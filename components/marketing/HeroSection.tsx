'use client'

import React, { useState, useEffect } from 'react'
import { HeroLayout, Button, Heading, Text, Card, Badge, cn } from '@/lib/design-system'
import { Check, Zap, Clock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

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
      className="relative overflow-hidden pt-24 pb-32"
    >
      {/* Mesh Gradient Background (Subtle) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background: `
            radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.8) 0px, transparent 50%),
            radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.6) 0px, transparent 50%),
            radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.7) 0px, transparent 50%)
          `
        }}
      />

      {/* Z-Pattern Layout: Logo (top-left) → CTA (top-right) → Content (center) → Secondary CTA (bottom-right) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-24 items-center max-w-7xl mx-auto px-6 relative z-10">
        {/* Left: Text Content - 38.2% (Golden Ratio) */}
        <motion.div
          className="lg:col-span-2 space-y-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* F-Pattern: Top-left hotspot - Primary headline */}
          <Heading
            as="h1"
            className="text-gray-900 leading-[1.1] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}
          >
            From Hours to{' '}
            <span className="relative inline-block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-black">
              30 Seconds
              {/* Neo-brutalist accent line */}
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </span>
          </Heading>

          {/* F-Pattern: Secondary hotspot - Value proposition */}
          <Text
            size="2xl"
            className="text-gray-700 font-semibold leading-[1.4]"
          >
            AI Creates Your Entire Social Media Campaign
          </Text>

          <Text
            size="lg"
            className="text-gray-600 leading-[1.6]"
          >
            Stop being a content producer. Start being a content strategist. Our AI generates
            platform-perfect posts with images and copy while you focus on what actually drives
            business results.
          </Text>

          {/* Benefits Grid - 8px spacing (16px gap = 2 × 8px) */}
          <div className="grid grid-cols-1 gap-4 pt-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <Text size="base" className="text-gray-700">
                  {benefit}
                </Text>
              </motion.div>
            ))}
          </div>

          {/* CTA Section - Z-Pattern: Bottom-left to right */}
          <motion.div
            className="pt-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {/* Trust Signals Above CTA */}
            <div className="flex items-center gap-4 text-sm">
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 font-semibold">
                Starting at $49/mo
              </Badge>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-2 text-gray-600 font-medium">
                <Check className="w-4 h-4 text-green-600" />
                SOC 2 Certified
              </span>
            </div>

            {/* Primary CTA - High contrast (12:1 ratio on gradient) */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="primary"
                size="lg"
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-6 text-lg font-bold w-full sm:w-auto shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300"
                onClick={startDemo}
              >
                Start Free Trial - No Credit Card
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Micro trust signals - 8px spacing */}
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
          </motion.div>
        </motion.div>

        {/* Right: Product Demo - 61.8% (Golden Ratio) */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="relative">
            {/* Glassmorphism Card with neo-brutalist shadow */}
            <motion.div
              className="relative"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                variant="elevated"
                className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 shadow-2xl p-8 rounded-2xl"
                style={{
                  boxShadow: '12px 12px 0px 0px rgba(79, 70, 229, 0.1)'
                }}
              >
                <div className="space-y-8">
                  {/* Studio Header - with glow effect */}
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5 text-green-600" />
                    </motion.div>
                    <Text size="base" className="font-mono text-green-600 font-bold tracking-wide">
                      OmniSignalAI Studio
                    </Text>
                  </div>

                  {/* Demo Content - 8px spacing system */}
                  <div className="space-y-6">
                    {/* Input Area - with subtle gradient */}
                    <Card
                      variant="bordered"
                      className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 p-6 rounded-xl"
                    >
                      <Text size="sm" className="text-gray-500 mb-3 font-medium">
                        Describe your campaign idea...
                      </Text>
                      <Text size="base" className="text-gray-900 font-semibold">
                        Announcing our new project management tool for remote teams
                      </Text>
                    </Card>

                    {/* Countdown - with gradient text */}
                    <div className="text-center py-8">
                      <motion.div
                        animate={{ scale: countdown % 2 === 0 ? 1.05 : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Heading
                          as="h2"
                          className={cn(
                            "font-black transition-all duration-300 bg-clip-text text-transparent",
                            countdown > 20 ? "bg-gradient-to-r from-green-600 to-emerald-600" :
                            countdown > 10 ? "bg-gradient-to-r from-yellow-600 to-orange-600" :
                            "bg-gradient-to-r from-red-600 to-pink-600"
                          )}
                          style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
                        >
                          {countdown}
                        </Heading>
                      </motion.div>
                      <Text size="sm" className="text-gray-500 font-medium mt-2">
                        seconds remaining
                      </Text>
                    </div>

                    {/* Platform Status Grid - 8px system (12px gap = 1.5 × 8px) */}
                    <div className="grid grid-cols-2 gap-4">
                      {platformsDemo.map((platform, index) => {
                        const IconComponent = countdown < 25 - (index * 5) ? Check :
                                            countdown < 30 - (index * 3) ? Zap : Clock
                        const statusText = countdown < 25 - (index * 5) ? 'Generated' :
                                          countdown < 30 - (index * 3) ? 'Processing' : 'Pending'
                        const isGenerated = countdown < 25 - (index * 5)
                        const isProcessing = countdown < 30 - (index * 3) && !isGenerated

                        return (
                          <motion.div
                            key={platform.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card
                              className={cn(
                                "p-4 text-center border-2 transition-all duration-300 rounded-xl",
                                isGenerated && "bg-green-50 border-green-300 shadow-lg shadow-green-100",
                                isProcessing && "bg-blue-50 border-blue-300 shadow-lg shadow-blue-100",
                                !isGenerated && !isProcessing && "bg-gray-50 border-gray-300"
                              )}
                            >
                              <Text size="sm" className="text-gray-700 mb-2 font-bold">
                                {platform.name}
                              </Text>
                              <div className="flex items-center justify-center space-x-2">
                                <IconComponent className={cn(
                                  "w-5 h-5",
                                  isGenerated && "text-green-600",
                                  isProcessing && "text-blue-600 animate-spin",
                                  !isGenerated && !isProcessing && "text-gray-400"
                                )} />
                                <Text size="sm" className="text-gray-700 font-medium">{statusText}</Text>
                              </div>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator - animated */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-gray-500 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </HeroLayout>
  )
}