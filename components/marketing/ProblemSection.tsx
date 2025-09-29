'use client'

export function ProblemSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-red-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-heading font-bold text-gray-900 mb-6">
            Your Content Creation Process is Broken
            <br />
            <span className="text-red-600">(And Everyone Knows It)</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            You're spending HOURS on content that should take MINUTES
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: The Reality */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border-l-4 border-red-500">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">The Reality Check</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-red-500 text-xl">📱</span>
                <span>Research shows content creation takes "hours if not days"</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-orange-500 text-xl">😰</span>
                <span>33% of marketers struggle with content that resonates</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-red-600 text-xl">🔥</span>
                <span>Content creation fatigue is the #1 marketing pain point</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-orange-600 text-xl">⏰</span>
                <span>You're a "team of one" drowning in platform demands</span>
              </div>
            </div>
          </div>

          {/* Right: The Hidden Cost */}
          <div className="bg-gray-900 text-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-6">The Hidden Cost</h3>
            <blockquote className="text-lg italic mb-6">
              "While you're spending 3 hours creating one LinkedIn post, your competitors are
              publishing 15 pieces of AI-generated content that actually performs better."
            </blockquote>

            <div className="bg-red-900/30 rounded-lg p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">8+</div>
                <div className="text-red-200">Hours wasted weekly</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}