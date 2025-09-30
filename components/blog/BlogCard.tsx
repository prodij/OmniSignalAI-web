'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/lib/design-system/base-components'
import { Badge } from '@/lib/design-system/base-components'
import { Text } from '@/lib/design-system/base-components'
import { cn } from '@/lib/design-system/utils'
import { Clock, Calendar } from 'lucide-react'

interface BlogCardProps {
  title: string
  description: string
  slug: string
  datePublished: string
  readTime: number
  category: string
  tags?: string[]
  featured?: boolean
  thumbnail?: string
  className?: string
}

export function BlogCard({
  title,
  description,
  slug,
  datePublished,
  readTime,
  category,
  tags,
  featured = false,
  thumbnail,
  className,
}: BlogCardProps) {
  const formattedDate = new Date(datePublished).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link href={`/blog/${slug}`} className="block group">
      <Card
        variant={featured ? 'bordered' : 'default'}
        padding="none"
        interactive
        className={cn(
          'h-full flex flex-col overflow-hidden transition-all duration-300',
          featured && 'border-2 border-brand-primary',
          className
        )}
      >
        {/* Thumbnail Image */}
        {thumbnail && (
          <div className="relative w-full h-48 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Overlay gradient for better badge visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />

            {/* Header with category and featured badge - overlaid on image */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <Badge variant="default" size="sm" className="bg-white/90 backdrop-blur-sm">
                {category}
              </Badge>
              {featured && (
                <Badge variant="success" size="sm" className="bg-white/90 backdrop-blur-sm">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Header with category and featured badge (shown when no thumbnail) */}
          {!thumbnail && (
            <div className="flex items-center justify-between mb-4">
              <Badge variant="default" size="sm">
                {category}
              </Badge>
              {featured && (
                <Badge variant="success" size="sm">
                  Featured
                </Badge>
              )}
            </div>
          )}

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100 group-hover:text-brand-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        <Text size="base" className="mb-4 flex-grow text-neutral-700 dark:text-neutral-300 line-clamp-3">
          {description}
        </Text>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs px-2 py-1 text-neutral-500">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer with meta info */}
        <div className="flex items-center gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
            <Clock className="w-4 h-4" />
            <span>{readTime} min read</span>
          </div>
        </div>

          {/* Read more indicator */}
          <div className="mt-4 text-brand-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
            Read article →
          </div>
        </div>
      </Card>
    </Link>
  )
}