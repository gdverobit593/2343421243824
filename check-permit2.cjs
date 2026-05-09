const { ethers } = require('ethers');
const { SignatureTransfer, PermitType } = require('@uniswap/permit2-sdk');

// Permit2 на Base
const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3';
const CHAIN_ID = 8453;

// Расчёт domain separator как в контракте Permit2
// Permit2 использует: EIP712Domain(string name,uint256 chainId,address verifyingContract)
// (без version!)
const domain = {
  name: 'Permit2',
  chainId: CHAIN_ID,
  verifyingContract: PERMIT2_ADDRESS,
};

// Расчёт через ethers
const domainHash = ethers.TypedDataEncoder.hashDomain(domain);
console.log('Calculated DOMAIN_SEPARATOR:', domainHash);

// Type hash для PermitTransferFrom
// "PermitTransferFrom(TokenPermissions permitted,uint256 nonce,uint256 deadline)TokenPermissions(address token,uint256 amount)"
const permitTypeHash = ethers.keccak256(
  ethers.toUtf8Bytes('PermitTransferFrom(TokenPermissions permitted,uint256 nonce,uint256 deadline)TokenPermissions(address token,uint256 amount)')
);
console.log('PermitTransferFrom typehash:', permitTypeHash);

// Проверка: если добавить version (как в OpenZeppelin), hash будет другим
const domainWithVersion = {
  name: 'Permit2',
  version: '1',
  chainId: CHAIN_ID,
  verifyingContract: PERMIT2_ADDRESS,
};
const domainHashWithVersion = ethers.TypedDataEncoder.hashDomain(domainWithVersion);
console.log('Domain hash WITH version:', domainHashWithVersion);
console.log('Match:', domainHash === domainHashWithVersion ? 'SAME' : 'DIFFERENT');

// Compare with @uniswap/permit2-sdk
const permit = {
  permitted: {
    token: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
    amount: '139651934620751255265',
  },
  nonce: '7637517522610013524',
  deadline: '1778251720',
};

const sdkData = SignatureTransfer.getPermitData(
  permit,
  PERMIT2_ADDRESS,
  CHAIN_ID
);

console.log('\n=== SDK Comparison ===');
console.log('SDK Domain:', JSON.stringify(sdkData.domain, null, 2));
console.log('SDK Types:', JSON.stringify(sdkData.types, null, 2));
console.log('SDK Values:', JSON.stringify(sdkData.values, null, 2));

// Compute local hash for comparison
const localDomainHash = ethers.TypedDataEncoder.hashDomain(domain);
console.log('Local domain hash:', localDomainHash);

// Show raw SDK data for comparison
console.log('\n--- SDK Raw Data ---');
console.log('Domain:', JSON.stringify(sdkData.domain));
console.log('Types keys:', Object.keys(sdkData.types));
for (const [k,v] of Object.entries(sdkData.types)) {
  console.log(`Type ${k}:`, JSON.stringify(v));
}
console.log('Values:', JSON.stringify(sdkData.values));

// Compute local hash for comparison
const localTypes = {
  TokenPermissions: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint256' },
  ],
  PermitTransferFrom: [
    { name: 'permitted', type: 'TokenPermissions' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
};
const localValues = {
  permitted: {
    token: permit.permitted.token,
    amount: permit.permitted.amount,
  },
  nonce: permit.nonce,
  deadline: permit.deadline,
};
const localMsgHash = ethers.TypedDataEncoder.from(localTypes).hash(localValues);
console.log('Local msg hash:', localMsgHash);

// Function selector for DOMAIN_SEPARATOR()
const domainSeparatorSelector = ethers.id('DOMAIN_SEPARATOR()').slice(0, 10);
console.log('DOMAIN_SEPARATOR() selector:', domainSeparatorSelector);

// Also try eip712Domain()
const eip712DomainSelector = ethers.id('eip712Domain()').slice(0, 10);
console.log('eip712Domain() selector:', eip712DomainSelector);
