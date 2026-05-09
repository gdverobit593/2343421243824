import { useEffect, useState } from 'react'
import Button from '../components/Button'

export default function StickyHeader() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-bg-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="text-sm font-semibold text-slate-100">Старт в крипте</div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => document.getElementById('steps')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
            Начать
          </Button>
          <Button size="sm" onClick={() => window.open('https://www.bybit.com/invite?ref=OYMWAQ&utm_source=landing&utm_medium=site&utm_campaign=start-crypto-1000&utm_content=main-cta', '_blank', 'noopener,noreferrer')}>
            Регистрация
          </Button>
        </div>
      </div>
    </header>
  )
}
