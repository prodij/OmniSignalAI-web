'use client'

export function BenefitsSection() {
  const benefits = [
    {
      icon: '⚡',
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
      after: '30 seconds/campaign'
    },
    {
      icon: '🎯',
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
      after: 'Platform-optimized content'
    },
    {
      icon: '🧠',
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
      after: 'Unified brand voice'
    },
    {
      icon: '📊',
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
      after: 'Data-driven decisions'
    },
    {
      icon: '🎨',
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
      after: 'AI-generated visuals included'
    },
    {
      icon: '🔄',
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
      after: '10+ posts per week'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-heading font-bold text-gray-900 mb-6">
            Stop Being a Content Producer.
            <br />
            <span className="text-blue-600">Start Being a Content Strategist.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            While your competitors are still scheduling their single daily post,
            you'll be analyzing performance data from your 10 AI-generated campaigns.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg border hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-4xl">{benefit.icon}</div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {benefit.title}
                  </h3>
                  <div className="text-sm font-semibold text-green-600">
                    {benefit.metric}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {benefit.description}
              </p>

              {/* Before/After */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-xs font-medium text-red-600 uppercase mb-1">Before</div>
                  <div className="text-sm text-red-800 font-medium">{benefit.before}</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xs font-medium text-green-600 uppercase mb-1">After</div>
                  <div className="text-sm text-green-800 font-medium">{benefit.after}</div>
                </div>
              </div>

              {/* Detailed Benefits */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-3">What this means for you:</div>
                {benefit.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-sm text-gray-600 leading-relaxed">{detail}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              The Math is Simple
            </h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-red-600 mb-2">8 hours</div>
                <div className="text-sm text-gray-600">Your current time per campaign</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-2xl text-blue-600">→</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">30 seconds</div>
                <div className="text-sm text-gray-600">Time with OmniSignalAI</div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg">
              <div className="text-lg font-semibold text-gray-900 mb-2">
                That's 7.5 hours saved per campaign
              </div>
              <div className="text-sm text-gray-600">
                At $50/hour, that's <span className="font-bold text-green-600">$375 in time savings</span> per campaign.
                <br />
                Run 10 campaigns per month = <span className="font-bold text-green-600">$3,750 monthly savings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}