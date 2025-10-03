import { Navigation } from '@/components/Navigation'
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
import { SectionSeparator } from '@/components/SectionSeparator'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
      {/* Hero Section - White background */}
      <div className="bg-gradient-to-b from-white via-gray-50 to-white">
        <HeroSection />
      </div>

      {/* Trust Signals - Subtle gray background */}
      <div className="bg-white border-y border-gray-100">
        <TrustBar />
      </div>

      <SectionSeparator variant="gradient" className="my-16" />

      {/* Problem Agitation - Warm gradient background */}
      <div className="bg-gradient-to-b from-red-50/50 via-orange-50/30 to-white py-20">
        <ProblemSection />
      </div>

      <SectionSeparator variant="gradient" className="my-20" />

      {/* Solution Demonstration - Clean white */}
      <div className="bg-white py-20">
        <SolutionSection />
      </div>

      {/* Benefits - Light gray background for contrast */}
      <div className="bg-gradient-to-b from-white via-gray-50 to-white py-20">
        <BenefitsSection />
      </div>

      <SectionSeparator variant="gradient" className="my-20" />

      {/* Social Proof - White with subtle top border */}
      <div className="bg-white py-20">
        <SocialProofSection />
      </div>

      {/* How It Works - Light indigo tint */}
      <div className="bg-gradient-to-b from-white via-indigo-50/20 to-white py-20">
        <HowItWorksSection />
      </div>

      <SectionSeparator variant="gradient" className="my-20" />

      {/* Pricing - Clean white, prominent section */}
      <div className="bg-white py-20" id="pricing">
        <PricingSection />
      </div>

      {/* Integration Partners - Subtle gray */}
      <div className="bg-gradient-to-b from-white via-gray-50 to-white py-20">
        <IntegrationPartners />
      </div>

      <SectionSeparator variant="gradient" className="my-16" />

      {/* Final CTA - Dark gradient for contrast */}
      <div className="bg-gradient-to-b from-white to-gray-50">
        <FinalCTASection />
      </div>
    </main>
    </>
  )
}