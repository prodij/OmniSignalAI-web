'use client'

/**
 * Dashboard Navigation
 *
 * Main navigation for the AI Studio
 * - Active route highlighting
 * - User info display
 * - Sign-out functionality
 */

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authService } from '@/lib/api'
import { Button } from '@/lib/design-system'
import { FileText, Sparkles, LayoutDashboard, LogOut, Moon, Sun } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { useDarkMode } from '@/lib/contexts/DarkModeContext'

interface NavigationProps {
  user: User | null
}

export default function Navigation({ user }: NavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  // Debug: Log dark mode state
  if (typeof window !== 'undefined') {
    const htmlHasDark = document.documentElement.classList.contains('dark')
    const storedDarkMode = localStorage.getItem('darkMode')
    console.log('[Navigation Debug]', {
      isDarkMode,
      htmlHasDarkClass: htmlHasDark,
      localStorage: storedDarkMode,
      mismatch: (isDarkMode && !htmlHasDark) || (!isDarkMode && htmlHasDark)
    })
  }

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  const navItems = [
    {
      href: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/dashboard/content',
      label: 'Content',
      icon: FileText,
      exact: false,
    },
    {
      href: '/dashboard/generate',
      label: 'Generate',
      icon: Sparkles,
      exact: false,
    },
  ]

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname?.startsWith(item.href)
  }

  return (
    <nav className={`border-b shadow-sm transition-colors ${
      isDarkMode
        ? 'bg-gray-900 border-gray-700'
        : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">O</span>
                </div>
                <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Studio
                </span>
              </Link>
            </div>

            {/* Navigation Items */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? isDarkMode
                          ? 'bg-indigo-900/30 text-indigo-300'
                          : 'bg-indigo-50 text-indigo-700'
                        : isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* User Email */}
            <div className="hidden md:block">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user?.email || 'User'}</span>
            </div>

            {/* TEST MARKER */}
            <div className="bg-green-500 text-white px-2 py-1 text-xs font-bold">
              TEST MARKER
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                console.log('[Toggle] Clicked! Current isDarkMode:', isDarkMode)
                toggleDarkMode()
              }}
              className={`p-2 rounded-lg transition-colors border-2 border-red-500 ${
                isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Toggle dark mode"
              title={`Dark mode is ${isDarkMode ? 'ON' : 'OFF'}. Click to toggle.`}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span className="sr-only">Toggle dark mode (currently {isDarkMode ? 'off' : 'off'})</span>
            </button>

            {/* Sign Out Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`sm:hidden border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  active
                    ? isDarkMode
                      ? 'bg-indigo-900/30 text-indigo-300'
                      : 'bg-indigo-50 text-indigo-700'
                    : isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
