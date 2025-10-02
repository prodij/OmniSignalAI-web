/**
 * AI Agent SDK - Type Definitions
 *
 * TypeScript interfaces for AI agents to interact with the OmniSignalAI platform.
 */

/**
 * Result type for SDK operations
 */
export interface SDKResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Component metadata for AI agents
 */
export interface ComponentMetadata {
  name: string
  description?: string
  props?: string[]
  category?: 'layout' | 'content' | 'marketing' | 'design-system'
  examples?: Array<{
    description: string
    props: Record<string, any>
  }>
}

/**
 * Page block definition for PageBuilder
 */
export interface PageBlock {
  component: string
  props?: Record<string, any>
  children?: (PageBlock | string)[]
}

/**
 * Page frontmatter definition
 */
export interface PageFrontmatter {
  title: string
  description?: string
  datePublished?: string
  dateModified?: string
  author?: {
    name: string
    url: string
    image?: string
  }
  keywords?: string[]
  category?: 'Guides' | 'Case Studies' | 'Research' | 'Technical' | 'News'
  tags?: string[]
  featured?: boolean
  schema?: 'Article' | 'HowTo' | 'FAQPage'
  faq?: Array<{
    q: string
    a: string
  }>
  steps?: Array<{
    name: string
    description: string
    image?: string
  }>
  thumbnail?: string
  draft?: boolean
  published?: boolean
  layout?: 'default' | 'builder'
  blocks?: PageBlock[]
  [key: string]: any
}

/**
 * Page data structure
 */
export interface PageData {
  frontmatter: PageFrontmatter
  content: string
  slug?: string
  filePath?: string
}

/**
 * Save page options
 */
export interface SavePageOptions {
  slug: string
  frontmatter: PageFrontmatter
  markdownContent?: string
  overwrite?: boolean
}

/**
 * List components options
 */
export interface ListComponentsOptions {
  category?: ComponentMetadata['category']
  includeExamples?: boolean
}
