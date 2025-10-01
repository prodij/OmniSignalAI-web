'use client'

import * as runtime from 'react/jsx-runtime'
import { BlogImage, BlogImageGrid } from './BlogImage'

interface MDXContentProps {
  code: string
}

const useMDXComponent = (code: string) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

/**
 * Custom MDX components for advanced features
 * Most styling is handled by Tailwind Typography (prose classes)
 */
const components = {
  // Custom components for advanced layouts
  BlogImage,
  BlogImageGrid,
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code)

  return (
    <div className="prose prose-lg dark:prose-dark max-w-none">
      <Component components={components} />
    </div>
  )
}
