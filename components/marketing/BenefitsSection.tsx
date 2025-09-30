'use client'

import React from 'react'
import { ContentSection, FeatureGrid, Card, Heading, Text, Badge, cn } from '@/lib/design-system'
import { Zap, Target, Brain, BarChart3, Palette, RefreshCw, LucideIcon } from 'lucide-react'

const benefits = [
  {
    icon: Zap,
    title: 'From 8 Hours to 30 Seconds',
    description: 'What used to take your entire morning now happens while you grab coffee',
    details: [
      'No more staring at blank screens',
      'No more researching hashtags manually',
      'No more struggling with platform-specific requirements',
      'No more hiring expensive freelancers for basic posts'
    ],
    metric: '1,600x faster',
    before: '8 hours/campaign',
    after: '30 seconds/campaign',
    color: 'text-blue-600'
  },
  {
    icon: Target,
    title: 'Platform-Perfect Every Time',
    description: 'Each post is optimized for its specific platform\'s algorithm and audience behavior',
    details: [
      'LinkedIn: Professional tone with industry insights',
      'Instagram: Visual-first with trending hashtags',
      'Twitter: Conversational threads that drive engagement',
      'Facebook: Community-focused with clear CTAs'
    ],
    metric: '340% better engagement',
    before: 'Generic copy-paste',
    after: 'Platform-optimized content',
    color: 'text-purple-600'
  },
  {
    icon: Brain,
    title: 'Your Brand Voice, Amplified',
    description: 'AI learns your unique style and maintains consistency across all platforms',
    details: [
      'Analyzes your existing content patterns',
      'Maintains consistent tone and messaging',
      'Adapts to your industry terminology',
      'Evolves with your brand without losing identity'
    ],
    metric: '89% brand consistency',
    before: 'Inconsistent messaging',
    after: 'Unified brand voice',
    color: 'text-green-600'
  },
  {
    icon: BarChart3,
    title: 'Performance Prediction',
    description: 'See how your content will perform before you publish',
    details: [
      'AI predicts engagement rates per platform',
      'Suggests optimal posting times',
      'Identifies trending topics in your niche',
      'Recommends content improvements'
    ],
    metric: '67% higher ROI',
    before: 'Post and pray',
    after: 'Data-driven decisions',
    color: 'text-indigo-600'
  },
  {
    icon: Palette,
    title: 'Professional Visuals Included',
    description: 'Custom images generated for each post, perfectly sized for each platform',
    details: [
      'Brand-consistent color schemes',
      'Platform-specific dimensions (1080x1080, 1200x628, etc.)',
      'No stock photo licenses needed',
      'Unlimited variations and iterations'
    ],
    metric: '$2,400 saved monthly',
    before: 'Stock photos + designer fees',
    after: 'AI-generated visuals included',
    color: 'text-pink-600'
  },
  {
    icon: RefreshCw,
    title: 'Infinite Content Variations',
    description: 'Never run out of ideas. Generate unlimited variations of successful posts',
    details: [
      'Seasonal content adaptations',
      'A/B test different approaches instantly',
      'Repurpose high-performing content',
      'Generate content series and campaigns'
    ],
    metric: '10x more content',
    before: '1-2 posts per week',
    after: '10+ posts per week',
    color: 'text-cyan-600'
  }
]

export function BenefitsSection() {
  return (
    <ContentSection
      title="Stop Being a Content Producer."
      description="While your competitors are still scheduling their single daily post, you'll be analyzing performance data from your 10 AI-generated campaigns."
      variant="default"
      centered
      className="bg-white"
    >
      <div className="mb-4 text-center">
        <Heading size="5xl" className="mb-6">
          <span className="block">Stop Being a Content Producer.</span>
          <span className="text-indigo-600">Start Being a Content Strategist.</span>
        </Heading>
      </div>

      <FeatureGrid columns={3} gap="lg" responsive>
        {benefits.map((benefit, index) => (
          <Card
            key={index}
            variant="elevated"
            interactive
            className="group hover:shadow-2xl transition-all duration-300 p-8"
          >
            {/* Header */}
            <div className="flex items-start space-x-4 mb-8">
              <div className="flex-shrink-0">
                {React.createElement(benefit.icon, { className: cn("w-10 h-10", benefit.color) })}
              </div>
              <div className="flex-grow">
                <Heading size="xl" className="mb-3">
                  {benefit.title}
                </Heading>
                <Badge variant="success" size="sm" className={cn("font-semibold mt-2", benefit.color)}>
                  {benefit.metric}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <Text size="base" color="muted" className="mb-8 leading-relaxed">
              {benefit.description}
            </Text>

            {/* Before/After Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card className="bg-red-50 border border-red-200 text-center">
                <Text size="xs" weight="medium" className="text-red-600 uppercase mb-1">
                  Before
                </Text>
                <Text size="sm" weight="medium" className="text-red-800">
                  {benefit.before}
                </Text>
              </Card>
              <Card className="bg-green-50 border border-green-200 text-center">
                <Text size="xs" weight="medium" className="text-green-600 uppercase mb-1">
                  After
                </Text>
                <Text size="sm" weight="medium" className="text-green-800">
                  {benefit.after}
                </Text>
              </Card>
            </div>

            {/* Detailed Benefits */}
            <div>
              <Text size="sm" weight="medium" className="text-gray-700 mb-4">
                What this means for you:
              </Text>
              <div className="space-y-4">
                {benefit.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <Text size="sm" color="muted" className="leading-relaxed">
                      {detail}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </FeatureGrid>

      {/* ROI Calculation Summary */}
      <div className="mt-20">
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 max-w-5xl mx-auto">
          <Heading size="2xl" color="default" className="text-center mb-8">
            The Math is Simple
          </Heading>

          <div className="grid md:grid-cols-3 gap-8 items-center text-center mb-8">
            <div>
              <Text size="4xl" className="font-bold text-red-600 mb-2">
                8 hours
              </Text>
              <Text size="sm" color="muted">
                Your current time per campaign
              </Text>
            </div>
            <div className="flex items-center justify-center">
              <Text size="2xl" className="text-indigo-600 font-bold">
                →
              </Text>
            </div>
            <div>
              <Text size="4xl" className="font-bold text-green-600 mb-2">
                30 seconds
              </Text>
              <Text size="sm" color="muted">
                Time with OmniSignalAI
              </Text>
            </div>
          </div>

          <Card className="bg-white border border-indigo-200">
            <Heading size="lg" className="text-center mb-4">
              That's 7.5 hours saved per campaign
            </Heading>
            <div className="text-center space-y-2">
              <Text size="base" color="muted">
                At $50/hour, that's{' '}
                <span className="font-bold text-green-600">$375 in time savings</span>{' '}
                per campaign.
              </Text>
              <Text size="base" color="muted">
                Run 10 campaigns per month ={' '}
                <span className="font-bold text-green-600 text-xl">$3,750 monthly savings</span>
              </Text>
            </div>
          </Card>
        </Card>
      </div>
    </ContentSection>
  )
}