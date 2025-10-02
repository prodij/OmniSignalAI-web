'use client'

import { FC, ReactNode } from 'react'
import * as DesignSystem from '@/lib/design-system'
import * as MarketingComponents from '@/components/marketing'

// Combine all available components into one map
const COMPONENT_MAP = {
  ...DesignSystem,
  ...MarketingComponents,
} as const

interface Block {
  component: string
  props?: { [key: string]: any }
  children?: (Block | string)[]
}

interface PageBuilderProps {
  blocks: Block[]
}

const renderBlock = (block: Block | string, key: number): ReactNode => {
  // If it's a string, just return text
  if (typeof block === 'string') {
    return block
  }

  const Component = COMPONENT_MAP[block.component as keyof typeof COMPONENT_MAP] as FC<any>

  if (!Component) {
    console.warn(`Component "${block.component}" not found in COMPONENT_MAP.`)
    return null
  }

  // Recursively render children if they exist
  const children = block.children
    ? block.children.map((child, idx) => renderBlock(child, idx))
    : undefined

  return (
    <Component key={key} {...(block.props || {})}>
      {children}
    </Component>
  )
}

export const PageBuilder: FC<PageBuilderProps> = ({ blocks }) => {
  return <>{blocks.map((block, idx) => renderBlock(block, idx))}</>
}
