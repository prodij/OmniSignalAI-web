import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import {
  parseFrontmatter,
  extractBodyContent,
  analyzeContent,
  generateImageIntent,
  type ContentSection,
} from '@/lib/agents/content-analyzer'
import { PromptEnhancementAgent } from '@/lib/agents/prompt-enhancement'
import { ImageGenerationAgent } from '@/lib/agents/image-generation-agent'

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

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const { slug } = body

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Read blog post
    const contentPath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`)
    if (!fs.existsSync(contentPath)) {
      return NextResponse.json({ error: `Blog post not found: ${slug}` }, { status: 404 })
    }

    const mdxContent = fs.readFileSync(contentPath, 'utf-8')
    const frontmatter = parseFrontmatter(mdxContent)
    const bodyContent = extractBodyContent(mdxContent)

    // Analyze content to extract sections
    const analysisResult = analyzeContent(bodyContent, frontmatter)

    console.log(
      `[Pipeline] Analyzing "${analysisResult.title}" - Found ${analysisResult.sections.length} sections needing images`
    )

    // Process each section through the pipeline
    const pipelines: ImagePipeline[] = []

    // Limit to first 3 sections for demo (can be removed)
    const sectionsToProcess = analysisResult.sections.slice(0, 3)

    for (const section of sectionsToProcess) {
      const pipeline: ImagePipeline = {
        sectionTitle: section.title,
        sectionContent: section.content.substring(0, 500) + '...',
        stages: {
          contentAnalysis: { name: 'Content Analysis', status: 'pending' },
          intentGeneration: { name: 'Intent Generation', status: 'pending' },
          promptEnhancement: { name: 'Prompt Enhancement', status: 'pending' },
          imageGeneration: { name: 'Image Generation', status: 'pending' },
        },
      }

      try {
        // Stage 1: Content Analysis (already done)
        pipeline.stages.contentAnalysis.status = 'processing'
        pipeline.stages.contentAnalysis.startTime = Date.now()
        pipeline.stages.contentAnalysis.data = {
          sectionTitle: section.title,
          contentLength: section.content.length,
          headingLevel: section.headingLevel,
        }
        pipeline.stages.contentAnalysis.endTime = Date.now()
        pipeline.stages.contentAnalysis.status = 'completed'

        // Stage 2: Intent Generation
        pipeline.stages.intentGeneration.status = 'processing'
        pipeline.stages.intentGeneration.startTime = Date.now()

        const intent = generateImageIntent(section, analysisResult.title, analysisResult.description)

        pipeline.stages.intentGeneration.data = {
          intent,
          useCase: 'blog-header',
          stylePreference: 'photorealistic',
        }
        pipeline.stages.intentGeneration.endTime = Date.now()
        pipeline.stages.intentGeneration.status = 'completed'

        console.log(`[Pipeline] Generated intent for "${section.title}" (${intent.length} chars)`)

        // Stage 3: Prompt Enhancement (Gemini 2.5 Flash)
        pipeline.stages.promptEnhancement.status = 'processing'
        pipeline.stages.promptEnhancement.startTime = Date.now()

        const enhancementAgent = new PromptEnhancementAgent(3, 75)
        const enhancementResult = await enhancementAgent.enhance({
          userIntent: intent,
          useCase: 'blog-header',
          stylePreference: 'photorealistic',
          aspectRatio: '16:9',
        })

        if (!enhancementResult.success) {
          throw new Error(`Prompt enhancement failed: ${enhancementResult.error}`)
        }

        pipeline.stages.promptEnhancement.data = {
          iterations: enhancementResult.iterations.map(iter => ({
            iteration: iter.iteration,
            prompt: {
              optimizedPrompt: iter.prompt.optimizedPrompt,
              confidenceScore: iter.prompt.confidenceScore,
              reasoning: iter.prompt.reasoning,
            },
          })),
          finalPrompt: {
            optimizedPrompt: enhancementResult.finalPrompt.optimizedPrompt,
            negativePrompt: enhancementResult.finalPrompt.negativePrompt,
            confidenceScore: enhancementResult.finalPrompt.confidenceScore,
          },
          totalIterations: enhancementResult.totalIterations,
          processingTime: enhancementResult.processingTime,
        }
        pipeline.stages.promptEnhancement.endTime = Date.now()
        pipeline.stages.promptEnhancement.status = 'completed'

        console.log(
          `[Pipeline] Enhanced prompt for "${section.title}" in ${enhancementResult.totalIterations} iterations (${(enhancementResult.processingTime / 1000).toFixed(1)}s)`
        )

        // Stage 4: Image Generation (Nano Banana)
        pipeline.stages.imageGeneration.status = 'processing'
        pipeline.stages.imageGeneration.startTime = Date.now()

        const imageAgent = new ImageGenerationAgent({
          promptTranslation: {
            useTemplates: false,
            enhancePrompts: false,
            addNegativePrompts: true,
            minQualityScore: 75,
            useLLMEnhancement: false, // Already enhanced
          },
          generation: {
            retryOnFailure: true,
            maxRetries: 3,
            enableRefinement: false,
            timeout: 120000,
          },
          logging: {
            verbose: false,
            logIntentDetection: false,
            logPromptTranslation: false,
            logGeneration: false,
          },
        })

        // Generate image using the final enhanced prompt directly
        const imageResult = await imageAgent.generate({
          intent: enhancementResult.finalPrompt.optimizedPrompt,
          filename: `${slug}-section-${section.title.toLowerCase().replace(/\s+/g, '-')}`,
        })

        if (!imageResult.success) {
          throw new Error(`Image generation failed: ${imageResult.error}`)
        }

        pipeline.stages.imageGeneration.data = {
          imageUrl: imageResult.imageUrl,
          processingTime: imageResult.processingTime,
        }
        pipeline.stages.imageGeneration.endTime = Date.now()
        pipeline.stages.imageGeneration.status = 'completed'
        pipeline.finalImageUrl = imageResult.imageUrl

        console.log(
          `[Pipeline] Generated image for "${section.title}" (${(imageResult.processingTime || 0) / 1000}s)`
        )
      } catch (error) {
        console.error(`[Pipeline] Error processing section "${section.title}":`, error)

        // Mark current stage as error
        const currentStage = Object.values(pipeline.stages).find(s => s.status === 'processing')
        if (currentStage) {
          currentStage.status = 'error'
          currentStage.data = { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      }

      pipelines.push(pipeline)
    }

    const totalProcessingTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      blogPost: {
        slug,
        title: analysisResult.title,
        description: analysisResult.description,
        category: analysisResult.metadata.category,
      },
      pipelines,
      totalProcessingTime,
    })
  } catch (error) {
    console.error('[Pipeline API] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
