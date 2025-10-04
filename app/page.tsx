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

      {/* 8px system: 96px spacing (12 × 8px) */}
      <SectionSeparator variant="gradient" className="my-24" />

      {/* Problem Agitation - Warm gradient background */}
      {/* 8px system: 128px vertical padding (16 × 8px) */}
      <div className="bg-gradient-to-b from-red-50/50 via-orange-50/30 to-white py-32">
        <ProblemSection />
      </div>

      {/* 8px system: 128px spacing (16 × 8px) - generous whitespace */}
      <SectionSeparator variant="gradient" className="my-32" />

      {/* Solution Demonstration - Clean white */}
      {/* 8px system: 128px vertical padding */}
      <div className="bg-white py-32">
        <SolutionSection />
      </div>

      {/* Benefits - Light gray background for contrast */}
      {/* 8px system: 128px vertical padding */}
      <div className="bg-gradient-to-b from-white via-gray-50 to-white py-32">
        <BenefitsSection />
      </div>

      {/* 8px system: 128px spacing */}
      <SectionSeparator variant="gradient" className="my-32" />

      {/* Social Proof - White with subtle top border */}
      {/* 8px system: 128px vertical padding */}
      <div className="bg-white py-32">
        <SocialProofSection />
      </div>

      {/* How It Works - Light indigo tint */}
      {/* 8px system: 128px vertical padding */}
      <div className="bg-gradient-to-b from-white via-indigo-50/20 to-white py-32">
        <HowItWorksSection />
      </div>

      {/* 8px system: 128px spacing */}
      <SectionSeparator variant="gradient" className="my-32" />

      {/* Pricing - Clean white, prominent section */}
      {/* 8px system: 128px vertical padding */}
      <div className="bg-white py-32" id="pricing">
        <PricingSection />
      </div>

      {/* Integration Partners - Subtle gray */}
      {/* 8px system: 128px vertical padding */}
      <div className="bg-gradient-to-b from-white via-gray-50 to-white py-32">
        <IntegrationPartners />
      </div>

      {/* 8px system: 96px spacing (12 × 8px) */}
      <SectionSeparator variant="gradient" className="my-24" />

      {/* Final CTA - Dark gradient for contrast */}
      <div className="bg-gradient-to-b from-white to-gray-50">
        <FinalCTASection />
      </div>
    </main>
    </>
  )
}