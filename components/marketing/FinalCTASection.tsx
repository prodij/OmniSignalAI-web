'use client'

import { useState, useEffect } from 'react'
import { ContentSection, TwoColumnLayout, CTASection, Card, Heading, Text, Badge, Button, cn } from '@/lib/design-system'

export function FinalCTASection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  })

  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const urgencyReasons = [
    "Your competitors are already using AI",
    "Q4 content deadlines are approaching",
    "Holiday campaign season starts soon",
    "Every day delayed is revenue lost"
  ]

  const quickWins = [
    {
      icon: "⚡",
      title: "First Campaign",
      description: "Generate your first complete social media campaign",
      time: "30 seconds from now"
    },
    {
      icon: "📊",
      title: "Performance Data",
      description: "See predicted engagement rates before posting",
      time: "2 minutes from now"
    },
    {
      icon: "🚀",
      title: "Full Week Planned",
      description: "Complete content calendar for next 7 days",
      time: "5 minutes from now"
    },
    {
      icon: "💰",
      title: "Time Savings Realized",
      description: "Calculate your exact ROI and time saved",
      time: "1 hour from now"
    }
  ]

  const finalTestimonials = [
    {
      quote: "I wish I'd found this 6 months ago. Would have saved me $15,000 in freelancer costs.",
      author: "Michael Chen, SaaS Founder",
      metric: "$15K saved"
    },
    {
      quote: "From 20 hours a week on content to 1 hour. This literally gave me my life back.",
      author: "Sarah Williams, Marketing Director",
      metric: "19 hours/week saved"
    },
    {
      quote: "Our engagement rates doubled overnight. The AI knows our audience better than we did.",
      author: "David Martinez, Agency Owner",
      metric: "2x engagement"
    }
  ]

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % finalTestimonials.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [finalTestimonials.length])

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Header */}
        <div className="text-center mb-16">
          <Heading size="6xl" className="text-white mb-6">
            Stop Wasting Time on Content Creation
          </Heading>
          <Text size="xl" className="text-gray-300 max-w-4xl mx-auto mb-8">
            While you're reading this, your competitors just generated 10 social media campaigns.
            <br />
            <span className="text-yellow-400 font-semibold">Don't get left behind.</span>
          </Text>

          {/* Urgency Counter */}
          <Card className="bg-red-900/30 max-w-md mx-auto mb-8">
            <Text size="sm" className="text-red-300 mb-2">⚠️ Limited Time: Free Trial Access</Text>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Text size="2xl" weight="bold" className="text-red-400">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </Text>
                <Text size="xs" className="text-red-200">HOURS</Text>
              </div>
              <div>
                <Text size="2xl" weight="bold" className="text-red-400">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </Text>
                <Text size="xs" className="text-red-200">MINUTES</Text>
              </div>
              <div>
                <Text size="2xl" weight="bold" className="text-red-400">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </Text>
                <Text size="xs" className="text-red-200">SECONDS</Text>
              </div>
            </div>
          </Card>
        </div>

        <TwoColumnLayout
          variant="equal"
          gap="xl"
          verticalAlign="start"
          leftContent={
            <div>
              <Heading size="2xl" className="text-white mb-8 text-center">
                What You Get in the Next 30 Minutes
              </Heading>

              <div className="space-y-6">
                {quickWins.map((win, index) => (
                  <Card key={index} className="bg-white/5 border-0">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{win.icon}</div>
                      <div className="flex-grow">
                        <Heading size="lg" className="text-white mb-2">{win.title}</Heading>
                        <Text className="text-gray-300 mb-2">{win.description}</Text>
                        <Badge variant="warning" className="bg-yellow-900/50 text-yellow-400 border-yellow-600">
                          {win.time}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          }
          rightContent={
            <div>
              <Heading size="2xl" className="text-white mb-8 text-center">
                Don't Take Our Word For It
              </Heading>

              {/* Rotating Testimonial */}
              <Card className="bg-white/10 border-0 mb-8">
                <div className="text-center">
                  <div className="text-3xl text-yellow-400 mb-4">"</div>
                  <blockquote className="text-lg text-gray-200 mb-6 leading-relaxed">
                    {finalTestimonials[currentTestimonial].quote}
                  </blockquote>
                  <Text weight="semibold" className="text-white">
                    {finalTestimonials[currentTestimonial].author}
                  </Text>
                  <Badge variant="success" className="mt-2 bg-green-900/50 text-green-400 border-green-600">
                    {finalTestimonials[currentTestimonial].metric}
                  </Badge>
                </div>

                {/* Testimonial Indicators */}
                <div className="flex justify-center space-x-2 mt-6">
                  {finalTestimonials.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        currentTestimonial === index ? 'bg-yellow-400' : 'bg-gray-600'
                      )}
                    />
                  ))}
                </div>
              </Card>

              {/* Urgency Reasons */}
              <Card className="bg-red-900/20 border-0">
                <Heading size="lg" className="text-red-300 mb-4">Why You Need to Act Now:</Heading>
                <div className="space-y-3">
                  {urgencyReasons.map((reason, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <Text size="sm" className="text-red-200">{reason}</Text>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          }
        />

        {/* Main CTA */}
        <div className="text-center max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0 mb-8">
            <Heading size="3xl" className="text-white mb-4">
              Start Your Content Transformation Now
            </Heading>
            <Text size="lg" className="text-indigo-100 mb-6">
              14-day free trial • No credit card required • Cancel anytime
            </Text>

            {/* Main CTA Button */}
            <Button
              size="lg"
              className="bg-yellow-400 text-gray-900 px-12 py-6 font-bold text-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-2xl mb-6"
            >
              Generate My First Campaign in 30 Seconds - FREE
            </Button>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-xl mb-1">🔒</div>
                <Text size="sm" className="text-indigo-200">Enterprise Security</Text>
              </div>
              <div>
                <div className="text-xl mb-1">💰</div>
                <Text size="sm" className="text-indigo-200">30-Day Guarantee</Text>
              </div>
              <div>
                <div className="text-xl mb-1">⚡</div>
                <Text size="sm" className="text-indigo-200">Instant Access</Text>
              </div>
              <div>
                <div className="text-xl mb-1">🎯</div>
                <Text size="sm" className="text-indigo-200">500+ Happy Customers</Text>
              </div>
            </div>
          </Card>

          {/* Alternative CTA */}
          <div className="text-center">
            <Text color="muted" className="mb-4">Not ready to start? Want to see it in action first?</Text>
            <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 underline">
              Watch 2-Minute Demo Video →
            </Button>
          </div>

          {/* Final Urgency */}
          <Card className="mt-12 bg-yellow-900/20 border border-yellow-500/30">
            <Badge variant="warning" className="text-yellow-300 font-semibold mb-2">
              ⚠️ Fair Warning
            </Badge>
            <Text size="sm" className="text-gray-300 leading-relaxed">
              Once you experience the transformation from 8 hours to 30 seconds, you'll wonder how you ever
              survived manual content creation. Our customers report feeling "almost guilty" about how easy
              it becomes to outperform their competition.
            </Text>
          </Card>
        </div>
      </div>
    </section>
  )
}