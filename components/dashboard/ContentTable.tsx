'use client'

/**
 * Content Table Component
 *
 * Displays blog posts in a table with actions:
 * - Publish drafts
 * - Edit posts
 * - Delete posts
 * - Pagination
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { blogService } from '@/lib/api'
import type { BlogPost } from '@/lib/api/services/blog'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
  Button,
  Badge,
} from '@/lib/design-system'
import { Edit, Trash2, CheckCircle, ExternalLink } from 'lucide-react'

interface ContentTableProps {
  posts: BlogPost[]
  pagination: {
    total: number
    page: number
    page_size: number
    total_pages: number
  }
}

export default function ContentTable({ posts, pagination }: ContentTableProps) {
  const router = useRouter()
  const [publishing, setPublishing] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handlePublish = async (postId: string) => {
    setPublishing(postId)
    try {
      await blogService.publishPost(postId)
      router.refresh() // Refresh to show updated status
    } catch (error) {
      console.error('Failed to publish:', error)
      alert('Failed to publish post. Please try again.')
    } finally {
      setPublishing(null)
    }
  }

  const handleDelete = async (postId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    setDeleting(postId)
    try {
      await blogService.deletePost(postId)
      router.refresh()
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Failed to delete post. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const handlePageChange = (newPage: number) => {
    router.push(`/dashboard/content?page=${newPage}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Published</Badge>
      case 'draft':
        return <Badge variant="warning">Draft</Badge>
      case 'archived':
        return <Badge variant="default">Archived</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-600 mb-4">No posts found</p>
        <Button onClick={() => router.push('/dashboard/generate')}>
          Generate Your First Post
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              {/* Title & Slug */}
              <TableCell>
                <div className="max-w-md">
                  <div className="font-medium text-gray-900 truncate">{post.title}</div>
                  <div className="text-sm text-gray-500 truncate">{post.slug}</div>
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>{getStatusBadge(post.status)}</TableCell>

              {/* Updated Date */}
              <TableCell>
                <div className="text-sm text-gray-600">
                  {new Date(post.updated_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex items-center justify-end space-x-2">
                  {/* Publish Button (only for drafts) */}
                  {post.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => handlePublish(post.id)}
                      loading={publishing === post.id}
                      leftIcon={<CheckCircle className="w-3 h-3" />}
                    >
                      Publish
                    </Button>
                  )}

                  {/* View Button (only for published) */}
                  {post.status === 'published' && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<ExternalLink className="w-3 h-3" />}
                      >
                        View
                      </Button>
                    </a>
                  )}

                  {/* Edit Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/content/${post.id}/edit`)}
                    leftIcon={<Edit className="w-3 h-3" />}
                  >
                    Edit
                  </Button>

                  {/* Delete Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(post.id, post.title)}
                    loading={deleting === post.id}
                    leftIcon={<Trash2 className="w-3 h-3" />}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <TablePagination
        currentPage={pagination.page}
        totalPages={pagination.total_pages}
        totalItems={pagination.total}
        itemsPerPage={pagination.page_size}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
