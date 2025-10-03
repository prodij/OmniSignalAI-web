'use client'

import React, { useState } from 'react'
import { Button, cn } from '@/lib/design-system'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo'

const navLinks = [
  { name: 'Features', href: '/#features' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Testimonials', href: '/#testimonials' },
  { name: 'Blog', href: '/blog' },
]

const debugLinks = [
  { name: 'Prompt Enhancement', href: '/debug/image-generation' },
  { name: 'Full Pipeline', href: '/debug/content-to-image-pipeline' },
  { name: 'Image Gallery', href: '/debug/image-gallery' },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [debugMenuOpen, setDebugMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Logo className="w-10 h-10" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">OmniSignalAI</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}

            {/* Debug Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDebugMenuOpen(!debugMenuOpen)}
                onBlur={() => setTimeout(() => setDebugMenuOpen(false), 200)}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-1"
              >
                Debug
                <svg className={`w-4 h-4 transition-transform ${debugMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {debugMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {debugLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      onClick={() => setDebugMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Button>
            </a>
            <Button
              variant="primary"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Start Free Trial
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-gray-600 hover:text-gray-900 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}

            {/* Mobile Debug Section */}
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => setDebugMenuOpen(!debugMenuOpen)}
                className="flex items-center justify-between w-full text-gray-600 hover:text-gray-900 font-medium py-2"
              >
                Debug
                <svg className={`w-4 h-4 transition-transform ${debugMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {debugMenuOpen && (
                <div className="pl-4 space-y-2 mt-2">
                  {debugLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="block text-sm text-gray-600 hover:text-gray-900 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 space-y-3">
              <a href="/login" className="block">
                <Button
                  variant="ghost"
                  size="md"
                  className="w-full text-gray-600 hover:text-gray-900"
                >
                  Sign In
                </Button>
              </a>
              <Button
                variant="primary"
                size="md"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}