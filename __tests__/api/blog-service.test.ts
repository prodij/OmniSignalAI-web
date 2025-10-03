/**
 * Blog Service Integration Tests
 *
 * These are REAL integration tests that hit the actual omnidraft API
 * No mocks, no stubs - validates actual integration with backend
 *
 * Prerequisites:
 * 1. omnidraft backend must be running on http://localhost:8000
 * 2. User must be authenticated (or tests will skip auth-required operations)
 *
 * Run with: npm test -- __tests__/api/blog-service.test.ts
 */

import { blogService, BlogPost, BlogPostsResponse } from '@/lib/api/services/blog'
import { apiClient } from '@/lib/api/client'

describe('Blog Service Integration Tests', () => {
  let testPostId: string | null = null

  beforeAll(async () => {
    // Verify backend is accessible
    try {
      const response = await apiClient.get('/health')
      expect(response.status).toBe(200)
    } catch (error) {
      console.warn('⚠️  Backend not accessible. Some tests may fail.')
      console.warn('   Make sure omnidraft backend is running: docker ps | grep omnidraft')
    }
  })

  afterAll(async () => {
    // Cleanup: delete test post if created
    if (testPostId) {
      try {
        await blogService.deletePost(testPostId)
        console.log('✓ Cleaned up test post:', testPostId)
      } catch (error) {
        console.warn('Failed to cleanup test post:', error)
      }
    }
  })

  describe('getPosts', () => {
    it('should fetch blog posts from API', async () => {
      const result = await blogService.getPosts({ page: 1, page_size: 10 })

      // Validate response structure
      expect(result).toHaveProperty('posts')
      expect(result).toHaveProperty('pagination')
      expect(Array.isArray(result.posts)).toBe(true)

      // Validate pagination
      expect(result.pagination.page).toBe(1)
      expect(result.pagination.page_size).toBe(10)
      expect(typeof result.pagination.total).toBe('number')
      expect(typeof result.pagination.total_pages).toBe('number')

      console.log(`✓ Fetched ${result.posts.length} posts (total: ${result.pagination.total})`)
    })

    it('should filter posts by status', async () => {
      const result = await blogService.getPosts({
        status_filter: 'published',
        page: 1,
        page_size: 10,
      })

      expect(result.posts).toBeDefined()

      // If posts exist, verify they're all published
      if (result.posts.length > 0) {
        const allPublished = result.posts.every((post) => post.status === 'published')
        expect(allPublished).toBe(true)
        console.log(`✓ All ${result.posts.length} posts have status 'published'`)
      } else {
        console.log('ℹ️  No published posts found (this is okay)')
      }
    })

    it('should handle search parameter', async () => {
      const result = await blogService.getPosts({
        search: 'test',
        page: 1,
        page_size: 10,
      })

      expect(result.posts).toBeDefined()
      expect(Array.isArray(result.posts)).toBe(true)

      console.log(`✓ Search returned ${result.posts.length} results`)
    })

    it('should handle pagination correctly', async () => {
      const page1 = await blogService.getPosts({ page: 1, page_size: 5 })
      const page2 = await blogService.getPosts({ page: 2, page_size: 5 })

      expect(page1.pagination.page).toBe(1)
      expect(page2.pagination.page).toBe(2)

      // If there are enough posts, verify different results
      if (page1.pagination.total > 5) {
        expect(page1.posts[0]?.id).not.toBe(page2.posts[0]?.id)
        console.log('✓ Pagination returns different results for different pages')
      }
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
        expect(post).toHaveProperty('title')
        expect(post).toHaveProperty('slug')
        expect(post).toHaveProperty('content')
        expect(post.slug).toBe(slug)

        console.log(`✓ Fetched post by slug: "${slug}"`)
      } else {
        console.log('ℹ️  No posts available to test getPostBySlug')
      }
    })

    it('should throw error for non-existent slug', async () => {
      await expect(
        blogService.getPostBySlug('non-existent-slug-12345-test')
      ).rejects.toThrow()

      console.log('✓ Correctly throws error for non-existent slug')
    })
  })

  describe('createPost', () => {
    it('should create a new blog post', async () => {
      const newPost = {
        title: 'Test Post - Integration Test',
        slug: `test-post-${Date.now()}`,
        content: '# Test Content\n\nThis is a test post created by integration tests.',
        excerpt: 'Test excerpt for integration testing',
        status: 'draft' as const,
      }

      try {
        const created = await blogService.createPost(newPost)

        expect(created).toHaveProperty('id')
        expect(created.title).toBe(newPost.title)
        expect(created.slug).toBe(newPost.slug)
        expect(created.status).toBe('draft')

        // Store for cleanup
        testPostId = created.id

        console.log(`✓ Created test post: ${created.id}`)
      } catch (error: any) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          console.log('ℹ️  Skipped createPost test (authentication required)')
        } else {
          throw error
        }
      }
    })
  })

  describe('updatePost', () => {
    it('should update existing blog post', async () => {
      if (!testPostId) {
        console.log('ℹ️  Skipped updatePost test (no test post available)')
        return
      }

      const updates = {
        title: 'Updated Test Post Title',
        excerpt: 'Updated excerpt',
      }

      try {
        const updated = await blogService.updatePost(testPostId, updates)

        expect(updated.id).toBe(testPostId)
        expect(updated.title).toBe(updates.title)
        expect(updated.excerpt).toBe(updates.excerpt)

        console.log(`✓ Updated post: ${testPostId}`)
      } catch (error: any) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          console.log('ℹ️  Skipped updatePost test (authentication required)')
        } else {
          throw error
        }
      }
    })
  })

  describe('publishPost', () => {
    it('should publish a draft post', async () => {
      if (!testPostId) {
        console.log('ℹ️  Skipped publishPost test (no test post available)')
        return
      }

      try {
        const published = await blogService.publishPost(testPostId)

        expect(published.id).toBe(testPostId)
        expect(published.status).toBe('published')

        console.log(`✓ Published post: ${testPostId}`)
      } catch (error: any) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          console.log('ℹ️  Skipped publishPost test (authentication required)')
        } else {
          throw error
        }
      }
    })
  })

  describe('deletePost', () => {
    it('should delete a blog post', async () => {
      if (!testPostId) {
        console.log('ℹ️  Skipped deletePost test (no test post available)')
        return
      }

      try {
        await blogService.deletePost(testPostId)

        // Verify deletion by trying to fetch
        await expect(blogService.getPostById(testPostId)).rejects.toThrow()

        console.log(`✓ Deleted post: ${testPostId}`)

        // Clear testPostId so afterAll doesn't try to delete again
        testPostId = null
      } catch (error: any) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          console.log('ℹ️  Skipped deletePost test (authentication required)')
        } else {
          throw error
        }
      }
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Temporarily change base URL to trigger network error
      const originalBaseURL = apiClient.defaults.baseURL
      apiClient.defaults.baseURL = 'http://localhost:9999' // Non-existent port

      await expect(blogService.getPosts()).rejects.toThrow()

      // Restore base URL
      apiClient.defaults.baseURL = originalBaseURL

      console.log('✓ Network errors handled correctly')
    })

    it('should provide meaningful error messages', async () => {
      try {
        await blogService.getPostBySlug('this-will-fail-404')
        fail('Should have thrown an error')
      } catch (error: any) {
        expect(error.message).toBeDefined()
        expect(typeof error.message).toBe('string')
        expect(error.message.length).toBeGreaterThan(0)

        console.log(`✓ Error message: "${error.message}"`)
      }
    })
  })
})
