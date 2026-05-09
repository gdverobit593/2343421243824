import MotionInView from '../components/MotionInView'
import Section from '../components/Section'
import Card from '../components/Card'
import Icon from '../components/Icon'

const items = [
  {
    title: 'Ты контролируешь деньги',
    text: 'Баланс на аккаунте, история операций и вывод — всё прозрачно.',
  },
  {
    title: 'Можно начать с небольшой суммы',
    text: 'Тебе не нужно «заходить на всю котлету». Начни с комфортного минимума.',
  },
  {
    title: 'Крупные биржи',
    text: 'Ликвидность, базовые меры защиты и понятный интерфейс для старта.',
  },
]

export default function TrustSection() {
  return (
    <Section
      id="trust"
      eyebrow="Доверие"
      title="Спокойный старт"
      subtitle="Твоя задача — не угадать рынок, а выстроить понятный процесс."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((it, idx) => (
          <MotionInView key={it.title} delay={idx * 0.06}>
            <Card className="h-full p-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl bg-white/5 p-2 text-cyan-200">
                  <Icon name="check" className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-50">
                    {it.title}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-300">
                    {it.text}
                  </div>
                </div>
              </div>
            </Card>
          </MotionInView>
        ))}
      </div>
    </Section>
  )
}
