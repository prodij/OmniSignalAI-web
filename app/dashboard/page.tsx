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
  const result = await blogService.getPosts({ page: 1, page_size: 100 }).catch(() => ({
    posts: [],
    pagination: { total: 0, page: 1, page_size: 100, total_pages: 0 },
  }))

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
        <Text size="lg" className="text-gray-600">
          Manage your blog content powered by AI
        </Text>
      </div>

      {/* Statistics Grid */}
      <Grid cols={4} gap="lg" className="mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <Text size="sm" className="text-gray-600 mb-1">
                    {stat.label}
                  </Text>
                  <Text size="3xl" className="font-bold">
                    {stat.value}
                  </Text>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
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
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
          >
            <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
              <FilePlus className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <Text className="font-semibold text-gray-900 group-hover:text-indigo-700">
                Generate New Content
              </Text>
              <Text size="sm" className="text-gray-600">
                Use AI to create blog posts
              </Text>
            </div>
          </a>

          <a
            href="/dashboard/content"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
          >
            <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <Text className="font-semibold text-gray-900 group-hover:text-indigo-700">
                Manage Content
              </Text>
              <Text size="sm" className="text-gray-600">
                View and edit all posts
              </Text>
            </div>
          </a>
        </div>
      </Card>
    </div>
  )
}
