'use client'

/**
 * AI Content Wizard
 *
 * Form to generate blog posts using the omnidraft AI engine
 * - Collects topic, keywords, tone, audience, content type
 * - Calls omnidraft AI endpoint
 * - Saves generated content as draft
 * - Shows preview with edit/regenerate options
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { blogService } from '@/lib/api'
import { Button, Input, Textarea, Select, Card, Heading, Text } from '@/lib/design-system'
import { Sparkles, FileText, ArrowRight } from 'lucide-react'

interface GenerateForm {
  topic: string
  keywords: string
  tone: string
  targetAudience: string
  contentType: string
}

export default function GeneratePage() {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [generatedPost, setGeneratedPost] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateForm>()

  const onSubmit = async (data: GenerateForm) => {
    setGenerating(true)
    setError(null)

    try {
      // Call AI generation endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/ai/generate-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: data.topic,
          keywords: data.keywords.split(',').map((k) => k.trim()),
          tone: data.tone,
          target_audience: data.targetAudience,
          content_type: data.contentType,
        }),
      })

      if (!response.ok) {
        throw new Error('AI generation failed')
      }

      const aiResult = await response.json()

      // Save as draft
      const post = await blogService.createPost({
        title: aiResult.title || data.topic,
        content: aiResult.content || '# AI Generated Content\n\nContent generation in progress...',
        excerpt: aiResult.excerpt || aiResult.content?.substring(0, 200) || '',
        slug: aiResult.slug || data.topic.toLowerCase().replace(/\s+/g, '-'),
        status: 'draft',
        keywords: data.keywords.split(',').map((k) => k.trim()),
      })

      setGeneratedPost(post)
    } catch (err) {
      console.error('Generation failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate content. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  // Success view - show generated post
  if (generatedPost) {
    return (
      <div>
        <div className="mb-8">
          <Heading as="h1" size="3xl" className="mb-2">
            Content Generated Successfully!
          </Heading>
          <Text className="text-gray-600">
            Your AI-generated blog post has been saved as a draft
          </Text>
        </div>

        <Card padding="lg" className="mb-6">
          <Heading as="h2" size="2xl" className="mb-4">
            {generatedPost.title}
          </Heading>
          <Text className="text-gray-600 mb-6">{generatedPost.excerpt}</Text>
          <div className="prose prose-sm max-w-none">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm">{generatedPost.content}</pre>
            </div>
          </div>
        </Card>

        <div className="flex space-x-4">
          <Button
            onClick={() => router.push(`/dashboard/content/${generatedPost.id}/edit`)}
            leftIcon={<FileText className="w-4 h-4" />}
          >
            Edit Draft
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setGeneratedPost(null)
              setError(null)
            }}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Generate Another
          </Button>
          <Button variant="ghost" onClick={() => router.push('/dashboard/content')}>
            Back to Content
          </Button>
        </div>
      </div>
    )
  }

  // Form view - collect generation parameters
  return (
    <div>
      <div className="mb-8">
        <Heading as="h1" size="3xl" className="mb-2">
          AI Content Wizard
        </Heading>
        <Text className="text-gray-600">
          Generate high-quality blog posts using AI
        </Text>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <Text className="text-red-800">{error}</Text>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
        <Card padding="lg" className="space-y-6">
          {/* Topic */}
          <div>
            <Input
              label="Topic"
              placeholder="e.g., AI in Marketing Automation"
              error={errors.topic?.message}
              {...register('topic', {
                required: 'Topic is required',
                minLength: { value: 5, message: 'Topic must be at least 5 characters' },
              })}
            />
          </div>

          {/* Keywords */}
          <div>
            <Input
              label="Keywords (comma-separated)"
              placeholder="e.g., AI, automation, marketing, ROI"
              error={errors.keywords?.message}
              {...register('keywords', {
                required: 'Keywords are required',
              })}
            />
          </div>

          {/* Tone */}
          <div>
            <Select
              label="Tone"
              error={errors.tone?.message}
              {...register('tone', { required: 'Tone is required' })}
            >
              <option value="">Select tone...</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="technical">Technical</option>
              <option value="educational">Educational</option>
              <option value="conversational">Conversational</option>
            </Select>
          </div>

          {/* Target Audience */}
          <div>
            <Input
              label="Target Audience"
              placeholder="e.g., Marketing professionals, SMB owners"
              error={errors.targetAudience?.message}
              {...register('targetAudience', {
                required: 'Target audience is required',
              })}
            />
          </div>

          {/* Content Type */}
          <div>
            <Select
              label="Content Type"
              error={errors.contentType?.message}
              {...register('contentType', { required: 'Content type is required' })}
            >
              <option value="">Select content type...</option>
              <option value="blog_post">Blog Post</option>
              <option value="case_study">Case Study</option>
              <option value="how_to">How-To Guide</option>
              <option value="listicle">Listicle</option>
              <option value="tutorial">Tutorial</option>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            loading={generating}
            leftIcon={<Sparkles className="w-4 h-4" />}
            rightIcon={!generating ? <ArrowRight className="w-4 h-4" /> : undefined}
          >
            {generating ? 'Generating Content...' : 'Generate Content'}
          </Button>
        </Card>
      </form>
    </div>
  )
}
