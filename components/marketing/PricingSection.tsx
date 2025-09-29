'use client'

import { useState } from 'react'

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: "Starter",
      description: "Perfect for solopreneurs and small businesses",
      price: {
        monthly: 49,
        yearly: 39
      },
      features: [
        "50 campaigns per month",
        "3 social platforms",
        "AI-generated images",
        "Basic brand voice learning",
        "Performance analytics",
        "Email support"
      ],
      limitations: [
        "LinkedIn, Instagram, Twitter only",
        "Standard image styles",
        "Basic scheduling"
      ],
      popular: false,
      cta: "Start Free Trial",
      savings: "Save $120/year"
    },
    {
      name: "Professional",
      description: "For growing teams and agencies",
      price: {
        monthly: 149,
        yearly: 119
      },
      features: [
        "200 campaigns per month",
        "5+ social platforms",
        "Advanced AI visuals",
        "Custom brand voice training",
        "Advanced analytics & A/B testing",
        "Priority support",
        "Team collaboration",
        "Custom templates",
        "Bulk scheduling"
      ],
      limitations: [],
      popular: true,
      cta: "Start Free Trial",
      savings: "Save $360/year"
    },
    {
      name: "Enterprise",
      description: "For large organizations with custom needs",
      price: {
        monthly: 499,
        yearly: 399
      },
      features: [
        "Unlimited campaigns",
        "All social platforms",
        "Custom AI model training",
        "White-label solution",
        "Advanced integrations",
        "Dedicated account manager",
        "Custom workflows",
        "API access",
        "SLA guarantee"
      ],
      limitations: [],
      popular: false,
      cta: "Contact Sales",
      savings: "Save $1,200/year"
    }
  ]

  const costCalculator = {
    currentCost: {
      freelancer: 2400, // $50/hour × 12 hours/week × 4 weeks
      tools: 200, // Design tools + scheduling tools
      ads: 500 // Stock photos, premium features
    },
    withOmniSignal: {
      subscription: billingCycle === 'monthly' ? 149 : 119,
      savings: billingCycle === 'monthly' ? 2951 : 2981
    }
  }

  const faqs = [
    {
      question: "How does the free trial work?",
      answer: "Start with a 14-day free trial. Generate unlimited campaigns, test all features, and see the results for yourself. No credit card required to start."
    },
    {
      question: "Can I change plans later?",
      answer: "Yes, upgrade or downgrade anytime. Changes take effect immediately, and we'll pro-rate any differences."
    },
    {
      question: "What platforms are supported?",
      answer: "All major platforms: LinkedIn, Instagram, Twitter, Facebook, TikTok, YouTube, Pinterest, and more. We're constantly adding new platforms."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee. If you're not completely satisfied, we'll refund your payment in full."
    },
    {
      question: "Is my brand voice secure?",
      answer: "Absolutely. Your brand data is encrypted and never shared. We use enterprise-grade security and comply with GDPR and SOC 2 standards."
    }
  ]

  const getCurrentPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-heading font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your content creation needs.
            All plans include our core AI generation technology.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
            </button>
          </div>

          {billingCycle === 'yearly' && (
            <div className="mt-4 text-green-600 font-semibold">
              💰 Save up to 20% with annual billing
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl ${
                plan.popular
                  ? 'bg-gradient-to-b from-blue-50 to-white border-2 border-blue-200 shadow-xl scale-105'
                  : 'bg-white border border-gray-200 shadow-lg hover:border-blue-200'
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-600 text-white text-sm font-bold text-center py-2 px-4 rounded-full mb-6">
                  Most Popular
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">
                    ${getCurrentPrice(plan)}
                  </span>
                  <span className="text-gray-600 ml-1">
                    /{billingCycle === 'monthly' ? 'month' : 'month, billed annually'}
                  </span>
                </div>

                {billingCycle === 'yearly' && (
                  <div className="text-sm text-green-600 font-semibold">
                    {plan.savings}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-8">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="text-sm text-gray-500 mb-2">Plan limitations:</div>
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-center space-x-3 mb-2">
                        <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <span className="text-gray-500 text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <button
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {plan.cta}
              </button>

              {plan.name !== "Enterprise" && (
                <div className="text-center mt-4 text-sm text-gray-500">
                  14-day free trial • No credit card required
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cost Comparison */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            The Real Cost Comparison
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Solution */}
            <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500">
              <h4 className="text-xl font-bold text-red-800 mb-4">
                Your Current Solution
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Freelance content creator</span>
                  <span className="font-semibold text-red-600">
                    ${costCalculator.currentCost.freelancer.toLocaleString()}/month
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Design tools & scheduling</span>
                  <span className="font-semibold text-red-600">
                    ${costCalculator.currentCost.tools}/month
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Stock photos & premium features</span>
                  <span className="font-semibold text-red-600">
                    ${costCalculator.currentCost.ads}/month
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total Monthly Cost</span>
                  <span className="font-bold text-red-600 text-xl">
                    ${(costCalculator.currentCost.freelancer + costCalculator.currentCost.tools + costCalculator.currentCost.ads).toLocaleString()}/month
                  </span>
                </div>
              </div>
            </div>

            {/* OmniSignalAI Solution */}
            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
              <h4 className="text-xl font-bold text-green-800 mb-4">
                With OmniSignalAI Professional
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Complete AI content solution</span>
                  <span className="font-semibold text-green-600">
                    ${costCalculator.withOmniSignal.subscription}/month
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Design tools included</span>
                  <span className="font-semibold text-green-600">$0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Unlimited AI-generated visuals</span>
                  <span className="font-semibold text-green-600">$0</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total Monthly Cost</span>
                  <span className="font-bold text-green-600 text-xl">
                    ${costCalculator.withOmniSignal.subscription}/month
                  </span>
                </div>
              </div>

              <div className="mt-6 bg-green-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-800 mb-1">
                  ${costCalculator.withOmniSignal.savings.toLocaleString()} saved
                </div>
                <div className="text-green-700 text-sm">every single month</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h3>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Transform Your Content Creation?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of marketers who've already made the switch from hours to seconds
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300">
              Start Your 14-Day Free Trial
            </button>
            <div className="mt-4 text-blue-200 text-sm">
              No credit card required • Cancel anytime • 30-day money-back guarantee
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}