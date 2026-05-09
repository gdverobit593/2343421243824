import { useMemo, useState } from 'react'
import MotionInView from '../components/MotionInView'
import Section from '../components/Section'
import Card from '../components/Card'
import Icon from '../components/Icon'
import Button from '../components/Button'
import { clampNumber, formatRub, useAnimatedNumber } from '../lib/numbers'

function LabeledInput({ label, value, onChange }: any) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-slate-200">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="numeric"
        className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-slate-50 shadow-soft outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/20"
        placeholder="1000"
      />
    </label>
  )
}

export default function ProfitSection() {
  const [amountRaw, setAmountRaw] = useState('1000')
  const [percentRaw, setPercentRaw] = useState('4')

  const amount = useMemo(() => {
    const n = Number(String(amountRaw).replace(/\s/g, '').replace(',', '.'))
    return clampNumber(Math.floor(n || 0), 100, 1_000_000)
  }, [amountRaw])

  const percent = useMemo(() => {
    const n = Number(String(percentRaw).replace(/\s/g, '').replace(',', '.'))
    return clampNumber(n || 0, 3, 5)
  }, [percentRaw])

  const result = useMemo(() => Math.round(amount * (1 + percent / 100)), [amount, percent])
  const profit = useMemo(() => Math.max(0, result - amount), [result, amount])

  const animatedResult = useAnimatedNumber(result)
  const animatedProfit = useAnimatedNumber(profit)

  return (
    <Section
      id="profit"
      eyebrow="Интерактив"
      title="Посмотри на цифры — без обещаний и магии"
      subtitle="Это просто симуляция роста на +3–5%, чтобы понять механику. В реальности результат может быть любым."
    >
      <div className="grid gap-4 md:grid-cols-5">
        <MotionInView className="md:col-span-3">
          <Card className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <LabeledInput label="Сумма старта (₽)" value={amountRaw} onChange={setAmountRaw} />
              <LabeledInput label="Симуляция роста (%)" value={percentRaw} onChange={setPercentRaw} />
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-400">
                Диапазон: 100–1 000 000₽ и 3–5%
              </div>
              <Button variant="secondary">
                Пересчитать
              </Button>
            </div>
          </Card>
        </MotionInView>

        <MotionInView delay={0.06} className="md:col-span-2">
          <Card className="relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-radial-glow opacity-70" />
            <div className="relative">
              <div className="flex items-center gap-2 text-cyan-200">
                <Icon name="spark" className="h-5 w-5" />
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
                  Симуляция
                </div>
              </div>

              <div className="mt-6">
                <div className="text-sm text-slate-300">Итого</div>
                <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-50">
                  {formatRub(Math.round(animatedResult))}
                </div>
              </div>

              <div className="mt-5">
                <div className="text-sm text-slate-300">Прибыль</div>
                <div className="mt-1 text-xl font-semibold text-slate-50">
                  +{formatRub(Math.round(animatedProfit))}
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-slate-300">
                Начинать можно с небольшой суммы — важнее понять процесс.
              </div>
            </div>
          </Card>
        </MotionInView>
      </div>
    </Section>
  )
}
