'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface BlogPost {
  slug: string
  title: string
  description: string
  category: string
}

interface PipelineStage {
  name: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  startTime?: number
  endTime?: number
  data?: any
}

interface ImagePipeline {
  sectionTitle: string
  sectionContent: string
  stages: {
    contentAnalysis: PipelineStage
    intentGeneration: PipelineStage
    promptEnhancement: PipelineStage
    imageGeneration: PipelineStage
  }
  finalImageUrl?: string
}

interface PipelineResult {
  blogPost: BlogPost
  pipelines: ImagePipeline[]
  totalProcessingTime: number
  success: boolean
  timestamp?: number
}

interface HistoryEntry extends PipelineResult {
  id: string
  timestamp: number
}

export default function ContentToImagePipelinePage() {
  const [selectedPost, setSelectedPost] = useState<string>('')
  const [availablePosts, setAvailablePosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [result, setResult] = useState<PipelineResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null)
  const [allImages, setAllImages] = useState<any[]>([])
  const [showGallery, setShowGallery] = useState(false)
  const [approvalStates, setApprovalStates] = useState<Record<string, boolean>>({})
  const [insertingImages, setInsertingImages] = useState(false)
  const [insertionResult, setInsertionResult] = useState<any>(null)

  // Load available blog posts
  const loadBlogPosts = async () => {
    setLoadingPosts(true)
    try {
      const response = await fetch('/api/debug/list-content')
      if (!response.ok) throw new Error(`Failed to load blog posts: ${response.status}`)
      const data = await response.json()
      setAvailablePosts(data.posts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts')
    } finally {
      setLoadingPosts(false)
    }
  }

  // Execute full pipeline
  const handleExecutePipeline = async () => {
    if (!selectedPost) return

    setLoading(true)
    setError(null)
    setResult(null)
    setSelectedHistoryId(null)

    try {
      const response = await fetch('/api/debug/content-to-image-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: selectedPost }),
      })

      if (!response.ok) {
        throw new Error(`Pipeline execution failed: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)

      // Initialize approval states (all approved by default)
      const initialApprovals: Record<string, boolean> = {}
      data.pipelines.forEach((pipeline: any, idx: number) => {
        initialApprovals[`${idx}-${pipeline.sectionTitle}`] = true
      })
      setApprovalStates(initialApprovals)
      setInsertionResult(null)

      // Save to history
      const historyEntry: HistoryEntry = {
        ...data,
        id: Date.now().toString(),
        timestamp: Date.now(),
      }
      const newHistory = [historyEntry, ...history].slice(0, 20) // Keep last 20
      setHistory(newHistory)
      localStorage.setItem('pipeline-history', JSON.stringify(newHistory))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Load history from localStorage
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('pipeline-history')
      if (stored) {
        const parsed = JSON.parse(stored)
        setHistory(parsed)
      }
    } catch (err) {
      console.error('Failed to load history:', err)
    }
  }

  // Load history entry
  const loadHistoryEntry = (id: string) => {
    const entry = history.find(h => h.id === id)
    if (entry) {
      setResult(entry)
      setSelectedHistoryId(id)
      setError(null)
    }
  }

  // Clear history
  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('pipeline-history')
    if (selectedHistoryId) {
      setResult(null)
      setSelectedHistoryId(null)
    }
  }

  // Load all generated images
  const loadAllImages = async () => {
    try {
      const response = await fetch('/api/debug/list-images')
      if (response.ok) {
        const data = await response.json()
        setAllImages(data.images || [])
      }
    } catch (err) {
      console.error('Failed to load images:', err)
    }
  }

  // Toggle approval for an image
  const toggleApproval = (key: string) => {
    setApprovalStates(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Insert approved images into blog post
  const handleInsertImages = async () => {
    if (!result) return

    setInsertingImages(true)
    setError(null)
    setInsertionResult(null)

    try {
      // Build insertions array
      const insertions = result.pipelines
        .map((pipeline: any, idx: number) => {
          const key = `${idx}-${pipeline.sectionTitle}`
          return {
            sectionTitle: pipeline.sectionTitle,
            imageUrl: pipeline.finalImageUrl,
            imagePath: pipeline.finalImageUrl,
            altText: pipeline.sectionTitle,
            approved: approvalStates[key] !== false, // default to true
          }
        })
        .filter((i: any) => i.approved && i.imageUrl)

      if (insertions.length === 0) {
        setError('No images approved for insertion')
        return
      }

      const response = await fetch('/api/debug/insert-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: result.blogPost.slug,
          insertions,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to insert images')
      }

      const data = await response.json()
      setInsertionResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to insert images')
    } finally {
      setInsertingImages(false)
    }
  }

  // Load posts, history, and images on mount
  useEffect(() => {
    loadBlogPosts()
    loadHistory()
    loadAllImages()
  }, [])

  const getStageIcon = (status: PipelineStage['status']) => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'processing':
        return '⟳'
      case 'error':
        return '✗'
      default:
        return '○'
    }
  }

  const getStageColor = (status: PipelineStage['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200 animate-pulse'
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-400 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Content → Image Pipeline Visualizer
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Watch how content transforms into images through our complete AI pipeline
              </p>
            </div>
            <Button
              onClick={() => setShowGallery(!showGallery)}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2"
            >
              {showGallery ? 'Hide' : 'Show'} Gallery ({allImages.length} images)
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        {showGallery && allImages.length > 0 && (
          <Card className="p-6 mb-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">All Generated Images ({allImages.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allImages.map((img) => (
                <div key={img.filename} className="group relative">
                  <div className="aspect-video rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                    <img
                      src={img.url}
                      alt={img.filename}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    <p className="font-medium truncate" title={img.filename}>
                      {img.filename}
                    </p>
                    <p className="text-slate-500">
                      {new Date(img.modified).toLocaleDateString()} • {(img.size / 1024).toFixed(0)}KB
                    </p>
                  </div>
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 bg-white dark:bg-slate-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Selection Section */}
        <Card className="p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">1. Select Content Source</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Choose a blog post or webpage:
              </label>
              <select
                value={selectedPost}
                onChange={(e) => setSelectedPost(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition"
                disabled={loadingPosts || loading}
              >
                <option value="">-- Select a blog post --</option>
                {availablePosts.map((post) => (
                  <option key={post.slug} value={post.slug}>
                    {post.title} ({post.category})
                  </option>
                ))}
              </select>
            </div>

            {selectedPost && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Selected:</strong>{' '}
                  {availablePosts.find((p) => p.slug === selectedPost)?.title}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {availablePosts.find((p) => p.slug === selectedPost)?.description}
                </p>
              </div>
            )}

            <Button
              onClick={handleExecutePipeline}
              disabled={loading || !selectedPost}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-lg w-full sm:w-auto"
            >
              {loading ? 'Processing Pipeline...' : 'Execute Full Pipeline'}
            </Button>

            {loading && (
              <div className="flex items-center gap-3">
                <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Analyzing content and generating images through full pipeline...
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* History Section */}
        {history.length > 0 && (
          <Card className="p-6 mb-8 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Pipeline History ({history.length})</h2>
              <Button
                onClick={clearHistory}
                className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1"
              >
                Clear History
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => loadHistoryEntry(entry.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    selectedHistoryId === entry.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 line-clamp-2">
                      {entry.blogPost.title}
                    </h3>
                    {selectedHistoryId === entry.id && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full flex-shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.pipelines.length} images</span>
                      <span>•</span>
                      <span>{(entry.totalProcessingTime / 1000).toFixed(1)}s</span>
                    </div>
                    <div className="text-slate-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {entry.pipelines.slice(0, 3).map((pipeline, idx) => (
                      <div
                        key={idx}
                        className="w-16 h-16 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden"
                      >
                        {pipeline.finalImageUrl && (
                          <img
                            src={pipeline.finalImageUrl}
                            alt={pipeline.sectionTitle}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                    {entry.pipelines.length > 3 && (
                      <div className="w-16 h-16 rounded bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-xs font-semibold">
                        +{entry.pipelines.length - 3}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="p-6 mb-8 bg-red-50 dark:bg-red-900/20 border-red-200">
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Error</h3>
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </Card>
        )}

        {/* Pipeline Results */}
        {result && (
          <div className="space-y-8">
            {/* History Badge */}
            {selectedHistoryId && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Viewing result from history - {new Date(result.timestamp || 0).toLocaleString()}</span>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200">
                <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Blog Post</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {result.blogPost.title}
                </div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200">
                <div className="text-sm text-green-600 dark:text-green-400 mb-1">Images Generated</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {result.pipelines.length}
                </div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200">
                <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Total Processing Time</div>
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                  {(result.totalProcessingTime / 1000).toFixed(1)}s
                </div>
              </Card>
            </div>

            {/* Image Approval Section */}
            {!selectedHistoryId && !insertionResult && (
              <Card className="p-6 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-300">
                <h2 className="text-2xl font-semibold mb-4">✅ Review & Approve Images</h2>
                <p className="text-slate-700 dark:text-slate-300 mb-6">
                  Review each generated image below. Check the boxes for images you want to insert into the blog post.
                  Images will be automatically placed after their corresponding section headings.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {result.pipelines.map((pipeline, idx) => {
                    const key = `${idx}-${pipeline.sectionTitle}`
                    const isApproved = approvalStates[key] !== false

                    return (
                      <div
                        key={key}
                        className={`rounded-lg border-2 p-4 transition-all ${
                          isApproved
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-300 bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        <div className="aspect-video rounded overflow-hidden bg-slate-200 dark:bg-slate-700 mb-3">
                          {pipeline.finalImageUrl && (
                            <img
                              src={pipeline.finalImageUrl}
                              alt={pipeline.sectionTitle}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isApproved}
                            onChange={() => toggleApproval(key)}
                            className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">
                              {pipeline.sectionTitle}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Will be inserted after the section heading
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>{Object.values(approvalStates).filter(Boolean).length}</strong> of{' '}
                    <strong>{result.pipelines.length}</strong> images approved
                  </div>
                  <Button
                    onClick={handleInsertImages}
                    disabled={insertingImages || Object.values(approvalStates).filter(Boolean).length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-semibold"
                  >
                    {insertingImages ? 'Inserting Images...' : 'Insert Approved Images into Blog Post'}
                  </Button>
                </div>
              </Card>
            )}

            {/* Insertion Success Message */}
            {insertionResult && (
              <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-300 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="text-green-600 text-3xl">✓</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
                      Images Successfully Inserted!
                    </h3>
                    <p className="text-green-600 dark:text-green-300 mb-4">
                      {insertionResult.message}
                    </p>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded border border-green-200 space-y-2 text-sm">
                      <p>
                        <strong>Inserted:</strong> {insertionResult.insertionsMade} images
                      </p>
                      <p>
                        <strong>Backup created:</strong> {insertionResult.backupPath}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        Your original file has been backed up. You can find it in the backups directory.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Pipeline Stages for Each Image */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Pipeline Execution Details</h2>

              {result.pipelines.map((pipeline, idx) => (
                <Card key={idx} className="p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
                    Image {idx + 1}: {pipeline.sectionTitle}
                  </h3>

                  {/* Pipeline Flow Visualization */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between gap-2">
                      {[
                        { key: 'contentAnalysis', label: 'Content Analysis', icon: '📄' },
                        { key: 'intentGeneration', label: 'Intent Generation', icon: '🎯' },
                        { key: 'promptEnhancement', label: 'Prompt Enhancement', icon: '✨' },
                        { key: 'imageGeneration', label: 'Image Generation', icon: '🖼️' },
                      ].map((stage, stageIdx) => {
                        const stageData = pipeline.stages[stage.key as keyof typeof pipeline.stages]
                        return (
                          <div key={stage.key} className="flex-1">
                            <div
                              className={`p-4 rounded-lg border-2 ${getStageColor(stageData.status)} transition-all duration-300`}
                            >
                              <div className="text-center">
                                <div className="text-3xl mb-2">{stage.icon}</div>
                                <div className="text-sm font-semibold mb-1">{stage.label}</div>
                                <div className="text-2xl font-bold">{getStageIcon(stageData.status)}</div>
                                {stageData.startTime && stageData.endTime && (
                                  <div className="text-xs mt-1 opacity-75">
                                    {((stageData.endTime - stageData.startTime) / 1000).toFixed(1)}s
                                  </div>
                                )}
                              </div>
                            </div>
                            {stageIdx < 3 && (
                              <div className="text-center text-2xl text-slate-400 mt-2">→</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Detailed Stage Data */}
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="intent">Intent</TabsTrigger>
                      <TabsTrigger value="enhancement">Enhancement</TabsTrigger>
                      <TabsTrigger value="generation">Generation</TabsTrigger>
                      <TabsTrigger value="result">Result</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Section Content
                          </h4>
                          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border">
                            <p className="text-sm whitespace-pre-wrap">{pipeline.sectionContent}</p>
                          </div>
                        </div>
                        {pipeline.stages.contentAnalysis.data && (
                          <div>
                            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                              Analysis Output
                            </h4>
                            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border text-xs overflow-auto">
                              {JSON.stringify(pipeline.stages.contentAnalysis.data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="intent" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Generated Intent (Input to Prompt Enhancement)
                          </h4>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200">
                            <p className="text-sm">
                              {pipeline.stages.intentGeneration.data?.intent || 'No intent generated'}
                            </p>
                          </div>
                        </div>
                        {pipeline.stages.intentGeneration.data && (
                          <div>
                            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                              Full Intent Data
                            </h4>
                            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border text-xs overflow-auto">
                              {JSON.stringify(pipeline.stages.intentGeneration.data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="enhancement" className="mt-4">
                      <div className="space-y-4">
                        {pipeline.stages.promptEnhancement.data?.iterations && (
                          <>
                            <div>
                              <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Gemini 2.5 Flash Enhancement Process
                              </h4>
                              <div className="space-y-3">
                                {pipeline.stages.promptEnhancement.data.iterations.map((iter: any, iterIdx: number) => (
                                  <Card key={iterIdx} className="p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-semibold text-purple-700 dark:text-purple-300">
                                        Iteration {iter.iteration}
                                      </span>
                                      <span className="px-3 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full text-sm font-bold">
                                        {iter.prompt.confidenceScore}% confidence
                                      </span>
                                    </div>
                                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-2">
                                      <strong>Reasoning:</strong> {iter.prompt.reasoning}
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-3 rounded border text-xs">
                                      <p className="font-mono">{iter.prompt.optimizedPrompt.substring(0, 200)}...</p>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Final Optimized Prompt (Input to Nano Banana)
                              </h4>
                              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200">
                                <pre className="text-sm whitespace-pre-wrap font-mono">
                                  {pipeline.stages.promptEnhancement.data.finalPrompt.optimizedPrompt}
                                </pre>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="generation" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Nano Banana Generation Details
                          </h4>
                          {pipeline.stages.imageGeneration.data && (
                            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border text-xs overflow-auto">
                              {JSON.stringify(pipeline.stages.imageGeneration.data, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="result" className="mt-4">
                      <div className="space-y-4">
                        {pipeline.finalImageUrl ? (
                          <>
                            <div>
                              <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Final Generated Image
                              </h4>
                              <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border-2 border-green-400">
                                <img
                                  src={pipeline.finalImageUrl}
                                  alt={pipeline.sectionTitle}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                                <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Original Intent Length</div>
                                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                  {pipeline.stages.intentGeneration.data?.intent?.length || 0} chars
                                </div>
                              </Card>
                              <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200">
                                <div className="text-xs text-green-600 dark:text-green-400 mb-1">Enhanced Prompt Length</div>
                                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                                  {pipeline.stages.promptEnhancement.data?.finalPrompt?.optimizedPrompt?.length || 0} chars
                                </div>
                              </Card>
                            </div>
                          </>
                        ) : (
                          <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                            No image generated yet
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!result && !loading && (
          <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-400">
              Complete Pipeline Flow
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li><strong>Content Analysis:</strong> Extract sections from blog post/webpage</li>
              <li><strong>Intent Generation:</strong> Analyze each section to determine image requirements</li>
              <li><strong>Prompt Enhancement:</strong> Use Gemini 2.5 Flash to refine prompts (2-4 iterations)</li>
              <li><strong>Image Generation:</strong> Send optimized prompt to Nano Banana for final image</li>
              <li><strong>Result:</strong> Display full traceability from content → intent → enhanced prompt → image</li>
            </ol>
          </Card>
        )}
      </div>
    </div>
  )
}
