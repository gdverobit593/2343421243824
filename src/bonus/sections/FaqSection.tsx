import { useState } from 'react'
import MotionInView from '../components/MotionInView'
import Section from '../components/Section'
import Card from '../components/Card'

const faqs = [
  {
    q: 'Сколько времени займёт регистрация на Bybit?',
    a: 'Обычно 2–3 минуты: email/телефон, пароль, подтверждение. KYC — от 5 минут до нескольких часов, в зависимости от загрузки системы.',
  },
  {
    q: 'Какие документы нужны для верификации KYC?',
    a: 'Паспорт или ID-карта. Иногда требуется селфи с документом. Для РФ/СНГ обычно достаточно загрузить фото паспорта и пройти проверку лица.',
  },
  {
    q: 'Минимальная сумма для старта?',
    a: 'Теоретически — от 100₽, но практичнее начать с 1000–5000₽, чтобы комиссии не "съедали" всю сумму.',
  },
  {
    q: 'Какие комиссии на Bybit?',
    a: 'Спот: 0.1% на покупку/продажу. P2P: обычно 0% для покупателя. Вывод зависит от сети (USDT TRC-20 — один из самых дешёвых вариантов).',
  },
  {
    q: 'Безопасно ли хранить деньги на бирже?',
    a: 'Для старта и небольших сумм — да. Для крупных сумм лучше использовать аппаратный кошелёк. Включайте 2FA, не храните пароли в открытом виде.',
  },
  {
    q: 'Что если я не разбираюсь в технологиях?',
    a: 'Сайт создан именно для новичков — пошаговая инструкция, без сложных терминов. Если что-то непонятно — перечитайте шаг или посмотрите скриншоты в гайде.',
  },
  {
    q: 'Обязательно ли проходить KYC сразу?',
    a: 'Для P2P-пополнения и вывода — да. Для спотовой торгови небольшими суммами иногда можно начать без KYC, но лимиты будут ограничены.',
  },
  {
    q: 'Могу ли я потерять деньги?',
    a: 'Да. Криптовалюта — высокорисковый актив. Курс может упасть, бывают мошенники, технические риски. Не вкладывайте больше, чем готовы потерять.',
  },
]

function FaqItem({ q, a }: any) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-slate-100 md:text-base">{q}</span>
        <span className="ml-4 text-cyan-200 transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="pb-4 text-sm leading-relaxed text-slate-300">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FaqSection() {
  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Отвечаем на главные вопросы"
      subtitle="Если не нашли ответ — напишите в Telegram, добавим в список."
    >
      <MotionInView>
        <Card className="p-5 md:p-7">
          {faqs.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </Card>
      </MotionInView>
    </Section>
  )
}
