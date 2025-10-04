# OmniSignalAI Cockpit Implementation Plan
**Version:** 1.0
**Target:** Transform static website into dynamic "cockpit" frontend for omnidraft AI engine
**Duration:** Multi-session (estimated 8-12 sessions)
**Philosophy:** One phase at a time, complete implementation, no simplifications, real tests

---

## 🎯 Project Vision

Transform OmniSignalAI-web from a static marketing website into a **dual-purpose platform**:
1. **Public-facing website** - Marketing content served to visitors
2. **Internal cockpit** - Dashboard for the marketing team to use omnidraft AI engine

**Key Principle:** Keep both file-based (static) and API-based (dynamic) content systems running **in parallel**. No breaking changes.

---

## 🏗️ Architecture Overview

### Current State
```
OmniSignalAI-web (Port 5000)
├── Static Next.js marketing site
├── MDX content in /content directory (velite)
├── Design system components
├── AI-agent-sdk (scaffolded but not connected)
└── PageBuilder (scaffolded but not wired)
```

### Target State
```
OmniSignalAI-web Cockpit (Port 5000)
├── Public Routes (static, no auth)
│   ├── Homepage (marketing sections)
│   ├── /blog (hybrid: static + dynamic posts)
│   └── Public pages (about, pricing, etc.)
│
├── Protected Routes (auth required)
│   ├── /dashboard - Content cockpit
│   ├── /dashboard/generate - AI content wizard
│   ├── /dashboard/content - Content manager
│   └── /dashboard/analytics - Performance metrics
│
└── API Integration Layer
    ├── Supabase Auth (session management)
    ├── Authenticated API client (omnidraft backend)
    └── Dual content resolver (file-based OR API-based)
```

### Backend Connection
```
omnidraft API (Port 8000)
├── Supabase: https://nbcnhobkvkelndczcvfo.supabase.co
├── Endpoints:
│   ├── /api/auth/* - Authentication
│   ├── /api/v1/blog/posts - Blog CRUD
│   ├── /api/v1/ai/* - AI generation
│   ├── /api/brands/* - Brand management
│   └── /api/campaigns/* - Campaign management
└── Docker: omnidraft-backend container
```

---

## 📋 Phase Breakdown

### **PHASE 0: Foundation & API Client Setup**
**Duration:** 1-2 sessions
**Status:** Not Started
**Objective:** Establish secure communication between frontend and backend

#### Tasks

##### **Task 0.1: Install Dependencies**
```bash
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js axios
npm install --save-dev @types/node
```

**Acceptance Criteria:**
- [ ] Dependencies installed without conflicts
- [ ] Types available for TypeScript
- [ ] Package.json updated

---

##### **Task 0.2: Configure Environment Variables**
**File:** `.env.local` (create if doesn't exist)

```env
# Backend API Connection
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# Supabase Configuration (from omnidraft)
NEXT_PUBLIC_SUPABASE_URL=https://nbcnhobkvkelndczcvfo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iY25ob2JrdmtlbG5kY3pjdmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjE0OTQsImV4cCI6MjA3Mzc5NzQ5NH0.QnsMnFMAqnrh_iXz5Bbong3GMnEN2J2lhLgKF4wEoGg

# Feature Flags
NEXT_PUBLIC_ENABLE_COCKPIT=true
NEXT_PUBLIC_ENABLE_API_CONTENT=true
```

**Acceptance Criteria:**
- [ ] All environment variables set
- [ ] Supabase credentials match omnidraft backend
- [ ] TypeScript can access `process.env.NEXT_PUBLIC_*` variables

---

##### **Task 0.3: Create Supabase Client**
**File:** `lib/supabase/client.ts`

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Client-side Supabase client (for use in "use client" components)
export const createClient = () => {
  return createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  })
}

// Server-side Supabase client (for use in Server Components and API routes)
export const createServerClient = () => {
  return createServerComponentClient(
    { cookies },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  )
}
```

**Acceptance Criteria:**
- [ ] Client factory functions created
- [ ] Both client-side and server-side clients available
- [ ] Type-safe (no `any` types)
- [ ] Uses cookies for session persistence

---

##### **Task 0.4: Create Authenticated API Client**
**File:** `lib/api/client.ts`

```typescript
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { createClient } from '@/lib/supabase/client'

// Custom interface to extend AxiosRequestConfig with _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

/**
 * Creates an axios instance that automatically:
 * 1. Attaches Supabase JWT to Authorization header
 * 2. Retries on 401 with token refresh
 * 3. Handles network errors gracefully
 */
export const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor: Add auth token
  client.interceptors.request.use(
    async (config) => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`
      }

      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor: Handle 401 and refresh token
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig

      // If 401 and not already retried, try to refresh token
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

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`
          return client(originalRequest)
        } catch (refreshError) {
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    }
  )

  return client
}

// Singleton instance
export const apiClient = createApiClient()
```

**Acceptance Criteria:**
- [ ] Axios instance with interceptors
- [ ] Auto-attaches JWT from Supabase session
- [ ] Handles token refresh on 401
- [ ] Redirects to login on auth failure
- [ ] Type-safe error handling
- [ ] Singleton pattern for consistent state

---

##### **Task 0.5: Create API Service Layer**
**File:** `lib/api/services/blog.ts`

```typescript
import { apiClient } from '../client'

export interface BlogPost {
  id: string
  user_id: string
  brand_id: string
  title: string
  slug: string
  excerpt: string
  content: string
  status: 'draft' | 'published' | 'archived'
  meta_title?: string
  meta_description?: string
  keywords?: string[]
  quality_score?: number
  created_at: string
  updated_at: string
  frontmatter?: Record<string, any>
}

export interface BlogPostsResponse {
  posts: BlogPost[]
  pagination: {
    page: number
    page_size: number
    total: number
    total_pages: number
  }
}

export const blogService = {
  /**
   * Get paginated list of blog posts
   */
  async getPosts(params?: {
    brand_id?: string
    status_filter?: string
    workflow_status?: string
    search?: string
    page?: number
    page_size?: number
  }): Promise<BlogPostsResponse> {
    const response = await apiClient.get('/v1/blog/posts', { params })
    return response.data
  },

  /**
   * Get single blog post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPost> {
    const response = await apiClient.get(`/v1/blog/posts/${slug}`)
    return response.data
  },

  /**
   * Create new blog post
   */
  async createPost(data: Partial<BlogPost>): Promise<BlogPost> {
    const response = await apiClient.post('/v1/blog/posts', data)
    return response.data
  },

  /**
   * Update existing blog post
   */
  async updatePost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    const response = await apiClient.put(`/v1/blog/posts/${id}`, data)
    return response.data
  },

  /**
   * Delete blog post
   */
  async deletePost(id: string): Promise<void> {
    await apiClient.delete(`/v1/blog/posts/${id}`)
  },

  /**
   * Publish draft post
   */
  async publishPost(id: string): Promise<BlogPost> {
    const response = await apiClient.post(`/v1/blog/posts/${id}/publish`)
    return response.data
  },
}
```

**File:** `lib/api/services/auth.ts`

```typescript
import { apiClient } from '../client'
import { createClient } from '@/lib/supabase/client'

export const authService = {
  /**
   * Sign in with magic link
   */
  async signInWithMagicLink(email: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  },

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const supabase = createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return !!session
  },
}
```

**File:** `lib/api/index.ts` (barrel export)

```typescript
export * from './client'
export * from './services/blog'
export * from './services/auth'
```

**Acceptance Criteria:**
- [ ] Blog service with all CRUD operations
- [ ] Auth service with Supabase integration
- [ ] Type-safe interfaces matching backend schema
- [ ] Proper error handling and propagation
- [ ] Barrel export for clean imports

---

##### **Task 0.6: Create Integration Tests**
**File:** `__tests__/api/blog-service.test.ts`

```typescript
import { blogService } from '@/lib/api'

describe('Blog Service Integration Tests', () => {
  // These are REAL tests hitting the REAL API at localhost:8000
  // No mocks, no stubs - actual integration tests

  beforeAll(async () => {
    // TODO: Set up test user session
    // For now, assumes you're logged in locally
  })

  describe('getPosts', () => {
    it('should fetch blog posts from API', async () => {
      const result = await blogService.getPosts({ page: 1, page_size: 10 })

      expect(result).toHaveProperty('posts')
      expect(result).toHaveProperty('pagination')
      expect(Array.isArray(result.posts)).toBe(true)
      expect(result.pagination.page).toBe(1)
    })

    it('should filter posts by status', async () => {
      const result = await blogService.getPosts({
        status_filter: 'published',
        page: 1,
        page_size: 10,
      })

      expect(result.posts.every((post) => post.status === 'published')).toBe(true)
    })
  })

  describe('getPostBySlug', () => {
    it('should fetch single post by slug', async () => {
      // First get a post to ensure we have a valid slug
      const posts = await blogService.getPosts({ page: 1, page_size: 1 })

      if (posts.posts.length > 0) {
        const slug = posts.posts[0].slug
        const post = await blogService.getPostBySlug(slug)

        expect(post).toHaveProperty('id')
        expect(post.slug).toBe(slug)
      }
    })

    it('should throw error for non-existent slug', async () => {
      await expect(blogService.getPostBySlug('non-existent-slug-12345')).rejects.toThrow()
    })
  })

  // More tests for create, update, delete, publish...
})
```

**Run tests:**
```bash
npm test -- __tests__/api/blog-service.test.ts
```

**Acceptance Criteria:**
- [ ] Tests hit real API (no mocks)
- [ ] Tests pass when omnidraft backend is running
- [ ] Tests fail gracefully when backend is down
- [ ] Covers all CRUD operations
- [ ] Tests are verbose and debuggable

---

### **PHASE 1: Dynamic Content Rendering & Auth UI**
**Duration:** 2-3 sessions
**Status:** Not Started
**Objective:** Add authentication flow and enable dual content system (file + API)

#### Tasks

##### **Task 1.1: Create Auth Callback Route**
**File:** `app/auth/callback/route.ts`

```typescript
import { createServerClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createServerClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to dashboard after successful auth
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

**Acceptance Criteria:**
- [ ] Handles OAuth callback
- [ ] Exchanges code for session
- [ ] Redirects to dashboard
- [ ] Sets secure cookies

---

##### **Task 1.2: Create Login Page**
**File:** `app/login/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/api'
import { Button, Input, Heading, Text, Card } from '@/lib/design-system'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await authService.signInWithMagicLink(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full p-8">
          <Heading level={2}>Check your email</Heading>
          <Text className="mt-4">
            We've sent a magic link to <strong>{email}</strong>. Click the link to sign in.
          </Text>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full p-8">
        <Heading level={2}>Sign in to Cockpit</Heading>
        <Text className="mt-2">Enter your email to receive a magic link</Text>

        <form onSubmit={handleMagicLink} className="mt-6 space-y-4">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <Text className="text-red-600">{error}</Text>}

          <Button type="submit" fullWidth loading={loading}>
            {loading ? 'Sending...' : 'Send Magic Link'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
```

**Acceptance Criteria:**
- [ ] Clean UI using design system
- [ ] Magic link authentication
- [ ] Loading states
- [ ] Error handling
- [ ] Success state with instructions

---

##### **Task 1.3: Create Auth Middleware**
**File:** `middleware.ts`

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect /dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (req.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
```

**Acceptance Criteria:**
- [ ] Protects dashboard routes
- [ ] Redirects unauthenticated users to login
- [ ] Redirects authenticated users away from login
- [ ] Maintains session across requests

---

##### **Task 1.4: Create Dual Content Resolver**
**File:** `lib/content/resolver.ts`

```typescript
import { blogService, BlogPost } from '@/lib/api'
import { getPostBySlug as getStaticPost } from '@/lib/blog-api' // Existing static function
import { authService } from '@/lib/api'

export interface ResolvedPost {
  source: 'static' | 'api'
  data: BlogPost | any // `any` for static posts (different schema)
}

/**
 * Dual content resolver - tries API first (if authenticated), falls back to static
 */
export async function resolvePost(slug: string): Promise<ResolvedPost> {
  const isAuthenticated = await authService.isAuthenticated()

  // If authenticated and API content enabled, try API first
  if (isAuthenticated && process.env.NEXT_PUBLIC_ENABLE_API_CONTENT === 'true') {
    try {
      const apiPost = await blogService.getPostBySlug(slug)
      return { source: 'api', data: apiPost }
    } catch (error) {
      console.warn(`API post fetch failed for ${slug}, falling back to static`)
      // Fall through to static
    }
  }

  // Fall back to static content
  const staticPost = await getStaticPost(slug)
  return { source: 'static', data: staticPost }
}

export async function resolvePosts(options?: {
  limit?: number
  status?: string
}): Promise<BlogPost[]> {
  const isAuthenticated = await authService.isAuthenticated()

  // If authenticated, try API
  if (isAuthenticated && process.env.NEXT_PUBLIC_ENABLE_API_CONTENT === 'true') {
    try {
      const result = await blogService.getPosts({
        page: 1,
        page_size: options?.limit || 20,
        status_filter: options?.status,
      })
      return result.posts
    } catch (error) {
      console.warn('API posts fetch failed, falling back to static')
      // Fall through to static
    }
  }

  // Fall back to static (your existing implementation)
  const { getAllPosts } = await import('@/lib/blog-api')
  return getAllPosts()
}
```

**Acceptance Criteria:**
- [ ] Tries API first when authenticated
- [ ] Falls back to static content gracefully
- [ ] No breaking changes to existing blog
- [ ] Logs source of content (debugging)
- [ ] Type-safe for both sources

---

##### **Task 1.5: Update Blog Pages to Use Resolver**
**File:** `app/blog/page.tsx` (update existing)

```typescript
import { resolvePosts } from '@/lib/content/resolver'
import BlogList from '@/components/blog/BlogList'

export default async function BlogPage() {
  // This will use API if authenticated, static otherwise
  const posts = await resolvePosts({ limit: 20, status: 'published' })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <BlogList posts={posts} />
    </div>
  )
}
```

**File:** `app/blog/[slug]/page.tsx` (update existing)

```typescript
import { resolvePost } from '@/lib/content/resolver'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const resolved = await resolvePost(params.slug)

  if (!resolved) {
    notFound()
  }

  const { source, data } = resolved

  if (source === 'api') {
    // Render API content (MDX from database)
    return (
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-5xl font-bold mb-4">{data.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{data.excerpt}</p>
        <div className="prose prose-lg">
          <MDXRemote source={data.content} />
        </div>
      </article>
    )
  }

  // Render static content (existing implementation)
  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-5xl font-bold mb-4">{data.frontmatter.title}</h1>
      <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: data.content }} />
    </article>
  )
}
```

**Acceptance Criteria:**
- [ ] Blog index uses resolver
- [ ] Blog post detail uses resolver
- [ ] Shows API content when authenticated
- [ ] Shows static content when not authenticated
- [ ] No visual differences between sources
- [ ] SEO metadata preserved

---

##### **Task 1.6: Integration Tests for Dual Content**
**File:** `__tests__/content/resolver.test.ts`

```typescript
import { resolvePost, resolvePosts } from '@/lib/content/resolver'
import { authService } from '@/lib/api'

describe('Content Resolver Integration Tests', () => {
  describe('when NOT authenticated', () => {
    it('should return static content', async () => {
      // Assuming we're not logged in
      const posts = await resolvePosts({ limit: 5 })

      expect(Array.isArray(posts)).toBe(true)
      expect(posts.length).toBeGreaterThan(0)
      // Verify it's static content (has certain properties)
    })
  })

  describe('when authenticated', () => {
    beforeAll(async () => {
      // TODO: Authenticate test user
    })

    it('should return API content', async () => {
      const posts = await resolvePosts({ limit: 5 })

      expect(Array.isArray(posts)).toBe(true)
      expect(posts.length).toBeGreaterThan(0)
      // Verify it's API content
    })

    it('should fall back to static if API fails', async () => {
      // TODO: Simulate API failure
      const posts = await resolvePosts({ limit: 5 })

      expect(Array.isArray(posts)).toBe(true)
    })
  })
})
```

**Acceptance Criteria:**
- [ ] Tests both authenticated and unauthenticated states
- [ ] Tests fallback behavior
- [ ] Real API calls (no mocks)
- [ ] Verbose error messages

---

### **PHASE 2: Content Cockpit Dashboard**
**Duration:** 3-4 sessions
**Status:** Not Started
**Objective:** Build internal dashboard for marketing team to use omnidraft AI

#### Tasks

##### **Task 2.1: Create Dashboard Layout**
**File:** `app/dashboard/layout.tsx`

```typescript
import { createServerClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import Navigation from '@/components/dashboard/Navigation'
import { authService } from '@/lib/api'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const user = await authService.getCurrentUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
```

**File:** `components/dashboard/Navigation.tsx`

```typescript
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authService } from '@/lib/api'
import { Button } from '@/lib/design-system'

export default function Navigation({ user }: { user: any }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await authService.signOut()
    router.push('/login')
  }

  const navItems = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/content', label: 'Content' },
    { href: '/dashboard/generate', label: 'Generate' },
  ]

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === item.href
                    ? 'border-b-2 border-blue-500 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
```

**Acceptance Criteria:**
- [ ] Protected layout with auth check
- [ ] Navigation sidebar with active states
- [ ] User info display
- [ ] Sign out functionality
- [ ] Responsive design

---

##### **Task 2.2: Create Dashboard Overview Page**
**File:** `app/dashboard/page.tsx`

```typescript
import { blogService } from '@/lib/api'
import { Card, Heading, Text, Grid } from '@/lib/design-system'

export default async function DashboardPage() {
  const posts = await blogService.getPosts({ page: 1, page_size: 100 })

  const stats = {
    total: posts.pagination.total,
    drafts: posts.posts.filter((p) => p.status === 'draft').length,
    published: posts.posts.filter((p) => p.status === 'published').length,
    archived: posts.posts.filter((p) => p.status === 'archived').length,
  }

  return (
    <div>
      <Heading level={1} className="mb-8">
        Content Cockpit
      </Heading>

      <Grid cols={4} gap={6}>
        <Card>
          <Text variant="small" className="text-gray-600">
            Total Posts
          </Text>
          <Text className="text-3xl font-bold mt-2">{stats.total}</Text>
        </Card>

        <Card>
          <Text variant="small" className="text-gray-600">
            Drafts
          </Text>
          <Text className="text-3xl font-bold mt-2">{stats.drafts}</Text>
        </Card>

        <Card>
          <Text variant="small" className="text-gray-600">
            Published
          </Text>
          <Text className="text-3xl font-bold mt-2">{stats.published}</Text>
        </Card>

        <Card>
          <Text variant="small" className="text-gray-600">
            Archived
          </Text>
          <Text className="text-3xl font-bold mt-2">{stats.archived}</Text>
        </Card>
      </Grid>

      {/* Recent posts, activity feed, etc. */}
    </div>
  )
}
```

**Acceptance Criteria:**
- [ ] Shows content statistics
- [ ] Real-time data from API
- [ ] Clean dashboard design
- [ ] Uses design system components

---

##### **Task 2.3: Create Content Manager**
**File:** `app/dashboard/content/page.tsx`

```typescript
import { blogService } from '@/lib/api'
import ContentTable from '@/components/dashboard/ContentTable'

export default async function ContentPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string }
}) {
  const page = Number(searchParams.page) || 1
  const status = searchParams.status

  const result = await blogService.getPosts({
    page,
    page_size: 20,
    status_filter: status,
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Content Manager</h1>
      <ContentTable posts={result.posts} pagination={result.pagination} />
    </div>
  )
}
```

**File:** `components/dashboard/ContentTable.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { blogService, BlogPost } from '@/lib/api'
import { Button, Badge } from '@/lib/design-system'

interface ContentTableProps {
  posts: BlogPost[]
  pagination: any
}

export default function ContentTable({ posts, pagination }: ContentTableProps) {
  const router = useRouter()
  const [publishing, setPublishing] = useState<string | null>(null)

  const handlePublish = async (postId: string) => {
    setPublishing(postId)
    try {
      await blogService.publishPost(postId)
      router.refresh() // Refresh to show updated status
    } catch (error) {
      console.error('Failed to publish:', error)
    } finally {
      setPublishing(null)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await blogService.deletePost(postId)
      router.refresh()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Updated
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{post.title}</div>
                <div className="text-sm text-gray-500">{post.slug}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  variant={
                    post.status === 'published'
                      ? 'success'
                      : post.status === 'draft'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {post.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(post.updated_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                {post.status === 'draft' && (
                  <Button
                    size="sm"
                    onClick={() => handlePublish(post.id)}
                    loading={publishing === post.id}
                  >
                    Publish
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/content/${post.id}/edit`)}>
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(post.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-6 py-4 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {posts.length} of {pagination.total} posts
          </div>
          <div className="space-x-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => router.push(`/dashboard/content?page=${pagination.page - 1}`)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page >= pagination.total_pages}
              onClick={() => router.push(`/dashboard/content?page=${pagination.page + 1}`)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Acceptance Criteria:**
- [ ] Lists all posts with status
- [ ] Publish button for drafts
- [ ] Edit and delete actions
- [ ] Pagination
- [ ] Real-time updates after actions
- [ ] Loading states

---

##### **Task 2.4: Create AI Content Wizard**
**File:** `app/dashboard/generate/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { blogService } from '@/lib/api'
import { Button, Input, Textarea, Select, Card, Heading } from '@/lib/design-system'

interface GenerateForm {
  topic: string
  keywords: string
  tone: string
  targetAudience: string
  contentType: string
}

export default function GeneratePage() {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [generatedPost, setGeneratedPost] = useState<any>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<GenerateForm>()

  const onSubmit = async (data: GenerateForm) => {
    setGenerating(true)

    try {
      // Call AI generation endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai/generate-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: data.topic,
          keywords: data.keywords.split(',').map((k) => k.trim()),
          tone: data.tone,
          target_audience: data.targetAudience,
          content_type: data.contentType,
        }),
      })

      const aiResult = await response.json()

      // Save as draft
      const post = await blogService.createPost({
        title: aiResult.title,
        content: aiResult.content,
        excerpt: aiResult.excerpt,
        status: 'draft',
        keywords: data.keywords.split(',').map((k) => k.trim()),
      })

      setGeneratedPost(post)
    } catch (error) {
      console.error('Generation failed:', error)
      alert('Failed to generate content')
    } finally {
      setGenerating(false)
    }
  }

  if (generatedPost) {
    return (
      <div>
        <Heading level={1} className="mb-8">
          Content Generated Successfully!
        </Heading>
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">{generatedPost.title}</h2>
          <p className="text-gray-600 mb-4">{generatedPost.excerpt}</p>
          <div className="prose" dangerouslySetInnerHTML={{ __html: generatedPost.content }} />
        </Card>
        <div className="flex space-x-4">
          <Button onClick={() => router.push(`/dashboard/content/${generatedPost.id}/edit`)}>
            Edit Draft
          </Button>
          <Button variant="outline" onClick={() => setGeneratedPost(null)}>
            Generate Another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Heading level={1} className="mb-8">
        AI Content Wizard
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
        <Card className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <Input
              {...register('topic', { required: 'Topic is required' })}
              placeholder="e.g., AI in Marketing Automation"
            />
            {errors.topic && <p className="text-red-600 text-sm mt-1">{errors.topic.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
            <Input
              {...register('keywords', { required: 'Keywords are required' })}
              placeholder="e.g., AI, automation, marketing, ROI"
            />
            {errors.keywords && <p className="text-red-600 text-sm mt-1">{errors.keywords.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tone</label>
            <Select {...register('tone', { required: 'Tone is required' })}>
              <option value="">Select tone...</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="technical">Technical</option>
              <option value="educational">Educational</option>
            </Select>
            {errors.tone && <p className="text-red-600 text-sm mt-1">{errors.tone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Audience</label>
            <Input
              {...register('targetAudience', { required: 'Target audience is required' })}
              placeholder="e.g., Marketing professionals, SMB owners"
            />
            {errors.targetAudience && (
              <p className="text-red-600 text-sm mt-1">{errors.targetAudience.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content Type</label>
            <Select {...register('contentType', { required: 'Content type is required' })}>
              <option value="">Select content type...</option>
              <option value="blog_post">Blog Post</option>
              <option value="case_study">Case Study</option>
              <option value="how_to">How-To Guide</option>
              <option value="listicle">Listicle</option>
            </Select>
            {errors.contentType && (
              <p className="text-red-600 text-sm mt-1">{errors.contentType.message}</p>
            )}
          </div>

          <Button type="submit" fullWidth loading={generating}>
            {generating ? 'Generating...' : 'Generate Content'}
          </Button>
        </Card>
      </form>
    </div>
  )
}
```

**Acceptance Criteria:**
- [ ] Form with all AI generation parameters
- [ ] Calls omnidraft AI endpoint
- [ ] Saves generated content as draft
- [ ] Shows preview of generated content
- [ ] Navigate to edit or generate another
- [ ] Loading states and error handling

---

##### **Task 2.5: Create Post Editor**
**File:** `app/dashboard/content/[id]/edit/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { blogService, BlogPost } from '@/lib/api'
import { Button, Input, Textarea, Card, Heading } from '@/lib/design-system'

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset } = useForm<Partial<BlogPost>>()

  useEffect(() => {
    async function loadPost() {
      // Fetch by ID (you'll need to add this method to blogService)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog/posts/${params.id}`)
      const data = await response.json()
      setPost(data)
      reset(data)
    }
    loadPost()
  }, [params.id, reset])

  const onSubmit = async (data: Partial<BlogPost>) => {
    setSaving(true)
    try {
      await blogService.updatePost(params.id, data)
      router.push('/dashboard/content')
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  if (!post) return <div>Loading...</div>

  return (
    <div>
      <Heading level={1} className="mb-8">
        Edit Post
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
        <Card className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input {...register('title', { required: true })} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <Input {...register('slug', { required: true })} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <Textarea {...register('excerpt')} rows={3} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content (MDX)</label>
            <Textarea {...register('content', { required: true })} rows={20} className="font-mono" />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" loading={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
```

**Acceptance Criteria:**
- [ ] Loads post data
- [ ] Editable title, slug, excerpt, content
- [ ] Save updates to API
- [ ] Cancel navigation
- [ ] Loading and saving states

---

##### **Task 2.6: Integration Tests for Cockpit**
**File:** `__tests__/dashboard/content-manager.test.ts`

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContentTable from '@/components/dashboard/ContentTable'
import { blogService } from '@/lib/api'

describe('Content Manager Integration Tests', () => {
  beforeEach(async () => {
    // Set up authenticated session
  })

  it('should display list of posts', async () => {
    const posts = await blogService.getPosts({ page: 1, page_size: 20 })

    render(<ContentTable posts={posts.posts} pagination={posts.pagination} />)

    expect(screen.getByText(/Content Manager/i)).toBeInTheDocument()
    expect(posts.posts.length).toBeGreaterThan(0)
  })

  it('should publish a draft post', async () => {
    const drafts = await blogService.getPosts({ status_filter: 'draft', page: 1, page_size: 1 })

    if (drafts.posts.length > 0) {
      const draft = drafts.posts[0]

      render(<ContentTable posts={drafts.posts} pagination={drafts.pagination} />)

      const publishButton = screen.getByText(/Publish/i)
      await userEvent.click(publishButton)

      await waitFor(() => {
        expect(screen.getByText(/published/i)).toBeInTheDocument()
      })
    }
  })

  it('should delete a post', async () => {
    // Create test post
    const testPost = await blogService.createPost({
      title: 'Test Post for Deletion',
      content: 'Test content',
      status: 'draft',
    })

    render(<ContentTable posts={[testPost]} pagination={{ page: 1, total: 1 }} />)

    const deleteButton = screen.getByText(/Delete/i)
    await userEvent.click(deleteButton)

    // Confirm dialog
    const confirmButton = screen.getByText(/confirm/i)
    await userEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.queryByText(testPost.title)).not.toBeInTheDocument()
    })
  })
})
```

**Acceptance Criteria:**
- [ ] Tests real API interactions
- [ ] Tests publish workflow
- [ ] Tests delete workflow
- [ ] Tests pagination
- [ ] No mocks

---

### **PHASE 3: Lead Forms Integration**
**Duration:** 1 session
**Status:** Not Started
**Objective:** Connect marketing forms to omnidraft leads API

#### Tasks

##### **Task 3.1: Update Contact Form**
**File:** `components/ContactForm.tsx` (update existing)

```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Textarea } from '@/lib/design-system'

interface ContactFormData {
  name: string
  email: string
  company?: string
  message: string
}

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company,
          message: data.message,
          source: 'website_contact',
        }),
      })

      if (!response.ok) throw new Error('Failed to submit')

      setSubmitted(true)
    } catch (error) {
      console.error('Form submission failed:', error)
      alert('Failed to submit form. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center p-8">
        <h3 className="text-2xl font-bold mb-4">Thank you!</h3>
        <p>We'll get back to you soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <Input {...register('name', { required: 'Name is required' })} />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <Input
          type="email"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Company (optional)</label>
        <Input {...register('company')} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Message</label>
        <Textarea
          {...register('message', { required: 'Message is required' })}
          rows={5}
        />
        {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>}
      </div>

      <Button type="submit" fullWidth loading={submitting}>
        {submitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
```

**Acceptance Criteria:**
- [ ] Submits to omnidraft leads endpoint
- [ ] Includes source tracking
- [ ] Success state
- [ ] Error handling
- [ ] Loading state

---

## 🧪 Testing Strategy

### Integration Tests (Real API)
- **Location:** `__tests__/api/`
- **Command:** `npm test -- __tests__/api`
- **Requirements:**
  - omnidraft backend running on port 8000
  - Valid test user credentials
  - PostgreSQL database seeded with test data

### End-to-End Tests
- **Location:** `__tests__/e2e/`
- **Tool:** Playwright or Cypress (TBD)
- **Coverage:**
  - Login flow
  - Content generation workflow
  - Publishing workflow
  - Form submissions

### Test Data Setup
```bash
# Script to set up test user and sample data
npm run test:setup
```

**Creates:**
- Test user account
- Sample blog posts (draft, published)
- Sample brand
- Sample leads

---

## 📦 Deployment Strategy

### Development Environment
```bash
# Terminal 1: omnidraft backend
cd /home/prodij/omnidraft/main
docker-compose up

# Terminal 2: OmniSignalAI-web
cd /home/prodij/OmniSignalAI-web
npm run dev
```

**Access:**
- Frontend: http://localhost:5000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Production Environment
- **Frontend:** Vercel deployment (existing setup)
- **Backend:** Docker container on production server
- **Database:** Supabase (already configured)
- **Environment Variables:** Set in Vercel dashboard

---

## 🔄 Migration Path

### Gradual Rollout
1. **Week 1-2:** Phase 0 (Foundation)
2. **Week 3-4:** Phase 1 (Auth + Dual Content)
3. **Week 5-6:** Phase 2 (Dashboard)
4. **Week 7:** Phase 3 (Forms) + Testing

### Rollback Strategy
- Feature flags control API vs static content
- Can disable `NEXT_PUBLIC_ENABLE_API_CONTENT` to revert to static
- No database migrations on frontend (backend only)

---

## 📝 Session Checklist

### Before Each Session
- [ ] Pull latest changes from git
- [ ] Check omnidraft backend is running (`docker ps`)
- [ ] Verify environment variables are set
- [ ] Review previous session notes

### After Each Session
- [ ] Commit changes with descriptive message
- [ ] Update this plan with progress
- [ ] Run tests to ensure nothing broke
- [ ] Document any blockers or issues

---

## 🚀 Next Steps

**Current Phase:** Phase 0 - Foundation
**Next Task:** Task 0.1 - Install Dependencies
**Estimated Time:** 30 minutes

**To begin implementation:**
```bash
cd /home/prodij/OmniSignalAI-web
git checkout -b feature/cockpit-phase-0
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js axios
```

---

## 📚 References

- [omnidraft Backend API Docs](http://localhost:8000/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [AI Agent Integration Plan](./AI_AGENT_INTEGRATION_PLAN.md)

---

**Last Updated:** 2025-10-02
**Plan Version:** 1.0
**Maintainer:** Claude Code AI Agent
