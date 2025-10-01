'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PromptIteration {
  iteration: number
  prompt: string
  confidence: number
  reasoning: string
  expectedIssues: string[]
  technicalDetails: {
    composition: string
    lighting: string
    cameraSettings: string
    colorPalette: string
  }
}

interface GenerationResult {
  success: boolean
  userIntent: string
  iterations: PromptIteration[]
  finalImageUrl?: string
  processingTime: number
  totalIterations: number
}

export default function ImageGenerationDebugPage() {
  const [userIntent, setUserIntent] = useState('Professional blog header showing stressed marketing manager dealing with multiple social media platforms and tight deadlines')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/debug/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: userIntent,
          useCase: 'blog-header',
          stylePreference: 'photorealistic',
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Image Generation Debug Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Visualize the LLM-guided prompt refinement process with Gemini 2.5 Flash
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">User Intent</h2>
          <textarea
            value={userIntent}
            onChange={(e) => setUserIntent(e.target.value)}
            className="w-full h-32 p-4 border rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Describe the image you want to generate..."
          />
          <div className="mt-4 flex items-center gap-4">
            <Button
              onClick={handleGenerate}
              disabled={loading || !userIntent.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-lg"
            >
              {loading ? 'Generating...' : 'Generate & Analyze'}
            </Button>
            {loading && (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Processing with Gemini 2.5 Flash...
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="p-6 mb-8 bg-red-50 dark:bg-red-900/20 border-red-200">
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Error</h3>
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200">
                <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Iterations</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{result.totalIterations}</div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200">
                <div className="text-sm text-green-600 dark:text-green-400 mb-1">Processing Time</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {(result.processingTime / 1000).toFixed(1)}s
                </div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200">
                <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Final Confidence</div>
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                  {result.iterations[result.iterations.length - 1]?.confidence}%
                </div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200">
                <div className="text-sm text-orange-600 dark:text-orange-400 mb-1">Status</div>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {result.success ? '✓ Success' : '✗ Failed'}
                </div>
              </Card>
            </div>

            {/* Generated Image */}
            {result.finalImageUrl && (
              <Card className="p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Final Generated Image</h2>
                <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                  <img
                    src={result.finalImageUrl}
                    alt="Generated"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            )}

            {/* Iteration History */}
            <Card className="p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Prompt Evolution (Iteration History)</h2>
              <Tabs defaultValue="iteration-1" className="w-full">
                <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${result.iterations.length}, 1fr)` }}>
                  {result.iterations.map((iter) => (
                    <TabsTrigger key={iter.iteration} value={`iteration-${iter.iteration}`}>
                      Iteration {iter.iteration}
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                        {iter.confidence}%
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {result.iterations.map((iter) => (
                  <TabsContent key={iter.iteration} value={`iteration-${iter.iteration}`} className="space-y-4 mt-4">
                    {/* Confidence Score */}
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Confidence Score:</div>
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div
                          className={`h-full rounded-full transition-all ${
                            iter.confidence >= 85
                              ? 'bg-green-500'
                              : iter.confidence >= 70
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${iter.confidence}%` }}
                        />
                      </div>
                      <div className="text-2xl font-bold">{iter.confidence}%</div>
                    </div>

                    {/* Optimized Prompt */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Optimized Prompt</h3>
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <pre className="text-sm whitespace-pre-wrap font-mono">{iter.prompt}</pre>
                      </div>
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {iter.prompt.length} characters
                      </div>
                    </div>

                    {/* Technical Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Composition</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{iter.technicalDetails.composition}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">Lighting</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{iter.technicalDetails.lighting}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">Camera Settings</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{iter.technicalDetails.cameraSettings}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">Color Palette</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{iter.technicalDetails.colorPalette}</p>
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">LLM Reasoning</h3>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-slate-700 dark:text-slate-300">{iter.reasoning}</p>
                      </div>
                    </div>

                    {/* Expected Issues */}
                    {iter.expectedIssues.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Expected Issues & Mitigations</h3>
                        <ul className="space-y-2">
                          {iter.expectedIssues.map((issue, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-orange-500 mt-1">⚠️</span>
                              <span className="text-sm text-slate-700 dark:text-slate-300">{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </Card>

            {/* User Intent Comparison */}
            <Card className="p-6 shadow-lg bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
              <h2 className="text-xl font-semibold mb-4">Transformation Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">❌ Original User Intent</h3>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm">{result.userIntent}</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">{result.userIntent.length} characters</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">✅ Final Optimized Prompt</h3>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm">{result.iterations[result.iterations.length - 1]?.prompt.substring(0, 200)}...</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      {result.iterations[result.iterations.length - 1]?.prompt.length} characters
                      <span className="ml-2 font-semibold">
                        ({Math.round((result.iterations[result.iterations.length - 1]?.prompt.length / result.userIntent.length) * 10) / 10}x more detailed)
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Instructions */}
        {!result && !loading && (
          <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-400">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>Enter your simple, natural language description above</li>
              <li>Gemini 2.5 Flash analyzes and extracts visual attributes</li>
              <li>LLM generates optimized prompt (iteration 1)</li>
              <li>Self-critique evaluates quality and suggests improvements</li>
              <li>LLM refines prompt based on feedback (iterations 2-3)</li>
              <li>Final optimized prompt sent to Nano Banana for image generation</li>
              <li>Result: Professional, artifact-free, magazine-quality images</li>
            </ol>
          </Card>
        )}
      </div>
    </div>
  )
}