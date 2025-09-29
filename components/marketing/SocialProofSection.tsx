'use client'

import { useState, useEffect } from 'react'

export function SocialProofSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const metrics = [
    { number: '12,847', label: 'Content pieces generated', suffix: '+' },
    { number: '89%', label: 'Average engagement increase', suffix: '' },
    { number: '4.2M', label: 'Total impressions driven', suffix: '+' },
    { number: '67%', label: 'Time saved vs manual creation', suffix: '' }
  ]

  const testimonials = [
    {
      quote: "I went from spending my entire Tuesday creating one LinkedIn post to generating a week's worth of content during my coffee break. The engagement rates are actually higher than my manually created posts.",
      author: "Sarah Chen",
      role: "Marketing Director",
      company: "TechFlow Solutions",
      image: "👩‍💼",
      results: "300% more content, 45% higher engagement",
      platforms: ["LinkedIn", "Twitter", "Instagram"]
    },
    {
      quote: "As a solopreneur, I was drowning in content creation. Now I spend 30 seconds on content and 7 hours on actually running my business. Game changer.",
      author: "Marcus Rodriguez",
      role: "Founder & CEO",
      company: "Digital Marketing Pro",
      image: "👨‍💻",
      results: "$2,400/month saved on freelancers",
      platforms: ["Facebook", "LinkedIn", "Twitter"]
    },
    {
      quote: "The AI doesn't just generate content—it generates content that sounds exactly like our brand voice. Our followers can't tell the difference, but our metrics definitely can.",
      author: "Jennifer Park",
      role: "Content Manager",
      company: "Growth Labs Inc",
      image: "👩‍🎨",
      results: "87% brand voice consistency score",
      platforms: ["Instagram", "TikTok", "LinkedIn"]
    },
    {
      quote: "I was skeptical about AI-generated content until I saw the performance data. Our AI posts consistently outperform our human-written ones. The ROI is undeniable.",
      author: "David Thompson",
      role: "VP Marketing",
      company: "Scale Ventures",
      image: "👨‍💼",
      results: "156% ROI increase in Q3",
      platforms: ["LinkedIn", "Twitter", "Facebook"]
    }
  ]

  const beforeAfterCases = [
    {
      company: "SaaS Startup",
      before: {
        time: "6 hours/week",
        posts: "3 posts/week",
        engagement: "2.1%",
        reach: "1,200"
      },
      after: {
        time: "30 minutes/week",
        posts: "15 posts/week",
        engagement: "4.7%",
        reach: "8,400"
      }
    },
    {
      company: "E-commerce Brand",
      before: {
        time: "10 hours/week",
        posts: "5 posts/week",
        engagement: "1.8%",
        reach: "2,100"
      },
      after: {
        time: "45 minutes/week",
        posts: "25 posts/week",
        engagement: "3.9%",
        reach: "12,600"
      }
    },
    {
      company: "Consulting Firm",
      before: {
        time: "4 hours/week",
        posts: "2 posts/week",
        engagement: "3.2%",
        reach: "800"
      },
      after: {
        time: "20 minutes/week",
        posts: "12 posts/week",
        engagement: "5.1%",
        reach: "4,900"
      }
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Metrics Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-heading font-bold text-gray-900 mb-6">
            The Numbers Don't Lie
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Real results from real marketers who made the switch
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                  {metric.number}{metric.suffix}
                </div>
                <div className="text-sm text-gray-600 leading-tight">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{testimonials[currentTestimonial].image}</div>
              <div className="text-3xl text-gray-400 mb-6">"</div>
              <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-8">
                {testimonials[currentTestimonial].quote}
              </blockquote>

              {/* Author Info */}
              <div className="border-t pt-6">
                <div className="font-bold text-gray-900 text-lg">
                  {testimonials[currentTestimonial].author}
                </div>
                <div className="text-gray-600 mb-4">
                  {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                </div>

                {/* Results */}
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <div className="text-sm font-medium text-green-700 mb-1">Results:</div>
                  <div className="text-green-800 font-semibold">
                    {testimonials[currentTestimonial].results}
                  </div>
                </div>

                {/* Platforms Used */}
                <div className="flex justify-center space-x-2">
                  {testimonials[currentTestimonial].platforms.map((platform, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Before/After Cases */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Real Before/After Transformations
          </h3>

          <div className="grid lg:grid-cols-3 gap-8">
            {beforeAfterCases.map((case_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Company Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 text-center">
                  <h4 className="font-bold text-lg">{case_.company}</h4>
                </div>

                <div className="p-6">
                  {/* Before */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                        Before OmniSignalAI
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time spent:</span>
                        <span className="font-semibold text-red-600">{case_.before.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Posts created:</span>
                        <span className="font-semibold">{case_.before.posts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Engagement rate:</span>
                        <span className="font-semibold">{case_.before.engagement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weekly reach:</span>
                        <span className="font-semibold">{case_.before.reach}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-center mb-6">
                    <div className="text-2xl text-blue-600">↓</div>
                  </div>

                  {/* After */}
                  <div>
                    <div className="flex items-center justify-center mb-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        With OmniSignalAI
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time spent:</span>
                        <span className="font-semibold text-green-600">{case_.after.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Posts created:</span>
                        <span className="font-semibold">{case_.after.posts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Engagement rate:</span>
                        <span className="font-semibold">{case_.after.engagement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weekly reach:</span>
                        <span className="font-semibold">{case_.after.reach}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Trust Signals */}
        <div className="bg-gray-900 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-6">Trusted by Growing Businesses</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl mb-2">🏢</div>
              <div className="text-sm text-gray-300">500+ Companies</div>
            </div>
            <div>
              <div className="text-2xl mb-2">🌟</div>
              <div className="text-sm text-gray-300">4.9/5 Rating</div>
            </div>
            <div>
              <div className="text-2xl mb-2">💡</div>
              <div className="text-sm text-gray-300">12M+ Posts Generated</div>
            </div>
            <div>
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm text-gray-300">89% Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}