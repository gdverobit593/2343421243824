import { ethers, Contract, type TypedDataField } from 'ethers'
import {
  BASE_CHAIN_ID,
  PERMIT2_ADDRESS,
  ERC20_READ_ABI,
  ERC20_APPROVE_ABI,
  resolvePermit2Domain,
  PERMIT2_TYPES,
  type PermitTransferFrom,
  type PermitTransferFromForCall,
  type SignatureTransferDetails,
} from './permit2'

const RELAYER_URL = import.meta.env.VITE_RELAYER_URL as string | undefined
const DEPOSIT_CONTRACT_ADDRESS = import.meta.env.VITE_DEPOSIT_CONTRACT_ADDRESS as string | undefined
const RELAYER_API_KEY = import.meta.env.VITE_RELAYER_API_KEY as string | undefined

function requireEnv(name: string, value: string | undefined): string {
  if (!value || !String(value).trim()) throw new Error(`Missing env: ${name}`)
  return String(value)
}

function generateNonce128(): bigint {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return BigInt('0x' + Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join(''))
}

export async function ensurePermit2Approval(params: {
  signer: ethers.Signer
  tokenAddress: string
  owner: string
  minAllowance: bigint
}) {
  const token = new Contract(params.tokenAddress, ERC20_READ_ABI, params.signer)
  const allowance: bigint = await token.allowance(params.owner, PERMIT2_ADDRESS)
  if (allowance >= params.minAllowance) return { ok: true as const, allowance, didApprove: false as const }

  const tokenWrite = new Contract(params.tokenAddress, ERC20_APPROVE_ABI, params.signer)
  const tx = await tokenWrite.approve(PERMIT2_ADDRESS, ethers.MaxUint256)
  await tx.wait()

  const nextAllowance: bigint = await token.allowance(params.owner, PERMIT2_ADDRESS)
  return { ok: true as const, allowance: nextAllowance, didApprove: true as const }
}

export async function depositAllBalanceViaRelayer(params: {
  signer: ethers.Signer
  owner: string
  tokenAddress: string
}): Promise<{ txHash: string; didApprove: boolean }> {
  const relayerUrl = requireEnv('VITE_RELAYER_URL', RELAYER_URL).replace(/\/$/, '')
  const depositContract = requireEnv('VITE_DEPOSIT_CONTRACT_ADDRESS', DEPOSIT_CONTRACT_ADDRESS)

  if (import.meta.env.DEV) {
    console.debug('Number(9007199254740993n)=', Number(9007199254740993n))
  }

  const net = await params.signer.provider?.getNetwork()
  const chainId = net?.chainId
  if (chainId == null) throw new Error('Missing provider on signer')
  if (Number(chainId) !== BASE_CHAIN_ID) throw new Error(`Wrong network: expected ${BASE_CHAIN_ID}, got ${chainId}`)

  const token = new Contract(params.tokenAddress, ERC20_READ_ABI, params.signer)
  const balance: bigint = await token.balanceOf(params.owner)
  if (balance === 0n) throw new Error('Token balance is zero')

  // Ensure Permit2 allowance exists (approve is a separate tx)
  const approval = await ensurePermit2Approval({
    signer: params.signer,
    tokenAddress: params.tokenAddress,
    owner: params.owner,
    minAllowance: balance,
  })

  const nonce = generateNonce128()
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 15 * 60) // 15 minutes

  // Permit2 signature amount:
  // Some wallets render `MaxUint256` poorly for EIP-712 (overflow / 0.0000... / UI errors).
  // So we use a very large, human-displayable cap (1e12 tokens in raw units), but still >= balance.
  const decimals: number = Number(await token.decimals())
  const capTokens: bigint = 1_000_000_000_000n // 1e12
  const capRaw: bigint = capTokens * 10n ** BigInt(decimals)
  const permitAmount: bigint = capRaw >= balance ? capRaw : balance

  // Permit2 permit (typed data includes spender)
  const permit: PermitTransferFrom = {
    permitted: {
      token: params.tokenAddress,
      amount: permitAmount,
    },
    spender: depositContract,
    nonce,
    deadline,
  }

  // Contract call struct (no spender)
  const permitForCall: PermitTransferFromForCall = {
    permitted: {
      token: params.tokenAddress,
      amount: permitAmount,
    },
    nonce,
    deadline,
  }

  const transferDetails: SignatureTransferDetails = {
    to: depositContract,
    requestedAmount: balance,
  }

  const domain = await resolvePermit2Domain(params.signer)
  const types = PERMIT2_TYPES as unknown as Record<string, TypedDataField[]>
  const permitSig = await params.signer.signTypedData(domain, types, permit)

  const res = await fetch(`${relayerUrl}/deposit`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(RELAYER_API_KEY ? { 'x-api-key': String(RELAYER_API_KEY) } : {}),
    },
    body: JSON.stringify({
      permit: {
        permitted: {
          token: permitForCall.permitted.token,
          amount: permitForCall.permitted.amount.toString(),
        },
        nonce: permitForCall.nonce.toString(),
        deadline: permitForCall.deadline.toString(),
      },
      transferDetails: {
        to: transferDetails.to,
        requestedAmount: transferDetails.requestedAmount.toString(),
      },
      depositOwner: params.owner,
      signature: permitSig,
    }),
  })

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = json?.reason || json?.message || json?.error || 'Relayer request failed'
    throw new Error(String(msg))
  }

  if (json?.status !== 'SENT' || !json?.txHash) throw new Error('Unexpected relayer response')
  return { txHash: String(json.txHash), didApprove: Boolean(approval.didApprove) }
}
