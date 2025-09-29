'use client'

import { useState, useEffect } from 'react'
import { ContentSection, TwoColumnLayout, Card, Heading, Text, Badge, Input, cn } from '@/lib/design-system'

const transformationSteps = [
  {
    title: "Describe Your Campaign",
    description: "Type one sentence about your product or service",
    input: "Announcing our new project management tool for remote teams",
    time: "0s",
    icon: "✏️"
  },
  {
    title: "AI Analyzes & Optimizes",
    description: "Our AI understands your brand voice and audience",
    input: "Processing brand guidelines, audience insights, platform requirements...",
    time: "15s",
    icon: "🤖"
  },
  {
    title: "Complete Campaign Generated",
    description: "5 platforms, custom images, optimized copy",
    input: "LinkedIn post with carousel, Instagram story + feed post, Twitter thread...",
    time: "30s",
    icon: "✨"
  }
]

const platforms = [
  { name: 'LinkedIn', color: 'bg-blue-500' },
  { name: 'Instagram', color: 'bg-pink-500' },
  { name: 'Twitter', color: 'bg-blue-400' },
  { name: 'Facebook', color: 'bg-blue-600' }
]

export function SolutionSection() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % transformationSteps.length)
        setIsAnimating(false)
      }, 500)
    }, 4500)

    return () => clearInterval(interval)
  }, [])

  const getStepStatus = (index: number) => {
    if (currentStep > index) return 'completed'
    if (currentStep === index) return 'active'
    return 'pending'
  }

  const getPlatformStatus = (index: number) => {
    if (currentStep >= 2) return 'Complete'
    if (currentStep === 1 && index < 2) return 'Generating...'
    return 'Pending'
  }

  return (
    <ContentSection
      title="The 30-Second Transformation"
      description="Watch how our AI transforms a single idea into a complete, multi-platform social media campaign"
      variant="default"
      centered
      className="bg-gradient-to-b from-gray-50 to-white"
    >
      <TwoColumnLayout
        variant="equal"
        gap="xl"
        verticalAlign="center"
        leftContent={
          <div className="space-y-8">
            {transformationSteps.map((step, index) => {
              const status = getStepStatus(index)

              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-start space-x-6 transition-all duration-500",
                    status === 'active' && 'scale-105',
                    status === 'completed' && 'opacity-75',
                    status === 'pending' && 'opacity-40'
                  )}
                >
                  {/* Step Number/Icon */}
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500",
                    status === 'active' && 'bg-indigo-600 text-white shadow-lg animate-pulse',
                    status === 'completed' && 'bg-green-500 text-white',
                    status === 'pending' && 'bg-gray-200 text-gray-400'
                  )}>
                    {status === 'completed' ? '✓' : index + 1}
                  </div>

                  {/* Step Content */}
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-3">
                      <Heading size="xl" className="text-gray-900">
                        {step.title}
                      </Heading>
                      <Badge
                        variant={status === 'active' ? 'default' : 'default'}
                        size="sm"
                        className={cn(
                          "transition-all duration-500",
                          status === 'active' && 'bg-indigo-100 text-indigo-700 animate-pulse',
                          status === 'completed' && 'bg-green-100 text-green-700',
                          status === 'pending' && 'bg-gray-100 text-gray-500'
                        )}
                      >
                        {step.time}
                      </Badge>
                    </div>

                    <Text size="base" color="muted" className="mb-4">
                      {step.description}
                    </Text>

                    <Card className="bg-gray-50 border border-gray-200">
                      <Text size="sm" className="font-mono text-gray-700">
                        {step.input}
                      </Text>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        }
        rightContent={
          <div className="relative">
            <Card variant="elevated" className="shadow-2xl">
              <div className="space-y-6">
                {/* Input Section */}
                <div className="border-b border-gray-200 pb-6">
                  <Text size="sm" weight="medium" color="default" className="mb-3">
                    Campaign Idea
                  </Text>
                  <div className="relative">
                    <Input
                      value="Announcing our new project management tool for remote teams"
                      readOnly
                      className="bg-gray-50"
                      rightIcon={
                        <span className={cn(
                          "text-xl transition-all duration-500",
                          isAnimating && "animate-spin"
                        )}>
                          {currentStep === 0 ? '✏️' : currentStep === 1 ? '🤖' : '✨'}
                        </span>
                      }
                    />
                  </div>
                </div>

                {/* Platform Status Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {platforms.map((platform, index) => {
                    const status = getPlatformStatus(index)

                    return (
                      <Card
                        key={platform.name}
                        className={cn(
                          "p-4 text-center border-2 transition-all duration-500",
                          status === 'Complete' && `${platform.color} text-white shadow-lg transform scale-105`,
                          status === 'Generating...' && 'border-orange-300 bg-orange-50 animate-pulse',
                          status === 'Pending' && 'border-gray-200 bg-gray-50'
                        )}
                      >
                        <Text size="sm" weight="semibold" className="mb-1">
                          {platform.name}
                        </Text>
                        <Text size="xs" className="opacity-75">
                          {status === 'Complete' ? '✓ Ready' :
                           status === 'Generating...' ? '⚡ Processing' : '⏳ Queued'}
                        </Text>
                      </Card>
                    )
                  })}
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-gradient-to-r from-indigo-500 to-green-500 transition-all duration-1000 ease-out",
                      currentStep === 0 && 'w-0',
                      currentStep === 1 && 'w-1/2',
                      currentStep === 2 && 'w-full'
                    )}
                  />
                </div>

                {/* Status Display */}
                <div className="text-center">
                  <Heading size="2xl" color="default" className="mb-2">
                    {currentStep === 0 ? '0' : currentStep === 1 ? '50' : '100'}%
                  </Heading>
                  <Text size="sm" color="muted">
                    {transformationSteps[currentStep].title}
                  </Text>
                </div>
              </div>
            </Card>

            {/* Floating Decoration Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute top-1/2 -left-8 w-4 h-4 bg-cyan-300 rounded-full animate-ping opacity-50"></div>
          </div>
        }
      />

      {/* Transformation Summary */}
      <div className="mt-20">
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 max-w-4xl mx-auto text-center">
          <Heading size="lg" color="primary" className="mb-4">
            The Result: From Hours to Seconds
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Text size="3xl" className="font-bold text-red-600">
                8 Hours
              </Text>
              <Text size="sm" color="muted">
                Manual process
              </Text>
            </div>
            <div className="flex items-center justify-center">
              <Text size="xl" className="text-indigo-600">
                →
              </Text>
            </div>
            <div>
              <Text size="3xl" className="font-bold text-green-600">
                30 Seconds
              </Text>
              <Text size="sm" color="muted">
                With OmniSignalAI
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </ContentSection>
  )
}