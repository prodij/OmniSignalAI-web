/**
 * Dual Content Resolver
 *
 * Intelligent content resolution that:
 * 1. Tries API first if user is authenticated and feature flag enabled
 * 2. Falls back to static MDX files gracefully
 * 3. Provides unified interface for both sources
 * 4. Maintains backward compatibility
 */

import { blogService, type BlogPost as APIBlogPost } from '@/lib/api/services/blog'
import { authService } from '@/lib/api/services/auth'
import { blog as staticBlog } from '#site/content'

/**
 * Content source type
 */
export type ContentSource = 'api' | 'static'

/**
 * Unified blog post interface (compatible with both sources)
 */
export interface UnifiedBlogPost {
  slug: string
  slugAsParams: string // For URL routing
  title: string
  description: string // Same as excerpt
  excerpt: string
  content: string // MDX content
  body: string // Alias for content
  datePublished: string
  dateModified?: string
  published: boolean
  draft?: boolean
  featured?: boolean
  category?: string
  keywords?: string[]
  tags?: string[]
  author?: {
    name: string
    url: string
  }
  readTime?: number
  thumbnail?: string
  // PageBuilder fields
  layout?: string
  blocks?: any[]
  // Open Graph
  og?: {
    image?: string
    imageAlt?: string
  }
  // Schema.org
  schema?: any
  faq?: any
  steps?: any
  // Original source data
  _source: ContentSource
  _originalData: any
}

/**
 * Resolved content with metadata
 */
export interface ResolvedContent<T> {
  source: ContentSource
  data: T
  timestamp: number
}

/**
 * Transform API blog post to unified format
 */
function transformAPIPost(apiPost: APIBlogPost): UnifiedBlogPost {
  const frontmatter = apiPost.frontmatter || {}

  return {
    slug: apiPost.slug,
    slugAsParams: apiPost.slug,
    title: apiPost.title,
    description: apiPost.excerpt,
    excerpt: apiPost.excerpt,
    content: apiPost.content,
    body: apiPost.content,
    datePublished: apiPost.created_at,
    dateModified: apiPost.updated_at,
    published: apiPost.status === 'published',
    draft: apiPost.status === 'draft',
    featured: (frontmatter.featured as boolean | undefined) || false,
    category: frontmatter.category as string | undefined,
    keywords: apiPost.keywords,
    tags: frontmatter.tags as string[] | undefined,
    author: frontmatter.author as { name: string; url: string } | undefined,
    readTime: frontmatter.readTime as number | undefined,
    thumbnail: frontmatter.thumbnail as string | undefined,
    layout: frontmatter.layout as string | undefined,
    blocks: frontmatter.blocks as any[] | undefined,
    og: frontmatter.og as { image?: string; imageAlt?: string } | undefined,
    schema: frontmatter.schema,
    faq: frontmatter.faq,
    steps: frontmatter.steps,
    _source: 'api',
    _originalData: apiPost,
  }
}

/**
 * Transform static blog post to unified format
 */
function transformStaticPost(staticPost: any): UnifiedBlogPost {
  return {
    slug: staticPost.slug,
    slugAsParams: staticPost.slugAsParams || staticPost.slug,
    title: staticPost.title,
    description: staticPost.description || staticPost.excerpt || '',
    excerpt: staticPost.description || staticPost.excerpt || '',
    content: staticPost.content || staticPost.body || '',
    body: staticPost.body || staticPost.content || '',
    datePublished: staticPost.datePublished || staticPost.date,
    dateModified: staticPost.dateModified,
    published: staticPost.published !== false,
    draft: staticPost.draft || false,
    featured: staticPost.featured || false,
    category: staticPost.category,
    keywords: staticPost.keywords || [],
    tags: staticPost.tags || [],
    author: staticPost.author,
    readTime: staticPost.readTime,
    thumbnail: staticPost.thumbnail,
    layout: staticPost.layout,
    blocks: staticPost.blocks,
    og: staticPost.og,
    schema: staticPost.schema,
    faq: staticPost.faq,
    steps: staticPost.steps,
    _source: 'static',
    _originalData: staticPost,
  }
}

/**
 * Check if API content is enabled
 */
function isAPIContentEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_API_CONTENT === 'true'
}

/**
 * Resolve single blog post by slug
 *
 * @example
 * ```ts
 * const resolved = await resolvePost('my-blog-post')
 * if (resolved) {
 *   console.log('Source:', resolved.source) // 'api' or 'static'
 *   console.log('Title:', resolved.data.title)
 * }
 * ```
 */
export async function resolvePost(
  slug: string
): Promise<ResolvedContent<UnifiedBlogPost> | null> {
  // Try API first if authenticated and enabled
  if (isAPIContentEnabled()) {
    try {
      const isAuth = await authService.isAuthenticated()

      if (isAuth) {
        console.log(`[Content Resolver] Trying API for post: ${slug}`)
        const apiPost = await blogService.getPostBySlug(slug)

        return {
          source: 'api',
          data: transformAPIPost(apiPost),
          timestamp: Date.now(),
        }
      }
    } catch (error) {
      console.warn(
        `[Content Resolver] API fetch failed for ${slug}, falling back to static:`,
        error instanceof Error ? error.message : error
      )
      // Fall through to static
    }
  }

  // Fallback to static content
  console.log(`[Content Resolver] Using static content for post: ${slug}`)
  const staticPost = staticBlog.find((post) => post.slug === slug)

  if (!staticPost) {
    return null
  }

  return {
    source: 'static',
    data: transformStaticPost(staticPost),
    timestamp: Date.now(),
  }
}

/**
 * Resolve list of blog posts
 *
 * @example
 * ```ts
 * const posts = await resolvePosts({ limit: 10, published: true })
 * console.log(`Found ${posts.length} posts from ${posts[0]?._source}`)
 * ```
 */
export async function resolvePosts(options?: {
  limit?: number
  published?: boolean
  featured?: boolean
  category?: string
}): Promise<UnifiedBlogPost[]> {
  const limit = options?.limit || 100
  const publishedOnly = options?.published !== false

  // Try API first if authenticated and enabled
  if (isAPIContentEnabled()) {
    try {
      const isAuth = await authService.isAuthenticated()

      if (isAuth) {
        console.log('[Content Resolver] Fetching posts from API')
        const result = await blogService.getPosts({
          page: 1,
          page_size: limit,
          status_filter: publishedOnly ? 'published' : undefined,
        })

        let posts = result.posts.map(transformAPIPost)

        // Apply filters
        if (options?.featured !== undefined) {
          posts = posts.filter((p) => p.featured === options.featured)
        }
        if (options?.category) {
          posts = posts.filter((p) => p.category === options.category)
        }

        console.log(`[Content Resolver] Fetched ${posts.length} posts from API`)
        return posts
      }
    } catch (error) {
      console.warn(
        '[Content Resolver] API fetch failed, falling back to static:',
        error instanceof Error ? error.message : error
      )
      // Fall through to static
    }
  }

  // Fallback to static content
  console.log('[Content Resolver] Using static content for post list')
  let posts = staticBlog.map(transformStaticPost)

  // Apply filters
  if (publishedOnly) {
    posts = posts.filter((p) => p.published && !p.draft)
  }
  if (options?.featured !== undefined) {
    posts = posts.filter((p) => p.featured === options.featured)
  }
  if (options?.category) {
    posts = posts.filter((p) => p.category === options.category)
  }

  // Apply limit
  posts = posts.slice(0, limit)

  console.log(`[Content Resolver] Using ${posts.length} static posts`)
  return posts
}

/**
 * Get content source statistics (for debugging/monitoring)
 *
 * @example
 * ```ts
 * const stats = await getContentStats()
 * console.log('API available:', stats.apiAvailable)
 * console.log('Static posts:', stats.staticCount)
 * ```
 */
export async function getContentStats() {
  const isAuth = await authService.isAuthenticated().catch(() => false)
  const apiEnabled = isAPIContentEnabled()

  let apiPostCount = 0
  if (apiEnabled && isAuth) {
    try {
      const result = await blogService.getPosts({ page: 1, page_size: 1 })
      apiPostCount = result.pagination.total
    } catch (error) {
      // API not available
    }
  }

  return {
    apiEnabled,
    apiAvailable: apiEnabled && isAuth && apiPostCount > 0,
    apiPostCount,
    staticCount: staticBlog.length,
    authenticated: isAuth,
  }
}
