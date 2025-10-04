"use client"

import { Section, Container, Heading, Text } from '@/lib/design-system'
import { Check, X } from 'lucide-react'

/**
 * CompetitorComparison Component
 *
 * Strategic Purpose: Answer "Why not ChatGPT/Canva/Buffer?" immediately after hero
 * Psychology: Users are already comparing - make the comparison easy and obvious
 * Placement: Section 2 (immediately after hero, before anything else)
 */

interface ComparisonFeature {
  feature: string
  chatgpt: boolean
  jasper: boolean
  canva: boolean
  buffer: boolean
  omnisignal: boolean
  highlight?: boolean // Highlight row for our unique features
}

const comparisonData: ComparisonFeature[] = [
  {
    feature: 'AI-Generated Copy',
    chatgpt: true,
    jasper: true,
    canva: false,
    buffer: false,
    omnisignal: true,
  },
  {
    feature: 'AI-Generated Images',
    chatgpt: false,
    jasper: false,
    canva: true,
    buffer: false,
    omnisignal: true,
  },
  {
    feature: 'Complete Posts (Text + Images)',
    chatgpt: false,
    jasper: false,
    canva: false,
    buffer: false,
    omnisignal: true,
    highlight: true,
  },
  {
    feature: 'Multi-Platform Optimization',
    chatgpt: false,
    jasper: false,
    canva: false,
    buffer: true,
    omnisignal: true,
  },
  {
    feature: 'Performance Prediction',
    chatgpt: false,
    jasper: false,
    canva: false,
    buffer: false,
    omnisignal: true,
    highlight: true,
  },
  {
    feature: '30-Second Complete Campaigns',
    chatgpt: false,
    jasper: false,
    canva: false,
    buffer: false,
    omnisignal: true,
    highlight: true,
  },
  {
    feature: 'Brand Voice Training',
    chatgpt: false,
    jasper: true,
    canva: false,
    buffer: false,
    omnisignal: true,
  },
  {
    feature: 'Direct Publishing',
    chatgpt: false,
    jasper: false,
    canva: false,
    buffer: true,
    omnisignal: true,
  },
]

export const CompetitorComparison = () => {
  return (
    <Section variant="secondary" className="py-16 bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <Heading as="h2" size="3xl" className="mb-4">
            Why Not Just Use ChatGPT, Jasper, Canva, or Buffer?
          </Heading>
          <Text size="lg" className="text-gray-600 max-w-3xl mx-auto">
            They're great tools—but none do what we do. Here's the honest comparison.
          </Text>
        </div>

        {/* Comparison Table */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-3 p-4 bg-gray-50 border-b border-gray-200">
              <div className="col-span-2 text-left">
                <Text className="font-semibold text-gray-900">Feature</Text>
              </div>
              <div className="text-center">
                <Text className="font-medium text-gray-600 text-sm">ChatGPT</Text>
              </div>
              <div className="text-center">
                <Text className="font-medium text-gray-600 text-sm">Jasper</Text>
              </div>
              <div className="text-center">
                <Text className="font-medium text-gray-600 text-sm">Canva</Text>
              </div>
              <div className="text-center">
                <Text className="font-medium text-gray-600 text-sm">Buffer</Text>
              </div>
              <div className="text-center bg-indigo-50 rounded-lg -m-1 p-1">
                <Text className="font-bold text-indigo-600 text-sm">OmniSignal</Text>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {comparisonData.map((row, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-7 gap-3 p-4 transition-colors ${
                    row.highlight
                      ? 'bg-indigo-50/50 hover:bg-indigo-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="col-span-2 flex items-center">
                    <Text className={row.highlight ? 'font-semibold text-gray-900' : 'text-gray-700'}>
                      {row.feature}
                    </Text>
                  </div>
                  <div className="flex items-center justify-center">
                    {row.chatgpt ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    {row.jasper ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    {row.canva ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    {row.buffer ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    {row.omnisignal ? (
                      <Check className={`w-6 h-6 ${row.highlight ? 'text-indigo-600' : 'text-green-600'}`} strokeWidth={row.highlight ? 3 : 2} />
                    ) : (
                      <X className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Message */}
          <div className="text-center mt-8">
            <Text size="lg" weight="semibold" className="text-gray-900 max-w-2xl mx-auto">
              The only platform that creates complete campaigns with images, copy, AND predicts
              performance—all in 30 seconds.
            </Text>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6 rounded-xl bg-white border border-indigo-100">
              <Text className="font-semibold text-indigo-600 mb-2">vs ChatGPT</Text>
              <Text className="text-sm text-gray-600">
                No manual image creation. No platform-specific reformatting. Just complete posts.
              </Text>
            </div>
            <div className="text-center p-6 rounded-xl bg-white border border-indigo-100">
              <Text className="font-semibold text-indigo-600 mb-2">vs Jasper/Copy.ai</Text>
              <Text className="text-sm text-gray-600">
                Not just copy—complete posts with images, optimized for each platform's algorithm.
              </Text>
            </div>
            <div className="text-center p-6 rounded-xl bg-white border border-indigo-100">
              <Text className="font-semibold text-indigo-600 mb-2">vs Canva + Buffer</Text>
              <Text className="text-sm text-gray-600">
                Stop using 3+ tools. One platform creates, predicts, and publishes everything.
              </Text>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
