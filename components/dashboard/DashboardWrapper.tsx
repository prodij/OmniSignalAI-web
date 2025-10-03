'use client'

/**
 * Dashboard Wrapper
 *
 * Client-side wrapper that provides dark mode context to dashboard
 */

import Navigation from '@/components/dashboard/Navigation'
import { DarkModeProvider } from '@/lib/contexts/DarkModeContext'
import type { User } from '@supabase/supabase-js'

interface DashboardWrapperProps {
  user: User | null
  children: React.ReactNode
}

export default function DashboardWrapper({ user, children }: DashboardWrapperProps) {
  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <Navigation user={user} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </DarkModeProvider>
  )
}
