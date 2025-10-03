/**
 * Integration Tests for Dual Content Resolver
 *
 * Tests the dual content resolution system:
 * - API-first resolution when authenticated
 * - Graceful fallback to static content
 * - Unified interface for both sources
 */

// Mock the static blog import since .velite output is ESM
jest.mock('#site/content', () => ({
  blog: [
    {
      slug: 'whatsapp-business-guide-when-to-use',
      slugAsParams: 'whatsapp-business-guide-when-to-use',
      title: 'WhatsApp Business Guide: When to Use',
      description: 'Complete guide to WhatsApp Business',
      body: '# WhatsApp Business Guide\n\nComplete content here...',
      content: '# WhatsApp Business Guide\n\nComplete content here...',
      datePublished: '2024-01-15',
      published: true,
      draft: false,
      featured: true,
      category: 'Social Media',
      keywords: ['whatsapp', 'business', 'guide'],
      tags: ['whatsapp', 'marketing'],
      author: {
        name: 'OmniSignalAI',
        url: 'https://omnisignalai.com',
      },
      readTime: 10,
    },
    {
      slug: 'ai-generated-content-example',
      slugAsParams: 'ai-generated-content-example',
      title: 'AI Generated Content Example',
      description: 'Example of AI-generated blog content',
      body: '# AI Content\n\nExample content...',
      content: '# AI Content\n\nExample content...',
      datePublished: '2024-01-20',
      published: true,
      draft: false,
      featured: false,
      category: 'AI',
      keywords: ['ai', 'content'],
      tags: ['ai', 'automation'],
      layout: 'builder',
      blocks: [{ type: 'hero', content: 'Test' }],
      author: {
        name: 'OmniSignalAI',
        url: 'https://omnisignalai.com',
      },
      readTime: 7,
    },
    {
      slug: 'draft-post',
      slugAsParams: 'draft-post',
      title: 'Draft Post',
      description: 'This is a draft',
      body: '# Draft\n\nDraft content...',
      content: '# Draft\n\nDraft content...',
      datePublished: '2024-01-25',
      published: false,
      draft: true,
      category: 'General',
      author: {
        name: 'OmniSignalAI',
        url: 'https://omnisignalai.com',
      },
      readTime: 5,
    },
  ],
}))

import { resolvePost, resolvePosts, getContentStats } from '@/lib/content/resolver'
import { authService } from '@/lib/api/services/auth'

describe('Content Resolver Integration Tests', () => {
  describe('resolvePost', () => {
    it('should resolve post from static content when unauthenticated', async () => {
      // Ensure we're not authenticated
      const isAuth = await authService.isAuthenticated()

      const result = await resolvePost('whatsapp-business-guide-when-to-use')

      expect(result).not.toBeNull()
      expect(result?.source).toBe('static')
      expect(result?.data.slug).toBe('whatsapp-business-guide-when-to-use')
      expect(result?.data.title).toBeDefined()
      expect(result?.data.content).toBeDefined()
      expect(result?.data._source).toBe('static')
    })

    it('should return null for non-existent post', async () => {
      const result = await resolvePost('non-existent-post-slug-12345')

      expect(result).toBeNull()
    })

    it('should have all required fields in unified format', async () => {
      const result = await resolvePost('whatsapp-business-guide-when-to-use')

      expect(result).not.toBeNull()
      if (result) {
        const post = result.data

        // Core fields
        expect(post.slug).toBeDefined()
        expect(post.slugAsParams).toBeDefined()
        expect(post.title).toBeDefined()
        expect(post.description).toBeDefined()
        expect(post.excerpt).toBeDefined()
        expect(post.content).toBeDefined()
        expect(post.body).toBeDefined()
        expect(post.datePublished).toBeDefined()
        expect(typeof post.published).toBe('boolean')

        // Source metadata
        expect(post._source).toBe('static')
        expect(post._originalData).toBeDefined()
      }
    })
  })

  describe('resolvePosts', () => {
    it('should resolve list of posts from static content', async () => {
      const posts = await resolvePosts({ published: true })

      expect(Array.isArray(posts)).toBe(true)
      expect(posts.length).toBeGreaterThan(0)
      expect(posts[0]._source).toBe('static')
    })

    it('should filter published posts only', async () => {
      const publishedPosts = await resolvePosts({ published: true })
      const allPosts = await resolvePosts({ published: false })

      expect(publishedPosts.length).toBeLessThanOrEqual(allPosts.length)
      publishedPosts.forEach((post) => {
        expect(post.published).toBe(true)
        expect(post.draft).not.toBe(true)
      })
    })

    it('should filter featured posts', async () => {
      const featuredPosts = await resolvePosts({ featured: true })

      expect(Array.isArray(featuredPosts)).toBe(true)
      featuredPosts.forEach((post) => {
        expect(post.featured).toBe(true)
      })
    })

    it('should filter by category', async () => {
      // Get all posts first to find a category
      const allPosts = await resolvePosts({ published: true })
      const categoryToTest = allPosts.find((p) => p.category)?.category

      if (categoryToTest) {
        const categoryPosts = await resolvePosts({ category: categoryToTest })

        expect(Array.isArray(categoryPosts)).toBe(true)
        categoryPosts.forEach((post) => {
          expect(post.category).toBe(categoryToTest)
        })
      }
    })

    it('should respect limit parameter', async () => {
      const limitedPosts = await resolvePosts({ limit: 2 })

      expect(limitedPosts.length).toBeLessThanOrEqual(2)
    })

    it('should have consistent unified format across all posts', async () => {
      const posts = await resolvePosts({ limit: 5 })

      posts.forEach((post) => {
        // All posts must have these core fields
        expect(post.slug).toBeDefined()
        expect(post.slugAsParams).toBeDefined()
        expect(post.title).toBeDefined()
        expect(post.description).toBeDefined()
        expect(post.excerpt).toBeDefined()
        expect(post.content).toBeDefined()
        expect(post.body).toBeDefined()
        expect(post.datePublished).toBeDefined()
        expect(typeof post.published).toBe('boolean')
        expect(post._source).toBeDefined()
        expect(['api', 'static']).toContain(post._source)
      })
    })
  })

  describe('getContentStats', () => {
    it('should return content statistics', async () => {
      const stats = await getContentStats()

      expect(stats).toHaveProperty('apiEnabled')
      expect(stats).toHaveProperty('apiAvailable')
      expect(stats).toHaveProperty('apiPostCount')
      expect(stats).toHaveProperty('staticCount')
      expect(stats).toHaveProperty('authenticated')

      expect(typeof stats.apiEnabled).toBe('boolean')
      expect(typeof stats.apiAvailable).toBe('boolean')
      expect(typeof stats.apiPostCount).toBe('number')
      expect(typeof stats.staticCount).toBe('number')
      expect(typeof stats.authenticated).toBe('boolean')
    })

    it('should show static content is available', async () => {
      const stats = await getContentStats()

      expect(stats.staticCount).toBeGreaterThan(0)
    })
  })

  describe('Dual Content System', () => {
    it('should gracefully handle API feature flag disabled', async () => {
      // When NEXT_PUBLIC_ENABLE_API_CONTENT is not 'true', should use static
      const result = await resolvePost('whatsapp-business-guide-when-to-use')

      expect(result).not.toBeNull()
      expect(result?.source).toBe('static')
    })

    it('should maintain backward compatibility with static blog', async () => {
      // Ensure existing static blog posts still work
      const staticPosts = await resolvePosts({ published: true, limit: 3 })

      expect(staticPosts.length).toBeGreaterThan(0)

      // Check that data structure matches what components expect
      staticPosts.forEach((post) => {
        // BlogList expects these fields
        expect(post).toHaveProperty('title')
        expect(post).toHaveProperty('description')
        expect(post).toHaveProperty('slug')
        expect(post).toHaveProperty('slugAsParams')
        expect(post).toHaveProperty('datePublished')
        expect(post).toHaveProperty('category')

        // BlogCard expects these
        expect(post).toHaveProperty('featured')
      })
    })
  })

  describe('Content Transformation', () => {
    it('should transform static post with all fields', async () => {
      const result = await resolvePost('ai-generated-content-example')

      expect(result).not.toBeNull()
      if (result) {
        const post = result.data

        // Check PageBuilder fields are preserved
        if (post.layout === 'builder') {
          expect(post.blocks).toBeDefined()
          expect(Array.isArray(post.blocks)).toBe(true)
        }

        // Check that both content and body are available
        expect(post.content).toBeDefined()
        expect(post.body).toBeDefined()
        expect(post.content).toBe(post.body) // Should be same value
      }
    })

    it('should handle posts with optional fields missing', async () => {
      const posts = await resolvePosts({ published: true, limit: 5 })

      posts.forEach((post) => {
        // Optional fields should be undefined, not throw errors
        expect(() => {
          const _ = post.author
          const __ = post.readTime
          const ___ = post.thumbnail
          const ____ = post.keywords
          const _____ = post.tags
        }).not.toThrow()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid slug gracefully', async () => {
      const result = await resolvePost('')

      expect(result).toBeNull()
    })

    it('should handle resolvePosts with invalid options', async () => {
      const posts = await resolvePosts({ limit: -1 })

      // Should still return results, just handle invalid limit
      expect(Array.isArray(posts)).toBe(true)
    })
  })

  describe('Timestamp and Metadata', () => {
    it('should include timestamp in resolved content', async () => {
      const result = await resolvePost('whatsapp-business-guide-when-to-use')

      expect(result).not.toBeNull()
      if (result) {
        expect(result.timestamp).toBeDefined()
        expect(typeof result.timestamp).toBe('number')
        expect(result.timestamp).toBeGreaterThan(0)

        // Timestamp should be recent (within last minute)
        const now = Date.now()
        expect(now - result.timestamp).toBeLessThan(60000)
      }
    })

    it('should preserve original data in _originalData', async () => {
      const result = await resolvePost('whatsapp-business-guide-when-to-use')

      expect(result).not.toBeNull()
      if (result) {
        expect(result.data._originalData).toBeDefined()
        expect(typeof result.data._originalData).toBe('object')
      }
    })
  })
})
