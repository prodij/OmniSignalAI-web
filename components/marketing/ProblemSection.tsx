'use client'

import { ContentSection, TwoColumnLayout, Card, Heading, Text, Badge } from '@/lib/design-system'

const realityChecks = [
  {
    icon: '📱',
    text: 'Research shows content creation takes "hours if not days"',
    color: 'text-red-500'
  },
  {
    icon: '😰',
    text: '33% of marketers struggle with content that resonates',
    color: 'text-orange-500'
  },
  {
    icon: '🔥',
    text: 'Content creation fatigue is the #1 marketing pain point',
    color: 'text-red-600'
  },
  {
    icon: '⏰',
    text: 'You\'re a "team of one" drowning in platform demands',
    color: 'text-orange-600'
  }
]

export function ProblemSection() {
  return (
    <ContentSection
      title="Your Content Creation Process is Broken"
      description="You're spending HOURS on content that should take MINUTES"
      variant="secondary"
      centered
      className="bg-gradient-to-b from-red-50 to-orange-50"
    >
      <div className="mb-4 text-center">
        <Badge variant="error" size="md" className="text-red-700 bg-red-100">
          (And Everyone Knows It)
        </Badge>
      </div>

      <TwoColumnLayout
        variant="equal"
        gap="lg"
        verticalAlign="top"
        leftContent={
          <Card
            variant="elevated"
            className="border-l-4 border-red-500 bg-white shadow-xl"
          >
            <Heading size="2xl" color="default" className="mb-6">
              The Reality Check
            </Heading>

            <div className="space-y-6">
              {realityChecks.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <span className={`text-2xl ${item.color} flex-shrink-0`}>
                    {item.icon}
                  </span>
                  <Text size="base" color="default" className="leading-relaxed">
                    {item.text}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        }
        rightContent={
          <Card
            variant="elevated"
            className="bg-gray-900 text-white shadow-xl"
          >
            <Heading size="2xl" className="text-white mb-6">
              The Hidden Cost
            </Heading>

            <blockquote className="border-l-4 border-red-400 pl-6 mb-8">
              <Text size="lg" className="text-gray-300 italic leading-relaxed">
                "While you're spending 3 hours creating one LinkedIn post, your competitors are
                publishing 15 pieces of AI-generated content that actually performs better."
              </Text>
            </blockquote>

            <Card className="bg-red-900/30 border border-red-800/50 text-center">
              <div className="space-y-2">
                <Heading size="4xl" className="text-red-400 font-bold">
                  8+
                </Heading>
                <Text size="base" className="text-red-200">
                  Hours wasted weekly
                </Text>
              </div>
            </Card>

            {/* Additional metrics */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center">
                <Text size="2xl" className="text-yellow-400 font-bold">
                  $1,600
                </Text>
                <Text size="sm" className="text-gray-400">
                  Monthly cost at $50/hr
                </Text>
              </div>
              <div className="text-center">
                <Text size="2xl" className="text-orange-400 font-bold">
                  15x
                </Text>
                <Text size="sm" className="text-gray-400">
                  Competitor advantage
                </Text>
              </div>
            </div>
          </Card>
        }
      />

      {/* Pain Point Summary */}
      <div className="mt-16 text-center">
        <Card className="bg-white/80 backdrop-blur-sm border border-red-200 max-w-4xl mx-auto">
          <Text size="lg" color="muted" className="mb-4">
            The bottom line:
          </Text>
          <Heading size="xl" color="error" className="leading-relaxed">
            Every hour you spend manually creating content is an hour your competitors
            are gaining market share with AI-generated campaigns.
          </Heading>
        </Card>
      </div>
    </ContentSection>
  )
}