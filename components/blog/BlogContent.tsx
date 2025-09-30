'use client'

import { Container } from '@/lib/design-system/base-components'
import { cn } from '@/lib/design-system/utils'

interface BlogContentProps {
  children: React.ReactNode
  className?: string
}

export function BlogContent({ children, className }: BlogContentProps) {
  return (
    <article className={cn('py-12 md:py-16', className)}>
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* MDX Content with Typography Styles */}
          <div
            className={cn(
              'prose prose-lg dark:prose-invert',
              'prose-headings:font-bold prose-headings:text-neutral-900 dark:prose-headings:text-neutral-100',
              'prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6',
              'prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4',
              'prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3',
              'prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-6',
              'prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline',
              'prose-strong:text-neutral-900 dark:prose-strong:text-neutral-100 prose-strong:font-semibold',
              'prose-code:text-brand-secondary prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
              'prose-pre:bg-neutral-900 dark:prose-pre:bg-neutral-950 prose-pre:border prose-pre:border-neutral-700',
              'prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6',
              'prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6',
              'prose-li:text-neutral-700 dark:prose-li:text-neutral-300 prose-li:mb-2',
              'prose-blockquote:border-l-4 prose-blockquote:border-brand-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-neutral-600 dark:prose-blockquote:text-neutral-400',
              'prose-table:w-full prose-table:border-collapse',
              'prose-th:bg-neutral-100 dark:prose-th:bg-neutral-800 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:border prose-th:border-neutral-300 dark:prose-th:border-neutral-700',
              'prose-td:p-3 prose-td:border prose-td:border-neutral-300 dark:prose-td:border-neutral-700',
              'prose-img:rounded-lg prose-img:shadow-md prose-img:my-8',
              'prose-hr:my-12 prose-hr:border-neutral-300 dark:prose-hr:border-neutral-700',
              'max-w-none'
            )}
          >
            {children}
          </div>
        </div>
      </Container>
    </article>
  )
}