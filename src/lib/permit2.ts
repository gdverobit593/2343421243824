import { ethers, Contract } from 'ethers'

export const BASE_CHAIN_ID = 8453
export const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3'

export const ERC20_APPROVE_ABI = ['function approve(address spender,uint256 amount) returns (bool)'] as const

export const ERC20_READ_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function allowance(address owner,address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
] as const

export const PERMIT2_ABI = ['function DOMAIN_SEPARATOR() view returns (bytes32)'] as const

export type PermitTransferFrom = {
  permitted: {
    token: string
    amount: bigint
  }
  spender: string
  nonce: bigint
  deadline: bigint
}

export type PermitTransferFromForCall = {
  permitted: {
    token: string
    amount: bigint
  }
  nonce: bigint
  deadline: bigint
}

export type SignatureTransferDetails = {
  to: string
  requestedAmount: bigint
}

const PERMIT2_DOMAIN_NAME = 'Permit2'
const PERMIT2_DOMAIN_VERSION = '1'

export async function resolvePermit2Domain(signer: ethers.Signer): Promise<ethers.TypedDataDomain> {
  const permit2 = new Contract(PERMIT2_ADDRESS, PERMIT2_ABI, signer)
  const onchainDomainSeparator: string = await permit2.DOMAIN_SEPARATOR()

  const domainWithVersion = {
    name: PERMIT2_DOMAIN_NAME,
    version: PERMIT2_DOMAIN_VERSION,
    chainId: BASE_CHAIN_ID,
    verifyingContract: PERMIT2_ADDRESS,
  } satisfies ethers.TypedDataDomain

  const domainNoVersion = {
    name: PERMIT2_DOMAIN_NAME,
    chainId: BASE_CHAIN_ID,
    verifyingContract: PERMIT2_ADDRESS,
  } satisfies ethers.TypedDataDomain

  const localWithVersion = ethers.TypedDataEncoder.hashDomain(domainWithVersion)
  const localNoVersion = ethers.TypedDataEncoder.hashDomain(domainNoVersion)

  if (onchainDomainSeparator.toLowerCase() === localWithVersion.toLowerCase()) return domainWithVersion
  if (onchainDomainSeparator.toLowerCase() === localNoVersion.toLowerCase()) return domainNoVersion

  throw new Error('Permit2 domain mismatch')
}

export const PERMIT2_TYPES = {
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
} as const
