import MotionInView from '../components/MotionInView'
import Section from '../components/Section'
import Card from '../components/Card'
import Button from '../components/Button'

export default function FinalCtaSection() {
  const onClick = () => {
    window.open('https://www.bybit.com/invite?ref=OYMWAQ&utm_source=landing&utm_medium=site&utm_campaign=start-crypto-1000&utm_content=main-cta', '_blank', 'noopener,noreferrer')
  }

  return (
    <Section id="final">
      <MotionInView>
        <Card className="relative overflow-hidden p-7 md:p-10">
          <div className="absolute inset-0 bg-radial-glow opacity-80" />
          <div className="relative">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
              Готов?
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-50 md:text-4xl">
              Сделай первый шаг — регистрация на Bybit
            </div>
            <div className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">
              Дальше ты просто идёшь по 3 шагам выше: регистрация → пополнение → первая сделка.
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" onClick={onClick}>
                Начать регистрацию
              </Button>
              <div className="text-sm text-slate-400">
                Без обязательств — просто посмотри, как устроена биржа.
              </div>
            </div>
          </div>
        </Card>
      </MotionInView>
    </Section>
  )
}
