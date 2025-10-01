'use client'

import { Container } from '@/lib/design-system/base-components'
import { cn } from '@/lib/design-system/utils'

interface BlogContentProps {
  children: React.ReactNode
  className?: string
}

/**
 * BlogContent - Optimized typography container for long-form reading
 *
 * Design principles (2025 research-backed):
 * - Reading column: 680px for text (65-75 chars/line)
 * - Full-width images: Can expand to 1000px
 * - Line height: 1.75 (research shows 1.5-1.7 optimal)
 * - Font size: 18px web standard
 * - Generous spacing: 1.75em between paragraphs
 * - Subtle emphasis: Underlines, not heavy bold
 *
 * Based on: Medium, Substack, Tailwind Typography best practices
 */
export function BlogContent({ children, className }: BlogContentProps) {
  return (
    <article className={cn('py-12 md:py-16 bg-white dark:bg-neutral-950', className)}>
      <Container>
        {/* Centered reading column - content naturally constrains to 680px via prose class */}
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          {children}
        </div>
      </Container>
    </article>
  )
}