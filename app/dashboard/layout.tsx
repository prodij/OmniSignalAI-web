/**
 * Dashboard Layout
 *
 * Protected layout for the AI Studio dashboard
 * - Requires authentication (handled by middleware)
 * - Provides consistent navigation
 * - Displays user info and sign-out
 */

import { createServerClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import Navigation from '@/components/dashboard/Navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Double-check authentication at layout level
  const supabase = await createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Get user info for display (use server-side Supabase client)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
