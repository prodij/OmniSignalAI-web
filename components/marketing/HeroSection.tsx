'use client'

import React, { useState, useEffect } from 'react'
import { HeroLayout, Button, Heading, Text, Card, Badge, cn } from '@/lib/design-system'
import { Check, Zap, Clock, Sparkles, CheckCircle2 } from 'lucide-react'

const platformsDemo = [
  { name: 'LinkedIn', status: 'generated', icon: Check, color: 'bg-blue-500/20' },
  { name: 'Instagram', status: 'processing', icon: Zap, color: 'bg-pink-500/20' },
  { name: 'Twitter', status: 'pending', icon: Clock, color: 'bg-blue-400/20' },
  { name: 'Facebook', status: 'pending', icon: Clock, color: 'bg-blue-600/20' },
]

const benefits = [
  '5 platforms, 1 campaign, 30 seconds',
  'Performance prediction before you post',
  'Your brand voice, automatically maintained',
  'No design skills required',
]

export function HeroSection() {
  const [countdown, setCountdown] = useState(30)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (isRunning && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setIsRunning(false)
    }
  }, [countdown, isRunning])

  const startDemo = () => {
    setCountdown(30)
    setIsRunning(true)
  }

  return (
    <HeroLayout
      variant="white"
      height="screen"
      className="relative overflow-hidden pt-16 pb-20"
    >

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center max-w-7xl mx-auto">
        {/* Left: Text Content - 40% */}
        <div className="lg:col-span-2 space-y-12">
          <Heading
            as="h1"
            size="6xl"
            className="text-gray-900 leading-tight mb-8"
          >
            From Hours to{' '}
            <span className="relative inline-block">
              30 Seconds
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-indigo-500 rounded"></div>
            </span>
          </Heading>

          <Text
            size="xl"
            className="text-gray-700 mb-4"
          >
            AI Creates Your Entire Social Media Campaign
          </Text>

          <Text
            size="lg"
            className="text-gray-600 leading-relaxed mb-6"
          >
            Stop being a content producer. Start being a content strategist. Our AI generates
            platform-perfect posts with images and copy while you focus on what actually drives
            business results.
          </Text>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <Text size="sm" className="text-gray-700">
                  {benefit}
                </Text>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="pt-12 space-y-6">
            {/* Trust Signals Above CTA */}
            <div className="flex items-center gap-4 text-sm">
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                Starting at $49/mo
              </Badge>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-2 text-gray-600">
                <Check className="w-4 h-4 text-green-600" />
                SOC 2 Certified
              </span>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 text-lg font-semibold w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
              onClick={startDemo}
            >
              Start Free Trial - No Credit Card Required
            </Button>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Check className="text-green-600 w-4 h-4" />
                14-day free trial
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="text-green-600 w-4 h-4" />
                Setup in 2 minutes
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="text-green-600 w-4 h-4" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>

        {/* Right: Product Screenshot - 60% */}
        <div className="lg:col-span-3">
          <div className="relative">
            <Card
              variant="elevated"
              className="bg-white border border-gray-200 shadow-2xl p-8 transform hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="space-y-6">
                {/* Studio Header */}
                <div className="flex items-center space-x-3 text-green-600">
                  <Sparkles className="w-5 h-5" />
                  <Text size="sm" className="font-mono text-green-600 font-semibold">
                    OmniSignalAI Studio
                  </Text>
                </div>

                {/* Demo Content */}
                <div className="space-y-6">
                  {/* Input Area */}
                  <Card variant="bordered" className="bg-gray-50 border-gray-200 p-4">
                    <Text size="sm" className="text-gray-500 mb-2">
                      Describe your campaign idea...
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      Announcing our new project management tool for remote teams
                    </Text>
                  </Card>

                  {/* Countdown */}
                  <div className="text-center py-6">
                    <Heading
                      size="4xl"
                      className={cn(
                        "font-bold transition-colors duration-300",
                        countdown > 20 ? "text-green-600" :
                        countdown > 10 ? "text-yellow-600" : "text-red-600"
                      )}
                    >
                      {countdown}
                    </Heading>
                    <Text size="sm" className="text-gray-500">
                      seconds remaining
                    </Text>
                  </div>

                  {/* Platform Status Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {platformsDemo.map((platform, index) => {
                      const IconComponent = countdown < 25 - (index * 5) ? Check :
                                          countdown < 30 - (index * 3) ? Zap : Clock
                      const statusText = countdown < 25 - (index * 5) ? 'Generated' :
                                        countdown < 30 - (index * 3) ? 'Processing' : 'Pending'
                      const isGenerated = countdown < 25 - (index * 5)
                      const isProcessing = countdown < 30 - (index * 3) && !isGenerated

                      return (
                        <Card
                          key={platform.name}
                          className={cn(
                            "p-3 text-center border",
                            isGenerated && "bg-green-50 border-green-200",
                            isProcessing && "bg-blue-50 border-blue-200",
                            !isGenerated && !isProcessing && "bg-gray-50 border-gray-200"
                          )}
                        >
                          <Text size="xs" className="text-gray-600 mb-1 font-medium">
                            {platform.name}
                          </Text>
                          <div className="flex items-center justify-center space-x-2">
                            <IconComponent className={cn(
                              "w-4 h-4",
                              isGenerated && "text-green-600",
                              isProcessing && "text-blue-600",
                              !isGenerated && !isProcessing && "text-gray-400"
                            )} />
                            <Text size="sm" className="text-gray-700">{statusText}</Text>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </div>
    </HeroLayout>
  )
}