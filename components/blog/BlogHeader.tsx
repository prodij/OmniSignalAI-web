'use client'

import { Heading, Text, Badge } from '@/lib/design-system/base-components'
import { Container } from '@/lib/design-system/base-components'
import { Clock, Calendar, User } from 'lucide-react'
import { cn } from '@/lib/design-system/utils'

interface BlogHeaderProps {
  title: string
  description?: string
  datePublished: string
  dateModified?: string
  readTime: number
  category: string
  tags?: string[]
  author?: {
    name: string
    url?: string
    image?: string
  }
  className?: string
}

export function BlogHeader({
  title,
  description,
  datePublished,
  dateModified,
  readTime,
  category,
  tags,
  author,
  className,
}: BlogHeaderProps) {
  const formattedDate = new Date(datePublished).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const formattedModifiedDate = dateModified
    ? new Date(dateModified).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <header className={cn('py-12 md:py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800', className)}>
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Category Badge */}
          <div className="mb-6">
            <Badge variant="default" size="md">
              {category}
            </Badge>
          </div>

          {/* Title */}
          <Heading as="h1" size="5xl" className="mb-6 text-4xl md:text-5xl lg:text-6xl">
            {title}
          </Heading>

          {/* Description */}
          {description && (
            <Text size="xl" className="mb-8 text-neutral-700 dark:text-neutral-300">
              {description}
            </Text>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-neutral-300 dark:border-neutral-700">
            {/* Author */}
            {author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                <Text size="sm" className="text-neutral-700 dark:text-neutral-300">
                  {author.name}
                </Text>
              </div>
            )}

            {/* Published Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              <Text size="sm" className="text-neutral-700 dark:text-neutral-300">
                {formattedDate}
              </Text>
            </div>

            {/* Modified Date */}
            {formattedModifiedDate && (
              <Text size="sm" className="text-neutral-600 dark:text-neutral-400">
                Updated {formattedModifiedDate}
              </Text>
            )}

            {/* Read Time */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              <Text size="sm" className="text-neutral-700 dark:text-neutral-300">
                {readTime} min read
              </Text>
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Container>
    </header>
  )
}