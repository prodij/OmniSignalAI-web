/**
 * Supabase Client Factory
 *
 * Modern implementation using @supabase/ssr for Next.js 14 App Router
 * Provides both client-side and server-side clients with proper cookie handling
 */

import { createBrowserClient } from '@supabase/ssr'
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

// Validate environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  )
}

/**
 * Client-side Supabase client
 * Use in Client Components (components with "use client" directive)
 *
 * @example
 * ```tsx
 * "use client"
 * import { createClient } from '@/lib/supabase/client'
 *
 * const supabase = createClient()
 * const { data } = await supabase.auth.getUser()
 * ```
 */
export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!)
}

/**
 * Server-side Supabase client
 * Use in Server Components, Server Actions, and Route Handlers
 *
 * @example
 * ```tsx
 * // In Server Component
 * import { createServerClient } from '@/lib/supabase/client'
 *
 * const supabase = createServerClient()
 * const { data } = await supabase.auth.getUser()
 * ```
 */
export function createServerClient() {
  const cookieStore = cookies()

  return createSupabaseServerClient<Database>(
    SUPABASE_URL!,
    SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Get current session (server-side)
 * Helper function to get session in Server Components
 *
 * @example
 * ```tsx
 * import { getSession } from '@/lib/supabase/client'
 *
 * const session = await getSession()
 * if (!session) {
 *   redirect('/login')
 * }
 * ```
 */
export async function getSession() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

/**
 * Get current user (server-side)
 * Helper function to get user in Server Components
 *
 * @example
 * ```tsx
 * import { getUser } from '@/lib/supabase/client'
 *
 * const user = await getUser()
 * if (!user) {
 *   redirect('/login')
 * }
 * ```
 */
export async function getUser() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
