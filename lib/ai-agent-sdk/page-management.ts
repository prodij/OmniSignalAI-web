/**
 * AI Agent SDK - Core Functions
 *
 * Provides AI agents with tools to manage pages, discover components, and generate media.
 */

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import type {
  SDKResult,
  PageFrontmatter,
  PageData,
  SavePageOptions,
  ComponentMetadata,
  ListComponentsOptions,
} from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const BLOG_DIR = path.join(CONTENT_DIR, 'blog')

/**
 * Creates or updates a page (MDX file).
 *
 * @param options - Page creation options
 * @returns Result with file path
 *
 * @example
 * ```typescript
 * const result = await savePage({
 *   slug: 'blog/my-new-post',
 *   frontmatter: {
 *     title: 'My New Post',
 *     description: 'An AI-generated blog post',
 *     datePublished: new Date().toISOString(),
 *     layout: 'builder',
 *     blocks: [
 *       { component: 'HeroSection', props: { title: 'Hello World' } }
 *     ]
 *   },
 *   markdownContent: 'Optional additional content'
 * });
 * ```
 */
export async function savePage(
  options: SavePageOptions
): Promise<SDKResult<{ path: string }>> {
  try {
    const { slug, frontmatter, markdownContent = '', overwrite = false } = options

    // Ensure slug is valid
    if (!slug || slug.trim() === '') {
      return { success: false, error: 'Slug is required' }
    }

    // Determine file path
    let filePath: string
    if (slug.startsWith('blog/')) {
      filePath = path.join(BLOG_DIR, `${slug.replace('blog/', '')}.mdx`)
    } else {
      filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
    }

    // Check if file exists and overwrite is false
    if (!overwrite) {
      try {
        await fs.access(filePath)
        return {
          success: false,
          error: `File already exists: ${slug}. Set overwrite: true to update.`,
        }
      } catch {
        // File doesn't exist, which is what we want
      }
    }

    // Ensure directory exists
    const dir = path.dirname(filePath)
    await fs.mkdir(dir, { recursive: true })

    // Generate MDX content with frontmatter
    const fileContent = matter.stringify(markdownContent, frontmatter)

    // Write file
    await fs.writeFile(filePath, fileContent, 'utf-8')

    return {
      success: true,
      data: { path: filePath },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Reads a page's structured data.
 *
 * @param slug - Page slug (e.g., 'blog/my-post')
 * @returns Result with page data
 *
 * @example
 * ```typescript
 * const result = await getPage('blog/my-post');
 * if (result.success) {
 *   console.log(result.data.frontmatter.title);
 *   console.log(result.data.content);
 * }
 * ```
 */
export async function getPage(slug: string): Promise<SDKResult<PageData>> {
  try {
    // Determine file path
    let filePath: string
    if (slug.startsWith('blog/')) {
      filePath = path.join(BLOG_DIR, `${slug.replace('blog/', '')}.mdx`)
    } else {
      filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
    }

    // Read file
    const fileContent = await fs.readFile(filePath, 'utf-8')

    // Parse frontmatter
    const { data: frontmatter, content } = matter(fileContent)

    return {
      success: true,
      data: {
        frontmatter: frontmatter as PageFrontmatter,
        content,
        slug,
        filePath,
      },
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : `Page not found: ${slug}`,
    }
  }
}

/**
 * Lists all available components for AI agents to use.
 *
 * @param options - Filtering options
 * @returns Result with component metadata
 *
 * @example
 * ```typescript
 * const result = await listAvailableComponents({ includeExamples: true });
 * if (result.success) {
 *   result.data.forEach(component => {
 *     console.log(component.name, component.props);
 *   });
 * }
 * ```
 */
export async function listAvailableComponents(
  options: ListComponentsOptions = {}
): Promise<SDKResult<ComponentMetadata[]>> {
  try {
    const { category, includeExamples = false } = options

    const allComponents: ComponentMetadata[] = [
      // Layout Components
      {
        name: 'Section',
        description: 'Page sections with variant support',
        category: 'layout',
        props: ['variant', 'padding', 'className', 'children'],
        examples: includeExamples
          ? [
              {
                description: 'Light background section',
                props: { variant: 'light' },
              },
              {
                description: 'Dark background section',
                props: { variant: 'dark' },
              },
            ]
          : undefined,
      },
      {
        name: 'Container',
        description: 'Content containers with max-width',
        category: 'layout',
        props: ['maxWidth', 'padding', 'className', 'children'],
        examples: includeExamples
          ? [
              {
                description: 'Standard content container',
                props: { maxWidth: 'default' },
              },
            ]
          : undefined,
      },
      {
        name: 'Grid',
        description: 'Responsive grid layouts',
        category: 'layout',
        props: ['cols', 'gap', 'className', 'children'],
        examples: includeExamples
          ? [
              {
                description: '3-column grid',
                props: { cols: 3, gap: 6 },
              },
            ]
          : undefined,
      },
      {
        name: 'ContentSection',
        description: 'Semantic content areas',
        category: 'layout',
        props: ['className', 'children'],
      },

      // Base Components
      {
        name: 'Button',
        description: 'Call-to-action buttons',
        category: 'design-system',
        props: ['variant', 'size', 'loading', 'children', 'onClick'],
        examples: includeExamples
          ? [
              {
                description: 'Primary CTA button',
                props: { variant: 'primary', children: 'Get Started' },
              },
            ]
          : undefined,
      },
      {
        name: 'Card',
        description: 'Content cards',
        category: 'content',
        props: ['title', 'variant', 'padding', 'className', 'children'],
        examples: includeExamples
          ? [
              {
                description: 'Feature card',
                props: { title: 'Feature Name', variant: 'outline' },
              },
            ]
          : undefined,
      },
      {
        name: 'Badge',
        description: 'Status badges',
        category: 'design-system',
        props: ['variant', 'size', 'children'],
      },
      {
        name: 'Heading',
        description: 'Typography headings',
        category: 'design-system',
        props: ['level', 'size', 'align', 'weight', 'className', 'children'],
        examples: includeExamples
          ? [
              {
                description: 'Large centered heading',
                props: { level: 2, size: '3xl', align: 'center' },
              },
            ]
          : undefined,
      },
      {
        name: 'Text',
        description: 'Body text with variants',
        category: 'design-system',
        props: ['size', 'weight', 'color', 'align', 'className', 'children'],
      },

      // Marketing Components
      {
        name: 'HeroSection',
        description: 'Hero banners for pages',
        category: 'marketing',
        props: [],
        examples: includeExamples
          ? [
              {
                description: 'Standard hero section',
                props: {},
              },
            ]
          : undefined,
      },
      {
        name: 'PricingSection',
        description: 'Pricing tables',
        category: 'marketing',
        props: [],
      },
      {
        name: 'SocialProofSection',
        description: 'Testimonials and social proof',
        category: 'marketing',
        props: [],
      },
      {
        name: 'HowItWorksSection',
        description: 'Process explanations',
        category: 'marketing',
        props: [],
      },
      {
        name: 'BenefitsSection',
        description: 'Feature highlights',
        category: 'marketing',
        props: [],
      },
      {
        name: 'ProblemSection',
        description: 'Problem agitation section',
        category: 'marketing',
        props: [],
      },
      {
        name: 'SolutionSection',
        description: 'Solution demonstration',
        category: 'marketing',
        props: [],
      },
      {
        name: 'FinalCTASection',
        description: 'Final call-to-action',
        category: 'marketing',
        props: [],
      },
      {
        name: 'TrustBar',
        description: 'Trust signals bar',
        category: 'marketing',
        props: [],
      },
      {
        name: 'IntegrationPartners',
        description: 'Integration partners showcase',
        category: 'marketing',
        props: [],
      },
    ]

    // Filter by category if specified
    const filteredComponents = category
      ? allComponents.filter((c) => c.category === category)
      : allComponents

    return {
      success: true,
      data: filteredComponents,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Lists all existing pages in the content directory.
 *
 * @param directory - Directory to list (default: 'blog')
 * @returns Result with page slugs
 *
 * @example
 * ```typescript
 * const result = await listPages('blog');
 * if (result.success) {
 *   console.log('Available posts:', result.data);
 * }
 * ```
 */
export async function listPages(
  directory: string = 'blog'
): Promise<SDKResult<string[]>> {
  try {
    const targetDir = path.join(CONTENT_DIR, directory)
    const files = await fs.readdir(targetDir)

    const mdxFiles = files
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => `${directory}/${file.replace('.mdx', '')}`)

    return {
      success: true,
      data: mdxFiles,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Deletes a page.
 *
 * @param slug - Page slug to delete
 * @returns Result
 *
 * @example
 * ```typescript
 * const result = await deletePage('blog/old-post');
 * ```
 */
export async function deletePage(slug: string): Promise<SDKResult> {
  try {
    // Determine file path
    let filePath: string
    if (slug.startsWith('blog/')) {
      filePath = path.join(BLOG_DIR, `${slug.replace('blog/', '')}.mdx`)
    } else {
      filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
    }

    await fs.unlink(filePath)

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
