import MotionInView from '../components/MotionInView'
import Section from '../components/Section'
import Card from '../components/Card'
import Icon from '../components/Icon'

const steps = [
  {
    n: '01',
    title: 'Регистрация',
    text: 'Создаёшь аккаунт за 2–3 минуты и включаешь базовую защиту.',
    icon: 'shield',
  },
  {
    n: '02',
    title: 'Пополнение',
    text: 'Пополняешь баланс небольшой суммой и понимаешь комиссии.',
    icon: 'wallet',
  },
  {
    n: '03',
    title: 'Первая сделка',
    text: 'Делаешь простую покупку/продажу и видишь всё в цифрах.',
    icon: 'bolt',
  },
]

export default function StepsSection() {
  return (
    <Section
      id="steps"
      eyebrow="Система"
      title="Простой план из 3 шагов"
      subtitle="Без сложных терминов: просто повторяешь шаги и понимаешь, что происходит на каждом этапе."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((s, idx) => (
          <MotionInView key={s.title} delay={idx * 0.06}>
            <Card className="h-full p-6">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold tracking-[0.22em] text-slate-400">
                  {s.n}
                </div>
                <div className="rounded-xl bg-white/5 p-3 text-cyan-200">
                  <Icon name={s.icon} className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-5 text-lg font-semibold text-slate-50">
                {s.title}
              </div>
              <div className="mt-2 text-sm leading-relaxed text-slate-300">
                {s.text}
              </div>
            </Card>
          </MotionInView>
        ))}
      </div>
    </Section>
  )
}
