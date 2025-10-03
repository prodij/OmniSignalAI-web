/**
 * Dashboard Overview Page
 *
 * Shows content statistics and recent activity
 */

import { blogService } from '@/lib/api'
import { Card, Heading, Text, Grid } from '@/lib/design-system'
import { FileText, FilePlus, Archive, CheckCircle } from 'lucide-react'

export default async function DashboardPage() {
  // Fetch posts for statistics
  let hasError = false
  const result = await blogService.getPosts({ page: 1, page_size: 100 }).catch((err) => {
    console.error('Failed to fetch posts:', err)
    hasError = true
    return {
      posts: [],
      pagination: { total: 0, page: 1, page_size: 100, total_pages: 0 },
    }
  })

  const stats = {
    total: result.pagination.total,
    drafts: result.posts.filter((p) => p.status === 'draft').length,
    published: result.posts.filter((p) => p.status === 'published').length,
    archived: result.posts.filter((p) => p.status === 'archived').length,
  }

  const statCards = [
    {
      label: 'Total Posts',
      value: stats.total,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Drafts',
      value: stats.drafts,
      icon: FilePlus,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Published',
      value: stats.published,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Archived',
      value: stats.archived,
      icon: Archive,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <Heading as="h1" size="3xl" className="mb-2">
          Content Cockpit
        </Heading>
        <Text size="lg" className="text-gray-600 dark:text-gray-300">
          Manage your blog content powered by AI
        </Text>
      </div>

      {/* Error Alert */}
      {hasError && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <Text className="text-yellow-800 dark:text-yellow-200 font-medium mb-1">⚠️ Unable to connect to backend</Text>
          <Text size="sm" className="text-yellow-700 dark:text-yellow-300">
            Make sure the omnidraft backend is running at{' '}
            <code className="px-1 py-0.5 bg-yellow-100 dark:bg-yellow-800 rounded">
              {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}
            </code>
          </Text>
        </div>
      )}

      {/* Statistics Grid */}
      <Grid cols={4} gap="lg" className="mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <Text size="sm" className="text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </Text>
                  <Text size="3xl" className="font-bold">
                    {stat.value}
                  </Text>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} dark:bg-opacity-20`}>
                  <Icon className={`w-6 h-6 ${stat.color} dark:brightness-125`} />
                </div>
              </div>
            </Card>
          )
        })}
      </Grid>

      {/* Quick Actions */}
      <Card padding="lg">
        <Heading as="h2" size="xl" className="mb-4">
          Quick Actions
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/dashboard/generate"
            className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group"
          >
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
              <FilePlus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <Text className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                Generate New Content
              </Text>
              <Text size="sm" className="text-gray-600 dark:text-gray-400">
                Use AI to create blog posts
              </Text>
            </div>
          </a>

          <a
            href="/dashboard/content"
            className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group"
          >
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
              <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <Text className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                Manage Content
              </Text>
              <Text size="sm" className="text-gray-600 dark:text-gray-400">
                View and edit all posts
              </Text>
            </div>
          </a>
        </div>
      </Card>
    </div>
  )
}
