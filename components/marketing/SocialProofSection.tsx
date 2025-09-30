'use client'

import React, { useState, useEffect } from 'react'
import { ContentSection, StatsSection, Card, Heading, Text, Badge, cn } from '@/lib/design-system'
import { NumberTicker } from '@/lib/design-system/interactive-components'
import { Building2, Star, TrendingUp, Award, User } from 'lucide-react'

export function SocialProofSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const metrics = [
    { value: 12847, label: 'Content pieces generated', suffix: '+' },
    { value: 89, label: 'Average engagement increase', suffix: '%' },
    { value: 4200000, label: 'Total impressions driven', suffix: '+', format: 'M' },
    { value: 67, label: 'Time saved vs manual creation', suffix: '%' }
  ]

  const testimonials = [
    {
      quote: "I went from spending my entire Tuesday creating one LinkedIn post to generating a week's worth of content during my coffee break. The engagement rates are actually higher than my manually created posts.",
      author: "Sarah Chen",
      role: "Marketing Director",
      company: "TechFlow Solutions",
      imageIcon: User,
      results: "300% more content, 45% higher engagement",
      platforms: ["LinkedIn", "Twitter", "Instagram"]
    },
    {
      quote: "As a solopreneur, I was drowning in content creation. Now I spend 30 seconds on content and 7 hours on actually running my business. Game changer.",
      author: "Marcus Rodriguez",
      role: "Founder & CEO",
      company: "Digital Marketing Pro",
      imageIcon: User,
      results: "$2,400/month saved on freelancers",
      platforms: ["Facebook", "LinkedIn", "Twitter"]
    },
    {
      quote: "The AI doesn't just generate content—it generates content that sounds exactly like our brand voice. Our followers can't tell the difference, but our metrics definitely can.",
      author: "Jennifer Park",
      role: "Content Manager",
      company: "Growth Labs Inc",
      imageIcon: User,
      results: "87% brand voice consistency score",
      platforms: ["Instagram", "TikTok", "LinkedIn"]
    },
    {
      quote: "I was skeptical about AI-generated content until I saw the performance data. Our AI posts consistently outperform our human-written ones. The ROI is undeniable.",
      author: "David Thompson",
      role: "VP Marketing",
      company: "Scale Ventures",
      imageIcon: User,
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
  }, [testimonials.length])

  return (
    <ContentSection
      title="The Numbers Don't Lie"
      description="Real results from real marketers who made the switch"
      variant="default"
      centered
      className="bg-gradient-to-b from-gray-50 to-white"
    >
      {/* Key Metrics */}
      <StatsSection className="mb-16">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-indigo-600 mb-2">
              <NumberTicker
                value={metric.value}
                className="text-indigo-600"
              />
              {metric.format === 'M' ? 'M' : ''}
              {metric.suffix}
            </div>
            <Text size="sm" color="muted" className="leading-tight">
              {metric.label}
            </Text>
          </div>
        ))}
      </StatsSection>

      {/* Main Testimonial Carousel */}
      <div className="max-w-4xl mx-auto mb-16">
        <Card variant="elevated" className="text-center shadow-2xl">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
              {React.createElement(testimonials[currentTestimonial].imageIcon, {
                className: "w-10 h-10 text-indigo-600"
              })}
            </div>
          </div>
          <div className="text-3xl text-gray-400 mb-6">"</div>
          <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-8">
            {testimonials[currentTestimonial].quote}
          </blockquote>

          {/* Author Info */}
          <div className="border-t pt-6">
            <Heading size="lg" className="mb-2">
              {testimonials[currentTestimonial].author}
            </Heading>
            <Text size="base" color="muted" className="mb-4">
              {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
            </Text>

            {/* Results */}
            <Card className="bg-green-50 border border-green-200 mb-4">
              <Text size="sm" weight="medium" className="text-green-700 mb-1">Results:</Text>
              <Text weight="semibold" className="text-green-800">
                {testimonials[currentTestimonial].results}
              </Text>
            </Card>

            {/* Platforms Used */}
            <div className="flex justify-center space-x-2">
              {testimonials[currentTestimonial].platforms.map((platform, index) => (
                <Badge
                  key={index}
                  variant="default"
                  size="sm"
                  className="bg-indigo-100 text-indigo-700"
                >
                  {platform}
                </Badge>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  currentTestimonial === index ? 'bg-indigo-600' : 'bg-gray-300'
                )}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* Before/After Cases */}
      <div className="mb-16">
        <Heading size="3xl" className="text-center mb-12">
          Real Before/After Transformations
        </Heading>

        <div className="grid lg:grid-cols-3 gap-8">
          {beforeAfterCases.map((case_, index) => (
            <Card key={index} variant="elevated" padding="none" className="overflow-hidden">
              {/* Company Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 text-center">
                <Heading size="lg" className="text-white">{case_.company}</Heading>
              </div>

              <div className="p-6">
                {/* Before */}
                <div className="mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <Badge variant="error" size="sm">
                      Before OmniSignalAI
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Text size="sm" color="muted">Time spent:</Text>
                      <Text size="sm" weight="semibold" className="text-red-600">{case_.before.time}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text size="sm" color="muted">Posts created:</Text>
                      <Text size="sm" weight="semibold">{case_.before.posts}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text size="sm" color="muted">Engagement rate:</Text>
                      <Text size="sm" weight="semibold">{case_.before.engagement}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text size="sm" color="muted">Weekly reach:</Text>
                      <Text size="sm" weight="semibold">{case_.before.reach}</Text>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-center mb-6">
                  <Text size="2xl" className="text-indigo-600">↓</Text>
                </div>

                {/* After */}
                <div>
                  <div className="flex items-center justify-center mb-4">
                    <Badge variant="success" size="sm">
                      With OmniSignalAI
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Text size="sm" color="muted">Time spent:</Text>
                      <Text size="sm" weight="semibold" className="text-green-600">{case_.after.time}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text size="sm" color="muted">Posts created:</Text>
                      <Text size="sm" weight="semibold">{case_.after.posts}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text size="sm" color="muted">Engagement rate:</Text>
                      <Text size="sm" weight="semibold">{case_.after.engagement}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text size="sm" color="muted">Weekly reach:</Text>
                      <Text size="sm" weight="semibold">{case_.after.reach}</Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Trust Signals */}
      <Card className="bg-gray-900 text-white text-center max-w-4xl mx-auto">
        <Heading size="2xl" className="text-white mb-6">
          Trusted by Growing Businesses
        </Heading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <Building2 className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
            <Text size="sm" className="text-gray-300">500+ Companies</Text>
          </div>
          <div>
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <Text size="sm" className="text-gray-300">4.9/5 Rating</Text>
          </div>
          <div>
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <Text size="sm" className="text-gray-300">12M+ Posts Generated</Text>
          </div>
          <div>
            <Award className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <Text size="sm" className="text-gray-300">89% Success Rate</Text>
          </div>
        </div>
      </Card>
    </ContentSection>
  )
}