import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import Card from '../components/Card'

function AnimatedCounter({ value, suffix = '' }: any) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = display
    const end = value
    if (start === end) return
    const duration = 1500
    const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(start + (end - start) * eased)
      setDisplay(current)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return <span>{display.toLocaleString('ru-RU')}{suffix}</span>
}

function LiveBadge() {
  const [count, setCount] = useState(12)
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        const change = Math.floor(Math.random() * 5) - 2
        return Math.max(8, Math.min(45, c + change))
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      Сейчас на сайте: <AnimatedCounter value={count} /> человек
    </div>
  )
}

function ChartMock() {
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="absolute inset-0 bg-radial-glow opacity-60" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/70">
            Симуляция
          </div>
          <div className="text-xs text-slate-300">+4.2%</div>
        </div>
        <div className="mt-4 h-28 w-full">
          <svg viewBox="0 0 300 100" className="h-full w-full">
            <defs>
              <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="rgb(34,211,238)" stopOpacity="0.9" />
                <stop offset="1" stopColor="rgb(99,102,241)" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,78 C35,60 55,86 85,55 C110,30 130,62 160,40 C190,18 215,35 240,22 C260,14 282,24 300,10"
              fill="none"
              stroke="url(#line)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            />
            <motion.path
              d="M0,78 C35,60 55,86 85,55 C110,30 130,62 160,40 C190,18 215,35 240,22 C260,14 282,24 300,10 L300,100 L0,100 Z"
              fill="url(#line)"
              opacity="0.10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
          </svg>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-left">
          <div>
            <div className="text-xs text-slate-400">Старт</div>
            <div className="text-sm font-semibold text-slate-100">1000₽</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Рост</div>
            <div className="text-sm font-semibold text-slate-100">+3–5%</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Контроль</div>
            <div className="text-sm font-semibold text-slate-100">в твоих руках</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function HeroSection() {
  const onStart = () => {
    document.getElementById('steps')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const onRegister = () => {
    window.open('https://www.bybit.com/invite?ref=OYMWAQ&utm_source=landing&utm_medium=site&utm_campaign=start-crypto-1000&utm_content=main-cta', '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400/10 via-indigo-500/10 to-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
        <img
          src="/hero-bg.webp"
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-10 md:pb-20 md:pt-16">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 shadow-soft backdrop-blur"
            >
              <img
                src="/bybit_300x300@x2.png"
                alt="Bybit"
                className="h-10 w-10 rounded-full"
                loading="lazy"
              />
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
              Пошаговый старт без лишней теории
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.05 }}
              className="mt-6 text-3xl font-semibold tracking-tight text-slate-50 md:text-5xl"
            >
              Как начать в крипте с 1000₽ — даже если ты новичок
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
              className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg"
            >
              Пошагово покажу: регистрация, пополнение и первая сделка
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <Button size="lg" onClick={onStart}>
                Начать
              </Button>
              <Button size="lg" variant="secondary" onClick={onRegister}>
                Регистрация на Bybit
              </Button>
            </motion.div>

            <div className="mt-4">
              <LiveBadge />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-5 flex flex-wrap items-center gap-4"
            >
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <div className="flex -space-x-2">
                  {['А', 'М', 'Д', 'Е', 'И'].map((initial, i) => (
                    <div
                      key={i}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-bg-900 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-xs font-semibold text-cyan-200"
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <span><AnimatedCounter value={2847} /> уже начали</span>
              </div>
            </motion.div>

            <div className="mt-4 text-sm text-slate-400">
              Без бэка. Без API ключей. Только понятный план.
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="md:justify-self-end"
          >
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[32px] bg-gradient-to-r from-cyan-400/10 via-indigo-500/10 to-fuchsia-500/10 blur-2xl" />
              <div className="pointer-events-none absolute -right-10 -top-10 -z-10 h-40 w-40 opacity-40 blur-[1px] md:h-56 md:w-56">
                <img
                  src="/bybit-bg.jfif"
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="animate-floaty">
                <ChartMock />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
