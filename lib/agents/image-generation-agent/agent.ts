/**
 * Image Generation Agent
 * Autonomous agent that handles the complete image generation workflow
 */

import {
  ImageGenerationAgentRequest,
  ImageGenerationAgentResponse,
  AgentConfig,
} from './types';
import { IntentDetector } from './intent-detector';
import { ContextAnalyzer } from './context-analyzer';
import { PromptTranslator } from './prompt-translator';
import { generateImage, refineImage } from '@/lib/media-generator';
import { DEFAULT_CONFIG } from './config';

/**
 * Image Generation Agent
 * Orchestrates the complete workflow from intent to generated image
 */
export class ImageGenerationAgent {
  private config: AgentConfig;
  private intentDetector: IntentDetector;
  private contextAnalyzer: ContextAnalyzer;
  private promptTranslator: PromptTranslator;

  constructor(config?: Partial<AgentConfig>) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      promptTranslation: {
        ...DEFAULT_CONFIG.promptTranslation,
        ...config?.promptTranslation,
      },
      generation: {
        ...DEFAULT_CONFIG.generation,
        ...config?.generation,
      },
      fileManagement: {
        ...DEFAULT_CONFIG.fileManagement,
        ...config?.fileManagement,
      },
      logging: {
        ...DEFAULT_CONFIG.logging,
        ...config?.logging,
      },
    };

    this.intentDetector = new IntentDetector();
    this.contextAnalyzer = new ContextAnalyzer();
    this.promptTranslator = new PromptTranslator();
  }

  /**
   * Generate image from natural language intent
   */
  async generate(
    request: ImageGenerationAgentRequest
  ): Promise<ImageGenerationAgentResponse> {
    const startTime = Date.now();

    try {
      // Step 1: Validate intent
      this.log('Validating intent...', 'verbose');
      const intentValidation = this.intentDetector.validateIntent(request.intent);

      if (!intentValidation.isValid) {
        return {
          success: false,
          originalIntent: request.intent,
          error: `Invalid intent: ${intentValidation.suggestions.join(', ')}`,
          reasoning: {} as any,
        };
      }

      // Step 2: Detect intent
      this.log('Detecting intent...', 'intentDetection');
      let detectedIntent = this.intentDetector.detectIntent(request.intent);

      // Apply user hints if provided
      if (request.useCase) {
        detectedIntent.useCase = request.useCase;
        detectedIntent.confidence = Math.min(detectedIntent.confidence + 10, 100);
      }
      if (request.stylePreference) {
        detectedIntent.style = request.stylePreference;
        detectedIntent.confidence = Math.min(detectedIntent.confidence + 10, 100);
      }

      this.log(
        `Intent detected: ${detectedIntent.useCase} (confidence: ${detectedIntent.confidence}%)`,
        'intentDetection'
      );

      // Step 3: Analyze context
      this.log('Analyzing context...', 'verbose');
      const contextAnalysis = this.contextAnalyzer.analyzeContext(detectedIntent);

      this.log(
        `Context: ${contextAnalysis.style} style, ${contextAnalysis.composition.aspectRatio} aspect ratio`,
        'verbose'
      );

      // Step 4: Translate to optimized prompt
      this.log('Translating to Nano Banana optimized prompt...', 'promptTranslation');
      const translatedPrompt = this.promptTranslator.translateToPrompt(contextAnalysis);

      this.log(`Prompt: ${translatedPrompt.prompt}`, 'promptTranslation');
      this.log(`Quality score: ${translatedPrompt.qualityScore}`, 'promptTranslation');

      // Validate translation quality
      if (
        translatedPrompt.qualityScore < this.config.promptTranslation.minQualityScore
      ) {
        this.log(
          `Quality score below threshold (${translatedPrompt.qualityScore} < ${this.config.promptTranslation.minQualityScore})`,
          'verbose'
        );

        // Continue anyway but log warning
        this.log('Proceeding with generation despite low quality score', 'verbose');
      }

      // Step 5: Generate image
      this.log('Generating image via OpenRouter...', 'generation');
      const generationResult = await generateImage({
        prompt: translatedPrompt.prompt,
        negativePrompt: this.config.promptTranslation.addNegativePrompts
          ? translatedPrompt.negativePrompt
          : undefined,
        filename: request.filename,
      });

      if (!generationResult.success) {
        // Retry if enabled
        if (
          this.config.generation.retryOnFailure &&
          this.config.generation.maxRetries > 0
        ) {
          this.log(
            `Generation failed, retrying (max ${this.config.generation.maxRetries} attempts)...`,
            'generation'
          );

          return this.retryGeneration(
            request,
            detectedIntent,
            contextAnalysis,
            translatedPrompt,
            startTime
          );
        }

        return {
          success: false,
          originalIntent: request.intent,
          error: generationResult.error,
          reasoning: {
            detectedIntent,
            contextAnalysis,
            translatedPrompt,
          },
          processingTime: Date.now() - startTime,
        };
      }

      // Handle refinement if requested
      if (
        request.refinementInstructions &&
        request.refinementInstructions.length > 0 &&
        this.config.generation.enableRefinement
      ) {
        this.log('Applying refinement instructions...', 'generation');

        return this.applyRefinements(
          request,
          generationResult,
          detectedIntent,
          contextAnalysis,
          translatedPrompt,
          startTime
        );
      }

      // Success!
      this.log('Image generated successfully!', 'generation');

      return {
        success: true,
        imageUrl: generationResult.imageUrl,
        filePath: generationResult.filePath,
        originalIntent: request.intent,
        reasoning: {
          detectedIntent,
          contextAnalysis,
          translatedPrompt,
        },
        processingTime: Date.now() - startTime,
      };
    } catch (error) {
      this.log(`Error during generation: ${error}`, 'verbose');

      return {
        success: false,
        originalIntent: request.intent,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        reasoning: {} as any,
        processingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Retry generation with exponential backoff
   */
  private async retryGeneration(
    request: ImageGenerationAgentRequest,
    detectedIntent: any,
    contextAnalysis: any,
    translatedPrompt: any,
    startTime: number,
    attempt: number = 1
  ): Promise<ImageGenerationAgentResponse> {
    if (attempt > this.config.generation.maxRetries) {
      return {
        success: false,
        originalIntent: request.intent,
        error: `Failed after ${this.config.generation.maxRetries} retry attempts`,
        reasoning: {
          detectedIntent,
          contextAnalysis,
          translatedPrompt,
        },
        processingTime: Date.now() - startTime,
      };
    }

    // Exponential backoff
    const delay = 1000 * Math.pow(2, attempt - 1);
    this.log(`Waiting ${delay}ms before retry attempt ${attempt}...`, 'generation');
    await new Promise((resolve) => setTimeout(resolve, delay));

    this.log(`Retry attempt ${attempt}/${this.config.generation.maxRetries}...`, 'generation');

    const generationResult = await generateImage({
      prompt: translatedPrompt.prompt,
      negativePrompt: this.config.promptTranslation.addNegativePrompts
        ? translatedPrompt.negativePrompt
        : undefined,
      filename: request.filename,
    });

    if (!generationResult.success) {
      return this.retryGeneration(
        request,
        detectedIntent,
        contextAnalysis,
        translatedPrompt,
        startTime,
        attempt + 1
      );
    }

    return {
      success: true,
      imageUrl: generationResult.imageUrl,
      filePath: generationResult.filePath,
      originalIntent: request.intent,
      reasoning: {
        detectedIntent,
        contextAnalysis,
        translatedPrompt,
      },
      processingTime: Date.now() - startTime,
    };
  }

  /**
   * Apply refinement instructions
   */
  private async applyRefinements(
    request: ImageGenerationAgentRequest,
    baseResult: any,
    detectedIntent: any,
    contextAnalysis: any,
    translatedPrompt: any,
    startTime: number
  ): Promise<ImageGenerationAgentResponse> {
    let currentPrompt = translatedPrompt.prompt;
    let lastResult = baseResult;

    for (const refinement of request.refinementInstructions!) {
      this.log(`Applying refinement: ${refinement}`, 'generation');

      const refinementPrompt =
        this.promptTranslator.optimizeForRefinement(translatedPrompt, refinement);

      const refinedResult = await refineImage(currentPrompt, refinementPrompt);

      if (refinedResult.success) {
        lastResult = refinedResult;
        currentPrompt = refinementPrompt;
      } else {
        this.log(`Refinement failed: ${refinedResult.error}`, 'generation');
        // Continue with last successful result
        break;
      }
    }

    return {
      success: lastResult.success,
      imageUrl: lastResult.imageUrl,
      filePath: lastResult.filePath,
      originalIntent: request.intent,
      reasoning: {
        detectedIntent,
        contextAnalysis,
        translatedPrompt,
      },
      processingTime: Date.now() - startTime,
    };
  }

  /**
   * Log message based on configuration
   */
  private log(
    message: string,
    level: 'verbose' | 'intentDetection' | 'promptTranslation' | 'generation'
  ): void {
    if (level === 'verbose' && this.config.logging.verbose) {
      console.log(`[ImageAgent] ${message}`);
    } else if (level === 'intentDetection' && this.config.logging.logIntentDetection) {
      console.log(`[ImageAgent:Intent] ${message}`);
    } else if (level === 'promptTranslation' && this.config.logging.logPromptTranslation) {
      console.log(`[ImageAgent:Prompt] ${message}`);
    } else if (level === 'generation' && this.config.logging.logGeneration) {
      console.log(`[ImageAgent:Generation] ${message}`);
    }
  }

  /**
   * Get agent configuration
   */
  getConfig(): AgentConfig {
    return { ...this.config };
  }

  /**
   * Update agent configuration
   */
  updateConfig(updates: Partial<AgentConfig>): void {
    this.config = {
      ...this.config,
      ...updates,
      promptTranslation: {
        ...this.config.promptTranslation,
        ...updates.promptTranslation,
      },
      generation: {
        ...this.config.generation,
        ...updates.generation,
      },
      fileManagement: {
        ...this.config.fileManagement,
        ...updates.fileManagement,
      },
      logging: {
        ...this.config.logging,
        ...updates.logging,
      },
    };
  }
}