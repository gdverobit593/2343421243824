import MotionInView from '../components/MotionInView'
import Section from '../components/Section'
import Card from '../components/Card'

const testimonials = [
  {
    name: 'Алексей К.',
    role: 'Новичок в крипте',
    text: 'Регистрация заняла буквально 3 минуты. Всё по шагам — ничего не напутал. Бонус пришёл после KYC, проверял лично.',
  },
  {
    name: 'Марина С.',
    role: 'Студентка',
    text: 'Думала, крипта — это сложно. А тут просто повторяешь шаги и всё получается. Стартовала с 2000₽, теперь разбираюсь в комиссиях.',
  },
  {
    name: 'Дмитрий В.',
    role: 'Фрилансер',
    text: 'Наконец-то понял, как работает пополнение без переплаты. Раньше терял деньги на комиссиях, а теперь знаю, куда смотреть.',
  },
  {
    name: 'Екатерина П.',
    role: 'Мама в декрете',
    text: 'Муж посоветовал попробовать. Сайт помог разобраться с KYC — это самое страшное было. Теперь и сама могу.',
  },
  {
    name: 'Игорь Н.',
    role: 'Предприниматель',
    text: 'Чистый, понятный гайд без воды. Калькулятор прибыли — вообще отдельный плюс. Рекомендую всем, кто боится начать.',
  },
  {
    name: 'Анна Г.',
    role: 'Офисный сотрудник',
    text: 'Начала с 1000₽ из любопытства. Через неделю уже сделала первую сделку и поняла логику. Спасибо за структуру!',
  },
]

function Avatar({ name }: any) {
  const initial = name.charAt(0)
  const colors = ['bg-cyan-500/20 text-cyan-200', 'bg-indigo-500/20 text-indigo-200', 'bg-fuchsia-500/20 text-fuchsia-200', 'bg-emerald-500/20 text-emerald-200']
  const colorClass = colors[name.length % colors.length]
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${colorClass}`}>
      {initial}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <Section
      id="testimonials"
      eyebrow="Отзывы"
      title="Что говорят те, кто уже начал"
      subtitle="Реальные истории людей, которые прошли по этому плану и сделали первые шаги."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, idx) => (
          <MotionInView key={t.name} delay={idx * 0.05}>
            <Card className="h-full p-5">
              <div className="flex items-center gap-3">
                <Avatar name={t.name} />
                <div>
                  <div className="text-sm font-semibold text-slate-50">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                </div>
              </div>
              <div className="mt-4 text-sm leading-relaxed text-slate-300">
                «{t.text}»
              </div>
              <div className="mt-4 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </Card>
          </MotionInView>
        ))}
      </div>
    </Section>
  )
}
