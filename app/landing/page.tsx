import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/marketing/HeroSection'
import { CompetitorComparison } from '@/components/marketing/CompetitorComparison'
import { OutputShowcase } from '@/components/marketing/OutputShowcase'
import { TrustBar } from '@/components/marketing/TrustBar'
import { ProblemSection } from '@/components/marketing/ProblemSection'
import { SolutionSection } from '@/components/marketing/SolutionSection'
import { BenefitsSection } from '@/components/marketing/BenefitsSection'
import { SocialProofSection } from '@/components/marketing/SocialProofSection'
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection'
import { PricingSection } from '@/components/marketing/PricingSection'
import { IntegrationPartners } from '@/components/marketing/IntegrationPartners'
import { FAQSection } from '@/components/marketing/FAQSection'
import { FinalCTASection } from '@/components/marketing/FinalCTASection'
import { SectionSeparator } from '@/components/SectionSeparator'
import { ROICalculator } from '@/components/marketing/ROICalculator'

/**
 * CONVERSION-OPTIMIZED LANDING PAGE
 *
 * URL: /landing
 * Purpose: High-conversion landing page for paid traffic campaigns
 *
 * STRATEGIC ARCHITECTURE:
 * Based on deep research of target market psychology, competitor positioning,
 * and 2024/2025 SaaS conversion best practices.
 *
 * PSYCHOLOGICAL JOURNEY:
 * 1. Pattern Interrupt (Hero) - Match ad expectation
 * 2. Instant Differentiation - Answer "Why not ChatGPT?"
 * 3. Proof of Quality - Show actual output
 * 4. Trust Signals - Reduce skepticism
 * 5. Pain Awareness - Create urgency
 * 6. Transformation Demo - Show before/after
 * 7. Benefits Translation - Features → Outcomes
 * 8. Social Proof - Reduce risk through conformity
 * 9. Technical Confidence - "How it works"
 * 10. Investment Justification - ROI calculator
 * 11. Integration Trust - Platform logos
 * 12. Objection Removal - FAQ before final ask
 * 13. Urgency + Action - Final CTA
 *
 * KEY DIFFERENTIATORS FROM HOMEPAGE:
 * - Competitor comparison immediately after hero (answers the mental comparison)
 * - Output quality proof before pain agitation (show, then tell)
 * - FAQ before final CTA (remove barriers at decision moment)
 * - ROI calculator in pricing (reframe cost as investment)
 * - Optimized for users coming from paid ads (higher intent)
 */

export const metadata = {
  title: 'Create Social Media Campaigns in 30 Seconds | OmniSignalAI',
  description: 'Stop spending hours on content. AI creates complete multi-platform campaigns with text and images in 30 seconds. Performance prediction included. Free 14-day trial.',
  openGraph: {
    title: 'From Hours to 30 Seconds: AI-Powered Social Media Campaigns',
    description: 'Complete campaigns with text, images, and performance prediction in 30 seconds.',
  },
}

export default function LandingPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* SECTION 1: PATTERN INTERRUPT + EXPECTATION MATCH                  */}
        {/* Psychology: Did I click the right thing? (3 seconds to decide)    */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-gradient-to-b from-white via-gray-50 to-white">
          <HeroSection />
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* SECTION 2: INSTANT DIFFERENTIATION (NEW - CRITICAL)               */}
        {/* Psychology: How is this different from ChatGPT/Canva?             */}
        {/* Strategy: Answer the comparison they're already making mentally   */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <CompetitorComparison />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* SECTION 3: PROOF OF QUALITY (NEW - CRITICAL)                      */}
        {/* Psychology: Will this create good content or AI slop?             */}
        {/* Strategy: Show actual examples before asking for trust            */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <OutputShowcase />

        <SectionSeparator variant="gradient" className="my-16" />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* SECTION 4: TRUST SIGNALS (Early)                                  */}
        {/* Psychology: Reduce skepticism immediately                         */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-white border-y border-gray-100">
          <TrustBar />
        </div>

        <SectionSeparator variant="gradient" className="my-20" />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* SECTION 5: PAIN AWARENESS                                         */}
        {/* Psychology: Do I even need this? (Create urgency)                 */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-gradient-to-b from-red-50/50 via-orange-50/30 to-white py-20">
          <ProblemSection />
        </div>

        <SectionSeparator variant="gradient" className="my-20" />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* SECTION 6: TRANSFORMATION DEMONSTRATION                           */}
        {/* Psychology: OK, how does it work? (Show before/after)             */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-white py-20">
          <SolutionSection />
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* SECTION 7: BENEFITS TRANSLATION                                   */}
        {/* Psychology: What do I actually get? (Features → Outcomes)         */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-gradient-to-b from-white via-gray-50 to-white py-20">
          <BenefitsSection />
        </div>

        <SectionSeparator variant="gradient" className="my-20" />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* SECTION 8: SOCIAL PROOF (Deep)                                    */}
        {/* Psychology: Who else uses this? (Reduce risk through conformity)  */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-white py-20">
          <SocialProofSection />
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* SECTION 9: TECHNICAL CONFIDENCE                                   */}
        {/* Psychology: How does the tech actually work?                      */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-gradient-to-b from-white via-indigo-50/20 to-white py-20">
          <HowItWorksSection />
        </div>

        <SectionSeparator variant="gradient" className="my-20" />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* SECTION 10: INVESTMENT JUSTIFICATION                              */}
        {/* Psychology: Can I afford this? (Reframe cost as investment)       */}
        {/* Strategy: Show ROI calculator - pays for itself in week 1         */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-white py-20" id="pricing">
          <PricingSection />

          {/* ROI Calculator integrated into pricing section */}
          <ROICalculator />
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* SECTION 11: INTEGRATION TRUST                                     */}
        {/* Psychology: Does it work with my tools?                           */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-gradient-to-b from-white via-gray-50 to-white py-20">
          <IntegrationPartners />
        </div>

        <SectionSeparator variant="gradient" className="my-16" />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* SECTION 12: OBJECTION REMOVAL (NEW - CRITICAL)                    */}
        {/* Psychology: What if it doesn't work for me? (Remove final barriers)*/}
        {/* Strategy: FAQ before final CTA to address hidden concerns         */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <FAQSection />

        <SectionSeparator variant="gradient" className="my-16" />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* SECTION 13: URGENCY + ACTION                                      */}
        {/* Psychology: Should I do this now or later? (Create action)        */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-gradient-to-b from-white to-gray-50">
          <FinalCTASection />
        </div>

      </main>
    </>
  )
}
