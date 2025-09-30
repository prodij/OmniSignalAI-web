'use client'

import { BlogCard } from './BlogCard'
import { Grid, Text } from '@/lib/design-system/base-components'

interface BlogPost {
  title: string
  description: string
  slug: string
  slugAsParams: string
  datePublished: string
  readTime: number
  category: string
  tags?: string[]
  featured?: boolean
  thumbnail?: string
}

interface BlogListProps {
  posts: BlogPost[]
  featured?: boolean
  limit?: number
  className?: string
}

export function BlogList({ posts, featured = false, limit, className }: BlogListProps) {
  // Filter and limit posts
  let displayPosts = featured ? posts.filter((post) => post.featured) : posts

  if (limit) {
    displayPosts = displayPosts.slice(0, limit)
  }

  // Sort by date (newest first)
  displayPosts.sort((a, b) =>
    new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  )

  if (displayPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <Text size="lg" className="text-neutral-600 dark:text-neutral-400">
          No blog posts found.
        </Text>
      </div>
    )
  }

  return (
    <Grid
      cols={3}
      gap="lg"
      responsive={{ sm: 1, md: 2, lg: 3 }}
      className={className}
    >
      {displayPosts.map((post) => (
        <BlogCard
          key={post.slug}
          title={post.title}
          description={post.description}
          slug={post.slugAsParams}
          datePublished={post.datePublished}
          readTime={post.readTime}
          category={post.category}
          tags={post.tags}
          featured={post.featured}
          thumbnail={post.thumbnail}
        />
      ))}
    </Grid>
  )
}