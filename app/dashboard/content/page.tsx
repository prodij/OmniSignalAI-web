/**
 * Content Manager Page
 *
 * Lists all blog posts with filtering, actions, and pagination
 */

import { blogService } from '@/lib/api'
import ContentTable from '@/components/dashboard/ContentTable'
import { Heading, Button } from '@/lib/design-system'
import { FilePlus } from 'lucide-react'
import Link from 'next/link'

interface ContentPageProps {
  searchParams: {
    page?: string
    status?: string
  }
}

export default async function ContentPage({ searchParams }: ContentPageProps) {
  const page = Number(searchParams.page) || 1
  const status = searchParams.status as 'draft' | 'published' | 'archived' | undefined

  // Fetch posts from API
  const result = await blogService.getPosts({
    page,
    page_size: 20,
    status_filter: status,
  }).catch(() => ({
    posts: [],
    pagination: { total: 0, page: 1, page_size: 20, total_pages: 0 },
  }))

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading as="h1" size="3xl" className="mb-2">
            Content Manager
          </Heading>
          <p className="text-gray-600">
            Manage your blog posts ({result.pagination.total} total)
          </p>
        </div>
        <Link href="/dashboard/generate">
          <Button leftIcon={<FilePlus className="w-4 h-4" />}>
            Generate New Post
          </Button>
        </Link>
      </div>

      {/* Content Table */}
      <ContentTable posts={result.posts} pagination={result.pagination} />
    </div>
  )
}
