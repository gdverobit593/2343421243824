import MotionInView from '../components/MotionInView'
import Section from '../components/Section'
import Card from '../components/Card'
import Icon from '../components/Icon'

const items = [
  {
    title: 'Не понимаешь, с чего начать',
    text: 'Соберу всё в простой порядок действий — без хаоса и терминов.',
    icon: 'steps',
  },
  {
    title: 'Боишься потерять деньги',
    text: 'Начинаем с небольшой суммы и понятной логики риска.',
    icon: 'shield',
  },
  {
    title: 'Кажется слишком сложно',
    text: 'Разложим на 3 шага, чтобы было легко повторить.',
    icon: 'bolt',
  },
  {
    title: 'Нет уверенности в выборе биржи',
    text: 'Покажу базовые критерии: ликвидность, интерфейс, безопасность.',
    icon: 'wallet',
  },
]

export default function PainPointsSection() {
  return (
    <Section
      id="pain"
      eyebrow="Проблема"
      title="Это нормально — так начинают почти все"
      subtitle="Если ты новичок, то главная сложность — не нажать кнопку, а понять последовательность действий. Мы сделаем её простой."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it, idx) => (
          <MotionInView key={it.title} delay={idx * 0.06}>
            <Card className="h-full p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-gradient-to-b from-cyan-400/15 to-indigo-500/10 p-3 text-cyan-200">
                  <Icon name={it.icon} className="h-6 w-6" />
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
