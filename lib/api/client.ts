/**
 * Authenticated API Client
 *
 * Production-ready axios client with:
 * - Automatic JWT attachment from Supabase session
 * - Token refresh on 401 errors
 * - Request/response interceptors
 * - Type-safe error handling
 * - Retry logic with exponential backoff
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { createClient } from '@/lib/supabase/client'

// Extend AxiosRequestConfig to support retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
  _retryCount?: number
}

/**
 * API Error response format from backend
 */
export interface APIError {
  detail: string | { msg: string; type?: string }[]
  status_code?: number
}

/**
 * Check if error is an API error
 */
export function isAPIError(error: unknown): error is AxiosError<APIError> {
  return axios.isAxiosError(error) && error.response !== undefined
}

/**
 * Extract error message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (isAPIError(error)) {
    const detail = error.response?.data?.detail

    // Handle FastAPI validation errors (array format)
    if (Array.isArray(detail)) {
      return detail.map((err) => err.msg).join(', ')
    }

    // Handle string errors
    if (typeof detail === 'string') {
      return detail
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unknown error occurred'
}

/**
 * Maximum number of retry attempts
 */
const MAX_RETRIES = 3

/**
 * Calculate exponential backoff delay
 */
function getRetryDelay(retryCount: number): number {
  return Math.min(1000 * Math.pow(2, retryCount), 10000) // Max 10 seconds
}

/**
 * Create an authenticated axios instance
 *
 * This client automatically:
 * 1. Attaches JWT from Supabase session to Authorization header
 * 2. Refreshes token on 401 errors and retries request
 * 3. Handles errors with proper typing
 * 4. Retries failed requests with exponential backoff
 *
 * @returns Configured axios instance
 */
export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  })

  /**
   * Request Interceptor: Attach JWT token
   */
  client.interceptors.request.use(
    async (config) => {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`
        }

        return config
      } catch (error) {
        console.error('[API Client] Failed to attach auth token:', error)
        return config
      }
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  /**
   * Response Interceptor: Handle errors and token refresh
   */
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig

      if (!originalRequest) {
        return Promise.reject(error)
      }

      // Handle 401 Unauthorized - attempt token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const supabase = createClient()
          const {
            data: { session },
            error: refreshError,
          } = await supabase.auth.refreshSession()

          if (refreshError || !session) {
            // Refresh failed, redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/login?error=session_expired'
            }
            return Promise.reject(error)
          }

          // Update token and retry original request
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`
          return client(originalRequest)
        } catch (refreshError) {
          console.error('[API Client] Token refresh failed:', refreshError)
          return Promise.reject(error)
        }
      }

      // Handle network errors with retry logic
      if (
        !error.response &&
        error.code !== 'ECONNABORTED' && // Don't retry timeout errors
        (originalRequest._retryCount ?? 0) < MAX_RETRIES
      ) {
        const retryCount = (originalRequest._retryCount ?? 0) + 1
        originalRequest._retryCount = retryCount

        // Wait with exponential backoff before retry
        await new Promise((resolve) =>
          setTimeout(resolve, getRetryDelay(retryCount))
        )

        console.warn(
          `[API Client] Retrying request (${retryCount}/${MAX_RETRIES}):`,
          originalRequest.url
        )

        return client(originalRequest)
      }

      // Log error for debugging
      if (process.env.NODE_ENV === 'development') {
        console.error('[API Client] Request failed:', {
          url: originalRequest.url,
          method: originalRequest.method,
          status: error.response?.status,
          message: getErrorMessage(error),
        })
      }

      return Promise.reject(error)
    }
  )

  return client
}

/**
 * Singleton API client instance
 * Use this for all API requests to ensure consistent configuration
 *
 * @example
 * ```ts
 * import { apiClient } from '@/lib/api/client'
 *
 * const response = await apiClient.get('/v1/blog/posts')
 * ```
 */
export const apiClient = createApiClient()
