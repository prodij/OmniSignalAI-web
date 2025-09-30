import { PricingSection } from '@/components/marketing/PricingSection'
import { FinalCTASection } from '@/components/marketing/FinalCTASection'
import { PageLayout, HeroLayout, Container, Heading, Text } from '@/lib/design-system'

export default function PricingPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <HeroLayout variant="gradient" height="medium">
        <Container className="text-center">
          <Heading size="6xl" className="text-white mb-6">
            Simple, Transparent Pricing
          </Heading>
          <Text size="xl" className="text-gray-200 max-w-3xl mx-auto">
            Choose the plan that scales with your content creation needs.
            All plans include our core AI generation technology and 14-day free trial.
          </Text>
        </Container>
      </HeroLayout>

      {/* Pricing Details */}
      <PricingSection />

      {/* Final CTA */}
      <FinalCTASection />
    </PageLayout>
  )
}

export const metadata = {
  title: 'Pricing | OmniSignalAI - AI-Powered Social Media Content Generation',
  description: 'Transparent pricing for AI-powered social media content generation. Plans starting at $49/month with 14-day free trial.',
}