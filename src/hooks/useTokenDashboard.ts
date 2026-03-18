import { useEffect, useMemo, useState } from 'react'
import { baseClient } from '../lib/baseClient'
import { ERC20_ABI } from '../lib/erc20'
import { TOKENS, type TokenConfig } from '../lib/tokens'
import { fetchTokenPricesUsd } from '../lib/coingecko'

export type TokenDashboardRow = TokenConfig & {
  priceUsd: number
  totalSupply?: bigint
  vaultBalance?: bigint
}

export function useTokenDashboard(vaultAddress?: `0x${string}`) {
  const [rows, setRows] = useState<TokenDashboardRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tokens = useMemo(() => TOKENS, [])

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      setLoading(true)
      try {
        const prices = await fetchTokenPricesUsd(tokens, ac.signal)
        const next = await Promise.all(
          tokens.map(async (t) => {
            const [totalSupply, vaultBalance] = await Promise.all([
              baseClient.readContract({ address: t.address, abi: ERC20_ABI, functionName: 'totalSupply' }).catch(() => undefined),
              vaultAddress
                ? baseClient
                    .readContract({ address: t.address, abi: ERC20_ABI, functionName: 'balanceOf', args: [vaultAddress] })
                    .catch(() => undefined)
                : Promise.resolve(undefined),
            ])

            return {
              ...t,
              priceUsd: prices[t.symbol] ?? 0,
              totalSupply: typeof totalSupply === 'bigint' ? totalSupply : undefined,
              vaultBalance: typeof vaultBalance === 'bigint' ? vaultBalance : undefined,
            } satisfies TokenDashboardRow
          }),
        )
        setRows(next)
        setError(null)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e))
      } finally {
        setLoading(false)
      }
    })()

    return () => ac.abort()
  }, [tokens, vaultAddress])

  return { rows, loading, error }
}
