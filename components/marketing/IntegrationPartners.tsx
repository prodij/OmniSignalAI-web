'use client'

import React from 'react'
import { ContentSection, Card, Heading, Text } from '@/lib/design-system'
import { Linkedin, Facebook, Twitter, Instagram, Image as ImageIcon, Sparkles } from 'lucide-react'

const integrations = [
  {
    name: 'LinkedIn',
    icon: Linkedin,
    description: 'Official LinkedIn Marketing API',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    name: 'Meta Business',
    icon: Facebook,
    description: 'Facebook & Instagram APIs',
    color: 'text-blue-700 bg-blue-50',
  },
  {
    name: 'Twitter/X',
    icon: Twitter,
    description: 'X (Twitter) API v2',
    color: 'text-gray-900 bg-gray-50',
  },
  {
    name: 'OpenAI',
    icon: Sparkles,
    description: 'GPT-4 & DALL-E 3',
    color: 'text-green-600 bg-green-50',
  },
  {
    name: 'Anthropic',
    icon: Sparkles,
    description: 'Claude AI Models',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    name: 'Stability AI',
    icon: ImageIcon,
    description: 'Stable Diffusion Models',
    color: 'text-indigo-600 bg-indigo-50',
  },
]

export function IntegrationPartners() {
  return (
    <ContentSection
      title="Built on Best-in-Class APIs"
      description="We integrate with the platforms and AI providers you already trust"
      variant="default"
      centered
      className="bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {integrations.map((integration, index) => (
          <Card
            key={index}
            variant="bordered"
            className="text-center hover:shadow-lg transition-all duration-300 group"
          >
            <div className={`w-16 h-16 rounded-lg ${integration.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              {React.createElement(integration.icon, { className: "w-8 h-8" })}
            </div>
            <Heading size="sm" className="mb-2">
              {integration.name}
            </Heading>
            <Text size="xs" color="muted">
              {integration.description}
            </Text>
          </Card>
        ))}
      </div>

      {/* Additional Trust Signals */}
      <div className="mt-16 text-center">
        <Text size="sm" color="muted" weight="medium" className="mb-4">
          Enterprise-Grade Security & Compliance
        </Text>
        <div className="flex flex-wrap justify-center items-center gap-8">
          <Card variant="bordered" padding="sm" className="inline-flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <Text size="sm" weight="semibold">SOC 2 Type II</Text>
          </Card>
          <Card variant="bordered" padding="sm" className="inline-flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <Text size="sm" weight="semibold">GDPR Compliant</Text>
          </Card>
          <Card variant="bordered" padding="sm" className="inline-flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <Text size="sm" weight="semibold">CCPA Compliant</Text>
          </Card>
          <Card variant="bordered" padding="sm" className="inline-flex items-center space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <Text size="sm" weight="semibold">256-bit Encryption</Text>
          </Card>
        </div>
      </div>
    </ContentSection>
  )
}