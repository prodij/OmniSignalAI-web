'use client'

import { useState } from 'react'
import { ContentSection, CTASection, Card, Heading, Text, Badge, Button, cn } from '@/lib/design-system'

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
    <ContentSection
      title="Simple, Transparent Pricing"
      description="Choose the plan that fits your content creation needs. All plans include our core AI generation technology."
      variant="default"
      centered
      className=""
    >
      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <Card className="inline-flex items-center bg-gray-100 rounded-full p-1">
          <Button
            variant={billingCycle === 'monthly' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              "rounded-full transition-all duration-300",
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 bg-transparent'
            )}
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === 'yearly' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setBillingCycle('yearly')}
            className={cn(
              "rounded-full transition-all duration-300",
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 bg-transparent'
            )}
          >
            Yearly
          </Button>
        </Card>
      </div>

      {billingCycle === 'yearly' && (
        <div className="text-center mb-8">
          <Badge variant="success" className="text-green-600 font-semibold">
            💰 Save up to 20% with annual billing
          </Badge>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => (
          <Card
            key={index}
            variant="elevated"
            interactive
            className={cn(
              "transition-all duration-300 hover:shadow-2xl relative p-10",
              plan.popular
                ? 'bg-gradient-to-b from-indigo-50 to-white border-2 border-indigo-200 shadow-xl scale-105'
                : 'bg-white border border-gray-200 shadow-lg hover:border-indigo-200'
            )}
          >
            {plan.popular && (
              <Badge
                variant="default"
                className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white font-bold px-4 py-2"
              >
                Most Popular
              </Badge>
            )}

            {/* Header */}
            <div className="text-center mb-8">
              <Heading size="2xl" className="mb-4">{plan.name}</Heading>
              <Text color="muted" className="mb-8">{plan.description}</Text>

              <div className="mb-3">
                <span className="text-5xl font-bold text-gray-900">
                  ${getCurrentPrice(plan)}
                </span>
                <Text size="base" color="muted" as="span" className="ml-1">
                  /{billingCycle === 'monthly' ? 'month' : 'month, billed annually'}
                </Text>
              </div>

              {billingCycle === 'yearly' && (
                <Badge variant="success" size="sm">
                  {plan.savings}
                </Badge>
              )}
            </div>

            {/* Features */}
            <div className="mb-12">
              <div className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <Text size="base">{feature}</Text>
                  </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <Text size="sm" color="muted" className="mb-2">Plan limitations:</Text>
                  {plan.limitations.map((limitation, limitIndex) => (
                    <div key={limitIndex} className="flex items-center space-x-3 mb-2">
                      <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                      <Text size="sm" color="muted">{limitation}</Text>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="pt-8 border-t border-gray-100">
              <Button
                variant={plan.popular ? 'primary' : 'secondary'}
                size="lg"
                fullWidth
                className={cn(
                  "transition-all duration-300 font-semibold text-lg py-4",
                  plan.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                )}
              >
                {plan.cta}
              </Button>
            </div>

            {plan.name !== "Enterprise" && (
              <Text size="sm" color="muted" className="text-center mt-4">
                14-day free trial • No credit card required
              </Text>
            )}
          </Card>
        ))}
      </div>

      {/* Cost Comparison */}
      <Card variant="elevated" className="mb-16 shadow-2xl">
        <Heading size="2xl" className="text-center mb-8">
          The Real Cost Comparison
        </Heading>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Solution */}
          <Card className="bg-red-50 border-l-4 border-red-500">
            <Heading size="xl" className="text-red-800 mb-4">
              Your Current Solution
            </Heading>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Text>Freelance content creator</Text>
                <Text weight="semibold" className="text-red-600">
                  ${costCalculator.currentCost.freelancer.toLocaleString()}/month
                </Text>
              </div>
              <div className="flex justify-between">
                <Text>Design tools & scheduling</Text>
                <Text weight="semibold" className="text-red-600">
                  ${costCalculator.currentCost.tools}/month
                </Text>
              </div>
              <div className="flex justify-between">
                <Text>Stock photos & premium features</Text>
                <Text weight="semibold" className="text-red-600">
                  ${costCalculator.currentCost.ads}/month
                </Text>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <Text weight="bold">Total Monthly Cost</Text>
                <Text weight="bold" size="xl" className="text-red-600">
                  ${(costCalculator.currentCost.freelancer + costCalculator.currentCost.tools + costCalculator.currentCost.ads).toLocaleString()}/month
                </Text>
              </div>
            </div>
          </Card>

          {/* OmniSignalAI Solution */}
          <Card className="bg-green-50 border-l-4 border-green-500">
            <Heading size="xl" className="text-green-800 mb-4">
              With OmniSignalAI Professional
            </Heading>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Text>Complete AI content solution</Text>
                <Text weight="semibold" className="text-green-600">
                  ${costCalculator.withOmniSignal.subscription}/month
                </Text>
              </div>
              <div className="flex justify-between">
                <Text>Design tools included</Text>
                <Text weight="semibold" className="text-green-600">$0</Text>
              </div>
              <div className="flex justify-between">
                <Text>Unlimited AI-generated visuals</Text>
                <Text weight="semibold" className="text-green-600">$0</Text>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <Text weight="bold">Total Monthly Cost</Text>
                <Text weight="bold" size="xl" className="text-green-600">
                  ${costCalculator.withOmniSignal.subscription}/month
                </Text>
              </div>
            </div>

            <Card className="mt-6 bg-green-100 text-center">
              <Text size="2xl" weight="bold" className="text-green-800 mb-1">
                ${costCalculator.withOmniSignal.savings.toLocaleString()} saved
              </Text>
              <Text size="sm" className="text-green-700">every single month</Text>
            </Card>
          </Card>
        </div>
      </Card>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto mb-16">
        <Heading size="2xl" className="text-center mb-12">
          Frequently Asked Questions
        </Heading>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} variant="default" className="shadow-sm border">
              <Heading size="lg" className="mb-3">
                {faq.question}
              </Heading>
              <Text color="muted" className="leading-relaxed">
                {faq.answer}
              </Text>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <CTASection
        title="Ready to Transform Your Content Creation?"
        description="Join hundreds of marketers who've already made the switch from hours to seconds"
        primaryButton={{
          text: "Start Your 14-Day Free Trial",
          href: "#"
        }}
        note="No credit card required • Cancel anytime • 30-day money-back guarantee"
        variant="gradient"
        className="bg-gradient-to-r from-indigo-600 to-purple-600"
      />
    </ContentSection>
  )
}