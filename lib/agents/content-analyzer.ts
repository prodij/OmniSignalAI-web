/**
 * Content Analyzer
 * Extracts sections from blog posts and determines which sections need images
 */

export interface ContentSection {
  title: string
  content: string
  headingLevel: number
  needsImage: boolean
  existingImagePath?: string
  context: {
    precedingContent: string
    followingContent: string
  }
}

export interface ContentAnalysisResult {
  title: string
  description: string
  sections: ContentSection[]
  metadata: {
    category?: string
    tags?: string[]
    datePublished?: string
  }
}

/**
 * Analyzes MDX content and extracts sections with context
 */
export function analyzeContent(mdxContent: string, frontmatter: any): ContentAnalysisResult {
  const sections: ContentSection[] = []

  // Split content into lines
  const lines = mdxContent.split('\n')

  let currentSection: Partial<ContentSection> | null = null
  let currentContent: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Check if line is a heading (## or ###)
    const headingMatch = line.match(/^(#{2,3})\s+(.+)$/)

    if (headingMatch) {
      // Save previous section if exists
      if (currentSection && currentSection.title) {
        sections.push({
          ...currentSection,
          content: currentContent.join('\n').trim(),
          context: {
            precedingContent: getPrecedingContext(lines, i - currentContent.length - 1, 3),
            followingContent: getFollowingContext(lines, i, 3),
          },
        } as ContentSection)
      }

      // Start new section
      const headingLevel = headingMatch[1].length
      const title = headingMatch[2].trim()

      // Check if next line has an image
      const nextLine = lines[i + 1]
      const hasExistingImage = nextLine?.includes('![')
      const existingImagePath = hasExistingImage ? extractImagePath(nextLine) : undefined

      currentSection = {
        title,
        headingLevel,
        needsImage: !hasExistingImage, // Only needs image if none exists
        existingImagePath,
      }

      currentContent = []
    } else {
      // Add to current section content (skip image lines)
      if (!line.startsWith('![')) {
        currentContent.push(line)
      }
    }
  }

  // Save last section
  if (currentSection && currentSection.title) {
    sections.push({
      ...currentSection,
      content: currentContent.join('\n').trim(),
      context: {
        precedingContent: getPrecedingContext(lines, lines.length - currentContent.length - 1, 3),
        followingContent: '',
      },
    } as ContentSection)
  }

  return {
    title: frontmatter.title || 'Untitled',
    description: frontmatter.description || '',
    sections: sections.filter(s => s.needsImage && s.content.length > 50), // Only sections that need images and have substantial content
    metadata: {
      category: frontmatter.category,
      tags: frontmatter.tags,
      datePublished: frontmatter.datePublished,
    },
  }
}

/**
 * Generates image intent from section content
 */
export function generateImageIntent(
  section: ContentSection,
  blogTitle: string,
  blogDescription: string
): string {
  // Construct intent that includes context
  const intent = `Professional blog header image for section titled "${section.title}".

Blog context: ${blogTitle} - ${blogDescription}

Section content summary:
${section.content.substring(0, 500)}

${section.context.precedingContent ? `Previous context: ${section.context.precedingContent.substring(0, 200)}` : ''}

Style: Photorealistic, professional, modern, magazine-quality
Purpose: Blog section header that visually represents the content
Aspect ratio: 16:9 (blog header format)`

  return intent.trim()
}

function getPrecedingContext(lines: string[], startIdx: number, numLines: number): string {
  const start = Math.max(0, startIdx - numLines)
  return lines.slice(start, startIdx).join('\n').trim()
}

function getFollowingContext(lines: string[], startIdx: number, numLines: number): string {
  const end = Math.min(lines.length, startIdx + numLines)
  return lines.slice(startIdx + 1, end).join('\n').trim()
}

function extractImagePath(line: string): string | undefined {
  const match = line.match(/!\[.*?\]\((.+?)\)/)
  return match ? match[1] : undefined
}

/**
 * Parse frontmatter from MDX content
 */
export function parseFrontmatter(mdxContent: string): any {
  const frontmatterMatch = mdxContent.match(/^---\n([\s\S]+?)\n---/)
  if (!frontmatterMatch) return {}

  const frontmatterText = frontmatterMatch[1]
  const frontmatter: any = {}

  // Simple YAML parser for common fields
  const lines = frontmatterText.split('\n')
  let currentKey = ''

  for (const line of lines) {
    if (line.startsWith('  ')) {
      // Continuation of array or multiline string
      if (Array.isArray(frontmatter[currentKey])) {
        const match = line.match(/^\s+- (.+)$/)
        if (match) {
          frontmatter[currentKey].push(match[1])
        }
      } else if (typeof frontmatter[currentKey] === 'string') {
        frontmatter[currentKey] += ' ' + line.trim()
      }
    } else {
      const match = line.match(/^(\w+):\s*(.*)$/)
      if (match) {
        currentKey = match[1]
        const value = match[2].trim()

        if (value === '') {
          // Start of array or multiline string
          frontmatter[currentKey] = []
        } else if (value.startsWith("'") || value.startsWith('"')) {
          // Quoted string
          frontmatter[currentKey] = value.slice(1, -1)
        } else if (value === 'true' || value === 'false') {
          // Boolean
          frontmatter[currentKey] = value === 'true'
        } else {
          // Regular string or number
          frontmatter[currentKey] = isNaN(Number(value)) ? value : Number(value)
        }
      }
    }
  }

  return frontmatter
}

/**
 * Extract body content (without frontmatter)
 */
export function extractBodyContent(mdxContent: string): string {
  const frontmatterMatch = mdxContent.match(/^---\n[\s\S]+?\n---\n/)
  if (frontmatterMatch) {
    return mdxContent.slice(frontmatterMatch[0].length).trim()
  }
  return mdxContent
}
