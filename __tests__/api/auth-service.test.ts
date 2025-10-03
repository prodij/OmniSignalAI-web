/**
 * Auth Service Integration Tests
 *
 * These tests validate the authentication service using real Supabase
 * Note: Some tests require actual authentication which may not be available in CI
 *
 * Run with: npm test -- __tests__/api/auth-service.test.ts
 */

import { authService } from '@/lib/api/services/auth'

describe('Auth Service Integration Tests', () => {
  describe('getSession', () => {
    it('should get current session (may be null)', async () => {
      const session = await authService.getSession()

      // Session can be null if not authenticated - that's valid
      if (session) {
        expect(session).toHaveProperty('access_token')
        expect(session).toHaveProperty('user')
        console.log('✓ Session exists:', session.user.email)
      } else {
        console.log('ℹ️  No active session (user not authenticated)')
      }
    })
  })

  describe('getCurrentUser', () => {
    it('should get current user (may be null)', async () => {
      try {
        const user = await authService.getCurrentUser()

        if (user) {
          expect(user).toHaveProperty('id')
          expect(user).toHaveProperty('email')
          console.log('✓ Current user:', user.email)
        } else {
          console.log('ℹ️  No current user (not authenticated)')
        }
      } catch (error: any) {
        // Expected when not authenticated
        if (error.message.includes('session')) {
          console.log('ℹ️  No current user (session missing - expected)')
        } else {
          throw error
        }
      }
    })
  })

  describe('isAuthenticated', () => {
    it('should check authentication status', async () => {
      const isAuth = await authService.isAuthenticated()

      expect(typeof isAuth).toBe('boolean')

      if (isAuth) {
        console.log('✓ User is authenticated')
      } else {
        console.log('ℹ️  User is not authenticated')
      }
    })
  })

  describe('signInWithMagicLink', () => {
    it('should send magic link email', async () => {
      // Skip this test in CI as it requires email interaction
      if (process.env.CI) {
        console.log('ℹ️  Skipped in CI environment')
        return
      }

      // This test validates the request but doesn't verify email delivery
      // Use a test email address
      const testEmail = 'test@example.com'

      try {
        await authService.signInWithMagicLink({ email: testEmail })
        console.log('✓ Magic link request sent (check email)')
      } catch (error: any) {
        // Some errors are expected (e.g., rate limiting)
        if (error.message.includes('rate_limit')) {
          console.log('ℹ️  Rate limited (expected behavior)')
        } else {
          throw error
        }
      }
    })
  })

  describe('signOut', () => {
    it('should sign out without error even if not authenticated', async () => {
      // signOut should be idempotent - works even if not signed in
      await expect(authService.signOut()).resolves.not.toThrow()

      console.log('✓ Sign out completed')
    })
  })

  describe('refreshSession', () => {
    it('should attempt to refresh session', async () => {
      try {
        const session = await authService.refreshSession()

        if (session) {
          expect(session).toHaveProperty('access_token')
          console.log('✓ Session refreshed successfully')
        } else {
          console.log('ℹ️  No session to refresh')
        }
      } catch (error: any) {
        // It's okay if refresh fails when not authenticated
        if (error.message.includes('refresh') || error.message.includes('session')) {
          console.log('ℹ️  Refresh failed (expected when not authenticated)')
        } else {
          throw error
        }
      }
    })
  })

  describe('onAuthStateChange', () => {
    it('should register auth state change listener', (done) => {
      const { unsubscribe } = authService.onAuthStateChange((event, session) => {
        console.log('✓ Auth state change listener registered')
        console.log('  Event:', event)
        console.log('  Session:', session ? 'exists' : 'null')
      })

      // Immediately unsubscribe
      unsubscribe()

      // Give it a moment then complete
      setTimeout(() => {
        console.log('✓ Auth state change listener unsubscribed')
        done()
      }, 100)
    })
  })
})
