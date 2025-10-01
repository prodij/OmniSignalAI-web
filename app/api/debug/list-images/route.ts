import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'generated', 'images')

    // Check if directory exists
    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json({ images: [] })
    }

    // Read all files
    const files = fs.readdirSync(imagesDir)
      .filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
      .map(file => {
        const filePath = path.join(imagesDir, file)
        const stats = fs.statSync(filePath)

        return {
          filename: file,
          url: `/generated/images/${file}`,
          size: stats.size,
          created: stats.birthtime.getTime(),
          modified: stats.mtime.getTime(),
        }
      })
      .sort((a, b) => b.modified - a.modified) // Most recent first

    return NextResponse.json({ images: files })
  } catch (error) {
    console.error('[List Images API] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
