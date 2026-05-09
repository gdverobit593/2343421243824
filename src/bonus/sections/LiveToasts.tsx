import { useEffect, useState, useCallback } from 'react'

const names = [
  'Алексей', 'Марина', 'Дмитрий', 'Екатерина', 'Игорь', 'Анна',
  'Сергей', 'Ольга', 'Владимир', 'Татьяна', 'Никита', 'Юлия',
  'Максим', 'Елена', 'Артём', 'Ксения', 'Павел', 'Наталья',
  'Иван', 'Светлана', 'Константин', 'Полина', 'Глеб', 'Вера',
]

const actions = [
  'зарегистрировался на Bybit',
  'прошёл верификацию KYC',
  'получил бонус $20',
  'начал с 1000₽',
  'открыл первую сделку',
  'пригласил друга',
]

function Toast({ name, action, onRemove }: any) {
  useEffect(() => {
    const t = setTimeout(onRemove, 5000)
    return () => clearTimeout(t)
  }, [onRemove])

  return (
    <div className="mb-2 flex items-center gap-3 rounded-xl border border-white/10 bg-bg-900/95 px-4 py-3 shadow-lg backdrop-blur-md transition-all animate-slide-in-right">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 flex items-center justify-center text-sm font-semibold text-cyan-200">
        {name.charAt(0)}
      </div>
      <div className="text-sm">
        <span className="font-medium text-slate-100">{name}</span>{' '}
        <span className="text-slate-300">{action}</span>
      </div>
      <div className="ml-auto h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
    </div>
  )
}

export default function LiveToasts() {
  const [toasts, setToasts] = useState<any[]>([])

  const addToast = useCallback(() => {
    const name = names[Math.floor(Math.random() * names.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, name, action }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    const first = setTimeout(() => addToast(), 3000)
    let interval: any
    const startInterval = () => {
      const delay = 8000 + Math.random() * 7000
      interval = setTimeout(() => {
        addToast()
        startInterval()
      }, delay)
    }
    const second = setTimeout(() => startInterval(), 4000)

    return () => {
      clearTimeout(first)
      clearTimeout(second)
      if (interval) clearTimeout(interval)
    }
  }, [addToast])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      {toasts.map((t) => (
        <Toast key={t.id} name={t.name} action={t.action} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  )
}
