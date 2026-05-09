import MotionInView from '../components/MotionInView'
import Section from '../components/Section'
import Card from '../components/Card'

export default function BonusSection() {
  return (
    <Section
      id="bonus"
      eyebrow="Бонус"
      title="Бесплатно после регистрации"
      subtitle="Никакой воды — только то, что помогает сделать первые шаги спокойно и быстро."
    >
      <MotionInView>
        <Card className="p-6 md:p-8">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Реферальные награды
              </div>
              <div className="mt-3 text-base font-semibold text-slate-50">
                Получите реферальные награды на 20 USDT за 2 шага
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-sm font-semibold text-cyan-200">
                    1
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300">Зарегистрируйтесь</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-sm font-semibold text-cyan-200">
                    2
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300">Пройдите верификацию KYC</div>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-slate-200">
                Получите бонус $20
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Совет новичку
              </div>
              <div className="mt-3 text-base font-semibold text-slate-50">
                Сначала процесс — потом объём
              </div>
              <div className="mt-2 text-sm leading-relaxed text-slate-300">
                Твоя первая цель — научиться: зарегистрироваться, пополнить и сделать одну простую сделку.
                Когда стало понятно — масштабируешь.
              </div>
            </div>
          </div>
        </Card>
      </MotionInView>
    </Section>
  )
}
