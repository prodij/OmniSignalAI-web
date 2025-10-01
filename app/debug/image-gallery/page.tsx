'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'

interface ImageInfo {
  filename: string
  url: string
  size: number
  created: number
  modified: number
}

export default function ImageGalleryPage() {
  const [images, setImages] = useState<ImageInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date')

  // Load images
  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/list-images')
      if (!response.ok) throw new Error(`Failed to load images: ${response.status}`)
      const data = await response.json()
      setImages(data.images || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort images
  const filteredImages = images
    .filter(img =>
      img.filename.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.modified - a.modified
        case 'name':
          return a.filename.localeCompare(b.filename)
        case 'size':
          return b.size - a.size
        default:
          return 0
      }
    })

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Image Gallery
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Browse all AI-generated images
          </p>
        </div>

        {/* Controls */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
                className="p-3 border rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
              </select>
              <button
                onClick={loadImages}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition"
                title="Refresh"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold">{filteredImages.length} images</span>
            {searchQuery && (
              <span>
                (filtered from {images.length} total)
              </span>
            )}
            <span>•</span>
            <span>
              Total size: {formatBytes(images.reduce((sum, img) => sum + img.size, 0))}
            </span>
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200">
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Error</h3>
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </Card>
        )}

        {/* Gallery Grid */}
        {!loading && !error && (
          <>
            {filteredImages.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  {searchQuery ? 'No images match your search' : 'No images found'}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((img) => (
                  <Card key={img.filename} className="group overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative aspect-video bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <img
                        src={img.url}
                        alt={img.filename}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <a
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 bg-white dark:bg-slate-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Open in new tab"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate mb-2" title={img.filename}>
                        {img.filename}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>{formatBytes(img.size)}</span>
                        <span>{new Date(img.modified).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
