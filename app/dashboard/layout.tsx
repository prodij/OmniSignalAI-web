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
import DashboardWrapper from '@/components/dashboard/DashboardWrapper'

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
    <DashboardWrapper user={user}>
      {children}
    </DashboardWrapper>
  )
}
