import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { parseFrontmatter } from '@/lib/agents/content-analyzer'

export async function GET() {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'blog')

    // Read all MDX files
    const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.mdx'))

    const posts = files.map(file => {
      const filePath = path.join(contentDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const frontmatter = parseFrontmatter(content)

      return {
        slug: file.replace('.mdx', ''),
        title: frontmatter.title || 'Untitled',
        description: frontmatter.description || '',
        category: frontmatter.category || 'Uncategorized',
      }
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('[List Content API] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
