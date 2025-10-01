'use client'

import Image from 'next/image'
import { cn } from '@/lib/design-system/utils'

type ImageLayout = 'full' | 'inset' | 'float-right' | 'grid'
type AspectRatio = '16:9' | '4:3' | '1:1' | 'auto'

interface BlogImageProps {
  src: string
  alt: string
  caption?: string
  layout?: ImageLayout
  aspectRatio?: AspectRatio
  priority?: boolean
  className?: string
}

const aspectRatioClasses = {
  '16:9': 'aspect-[16/9]',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  'auto': '',
}

const layoutClasses = {
  full: 'w-full max-w-[1000px] mx-auto my-12',
  inset: 'w-full max-w-[680px] mx-auto my-10',
  'float-right': 'float-right ml-6 mb-6 w-[400px] max-w-[45%]',
  grid: 'w-full max-w-[680px] mx-auto my-10',
}

export function BlogImage({
  src,
  alt,
  caption,
  layout = 'inset',
  aspectRatio = '16:9',
  priority = false,
  className,
}: BlogImageProps) {
  const containerClasses = cn(
    'relative overflow-hidden rounded-lg',
    layoutClasses[layout],
    aspectRatioClasses[aspectRatio],
    className
  )

  return (
    <figure className={cn('blog-image', layout === 'float-right' && 'clear-none')}>
      <div className={containerClasses}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes={
            layout === 'full'
              ? '(max-width: 1000px) 100vw, 1000px'
              : layout === 'float-right'
              ? '(max-width: 768px) 100vw, 400px'
              : '(max-width: 680px) 100vw, 680px'
          }
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-neutral-600 dark:text-neutral-400 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * Grid layout for side-by-side images (comparison shots, before/after, etc.)
 */
interface BlogImageGridProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  columns?: 2 | 3
  className?: string
}

export function BlogImageGrid({ images, columns = 2, className }: BlogImageGridProps) {
  return (
    <div
      className={cn(
        'grid gap-6 my-10 w-full max-w-[1000px] mx-auto',
        columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3',
        className
      )}
    >
      {images.map((image, idx) => (
        <figure key={idx}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1000px) 50vw, 500px"
            />
          </div>
          {image.caption && (
            <figcaption className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400 italic">
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}
