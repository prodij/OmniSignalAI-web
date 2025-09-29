'use client'

import React from 'react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 particle-field">
        {/* Particles will be added here */}
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Content */}
          <div className="space-y-8">
            <h1 className="text-6xl lg:text-7xl font-heading font-bold leading-tight animate-fade-in">
              From Hours to{' '}
              <span className="relative">
                30 Seconds
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 rounded animate-pulse"></div>
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-white/90 max-w-2xl animate-slide-up">
              AI Creates Your Entire Social Media Campaign
            </p>

            <p className="text-lg text-white/80 max-w-xl leading-relaxed">
              Stop being a content producer. Start being a content strategist. Our AI generates
              platform-perfect posts with images and copy while you focus on what actually drives
              business results.
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>5 platforms, 1 campaign, 30 seconds</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Performance prediction before you post</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Your brand voice, automatically maintained</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>No design skills required</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Start Creating Content in 30 Seconds - Free Trial
              </button>
            </div>
          </div>

          {/* Right Side: Interactive Demo (Placeholder) */}
          <div className="relative">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-mono">OmniSignalAI Studio</span>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-white/60 text-sm mb-2">Describe your campaign idea...</div>
                    <div className="text-white animate-typewriter">
                      Announcing our new project management tool for remote teams
                    </div>
                  </div>

                  <div className="text-center py-8">
                    <div className="text-4xl font-bold text-green-400 animate-bounce-gentle">
                      30
                    </div>
                    <div className="text-white/60 text-sm">seconds remaining</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                      <div className="text-xs text-white/60">LinkedIn</div>
                      <div className="text-sm text-white">✓ Generated</div>
                    </div>
                    <div className="bg-pink-500/20 rounded-lg p-3 text-center">
                      <div className="text-xs text-white/60">Instagram</div>
                      <div className="text-sm text-white">⚡ Processing</div>
                    </div>
                    <div className="bg-blue-400/20 rounded-lg p-3 text-center">
                      <div className="text-xs text-white/60">Twitter</div>
                      <div className="text-sm text-white/60">Pending</div>
                    </div>
                    <div className="bg-blue-600/20 rounded-lg p-3 text-center">
                      <div className="text-xs text-white/60">Facebook</div>
                      <div className="text-sm text-white/60">Pending</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  )
}