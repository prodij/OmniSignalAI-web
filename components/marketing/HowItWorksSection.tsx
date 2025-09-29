'use client'

import { useState } from 'react'

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: "Describe Your Campaign",
      subtitle: "One sentence is all it takes",
      description: "Type a simple description of what you want to promote. Our AI understands context, tone, and intent from minimal input.",
      details: [
        "Natural language processing identifies key themes",
        "Brand voice analysis maintains consistency",
        "Industry context ensures relevant messaging",
        "Audience targeting optimizes for your market"
      ],
      example: {
        input: "Announcing our new project management tool for remote teams",
        processing: [
          "Detecting industry: SaaS/Productivity",
          "Identifying audience: Remote workers, team leads",
          "Brand tone: Professional, helpful, innovative",
          "Key benefits: Organization, collaboration, efficiency"
        ]
      },
      icon: "✏️",
      time: "5 seconds"
    },
    {
      title: "AI Analyzes & Strategizes",
      subtitle: "Deep learning meets marketing expertise",
      description: "Our AI analyzes your brand guidelines, audience data, and current trends to create a comprehensive content strategy.",
      details: [
        "Brand guidelines analysis for visual consistency",
        "Competitor content research for differentiation",
        "Trending hashtags and keywords identification",
        "Optimal posting time recommendations per platform"
      ],
      example: {
        input: "Processing brand assets and market data...",
        processing: [
          "Analyzing 15,000+ similar campaigns",
          "Identifying top-performing content patterns",
          "Optimizing for platform-specific algorithms",
          "Generating performance predictions"
        ]
      },
      icon: "🧠",
      time: "15 seconds"
    },
    {
      title: "Multi-Platform Generation",
      subtitle: "Each platform gets exactly what it needs",
      description: "Simultaneous generation of platform-optimized content with custom visuals, copy variations, and engagement strategies.",
      details: [
        "LinkedIn: Professional insights with industry data",
        "Instagram: Visual storytelling with hashtag strategies",
        "Twitter: Conversational threads with trending topics",
        "Facebook: Community-focused with clear CTAs"
      ],
      example: {
        input: "Generating content for 5 platforms...",
        processing: [
          "LinkedIn: Professional announcement + carousel",
          "Instagram: Visual story + feed post + reels",
          "Twitter: Thread + single tweet variants",
          "Facebook: Community post + event creation"
        ]
      },
      icon: "🚀",
      time: "10 seconds"
    },
    {
      title: "Review & Launch",
      subtitle: "Your content, perfected",
      description: "Review AI-generated content with performance predictions, make any adjustments, and schedule across all platforms.",
      details: [
        "Performance prediction scores for each post",
        "One-click editing for quick adjustments",
        "Scheduling optimization for maximum reach",
        "A/B testing variants for continuous improvement"
      ],
      example: {
        input: "Campaign ready for review and launch",
        processing: [
          "Predicted engagement: 4.2% (87% above average)",
          "Optimal posting: LinkedIn 9AM, Instagram 2PM",
          "15 content variations ready",
          "A/B test suggestions: 3 headline variations"
        ]
      },
      icon: "📊",
      time: "Review time"
    }
  ]

  const platforms = [
    {
      name: "LinkedIn",
      color: "bg-blue-600",
      features: ["Professional tone", "Industry insights", "B2B optimization", "Carousel posts"],
      sample: "🏢 Exciting news for remote teams! We're launching a project management solution that transforms how distributed teams collaborate..."
    },
    {
      name: "Instagram",
      color: "bg-pink-500",
      features: ["Visual-first", "Story format", "Trending hashtags", "Reels integration"],
      sample: "✨ Remote work just got an upgrade! 📱 Our new PM tool makes team collaboration effortless. #RemoteWork #Productivity..."
    },
    {
      name: "Twitter",
      color: "bg-blue-400",
      features: ["Thread format", "Real-time engagement", "Trending topics", "Concise messaging"],
      sample: "🧵 THREAD: Why remote teams struggle with project management (and how we're fixing it) 1/7 The average remote worker..."
    },
    {
      name: "Facebook",
      color: "bg-blue-700",
      features: ["Community focus", "Event integration", "Long-form content", "Discussion starters"],
      sample: "👋 Fellow entrepreneurs and team leaders! We've been working on something special for the remote work community..."
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-heading font-bold text-gray-900 mb-6">
            How It Actually Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Behind the scenes of the 30-second transformation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Step Navigation */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => setActiveStep(index)}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 ${
                  activeStep === index
                    ? 'bg-blue-50 border-2 border-blue-200 shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    activeStep === index ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeStep === index
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {step.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{step.subtitle}</p>
                  </div>
                </div>

                {/* Expanded Details */}
                {activeStep === index && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-gray-700 mb-4">{step.description}</p>
                    <div className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="text-sm text-gray-600">{detail}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Active Step Details */}
          <div className="sticky top-8">
            <div className="bg-gray-900 rounded-2xl p-8 text-white">
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-green-400 text-xl">{steps[activeStep].icon}</div>
                <div className="text-green-400 font-mono text-sm">Step {activeStep + 1}/4</div>
              </div>

              <h3 className="text-2xl font-bold mb-4">{steps[activeStep].title}</h3>

              {/* Input/Processing Display */}
              <div className="bg-black/50 rounded-lg p-4 mb-6">
                <div className="text-gray-300 text-sm mb-2">Input:</div>
                <div className="text-white font-mono text-sm mb-4">
                  {steps[activeStep].example.input}
                </div>

                <div className="text-gray-300 text-sm mb-2">AI Processing:</div>
                <div className="space-y-1">
                  {steps[activeStep].example.processing.map((process, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="text-green-200 text-sm font-mono">{process}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-gray-700 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>

              <div className="text-center text-gray-300 text-sm">
                Step {activeStep + 1} of {steps.length} • {steps[activeStep].time}
              </div>
            </div>
          </div>
        </div>

        {/* Platform Examples */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Platform-Specific Optimization
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map((platform, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className={`${platform.color} text-white p-4 text-center`}>
                  <h4 className="font-bold text-lg">{platform.name}</h4>
                </div>

                <div className="p-6">
                  {/* Features */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Optimizations:</div>
                    <div className="space-y-1">
                      {platform.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          <div className="text-xs text-gray-600">{feature}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample Content */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-2">Generated sample:</div>
                    <div className="text-xs text-gray-700 leading-relaxed">
                      {platform.sample}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}