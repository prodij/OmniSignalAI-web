'use client'

import { useState, useEffect } from 'react'

export function SolutionSection() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const transformationSteps = [
    {
      title: "Describe Your Campaign",
      description: "Type one sentence about your product or service",
      input: "Announcing our new project management tool for remote teams",
      time: "0s"
    },
    {
      title: "AI Analyzes & Optimizes",
      description: "Our AI understands your brand voice and audience",
      input: "Processing brand guidelines, audience insights, platform requirements...",
      time: "15s"
    },
    {
      title: "Complete Campaign Generated",
      description: "5 platforms, custom images, optimized copy",
      input: "LinkedIn post with carousel, Instagram story + feed post, Twitter thread...",
      time: "30s"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % transformationSteps.length)
        setIsAnimating(false)
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-heading font-bold text-gray-900 mb-6">
            The 30-Second Transformation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how our AI transforms a single idea into a complete,
            multi-platform social media campaign
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Step-by-step breakdown */}
          <div className="space-y-8">
            {transformationSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-start space-x-6 transition-all duration-500 ${
                  currentStep === index
                    ? 'opacity-100 scale-105'
                    : currentStep > index
                      ? 'opacity-60'
                      : 'opacity-30'
                }`}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 ${
                  currentStep === index
                    ? 'bg-blue-600 text-white shadow-lg'
                    : currentStep > index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                }`}>
                  {currentStep > index ? '✓' : index + 1}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    <span className={`text-sm px-2 py-1 rounded-full transition-all duration-500 ${
                      currentStep === index
                        ? 'bg-blue-100 text-blue-700 animate-pulse'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {step.time}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-700">
                    {step.input}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Live demo visualization */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <div className="space-y-6">
                {/* Input Area */}
                <div className="border-b pb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Idea
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full p-4 border rounded-lg bg-gray-50"
                      value="Announcing our new project management tool for remote teams"
                      readOnly
                    />
                    <div className={`absolute right-4 top-4 transition-all duration-500 ${
                      isAnimating ? 'animate-spin' : ''
                    }`}>
                      {currentStep === 0 ? '✏️' : currentStep === 1 ? '🤖' : '✨'}
                    </div>
                  </div>
                </div>

                {/* Platform Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { platform: 'LinkedIn', color: 'bg-blue-500', status: currentStep >= 2 ? 'Complete' : currentStep === 1 ? 'Generating...' : 'Pending' },
                    { platform: 'Instagram', color: 'bg-pink-500', status: currentStep >= 2 ? 'Complete' : currentStep === 1 ? 'Generating...' : 'Pending' },
                    { platform: 'Twitter', color: 'bg-blue-400', status: currentStep >= 2 ? 'Complete' : 'Pending' },
                    { platform: 'Facebook', color: 'bg-blue-600', status: currentStep >= 2 ? 'Complete' : 'Pending' }
                  ].map((item, index) => (
                    <div
                      key={item.platform}
                      className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                        item.status === 'Complete'
                          ? `${item.color} text-white shadow-lg transform scale-105`
                          : item.status === 'Generating...'
                            ? 'border-orange-300 bg-orange-50 animate-pulse'
                            : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold text-sm mb-1">{item.platform}</div>
                        <div className="text-xs opacity-75">
                          {item.status === 'Complete' ? '✓ Ready' :
                           item.status === 'Generating...' ? '⚡ Processing' : '⏳ Queued'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000 ease-out ${
                      currentStep === 0 ? 'w-0' :
                      currentStep === 1 ? 'w-1/2' : 'w-full'
                    }`}
                  ></div>
                </div>

                {/* Status */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {currentStep === 0 ? '0' : currentStep === 1 ? '50' : '100'}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {transformationSteps[currentStep].title}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-pulse opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  )
}