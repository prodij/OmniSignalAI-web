"use client"

import { useState } from 'react'
import { Section, Container, Heading, Text } from '@/lib/design-system'
import { ChevronDown, HelpCircle } from 'lucide-react'

/**
 * FAQSection Component
 *
 * Strategic Purpose: Remove final objections before asking for purchase
 * Psychology: Address hidden concerns users have but won't ask about
 * Placement: Section 12 (immediately before final CTA, after pricing)
 *
 * Critical Questions to Address:
 * - Brand voice concerns
 * - Quality concerns ("AI slop")
 * - Setup difficulty
 * - Industry fit
 * - Trial details
 */

interface FAQItem {
  question: string
  answer: string
  category: 'quality' | 'setup' | 'brand' | 'general'
}

const faqs: FAQItem[] = [
  {
    category: 'quality',
    question: "Will it sound like my brand or just generic AI content?",
    answer: "Your AI learns from your existing content and brand guidelines. Upload 3-5 sample posts, add your brand voice description, and the AI adapts to your style. 73% of users publish without edits after the 2-minute training process. You maintain full control and can regenerate or edit any output.",
  },
  {
    category: 'quality',
    question: "What if it creates 'AI slop' or low-quality content?",
    answer: "Our quality scoring system prevents bad content from being suggested. The AI is trained specifically on high-performing social media posts (not generic text), and you review everything before publishing. Plus, performance prediction scores help you identify winners before posting. If you're not satisfied, regenerate instantly with refinements.",
  },
  {
    category: 'setup',
    question: "How hard is setup? I'm not technical.",
    answer: "2 minutes, zero technical skills needed. Connect your social platforms (OAuth, no passwords), upload 3 sample posts for brand training, and start generating. Most users create their first campaign within 5 minutes of signing up. No coding, no complicated configuration.",
  },
  {
    category: 'general',
    question: "Does it work for my industry? (B2B SaaS, agency, e-commerce, etc.)",
    answer: "Yes. OmniSignalAI works for any business with a social media presence. We have customers across B2B SaaS, marketing agencies, e-commerce, consulting, coaching, real estate, and more. The AI learns YOUR industry language and audience, not generic templates.",
  },
  {
    category: 'brand',
    question: "What if I don't like the output?",
    answer: "You have full control. Regenerate with specific refinements ('make it more professional', 'add humor', 'focus on ROI'), edit manually before publishing, or start over. Think of it as a collaborative writing partner, not a replacement for your judgment.",
  },
  {
    category: 'general',
    question: "What's included in the free trial?",
    answer: "Full access to all Professional plan features for 14 days. No credit card required to start. Create unlimited campaigns, test all platforms, try performance prediction, train your brand voice—everything. Cancel anytime, no questions asked.",
  },
  {
    category: 'setup',
    question: "Do I need to learn prompting or AI skills?",
    answer: "No. Just describe what you want in plain language: 'Announce our new feature for remote teams' or 'Share our latest customer success story.' The AI handles the rest. Unlike ChatGPT, you don't need to be a prompt engineer.",
  },
  {
    category: 'general',
    question: "How is this different from using ChatGPT + Canva + Buffer?",
    answer: "Those are 3 separate tools requiring manual work between each step. OmniSignalAI creates complete posts (text + images) optimized for each platform, predicts performance, and publishes—all in one workflow. ChatGPT doesn't create images. Canva doesn't write copy. Buffer doesn't create content. We do all three.",
  },
  {
    category: 'brand',
    question: "Can I use my own images instead of AI-generated ones?",
    answer: "Absolutely. Upload your own images, use our AI-generated visuals, or mix both. You have complete flexibility. The AI will optimize whatever images you choose for each platform's specs (dimensions, file size, etc.).",
  },
  {
    category: 'general',
    question: "What if I need help or have questions?",
    answer: "Professional plan includes priority email support (response within 4 hours). Enterprise plan includes dedicated success manager and Slack channel. Plus comprehensive help docs, video tutorials, and community forum for all users.",
  },
]

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <Section variant="secondary" className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full mb-4">
            <HelpCircle className="w-4 h-4" />
            <Text size="sm" weight="semibold">Your Questions Answered</Text>
          </div>
          <Heading as="h2" size="3xl" className="mb-4">
            Questions You're Probably Asking
          </Heading>
          <Text size="lg" className="text-gray-600 max-w-2xl mx-auto">
            We've helped 2,847 marketing teams get started. Here are the most common questions.
          </Text>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <Text className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </Text>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 pt-2 border-t border-gray-100">
                    <Text className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
            <Text className="text-lg font-semibold text-gray-900">
              Still have questions?
            </Text>
            <Text className="text-gray-600">
              Book a 15-minute demo call with our team
            </Text>
            <button className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
              Schedule a Demo Call
            </button>
          </div>
        </div>

        {/* Trust Signal */}
        <div className="mt-12 text-center">
          <Text className="text-sm text-gray-500">
            Join 2,847 marketing teams who asked the same questions and got started in 2 minutes
          </Text>
        </div>
      </Container>
    </Section>
  )
}
