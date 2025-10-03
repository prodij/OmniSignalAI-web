/**
 * Blog Service
 *
 * Type-safe service layer for blog post operations
 * Connects to omnidraft backend /api/v1/blog endpoints
 */

import { apiClient, getErrorMessage } from '../client'

/**
 * Blog post status enum
 */
export type BlogPostStatus = 'draft' | 'published' | 'archived'

/**
 * Blog post interface (matches backend schema)
 */
export interface BlogPost {
  id: string
  user_id: string
  brand_id: string
  title: string
  slug: string
  excerpt: string
  content: string // MDX content
  status: BlogPostStatus
  meta_title?: string
  meta_description?: string
  keywords?: string[]
  schema_markup?: Record<string, unknown>
  quality_score?: number
  frontmatter?: Record<string, unknown>
  created_at: string
  updated_at: string
}

/**
 * Pagination metadata
 */
export interface Pagination {
  page: number
  page_size: number
  total: number
  total_pages: number
}

/**
 * Blog posts list response
 */
export interface BlogPostsResponse {
  posts: BlogPost[]
  pagination: Pagination
}

/**
 * Blog post create/update payload
 */
export interface BlogPostPayload {
  brand_id?: string
  title: string
  slug?: string
  excerpt?: string
  content: string
  status?: BlogPostStatus
  meta_title?: string
  meta_description?: string
  keywords?: string[]
  schema_markup?: Record<string, unknown>
  frontmatter?: Record<string, unknown>
}

/**
 * Get posts query parameters
 */
export interface GetPostsParams {
  brand_id?: string
  status_filter?: BlogPostStatus
  workflow_status?: string
  search?: string
  page?: number
  page_size?: number
}

/**
 * Blog service for managing blog posts
 */
export const blogService = {
  /**
   * Get paginated list of blog posts
   *
   * @example
   * ```ts
   * const result = await blogService.getPosts({ page: 1, page_size: 20, status_filter: 'published' })
   * console.log(result.posts)
   * ```
   */
  async getPosts(params?: GetPostsParams): Promise<BlogPostsResponse> {
    try {
      const response = await apiClient.get<BlogPostsResponse>('/v1/blog/posts', {
        params,
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch blog posts: ${getErrorMessage(error)}`)
    }
  },

  /**
   * Get single blog post by slug
   *
   * @example
   * ```ts
   * const post = await blogService.getPostBySlug('my-blog-post')
   * console.log(post.title)
   * ```
   */
  async getPostBySlug(slug: string): Promise<BlogPost> {
    try {
      const response = await apiClient.get<BlogPost>(`/v1/blog/posts/${slug}`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch post "${slug}": ${getErrorMessage(error)}`)
    }
  },

  /**
   * Get single blog post by ID
   *
   * @example
   * ```ts
   * const post = await blogService.getPostById('123e4567-e89b-12d3-a456-426614174000')
   * console.log(post.title)
   * ```
   */
  async getPostById(id: string): Promise<BlogPost> {
    try {
      const response = await apiClient.get<BlogPost>(`/v1/blog/posts/${id}`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch post with ID "${id}": ${getErrorMessage(error)}`)
    }
  },

  /**
   * Create new blog post
   *
   * @example
   * ```ts
   * const newPost = await blogService.createPost({
   *   title: 'My New Post',
   *   content: '# Hello World',
   *   status: 'draft'
   * })
   * console.log('Created post:', newPost.id)
   * ```
   */
  async createPost(data: BlogPostPayload): Promise<BlogPost> {
    try {
      const response = await apiClient.post<BlogPost>('/v1/blog/posts', data)
      return response.data
    } catch (error) {
      throw new Error(`Failed to create blog post: ${getErrorMessage(error)}`)
    }
  },

  /**
   * Update existing blog post
   *
   * @example
   * ```ts
   * const updated = await blogService.updatePost('post-id', {
   *   title: 'Updated Title',
   *   status: 'published'
   * })
   * console.log('Updated:', updated.title)
   * ```
   */
  async updatePost(
    id: string,
    data: Partial<BlogPostPayload>
  ): Promise<BlogPost> {
    try {
      const response = await apiClient.put<BlogPost>(
        `/v1/blog/posts/${id}`,
        data
      )
      return response.data
    } catch (error) {
      throw new Error(
        `Failed to update post "${id}": ${getErrorMessage(error)}`
      )
    }
  },

  /**
   * Delete blog post
   *
   * @example
   * ```ts
   * await blogService.deletePost('post-id')
   * console.log('Post deleted')
   * ```
   */
  async deletePost(id: string): Promise<void> {
    try {
      await apiClient.delete(`/v1/blog/posts/${id}`)
    } catch (error) {
      throw new Error(
        `Failed to delete post "${id}": ${getErrorMessage(error)}`
      )
    }
  },

  /**
   * Publish draft post
   *
   * @example
   * ```ts
   * const published = await blogService.publishPost('post-id')
   * console.log('Published:', published.status) // 'published'
   * ```
   */
  async publishPost(id: string): Promise<BlogPost> {
    try {
      const response = await apiClient.post<BlogPost>(
        `/v1/blog/posts/${id}/publish`
      )
      return response.data
    } catch (error) {
      throw new Error(
        `Failed to publish post "${id}": ${getErrorMessage(error)}`
      )
    }
  },
}
