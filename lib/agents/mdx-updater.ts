/**
 * MDX Content Updater Agent
 * Intelligently inserts images into MDX blog posts at appropriate locations
 * with smart placement logic and layout optimization
 */

export type ImageLayout = 'full' | 'inset' | 'float-right' | 'grid'
export type InsertionPoint = 'after-intro' | 'mid-section' | 'after-heading' | 'before-list'

export interface ImageInsertion {
  sectionTitle: string
  imageUrl: string
  imagePath: string
  altText: string
  approved: boolean
  layout?: ImageLayout
  caption?: string
}

export interface MDXUpdateResult {
  success: boolean
  updatedContent: string
  originalContent: string
  insertionsMade: number
  error?: string
  backupPath?: string
}

/**
 * Analyzes section content structure to determine optimal image placement
 */
interface ContentAnalysis {
  hasIntroParagraph: boolean
  firstParagraphIndex: number
  hasLists: boolean
  firstListIndex: number
  sectionLength: number
  contentType: 'short' | 'medium' | 'long'
}

function analyzeSection(lines: string[], startIndex: number, endIndex: number): ContentAnalysis {
  let firstParagraphIndex = -1
  let firstListIndex = -1
  let paragraphCount = 0

  for (let i = startIndex; i < endIndex; i++) {
    const line = lines[i].trim()

    // Find first paragraph
    if (firstParagraphIndex === -1 && line.length > 0 && !line.startsWith('#') && !line.startsWith('!') && !line.startsWith('-') && !line.startsWith('*')) {
      firstParagraphIndex = i
    }

    // Count paragraphs
    if (line.length > 0 && !line.startsWith('#') && !line.startsWith('!')) {
      paragraphCount++
    }

    // Find first list
    if (firstListIndex === -1 && (line.startsWith('- ') || line.startsWith('* ') || line.match(/^\d+\./))) {
      firstListIndex = i
    }
  }

  const sectionLength = endIndex - startIndex
  const contentType = sectionLength < 5 ? 'short' : sectionLength < 15 ? 'medium' : 'long'

  return {
    hasIntroParagraph: firstParagraphIndex !== -1,
    firstParagraphIndex,
    hasLists: firstListIndex !== -1,
    firstListIndex,
    sectionLength,
    contentType,
  }
}

/**
 * Intelligently finds the best insertion point for an image based on content structure
 *
 * Strategy:
 * 1. After intro paragraph (preferred) - Establishes context before showing image
 * 2. Mid-section for long content - Breaks up text walls
 * 3. Before lists - Visual break between prose and structured content
 * 4. After heading (fallback) - Only if no better option exists
 */
function findInsertionPoint(lines: string[], sectionTitle: string): number {
  // Find the heading line
  let headingIndex = -1
  let nextHeadingIndex = lines.length

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const headingMatch = line.match(/^(#{2,3})\s+(.+)$/)

    if (headingMatch) {
      const titleText = headingMatch[2].trim()
      const normalizedLine = titleText.toLowerCase().replace(/[^a-z0-9\s]/g, '')
      const normalizedSection = sectionTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '')

      if (normalizedLine === normalizedSection || normalizedLine.includes(normalizedSection)) {
        headingIndex = i

        // Find next heading to determine section bounds
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].match(/^#{2,3}\s+/)) {
            nextHeadingIndex = j
            break
          }
        }
        break
      }
    }
  }

  if (headingIndex === -1) {
    return -1 // Section not found
  }

  // Check if image already exists immediately after heading
  const nextLine = lines[headingIndex + 1]
  if (nextLine && (nextLine.startsWith('![') || nextLine.startsWith('<BlogImage'))) {
    return headingIndex + 1 // Replace existing image
  }

  // Analyze section content
  const analysis = analyzeSection(lines, headingIndex + 1, nextHeadingIndex)

  // Strategy 1: After intro paragraph (skip empty lines)
  if (analysis.hasIntroParagraph && analysis.firstParagraphIndex !== -1) {
    // Find end of first paragraph (next empty line or list)
    let insertPos = analysis.firstParagraphIndex
    for (let i = analysis.firstParagraphIndex; i < nextHeadingIndex; i++) {
      if (lines[i].trim() === '' || lines[i].startsWith('-') || lines[i].startsWith('*') || lines[i].match(/^\d+\./)) {
        insertPos = i
        break
      }
      insertPos = i + 1
    }

    // Skip any empty lines
    while (insertPos < lines.length && lines[insertPos].trim() === '') {
      insertPos++
    }

    return insertPos
  }

  // Strategy 2: Before first list (if exists and section is medium+)
  if (analysis.hasLists && analysis.contentType !== 'short') {
    return analysis.firstListIndex
  }

  // Strategy 3: Fallback - after heading with proper spacing
  let insertPos = headingIndex + 1
  if (lines[insertPos] === '') {
    insertPos = headingIndex + 2
  }

  return insertPos
}

/**
 * Suggests optimal layout based on section content type
 */
function suggestLayout(sectionTitle: string, sectionContent: string): ImageLayout {
  const title = sectionTitle.toLowerCase()
  const content = sectionContent.toLowerCase()

  // Full-width layouts for hero/overview sections
  if (
    title.includes('introduction') ||
    title.includes('overview') ||
    title.includes('getting started') ||
    title.includes('quick answer')
  ) {
    return 'full'
  }

  // Float-right for short explanatory sections or step details
  if (
    content.length < 300 ||
    title.includes('tip') ||
    title.includes('note') ||
    title.includes('example')
  ) {
    return 'float-right'
  }

  // Grid for comparison sections
  if (
    title.includes('vs') ||
    title.includes('compare') ||
    title.includes('before') ||
    title.includes('after') ||
    title.includes('options')
  ) {
    return 'grid'
  }

  // Default to inset for standard content
  return 'inset'
}

/**
 * Creates an image markdown line or component with proper formatting and layout
 */
function createImageLine(insertion: ImageInsertion): string {
  const altText = insertion.altText || insertion.sectionTitle
  const layout = insertion.layout || 'inset'
  const caption = insertion.caption || ''

  // Use simple markdown for basic layouts without captions
  if (layout === 'inset' && !caption) {
    return `![${altText}](${insertion.imagePath})`
  }

  // Use BlogImage component for advanced layouts
  const propsArray = [
    `src="${insertion.imagePath}"`,
    `alt="${altText}"`,
    layout !== 'inset' ? `layout="${layout}"` : '',
    caption ? `caption="${caption}"` : '',
  ].filter(Boolean)

  return `<BlogImage ${propsArray.join(' ')} />`
}

/**
 * Updates MDX content with approved images
 */
export function updateMDXWithImages(
  mdxContent: string,
  insertions: ImageInsertion[]
): MDXUpdateResult {
  try {
    const lines = mdxContent.split('\n')
    const approvedInsertions = insertions.filter(i => i.approved)

    if (approvedInsertions.length === 0) {
      return {
        success: false,
        updatedContent: mdxContent,
        originalContent: mdxContent,
        insertionsMade: 0,
        error: 'No approved images to insert',
      }
    }

    let insertionsMade = 0
    const processedLines = [...lines]

    // Track offset caused by insertions
    let lineOffset = 0

    // Process each approved insertion
    for (const insertion of approvedInsertions) {
      const insertionPoint = findInsertionPoint(processedLines, insertion.sectionTitle)

      if (insertionPoint === -1) {
        console.warn(`Section not found: "${insertion.sectionTitle}"`)
        continue
      }

      const imageLine = createImageLine(insertion)

      // Check if we're replacing an existing image
      if (processedLines[insertionPoint]?.startsWith('![')) {
        // Replace existing image
        processedLines[insertionPoint] = imageLine
        console.log(`Replaced image in section: "${insertion.sectionTitle}"`)
      } else {
        // Insert new image
        processedLines.splice(insertionPoint + lineOffset, 0, imageLine, '') // Add blank line after
        lineOffset += 2
        console.log(`Inserted image in section: "${insertion.sectionTitle}"`)
      }

      insertionsMade++
    }

    const updatedContent = processedLines.join('\n')

    return {
      success: true,
      updatedContent,
      originalContent: mdxContent,
      insertionsMade,
    }
  } catch (error) {
    return {
      success: false,
      updatedContent: mdxContent,
      originalContent: mdxContent,
      insertionsMade: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Creates a backup of the original file
 */
export function createBackup(filePath: string, content: string): string {
  const timestamp = Date.now()
  const backupPath = filePath.replace(/\.mdx$/, `.backup-${timestamp}.mdx`)
  return backupPath
}

/**
 * Validates image insertions before applying
 */
export function validateInsertions(
  mdxContent: string,
  insertions: ImageInsertion[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const lines = mdxContent.split('\n')

  for (const insertion of insertions.filter(i => i.approved)) {
    const insertionPoint = findInsertionPoint(lines, insertion.sectionTitle)

    if (insertionPoint === -1) {
      errors.push(`Section "${insertion.sectionTitle}" not found in content`)
    }

    if (!insertion.imagePath || !insertion.imagePath.startsWith('/generated/images/')) {
      errors.push(`Invalid image path for section "${insertion.sectionTitle}"`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Export layout suggestion function for use in UI
 */
export { suggestLayout }
