import { HeroSection } from '@/components/marketing/HeroSection'
import { TrustBar } from '@/components/marketing/TrustBar'
import { ProblemSection } from '@/components/marketing/ProblemSection'
import { SolutionSection } from '@/components/marketing/SolutionSection'
import { BenefitsSection } from '@/components/marketing/BenefitsSection'
import { SocialProofSection } from '@/components/marketing/SocialProofSection'
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection'
import { PricingSection } from '@/components/marketing/PricingSection'
import { IntegrationPartners } from '@/components/marketing/IntegrationPartners'
import { FinalCTASection } from '@/components/marketing/FinalCTASection'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Trust Signals - Above the fold */}
      <TrustBar />

      {/* Problem Agitation */}
      <ProblemSection />

      {/* Solution Demonstration */}
      <SolutionSection />

      {/* Benefits */}
      <BenefitsSection />

      {/* Social Proof */}
      <SocialProofSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Pricing */}
      <PricingSection />

      {/* Integration Partners & Security */}
      <IntegrationPartners />

      {/* Final CTA */}
      <FinalCTASection />
    </main>
  )
}