import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { updateMDXWithImages, validateInsertions, type ImageInsertion } from '@/lib/agents/mdx-updater'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, insertions } = body as { slug: string; insertions: ImageInsertion[] }

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    if (!insertions || insertions.length === 0) {
      return NextResponse.json({ error: 'No insertions provided' }, { status: 400 })
    }

    // Read the MDX file
    const contentPath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`)

    if (!fs.existsSync(contentPath)) {
      return NextResponse.json({ error: `Blog post not found: ${slug}` }, { status: 404 })
    }

    const originalContent = fs.readFileSync(contentPath, 'utf-8')

    // Validate insertions
    const validation = validateInsertions(originalContent, insertions)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    // Create backup
    const backupDir = path.join(process.cwd(), 'content', 'blog', '.backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    const timestamp = Date.now()
    const backupPath = path.join(backupDir, `${slug}.backup-${timestamp}.mdx`)
    fs.writeFileSync(backupPath, originalContent, 'utf-8')

    console.log(`[Insert Images] Created backup: ${backupPath}`)

    // Update MDX content
    const result = updateMDXWithImages(originalContent, insertions)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to update content' },
        { status: 500 }
      )
    }

    // Write updated content
    fs.writeFileSync(contentPath, result.updatedContent, 'utf-8')

    console.log(
      `[Insert Images] Updated ${slug}.mdx with ${result.insertionsMade} images`
    )

    return NextResponse.json({
      success: true,
      insertionsMade: result.insertionsMade,
      backupPath: backupPath.replace(process.cwd(), ''),
      message: `Successfully inserted ${result.insertionsMade} images into ${slug}.mdx`,
    })
  } catch (error) {
    console.error('[Insert Images API] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
