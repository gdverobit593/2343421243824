import type { TokenConfig } from './tokens'

export async function fetchTokenPricesUsd(
  tokens: readonly TokenConfig[],
  signal?: AbortSignal,
): Promise<Record<string, number>> {
  const out: Record<string, number> = {}
  for (const t of tokens) out[t.symbol] = 0

  const chunk = <T,>(arr: readonly T[], size: number): T[][] => {
    const res: T[][] = []
    for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size) as T[])
    return res
  }

  // Prefer ID-based pricing first (shorter URLs, usually more reliable).
  const tokensWithIds = tokens.filter((t) => Boolean(t.coingeckoId))
  for (const batch of chunk(tokensWithIds, 50)) {
    const ids = batch
      .map((t) => t.coingeckoId)
      .filter((x): x is string => Boolean(x))
      .join(',')

    if (!ids) continue

    const simplePriceUrl = `/api/coingecko/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd`
    const r = await fetch(simplePriceUrl, { method: 'GET', signal })
    if (!r.ok) continue

    const data = (await r.json()) as Record<string, { usd?: number }>
    for (const t of batch) {
      if (!t.coingeckoId) continue
      const row = data[t.coingeckoId]
      if (typeof row?.usd === 'number') out[t.symbol] = row.usd
    }
  }

  // Fallback for tokens without IDs or missing rows: contract-address based endpoint.
  // NOTE: We batch to avoid 400s due to long URLs.
  const missing = tokens.filter((t) => !t.coingeckoId && (!out[t.symbol] || out[t.symbol] === 0))
  for (const batch of chunk(missing, 40)) {
    const addrs = batch.map((t) => t.address.toLowerCase()).join(',')
    if (!addrs) continue

    const tokenPriceUrl = `/api/coingecko/api/v3/simple/token_price/base?contract_addresses=${encodeURIComponent(addrs)}&vs_currencies=usd`

    try {
      const r = await fetch(tokenPriceUrl, { method: 'GET', signal })
      if (!r.ok) continue

      const data = (await r.json()) as Record<string, { usd?: number }>
      for (const t of batch) {
        const row = data[t.address.toLowerCase()]
        if (typeof row?.usd === 'number') out[t.symbol] = row.usd
      }
    } catch {
      // ignore
    }
  }

  return out
}

