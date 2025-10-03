/**
 * Content Manager Page
 *
 * Lists all blog posts with filtering, actions, and pagination
 */

import { blogService } from '@/lib/api'
import ContentTable from '@/components/dashboard/ContentTable'
import { Heading, Button, Text } from '@/lib/design-system'
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
  let hasError = false
  const result = await blogService.getPosts({
    page,
    page_size: 20,
    status_filter: status,
  }).catch((err) => {
    console.error('Failed to fetch posts:', err)
    hasError = true
    return {
      posts: [],
      pagination: { total: 0, page: 1, page_size: 20, total_pages: 0 },
    }
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Heading as="h1" size="3xl" className="mb-2">
            Content Manager
          </Heading>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your blog posts ({result.pagination.total} total)
          </p>
        </div>
        <Link href="/dashboard/generate">
          <Button leftIcon={<FilePlus className="w-4 h-4" />}>
            Generate New Post
          </Button>
        </Link>
      </div>

      {/* Error Alert */}
      {hasError && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <Text className="text-yellow-800 dark:text-yellow-200 font-medium mb-1">⚠️ Unable to connect to backend</Text>
          <Text size="sm" className="text-yellow-700 dark:text-yellow-300">
            Content will appear here once the backend is running. Start it with: <code className="px-1 py-0.5 bg-yellow-100 dark:bg-yellow-800 rounded">cd omnidraft && docker-compose up</code>
          </Text>
        </div>
      )}

      {/* Content Table */}
      <ContentTable posts={result.posts} pagination={result.pagination} />
    </div>
  )
}
