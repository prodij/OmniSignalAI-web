'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button, cn } from '@/lib/design-system'
import { Menu, X, LayoutDashboard, FileText, Sparkles, User, LogOut, type LucideIcon } from 'lucide-react'
import { Logo } from './Logo'
import { createClient } from '@/lib/supabase/client'
import { authService } from '@/lib/api'

// Navigation link types
type PublicNavLink = { name: string; href: string }
type AuthenticatedNavLink = { name: string; href: string; icon: LucideIcon }

// Public navigation (not logged in)
const publicNavLinks: PublicNavLink[] = [
  { name: 'Features', href: '/#features' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Testimonials', href: '/#testimonials' },
  { name: 'Blog', href: '/blog' },
]

// Authenticated navigation (logged in)
const authenticatedNavLinks: AuthenticatedNavLink[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Content', href: '/dashboard/content', icon: FileText },
  { name: 'Generate', href: '/dashboard/generate', icon: Sparkles },
  { name: 'Blog', href: '/blog', icon: FileText },
]

const debugLinks = [
  { name: 'Prompt Enhancement', href: '/debug/image-generation' },
  { name: 'Full Pipeline', href: '/debug/content-to-image-pipeline' },
  { name: 'Image Gallery', href: '/debug/image-gallery' },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [debugMenuOpen, setDebugMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication status
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      setIsAuthenticated(!!session)
      setUserEmail(session?.user?.email || null)
    }

    checkAuth()

    // Listen for auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
      setUserEmail(session?.user?.email || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Logo className="w-10 h-10" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              {isAuthenticated ? "Content Cockpit" : "OmniSignalAI"}
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              // Authenticated navigation with icons
              authenticatedNavLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
                const IconComponent = link.icon

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "font-medium transition-colors flex items-center gap-2",
                      isActive
                        ? "text-indigo-600"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <IconComponent className="w-4 h-4" />
                    {link.name}
                  </a>
                )
              })
            ) : (
              // Public navigation without icons
              publicNavLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "font-medium transition-colors",
                      isActive
                        ? "text-indigo-600"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {link.name}
                  </a>
                )
              })
            )}

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

          {/* Desktop CTA / User Menu */}
          {isAuthenticated ? (
            // Logged in: Show user menu
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">{userEmail || 'User'}</span>
                  <svg className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Not logged in: Show Sign In + CTA
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
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-100"
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
            {isAuthenticated ? (
              // Authenticated navigation with icons
              authenticatedNavLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
                const IconComponent = link.icon

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 font-medium py-2",
                      isActive
                        ? "text-indigo-600"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5" />
                    {link.name}
                  </a>
                )
              })
            ) : (
              // Public navigation without icons
              publicNavLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 font-medium py-2",
                      isActive
                        ? "text-indigo-600"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                )
              })
            )}

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

            {/* Mobile Auth Section */}
            {isAuthenticated ? (
              <div className="border-t border-gray-200 pt-4">
                <div className="mb-3 px-3 py-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900">{userEmail}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
