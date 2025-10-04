/**
 * Auth Service
 *
 * Authentication service using Supabase
 * Handles sign in, sign out, session management
 */

import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

/**
 * Magic link options
 */
export interface MagicLinkOptions {
  email: string
  redirectTo?: string
}

/**
 * Email/password sign in options
 */
export interface EmailPasswordOptions {
  email: string
  password: string
}

/**
 * Sign up options
 */
export interface SignUpOptions {
  email: string
  password: string
  redirectTo?: string
}

/**
 * OAuth provider types
 */
export type OAuthProvider = 'google' | 'github' | 'azure'

/**
 * OAuth options
 */
export interface OAuthOptions {
  provider: OAuthProvider
  redirectTo?: string
}

/**
 * Authentication service
 */
export const authService = {
  /**
   * Sign in with email and password
   *
   * @example
   * ```ts
   * await authService.signInWithPassword({
   *   email: 'user@example.com',
   *   password: 'secure-password'
   * })
   * // User is signed in with session
   * ```
   */
  async signInWithPassword(options: EmailPasswordOptions): Promise<{ user: User; session: Session }> {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: options.email,
      password: options.password,
    })

    if (error) {
      throw new Error(`Sign in failed: ${error.message}`)
    }

    if (!data.user || !data.session) {
      throw new Error('Sign in failed: No user or session returned')
    }

    return { user: data.user, session: data.session }
  },

  /**
   * Sign up with email and password
   *
   * @example
   * ```ts
   * await authService.signUp({
   *   email: 'user@example.com',
   *   password: 'secure-password',
   *   redirectTo: '/dashboard'
   * })
   * // User account created, may need email verification
   * ```
   */
  async signUp(options: SignUpOptions): Promise<{ user: User | null; session: Session | null }> {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email: options.email,
      password: options.password,
      options: {
        emailRedirectTo:
          options.redirectTo ||
          `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      throw new Error(`Sign up failed: ${error.message}`)
    }

    return { user: data.user, session: data.session }
  },

  /**
   * Sign in with magic link (passwordless)
   *
   * @example
   * ```ts
   * await authService.signInWithMagicLink({
   *   email: 'user@example.com',
   *   redirectTo: '/dashboard'
   * })
   * // User receives email with magic link
   * ```
   */
  async signInWithMagicLink(options: MagicLinkOptions): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email: options.email,
      options: {
        emailRedirectTo:
          options.redirectTo ||
          `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      throw new Error(`Magic link sign in failed: ${error.message}`)
    }
  },

  /**
   * Sign in with OAuth provider
   *
   * @example
   * ```ts
   * await authService.signInWithOAuth({
   *   provider: 'google',
   *   redirectTo: '/dashboard'
   * })
   * // Redirects to OAuth provider
   * ```
   */
  async signInWithOAuth(options: OAuthOptions): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: options.provider,
      options: {
        redirectTo:
          options.redirectTo ||
          `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      throw new Error(`OAuth sign in failed: ${error.message}`)
    }
  },

  /**
   * Sign out current user
   *
   * @example
   * ```ts
   * await authService.signOut()
   * // User is signed out, session cleared
   * ```
   */
  async signOut(): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(`Sign out failed: ${error.message}`)
    }
  },

  /**
   * Get current session
   *
   * @example
   * ```ts
   * const session = await authService.getSession()
   * if (session) {
   *   console.log('User is authenticated:', session.user.email)
   * }
   * ```
   */
  async getSession(): Promise<Session | null> {
    const supabase = createClient()

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      throw new Error(`Failed to get session: ${error.message}`)
    }

    return session
  },

  /**
   * Get current user
   *
   * @example
   * ```ts
   * const user = await authService.getCurrentUser()
   * if (user) {
   *   console.log('Logged in as:', user.email)
   * }
   * ```
   */
  async getCurrentUser(): Promise<User | null> {
    const supabase = createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      throw new Error(`Failed to get current user: ${error.message}`)
    }

    return user
  },

  /**
   * Check if user is authenticated
   *
   * @example
   * ```ts
   * const isAuth = await authService.isAuthenticated()
   * if (!isAuth) {
   *   router.push('/login')
   * }
   * ```
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession()
    return session !== null
  },

  /**
   * Refresh session
   *
   * @example
   * ```ts
   * const session = await authService.refreshSession()
   * if (session) {
   *   console.log('Session refreshed')
   * }
   * ```
   */
  async refreshSession(): Promise<Session | null> {
    const supabase = createClient()

    const {
      data: { session },
      error,
    } = await supabase.auth.refreshSession()

    if (error) {
      throw new Error(`Failed to refresh session: ${error.message}`)
    }

    return session
  },

  /**
   * Listen to auth state changes
   *
   * @example
   * ```ts
   * const { unsubscribe } = authService.onAuthStateChange((event, session) => {
   *   if (event === 'SIGNED_IN') {
   *     console.log('User signed in:', session?.user.email)
   *   }
   * })
   *
   * // Later: unsubscribe()
   * ```
   */
  onAuthStateChange(
    callback: (
      event: string,
      session: Session | null
    ) => void | Promise<void>
  ) {
    const supabase = createClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback)

    return {
      unsubscribe: () => subscription.unsubscribe(),
    }
  },
}
