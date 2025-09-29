'use client'

import { useState, useEffect } from 'react'

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
  }, [])

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-heading font-bold mb-6">
            Stop Wasting Time on Content Creation
          </h2>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
            While you're reading this, your competitors just generated 10 social media campaigns.
            <br />
            <span className="text-yellow-400 font-semibold">Don't get left behind.</span>
          </p>

          {/* Urgency Counter */}
          <div className="bg-red-900/30 rounded-2xl p-6 max-w-md mx-auto mb-8">
            <div className="text-red-300 text-sm mb-2">⚠️ Limited Time: Free Trial Access</div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-400">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-red-200 text-xs">HOURS</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-red-200 text-xs">MINUTES</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-red-200 text-xs">SECONDS</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
          {/* Left: What You Get Immediately */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-center">
              What You Get in the Next 30 Minutes
            </h3>

            <div className="space-y-6">
              {quickWins.map((win, index) => (
                <div key={index} className="flex items-start space-x-4 bg-white/5 rounded-xl p-6">
                  <div className="text-3xl">{win.icon}</div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold text-white mb-2">{win.title}</h4>
                    <p className="text-gray-300 mb-2">{win.description}</p>
                    <div className="text-yellow-400 text-sm font-medium">{win.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Social Proof + Urgency */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-center">
              Don't Take Our Word For It
            </h3>

            {/* Rotating Testimonial */}
            <div className="bg-white/10 rounded-2xl p-8 mb-8">
              <div className="text-center">
                <div className="text-3xl text-yellow-400 mb-4">"</div>
                <blockquote className="text-lg text-gray-200 mb-6 leading-relaxed">
                  {finalTestimonials[currentTestimonial].quote}
                </blockquote>
                <div className="text-white font-semibold">
                  {finalTestimonials[currentTestimonial].author}
                </div>
                <div className="text-green-400 font-bold mt-2">
                  {finalTestimonials[currentTestimonial].metric}
                </div>
              </div>

              {/* Testimonial Indicators */}
              <div className="flex justify-center space-x-2 mt-6">
                {finalTestimonials.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentTestimonial === index ? 'bg-yellow-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Urgency Reasons */}
            <div className="bg-red-900/20 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-red-300 mb-4">Why You Need to Act Now:</h4>
              <div className="space-y-3">
                {urgencyReasons.map((reason, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <div className="text-red-200 text-sm">{reason}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main CTA */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8">
            <h3 className="text-3xl font-bold mb-4">
              Start Your Content Transformation Now
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              14-day free trial • No credit card required • Cancel anytime
            </p>

            {/* Main CTA Button */}
            <button className="bg-yellow-400 text-gray-900 px-12 py-6 rounded-xl font-bold text-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-2xl mb-6">
              Generate My First Campaign in 30 Seconds - FREE
            </button>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-blue-200 text-sm">
              <div>
                <div className="text-xl mb-1">🔒</div>
                <div>Enterprise Security</div>
              </div>
              <div>
                <div className="text-xl mb-1">💰</div>
                <div>30-Day Guarantee</div>
              </div>
              <div>
                <div className="text-xl mb-1">⚡</div>
                <div>Instant Access</div>
              </div>
              <div>
                <div className="text-xl mb-1">🎯</div>
                <div>500+ Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Alternative CTA */}
          <div className="text-center">
            <p className="text-gray-400 mb-4">Not ready to start? Want to see it in action first?</p>
            <button className="text-blue-400 hover:text-blue-300 underline">
              Watch 2-Minute Demo Video →
            </button>
          </div>

          {/* Final Urgency */}
          <div className="mt-12 p-6 bg-yellow-900/20 rounded-xl border border-yellow-500/30">
            <div className="text-yellow-300 font-semibold mb-2">
              ⚠️ Fair Warning
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Once you experience the transformation from 8 hours to 30 seconds, you'll wonder how you ever
              survived manual content creation. Our customers report feeling "almost guilty" about how easy
              it becomes to outperform their competition.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}