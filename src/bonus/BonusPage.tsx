import HeroSection from './sections/HeroSection'
import PainPointsSection from './sections/PainPointsSection'
import StepsSection from './sections/StepsSection'
import ProfitSection from './sections/ProfitSection'
import TrustSection from './sections/TrustSection'
import BonusSection from './sections/BonusSection'
import FaqSection from './sections/FaqSection'
import TestimonialsSection from './sections/TestimonialsSection'
import FinalCtaSection from './sections/FinalCtaSection'
import FooterSection from './sections/FooterSection'
import StickyHeader from './sections/StickyHeader'
import LiveToasts from './sections/LiveToasts'

export default function BonusPage() {
  return (
    <div className="bonus-page min-h-screen bg-bg-900 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-radial-glow" />
      <StickyHeader />
      <LiveToasts />
      <div className="relative">
        <HeroSection />
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <PainPointsSection />
        <StepsSection />
        <ProfitSection />
        <TrustSection />
        <BonusSection />
        <FaqSection />
        <TestimonialsSection />
        <FinalCtaSection />
        <FooterSection />
      </div>
    </div>
  )
}
