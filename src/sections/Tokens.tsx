import { useState, useEffect, useCallback } from "react"
import { ExternalLink, RefreshCw, Gift, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { formatEther } from "viem"
import { ZORA_TOKENS } from "../lib/tokens"
import { AIRDROP_VAULT_ABI } from "../lib/airdropVaultAbi"
import { toast } from "react-toastify"

const VAULT_ADDRESS = import.meta.env.VITE_AIRDROP_VAULT as `0x${string}` | undefined
const FEE_ETH = 30000000000000n // 0.00003 ETH in wei

function formatTokenAmount(value: bigint | undefined, decimals: number): string {
  if (value === undefined) return "—"
  const s = value.toString()
  if (decimals === 0) return s
  const whole = s.length > decimals ? s.slice(0, -decimals) : "0"
  const frac = s.length > decimals ? s.slice(-decimals) : s.padStart(decimals, "0")
  const fracTrim = frac.replace(/0+$/, "")
  return fracTrim ? `${whole}.${fracTrim}` : whole
}

function formatEth(wei: bigint): string {
  return formatEther(wei) + " ETH"
}

export default function Tokens() {
  const { address: userAddress, isConnected } = useAccount()
  const [refreshKey, setRefreshKey] = useState(0)
  const [claimingToken, setClaimingToken] = useState<string | null>(null)

  // Read fee from contract
  const { data: contractFee } = useReadContract({
    address: VAULT_ADDRESS,
    abi: AIRDROP_VAULT_ABI,
    functionName: "feeEth",
    query: { enabled: !!VAULT_ADDRESS },
  })

  const feeEth = contractFee ?? FEE_ETH

  // Claim function
  const { writeContract, data: hash, error: writeError } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Tokens claimed successfully!")
      setClaimingToken(null)
      setRefreshKey((k) => k + 1)
    }
  }, [isConfirmed])

  useEffect(() => {
    if (writeError) {
      toast.error(writeError.message || "Failed to claim tokens")
      setClaimingToken(null)
    }
  }, [writeError])

  const handleClaim = useCallback(
    (tokenAddress: `0x${string}`) => {
      if (!VAULT_ADDRESS || !userAddress) {
        toast.error("Please connect your wallet")
        return
      }

      setClaimingToken(tokenAddress)

      writeContract({
        address: VAULT_ADDRESS,
        abi: AIRDROP_VAULT_ABI,
        functionName: "claim",
        args: [tokenAddress],
        value: feeEth,
      })
    },
    [VAULT_ADDRESS, userAddress, feeEth, writeContract]
  )

  const hasTokens = ZORA_TOKENS.length > 0

  return (
    <div className="px-4 py-12 bg-gradient-to-br from-green-950 via-emerald-950 to-teal-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-6 flex-wrap mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
              <span className="bg-gradient-to-r from-green-300 via-lime-300 to-emerald-300 bg-clip-text text-transparent">
                PEPE DROPS
              </span>
            </h1>
            <p className="text-base text-white/60 max-w-2xl">
              Claim exclusive meme tokens on Base Network
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition backdrop-blur-sm text-white"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {!VAULT_ADDRESS && (
          <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-yellow-300">
            VAULT not configured. Please set the contract address.
          </div>
        )}

        {!hasTokens && (
          <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">
            No tokens configured. Add token addresses to src/lib/tokens.ts
          </div>
        )}

        {hasTokens && (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ZORA_TOKENS.map((token) => {
              return (
                <TokenCard
                  key={token.symbol}
                  token={token}
                  vaultAddress={VAULT_ADDRESS}
                  userAddress={userAddress}
                  feeEth={feeEth}
                  onClaim={() => handleClaim(token.address)}
                  isClaiming={claimingToken === token.address}
                  isConnected={isConnected}
                  refreshKey={refreshKey}
                />
              )
            })}
          </div>
        )}

        <div className="mt-8 text-xs text-white/30 font-mono">
          Vault: {VAULT_ADDRESS ? `${VAULT_ADDRESS.slice(0, 6)}...${VAULT_ADDRESS.slice(-4)}` : "Not configured"}
        </div>
      </div>
    </div>
  )
}

interface TokenCardProps {
  token: {
    symbol: string
    name: string
    address: `0x${string}`
    decimals: number
  }
  vaultAddress: `0x${string}` | undefined
  userAddress: `0x${string}` | undefined
  feeEth: bigint
  onClaim: () => void
  isClaiming: boolean
  isConnected: boolean
  refreshKey: number
}

function TokenCard({
  token,
  vaultAddress,
  userAddress,
  feeEth,
  onClaim,
  isClaiming,
  isConnected,
  refreshKey,
}: TokenCardProps) {
  // Read token config from contract
  const { data: tokenConfig } = useReadContract({
    address: vaultAddress,
    abi: AIRDROP_VAULT_ABI,
    functionName: "tokenConfig",
    args: [token.address],
    query: { enabled: !!vaultAddress },
  })

  // Read vault balance
  const { data: vaultBalance } = useReadContract({
    address: vaultAddress,
    abi: AIRDROP_VAULT_ABI,
    functionName: "vaultBalance",
    args: [token.address],
    query: { enabled: !!vaultAddress },
  })

  // Read if user has claimed
  const { data: hasClaimed } = useReadContract({
    address: vaultAddress,
    abi: AIRDROP_VAULT_ABI,
    functionName: "hasClaimed",
    args: userAddress ? [token.address, userAddress] : undefined,
    query: { enabled: !!vaultAddress && !!userAddress },
  })

  const enabled = tokenConfig?.[0] ?? false
  const claimAmount = tokenConfig?.[1] ?? 0n
  const canClaim =
    isConnected &&
    enabled &&
    !hasClaimed &&
    vaultBalance !== undefined &&
    vaultBalance >= claimAmount &&
    claimAmount > 0n

  const status = !isConnected
    ? { text: "Connect wallet", icon: null, color: "text-gray-400" }
    : !enabled
    ? { text: "Not enabled", icon: <XCircle className="w-4 h-4" />, color: "text-red-500" }
    : hasClaimed
    ? { text: "Already claimed", icon: <CheckCircle className="w-4 h-4" />, color: "text-green-600" }
    : vaultBalance !== undefined && vaultBalance < claimAmount
    ? { text: "Insufficient balance", icon: <XCircle className="w-4 h-4" />, color: "text-red-500" }
    : { text: "Available", icon: <Gift className="w-4 h-4" />, color: "text-emerald-600" }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-3 hover:bg-white/10 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-lime-500 rounded-md flex items-center justify-center text-white font-bold text-xs">
            {token.symbol.slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-bold text-white">{token.symbol}</div>
            <div className="text-[10px] text-white/50">{token.name}</div>
          </div>
        </div>
        <a
          className="text-white/30 hover:text-green-400 transition-colors"
          href={`https://basescan.org/token/${token.address}`}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="grid grid-cols-3 gap-1 text-[10px] mb-2">
        <div className="bg-white/5 rounded p-1.5">
          <div className="text-white/40 mb-0.5">Claim</div>
          <div className="text-white font-semibold truncate">
            {formatTokenAmount(claimAmount, token.decimals)}
          </div>
        </div>
        <div className="bg-white/5 rounded p-1.5">
          <div className="text-white/40 mb-0.5">Fee</div>
          <div className="text-white font-semibold">{formatEther(feeEth).slice(0, 6)}</div>
        </div>
        <div className="bg-white/5 rounded p-1.5">
          <div className="text-white/40 mb-0.5">Vault</div>
          <div className="text-white font-semibold truncate">
            {formatTokenAmount(vaultBalance, token.decimals)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1 text-[10px] ${status.color}`}>
          {status.icon}
          <span className="font-medium">{status.text}</span>
        </div>
        <button
          onClick={onClaim}
          disabled={!canClaim || isClaiming}
          className={`px-2.5 py-1 rounded-md font-semibold text-[10px] transition-all ${
            canClaim && !isClaiming
              ? "bg-gradient-to-r from-green-500 to-lime-500 text-black hover:shadow-md"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
        >
          {isClaiming ? (
            <span className="flex items-center gap-1">
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
              ...
            </span>
          ) : (
            "Claim"
          )}
        </button>
      </div>
    </div>
  )
}
