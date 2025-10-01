import { NextRequest, NextResponse } from 'next/server';
import { ImageGenerationAgent } from '@/lib/agents/image-generation-agent';
import { PromptEnhancementAgent } from '@/lib/agents/prompt-enhancement';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { intent, useCase, stylePreference } = body;

    if (!intent) {
      return NextResponse.json(
        { error: 'Intent is required' },
        { status: 400 }
      );
    }

    // Create enhancement agent to get iteration details
    const enhancementAgent = new PromptEnhancementAgent(3, 75);

    const enhancementResult = await enhancementAgent.enhance({
      userIntent: intent,
      useCase: useCase || 'blog-header',
      stylePreference: stylePreference || 'photorealistic',
      aspectRatio: '16:9',
    });

    if (!enhancementResult.success) {
      return NextResponse.json(
        { error: enhancementResult.error || 'Enhancement failed' },
        { status: 500 }
      );
    }

    // Now generate the actual image with the final prompt
    const imageAgent = new ImageGenerationAgent({
      promptTranslation: {
        useTemplates: false,
        enhancePrompts: false,
        addNegativePrompts: true,
        minQualityScore: 75,
        useLLMEnhancement: false, // We already have the enhanced prompt
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
    });

    // Generate image using the final enhanced prompt directly
    const imageResult = await imageAgent.generate({
      intent: enhancementResult.finalPrompt.optimizedPrompt, // Use the optimized prompt as intent
      filename: `debug-${Date.now()}`,
    });

    // Format iterations for frontend
    const iterations = enhancementResult.iterations.map(iter => ({
      iteration: iter.iteration,
      prompt: iter.prompt.optimizedPrompt,
      confidence: iter.prompt.confidenceScore,
      reasoning: iter.prompt.reasoning,
      expectedIssues: iter.prompt.expectedIssues,
      technicalDetails: iter.prompt.technicalDetails,
    }));

    return NextResponse.json({
      success: imageResult.success,
      userIntent: intent,
      iterations,
      finalImageUrl: imageResult.imageUrl,
      processingTime: enhancementResult.processingTime + (imageResult.processingTime || 0),
      totalIterations: enhancementResult.totalIterations,
    });
  } catch (error) {
    console.error('[Debug API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}