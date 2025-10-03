/**
 * Dashboard Integration Tests
 *
 * Tests the Content Cockpit dashboard functionality:
 * - Content manager operations
 * - Post editing workflow
 * - Real API integration (no mocks)
 *
 * NOTE: These tests require authentication.
 * To run these tests:
 * 1. Start the backend: cd /home/prodij/omnidraft && docker-compose up
 * 2. Authenticate via magic link at http://localhost:3000/login
 * 3. Run tests while session is active
 *
 * These tests validate the dashboard UI integrates correctly with the backend API.
 */

import { blogService } from '@/lib/api/services/blog'

describe.skip('Dashboard Integration Tests (requires auth)', () => {
  let testPostId: string | null = null

  // Cleanup: Delete test post after all tests
  afterAll(async () => {
    if (testPostId) {
      try {
        await blogService.deletePost(testPostId)
        console.log(`Cleaned up test post: ${testPostId}`)
      } catch (error) {
        console.error('Failed to cleanup test post:', error)
      }
    }
  })

  describe('Content Manager', () => {
    it('should fetch list of posts', async () => {
      const result = await blogService.getPosts({
        page: 1,
        page_size: 20,
      })

      expect(result).toHaveProperty('posts')
      expect(result).toHaveProperty('pagination')
      expect(Array.isArray(result.posts)).toBe(true)
      expect(result.pagination.total).toBeGreaterThanOrEqual(0)
    })

    it('should filter posts by status', async () => {
      const drafts = await blogService.getPosts({
        page: 1,
        page_size: 20,
        status_filter: 'draft',
      })

      expect(Array.isArray(drafts.posts)).toBe(true)
      drafts.posts.forEach((post) => {
        expect(post.status).toBe('draft')
      })
    })

    it('should handle pagination correctly', async () => {
      const page1 = await blogService.getPosts({
        page: 1,
        page_size: 5,
      })

      expect(page1.pagination.page).toBe(1)
      expect(page1.pagination.page_size).toBe(5)
      expect(page1.posts.length).toBeLessThanOrEqual(5)

      if (page1.pagination.total_pages > 1) {
        const page2 = await blogService.getPosts({
          page: 2,
          page_size: 5,
        })

        expect(page2.pagination.page).toBe(2)
        expect(page2.posts[0]?.id).not.toBe(page1.posts[0]?.id)
      }
    })
  })

  describe('Post Creation and Editing', () => {
    it('should create a new draft post', async () => {
      const newPost = await blogService.createPost({
        title: 'Test Dashboard Post',
        slug: `test-dashboard-post-${Date.now()}`,
        excerpt: 'This is a test post created by dashboard integration tests',
        content: '# Test Post\n\nThis is test content for dashboard integration testing.',
        status: 'draft',
        keywords: ['test', 'dashboard', 'integration'],
      })

      // Store for cleanup
      testPostId = newPost.id

      expect(newPost).toHaveProperty('id')
      expect(newPost.title).toBe('Test Dashboard Post')
      expect(newPost.status).toBe('draft')
      expect(newPost.slug).toContain('test-dashboard-post')
    })

    it('should retrieve post by ID', async () => {
      if (!testPostId) {
        // Create post if not exists
        const newPost = await blogService.createPost({
          title: 'Test Post for Retrieval',
          slug: `test-retrieval-${Date.now()}`,
          excerpt: 'Test excerpt',
          content: '# Test',
          status: 'draft',
        })
        testPostId = newPost.id
      }

      const post = await blogService.getPostById(testPostId)

      expect(post.id).toBe(testPostId)
      expect(post).toHaveProperty('title')
      expect(post).toHaveProperty('content')
    })

    it('should update post content', async () => {
      if (!testPostId) {
        const newPost = await blogService.createPost({
          title: 'Test Post for Update',
          slug: `test-update-${Date.now()}`,
          excerpt: 'Test excerpt',
          content: '# Test',
          status: 'draft',
        })
        testPostId = newPost.id
      }

      const updatedTitle = `Updated Test Post ${Date.now()}`
      const updatedContent = '# Updated Content\n\nThis content has been updated.'

      const updated = await blogService.updatePost(testPostId, {
        title: updatedTitle,
        content: updatedContent,
      })

      expect(updated.id).toBe(testPostId)
      expect(updated.title).toBe(updatedTitle)
      expect(updated.content).toBe(updatedContent)
    })

    it('should publish a draft post', async () => {
      if (!testPostId) {
        const newPost = await blogService.createPost({
          title: 'Test Post for Publishing',
          slug: `test-publish-${Date.now()}`,
          excerpt: 'Test excerpt',
          content: '# Test',
          status: 'draft',
        })
        testPostId = newPost.id
      }

      // Ensure it's a draft first
      const draft = await blogService.getPostById(testPostId)
      expect(draft.status).toBe('draft')

      // Publish it
      const published = await blogService.publishPost(testPostId)

      expect(published.id).toBe(testPostId)
      expect(published.status).toBe('published')
    })
  })

  describe('Error Handling', () => {
    it('should handle non-existent post ID gracefully', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000'

      await expect(blogService.getPostById(fakeId)).rejects.toThrow()
    })

    it('should handle invalid post data', async () => {
      await expect(
        blogService.createPost({
          title: '', // Invalid: empty title
          slug: 'test',
          excerpt: '',
          content: '',
          status: 'draft',
        })
      ).rejects.toThrow()
    })
  })

  describe('Dashboard Statistics', () => {
    it('should calculate content statistics correctly', async () => {
      const result = await blogService.getPosts({
        page: 1,
        page_size: 100,
      })

      const stats = {
        total: result.pagination.total,
        drafts: result.posts.filter((p) => p.status === 'draft').length,
        published: result.posts.filter((p) => p.status === 'published').length,
        archived: result.posts.filter((p) => p.status === 'archived').length,
      }

      expect(stats.total).toBeGreaterThanOrEqual(0)
      expect(stats.drafts).toBeGreaterThanOrEqual(0)
      expect(stats.published).toBeGreaterThanOrEqual(0)
      expect(stats.archived).toBeGreaterThanOrEqual(0)

      // Total should equal sum of all statuses
      expect(stats.total).toBeGreaterThanOrEqual(
        stats.drafts + stats.published + stats.archived
      )
    })
  })
})
