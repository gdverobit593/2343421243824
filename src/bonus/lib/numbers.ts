import { useEffect, useMemo, useState } from 'react'

export function clampNumber(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min
  return Math.min(max, Math.max(min, n))
}

export function formatRub(amount: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function useAnimatedNumber(target: number, { durationMs = 650 } = {}) {
  const [value, setValue] = useState(target)

  const safeTarget = useMemo(() => (Number.isFinite(target) ? target : 0), [target])

  useEffect(() => {
    const start = value
    const startTs = performance.now()

    let rafId = 0

    const tick = (ts: number) => {
      const t = Math.min(1, (ts - startTs) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(start + (safeTarget - start) * eased)
      if (t < 1) rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeTarget])

  return value
}
