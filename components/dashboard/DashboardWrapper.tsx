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
  console.log('[DashboardWrapper] Rendering with user:', user?.email)

  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="bg-yellow-500 text-black p-2 text-center font-bold">
          DASHBOARD WRAPPER RENDERING - User: {user?.email || 'None'}
        </div>
        <Navigation user={user} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </DarkModeProvider>
  )
}
