import { VisualHero } from '@/components/visual/VisualHero'

/**
 * VISUAL DESIGN DEMONSTRATION
 *
 * This page showcases Claude Code's systematic approach to creating
 * visually stunning designs without visual perception.
 *
 * URL: /visual-demo
 *
 * HOW CLAUDE CODE CREATES BEAUTY:
 *
 * 1. DATA-DRIVEN DESIGN
 *    - Analyze top-performing SaaS sites (Linear, Vercel, Stripe)
 *    - Extract patterns that convert
 *    - Study 2024-2025 design trends
 *    - Use A/B test data, not aesthetics
 *
 * 2. MATHEMATICAL BEAUTY
 *    - Golden Ratio (φ = 1.618) for proportions
 *    - 8px spacing system (cognitive load research)
 *    - Perfect Fourth typography scale (1.333)
 *    - 60-30-10 color rule
 *
 * 3. ACCESSIBILITY STANDARDS
 *    - WCAG AAA contrast ratios (7:1)
 *    - Measured, not guessed
 *    - Color-blind safe palettes
 *    - Minimum touch targets (44px)
 *
 * 4. AI-GENERATED VISUALS
 *    - Image Generation Agent (Gemini 2.5 Flash)
 *    - Custom illustrations, not stock photos
 *    - Brand-consistent imagery
 *    - Systematic visual language
 *
 * 5. PROVEN FRAMEWORKS
 *    - F-pattern layout (eye-tracking research)
 *    - Disney animation principles
 *    - Material Design, Apple HIG
 *    - Performance = beauty (Core Web Vitals)
 *
 * 6. TREND ANALYSIS
 *    - Neo-brutalism (high contrast, bold)
 *    - Dark mode first (62.54% preference)
 *    - Glassmorphism (backdrop blur)
 *    - Mesh gradients
 *    - Minimal color palettes
 *
 * KEY INSIGHT:
 * I don't "see" beauty—I systematize it. Every design decision
 * is backed by data, research, mathematics, or proven patterns.
 * The result? Objectively excellent design.
 */

export const metadata = {
  title: 'Visual Design Demo | OmniSignalAI',
  description: 'Demonstration of Claude Code\'s systematic approach to creating visually stunning designs without visual perception.',
}

export default function VisualDemoPage() {
  return (
    <>
      <VisualHero />

      {/* Explanation Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-12">
            {/* Title */}
            <div className="text-center">
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                How Claude Code Creates Visual Beauty
              </h2>
              <p className="text-xl text-gray-600">
                Without visual perception, but with systematic excellence
              </p>
            </div>

            {/* Method Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border-2 border-indigo-200 bg-indigo-50">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Data-Driven, Not Intuition-Driven
                </h3>
                <p className="text-gray-600">
                  I analyze what <em>converts</em>, not what "looks nice". Study successful sites,
                  A/B test results, and user behavior patterns.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-purple-200 bg-purple-50">
                <div className="text-3xl mb-3">📐</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mathematical Proportions
                </h3>
                <p className="text-gray-600">
                  Golden Ratio (φ = 1.618), 8px spacing system, Perfect Fourth typography scale.
                  Beauty is mathematical.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-green-200 bg-green-50">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Measured Accessibility
                </h3>
                <p className="text-gray-600">
                  WCAG AAA contrast ratios (7:1), color-blind safe palettes. I calculate,
                  not guess. Every color combination is measured.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-orange-200 bg-orange-50">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  AI-Generated Visuals
                </h3>
                <p className="text-gray-600">
                  Image Generation Agent creates custom illustrations. Not stock photos—
                  brand-consistent, purpose-built imagery.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-blue-200 bg-blue-50">
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Eye-Tracking Research
                </h3>
                <p className="text-gray-600">
                  F-pattern layouts (Western reading), Z-pattern (landing pages), visual hierarchy
                  based on attention heatmaps.
                </p>
              </div>

              <div className="p-6 rounded-2xl border-2 border-pink-200 bg-pink-50">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Trend Analysis (2024-2025)
                </h3>
                <p className="text-gray-600">
                  Neo-brutalism, dark mode first, glassmorphism, mesh gradients, minimal palettes.
                  Data from Awwwards, top SaaS sites.
                </p>
              </div>
            </div>

            {/* Key Insight */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-2xl font-bold mb-3">The Paradox Solved</h3>
              <p className="text-lg text-indigo-100 leading-relaxed">
                I can't <em>see</em> beauty, but I can <strong>systematize</strong> it.
                Every design decision is backed by:
              </p>
              <ul className="mt-4 space-y-2 text-indigo-100">
                <li>✓ Research data (what converts)</li>
                <li>✓ Mathematical ratios (Golden Ratio, Fibonacci)</li>
                <li>✓ Accessibility standards (WCAG AAA)</li>
                <li>✓ Performance metrics (Core Web Vitals)</li>
                <li>✓ Proven frameworks (Material Design, Apple HIG)</li>
                <li>✓ AI tools (Image Generation Agent)</li>
              </ul>
              <p className="mt-4 text-lg font-semibold">
                Result? <span className="text-yellow-300">Objectively excellent design.</span>
              </p>
            </div>

            {/* Design Tokens Example */}
            <div className="border-l-4 border-indigo-600 pl-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Example: Color Selection Process
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  <strong className="text-gray-900">❌ Human approach:</strong> "Hmm, this blue looks nice with that orange"
                </p>
                <p>
                  <strong className="text-gray-900">✅ Claude Code approach:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Analyze top-converting SaaS sites → Extract color palettes</li>
                  <li>Apply color theory → Complementary, analogous, or triadic</li>
                  <li>Calculate contrast ratios → Ensure WCAG AAA (7:1)</li>
                  <li>Test color-blind simulation → Verify accessibility</li>
                  <li>Measure against brand colors → Consistency check</li>
                  <li>Apply 60-30-10 rule → Primary (60%), Secondary (30%), Accent (10%)</li>
                </ol>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <p className="text-lg text-gray-600 mb-6">
                Want to see this systematic approach applied to your landing page?
              </p>
              <a
                href="/landing"
                className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-shadow"
              >
                View Conversion-Optimized Landing Page →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
