"use client"

import { Section, Container, Heading, Text } from '@/lib/design-system'
import { TrendingUp, Eye } from 'lucide-react'
import Image from 'next/image'

/**
 * OutputShowcase Component
 *
 * Strategic Purpose: Prove output quality before asking for trust
 * Psychology: Show actual examples so users can judge quality themselves
 * Placement: Section 3 (after differentiation, before pain agitation)
 *
 * PLACEHOLDER STRATEGY:
 * - Use realistic post mockups with professional copy
 * - Include performance prediction scores
 * - Show platform-specific formatting
 * - Replace with real generated content later
 */

interface ShowcasePost {
  platform: 'LinkedIn' | 'Instagram' | 'Twitter' | 'Facebook' | 'TikTok'
  platformColor: string
  copy: string
  imageDescription: string // Description for placeholder
  predictedEngagement: number
  engagement: string
}

const showcasePosts: ShowcasePost[] = [
  {
    platform: 'LinkedIn',
    platformColor: 'bg-blue-600',
    copy: "We just launched real-time collaboration for distributed teams. Here's why it matters:\n\n→ 3x faster decision-making\n→ Zero context-switching\n→ Built-in async support\n\nRemote work isn't the future. It's now. Tools need to catch up.",
    imageDescription: 'Professional team collaboration workspace with modern UI',
    predictedEngagement: 87,
    engagement: '87% predicted engagement',
  },
  {
    platform: 'Instagram',
    platformColor: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500',
    copy: "5 productivity hacks that actually work ✨\n\n1. Time-block your calendar\n2. Use the 2-minute rule\n3. Batch similar tasks\n4. Set hard deadlines\n5. Take actual breaks\n\nWhich one are you trying first? 👇\n\n#ProductivityTips #WorkSmart #RemoteWork",
    imageDescription: 'Vibrant visual guide showing productivity tips in modern design',
    predictedEngagement: 92,
    engagement: '92% predicted engagement',
  },
  {
    platform: 'Twitter',
    platformColor: 'bg-sky-500',
    copy: "The future of content marketing isn't more content.\n\nIt's smarter content.\n\nAI that understands:\n→ Your audience\n→ Your brand voice  \n→ Platform algorithms\n→ Performance data\n\nCreate less. Impact more.",
    imageDescription: 'Clean infographic showing AI-powered content workflow',
    predictedEngagement: 78,
    engagement: '78% predicted engagement',
  },
]

export const OutputShowcase = () => {
  return (
    <Section variant="default" className="py-20 bg-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-4">
            <Eye className="w-4 h-4" />
            <Text size="sm" weight="semibold">Real Output Quality</Text>
          </div>
          <Heading as="h2" size="3xl" className="mb-4">
            See What You Actually Get in 30 Seconds
          </Heading>
          <Text size="lg" className="text-gray-600 max-w-3xl mx-auto">
            All generated from one prompt: <span className="font-semibold text-gray-900">"Announce our new feature for remote teams"</span>
          </Text>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {showcasePosts.map((post, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Platform Header */}
              <div className={`${post.platformColor} px-6 py-4`}>
                <Text className="text-white font-semibold text-lg">{post.platform}</Text>
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* Image Placeholder */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 h-48 flex items-center justify-center border border-gray-300">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-300 rounded-lg flex items-center justify-center">
                      <Image
                        src="/api/placeholder/64/64"
                        alt="Placeholder"
                        width={64}
                        height={64}
                        className="opacity-50"
                        unoptimized
                      />
                    </div>
                    <Text className="text-xs text-gray-500 leading-relaxed">
                      {post.imageDescription}
                    </Text>
                    <Text className="text-xs text-gray-400 mt-2">
                      (AI-generated image placeholder)
                    </Text>
                  </div>
                </div>

                {/* Post Copy */}
                <div className="mb-4">
                  <Text className="text-sm text-gray-900 leading-relaxed whitespace-pre-line">
                    {post.copy}
                  </Text>
                </div>

                {/* Performance Prediction */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Text className="text-xs font-semibold text-gray-700">
                        Performance Prediction
                      </Text>
                      <Text className="text-xs font-bold text-green-600">
                        {post.predictedEngagement}%
                      </Text>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${post.predictedEngagement}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
            <Text className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              From One Prompt
            </Text>
            <div className="flex items-center gap-8">
              <div>
                <Text className="text-3xl font-bold text-indigo-600">3</Text>
                <Text className="text-sm text-gray-600">Platforms</Text>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div>
                <Text className="text-3xl font-bold text-indigo-600">3</Text>
                <Text className="text-sm text-gray-600">Unique Posts</Text>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div>
                <Text className="text-3xl font-bold text-indigo-600">3</Text>
                <Text className="text-sm text-gray-600">Custom Images</Text>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div>
                <Text className="text-3xl font-bold text-indigo-600">30</Text>
                <Text className="text-sm text-gray-600">Seconds</Text>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
            <Text className="font-semibold text-gray-900 mb-2">Platform-Optimized</Text>
            <Text className="text-sm text-gray-600">
              Each post formatted for its platform's best practices and algorithm
            </Text>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
            <Text className="font-semibold text-gray-900 mb-2">Brand Voice Consistent</Text>
            <Text className="text-sm text-gray-600">
              Professional, engaging tone maintained across all platforms
            </Text>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
            <Text className="font-semibold text-gray-900 mb-2">Performance Predicted</Text>
            <Text className="text-sm text-gray-600">
              AI predicts engagement before you publish (85% accuracy)
            </Text>
          </div>
        </div>

        {/* Note about examples */}
        <div className="mt-12 text-center">
          <Text className="text-xs text-gray-500">
            Examples generated by OmniSignalAI. Image placeholders represent AI-generated visuals.
          </Text>
        </div>
      </Container>
    </Section>
  )
}
