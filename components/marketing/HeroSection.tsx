'use client'

import React, { useState, useEffect } from 'react'
import { HeroLayout, TwoColumnLayout, Button, Heading, Text, Card, cn } from '@/lib/design-system'
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
      variant="gradient"
      height="screen"
      className="relative overflow-hidden"
    >
      {/* Background particles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse"></div>
      </div>

      <TwoColumnLayout
        variant="equal"
        gap="xl"
        verticalAlign="center"
        leftContent={
          <div className="space-y-8">
            <Heading
              as="h1"
              size="6xl"
              className="text-white leading-tight animate-fade-in"
            >
              From Hours to{' '}
              <span className="relative inline-block">
                30 Seconds
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 rounded animate-pulse"></div>
              </span>
            </Heading>

            <Text
              size="xl"
              className="text-white/90 animate-slide-up"
            >
              AI Creates Your Entire Social Media Campaign
            </Text>

            <Text
              size="lg"
              className="text-white/80 leading-relaxed max-w-xl"
            >
              Stop being a content producer. Start being a content strategist. Our AI generates
              platform-perfect posts with images and copy while you focus on what actually drives
              business results.
            </Text>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-300 flex-shrink-0" />
                  <Text size="sm" className="text-white/90">
                    {benefit}
                  </Text>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-6 space-y-4">
              <Button
                variant="primary"
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg font-semibold"
                onClick={startDemo}
              >
                Start Free Trial - No Credit Card Required
              </Button>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Check className="text-green-500 mr-1 w-4 h-4" />
                  14-day free trial
                </span>
                <span className="flex items-center">
                  <Check className="text-green-500 mr-1 w-4 h-4" />
                  Setup in 2 minutes
                </span>
                <span className="flex items-center">
                  <Check className="text-green-500 mr-1 w-4 h-4" />
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        }
        rightContent={
          <div className="relative">
            <Card
              variant="elevated"
              className="bg-white border border-gray-200 shadow-2xl p-8"
            >
              <div className="space-y-6">
                {/* Studio Header */}
                <div className="flex items-center space-x-3 text-green-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <Text size="sm" className="font-mono text-green-400">
                    OmniSignalAI Studio
                  </Text>
                </div>

                {/* Demo Content */}
                <div className="space-y-6">
                  {/* Input Area */}
                  <Card variant="bordered" className="bg-white/10 border-white/20 p-4">
                    <Text size="sm" className="text-white/60 mb-2">
                      Describe your campaign idea...
                    </Text>
                    <Text className="text-white animate-typewriter">
                      Announcing our new project management tool for remote teams
                    </Text>
                  </Card>

                  {/* Countdown */}
                  <div className="text-center py-8">
                    <Heading
                      size="4xl"
                      className={cn(
                        "font-bold transition-colors duration-300",
                        countdown > 20 ? "text-green-400" :
                        countdown > 10 ? "text-yellow-400" : "text-red-400",
                        isRunning && "animate-bounce-gentle"
                      )}
                    >
                      {countdown}
                    </Heading>
                    <Text size="sm" className="text-white/60">
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

                      return (
                        <Card
                          key={platform.name}
                          className={cn(
                            platform.color,
                            "p-3 text-center border border-white/10",
                            countdown < 25 - (index * 5) && "bg-green-500/20"
                          )}
                        >
                          <Text size="xs" className="text-white/60 mb-1">
                            {platform.name}
                          </Text>
                          <div className="flex items-center justify-center space-x-2">
                            <IconComponent className="w-4 h-4 text-white" />
                            <Text size="sm" className="text-white">{statusText}</Text>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Card>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-300 rounded-full animate-bounce opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-300 rounded-full animate-pulse opacity-40"></div>
          </div>
        }
      />

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </HeroLayout>
  )
}