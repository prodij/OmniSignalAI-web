/**
 * Auth Callback Route Handler
 *
 * Handles OAuth callbacks and magic link verification
 * Exchanges authorization code for session and redirects to dashboard
 */

import { createServerClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  // Handle auth errors
  if (error) {
    console.error('[Auth Callback] Authentication error:', error, error_description)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error_description || error)}`, request.url)
    )
  }

  // Exchange code for session
  if (code) {
    try {
      const supabase = createServerClient()
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('[Auth Callback] Code exchange failed:', exchangeError)
        return NextResponse.redirect(
          new URL('/login?error=auth_failed', request.url)
        )
      }

      // Success - redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (error) {
      console.error('[Auth Callback] Unexpected error:', error)
      return NextResponse.redirect(
        new URL('/login?error=unexpected_error', request.url)
      )
    }
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/login', request.url))
}
