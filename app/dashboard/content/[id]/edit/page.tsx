'use client'

/**
 * Post Editor Page
 *
 * Edit blog post content, metadata, and settings
 * - Loads post by ID
 * - Editable: title, slug, excerpt, content (MDX)
 * - Save changes to API
 * - Loading and error states
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { blogService } from '@/lib/api'
import type { BlogPost } from '@/lib/api/services/blog'
import { Button, Input, Textarea, Card, Heading, Text } from '@/lib/design-system'
import { Save, X, Eye } from 'lucide-react'

interface EditPostForm {
  title: string
  slug: string
  excerpt: string
  content: string
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditPostForm>()

  // Load post on mount
  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true)
        setError(null)
        const data = await blogService.getPostById(params.id)
        setPost(data)
        reset({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
        })
      } catch (err) {
        console.error('Failed to load post:', err)
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [params.id, reset])

  const onSubmit = async (data: EditPostForm) => {
    setSaving(true)
    setError(null)

    try {
      await blogService.updatePost(params.id, {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
      })

      // Refresh post data
      const updated = await blogService.getPostById(params.id)
      setPost(updated)
      reset({
        title: updated.title,
        slug: updated.slug,
        excerpt: updated.excerpt,
        content: updated.content,
      })

      // Navigate back to content manager
      router.push('/dashboard/content')
    } catch (err) {
      console.error('Failed to save:', err)
      setError(err instanceof Error ? err.message : 'Failed to save post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
          <Text className="text-gray-600 dark:text-gray-300">Loading post...</Text>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !post) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card padding="lg">
          <div className="text-center">
            <Text className="text-red-600 dark:text-red-400 mb-4">{error}</Text>
            <Button onClick={() => router.push('/dashboard/content')}>
              Back to Content
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!post) return null

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Heading as="h1" size="3xl" className="mb-2">
            Edit Post
          </Heading>
          <Text className="text-gray-600 dark:text-gray-300">
            Make changes to your blog post
          </Text>
        </div>
        {post.status === 'published' && (
          <a
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" leftIcon={<Eye className="w-4 h-4" />}>
              Preview
            </Button>
          </a>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <Text className="text-red-800 dark:text-red-200">{error}</Text>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
        <Card padding="lg" className="space-y-6">
          {/* Title */}
          <div>
            <Input
              label="Title"
              error={errors.title?.message}
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 5, message: 'Title must be at least 5 characters' },
              })}
            />
          </div>

          {/* Slug */}
          <div>
            <Input
              label="Slug (URL path)"
              error={errors.slug?.message}
              {...register('slug', {
                required: 'Slug is required',
                pattern: {
                  value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                  message: 'Slug must be lowercase letters, numbers, and hyphens only',
                },
              })}
            />
            <Text size="sm" className="text-gray-500 dark:text-gray-400 mt-1">
              URL: /blog/{register('slug').name}
            </Text>
          </div>

          {/* Excerpt */}
          <div>
            <Textarea
              label="Excerpt (short description)"
              rows={3}
              error={errors.excerpt?.message}
              {...register('excerpt')}
            />
          </div>

          {/* Content */}
          <div>
            <Textarea
              label="Content (MDX format)"
              rows={20}
              className="font-mono text-sm"
              error={errors.content?.message}
              {...register('content', {
                required: 'Content is required',
                minLength: { value: 50, message: 'Content must be at least 50 characters' },
              })}
            />
            <Text size="sm" className="text-gray-500 dark:text-gray-400 mt-1">
              Supports Markdown and MDX syntax
            </Text>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              loading={saving}
              disabled={!isDirty}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/content')}
              leftIcon={<X className="w-4 h-4" />}
            >
              Cancel
            </Button>
            {isDirty && (
              <Text size="sm" className="text-gray-500 dark:text-gray-400">
                You have unsaved changes
              </Text>
            )}
          </div>
        </Card>
      </form>
    </div>
  )
}
