/**
 * Prompt Enhancement Agent
 * Uses Gemini 1.5 Pro to iteratively refine prompts for Nano Banana
 */

import { callGeminiPro, parseJSONResponse } from './gemini-pro-client';
import { extractAttributes, type VisualAttributes } from './attribute-extractor';
import { buildNegativePrompt, extractNegativesFromCritique } from './negative-prompt-builder';
import { analyzeImage } from './critique-analyzer';
import {
  PromptEnhancementRequest,
  PromptEnhancementResult,
  EnhancedPrompt,
  PromptIterationHistory,
} from './types';

const PROMPT_OPTIMIZATION_TEMPLATE = `You are an expert prompt engineer specializing in Google's Gemini Nano Banana image generation.

Your mission: Create the PERFECT prompt that will generate photorealistic, artifact-free, professional-quality images.

## Input Context
User Intent: {userIntent}
Use Case: {useCase}
Style: {stylePreference}
Aspect Ratio: {aspectRatio}

## Visual Attributes (from analysis)
{attributes}

## Previous Iteration Feedback (if any)
{critiqueFeedback}

## Your Task
Generate an optimized prompt that:

1. **Fills the entire frame** (16:9 ratio) edge-to-edge, no borders or empty space
2. **Avoids ALL AI artifacts**: No synthetic skin, weird fingers, impossible physics, unnatural lighting
3. **Achieves magazine-quality** professional photography standards
4. **Includes specific technical details**: Camera model, lens type, aperture (f/1.4-f/2.8 for shallow DOF), ISO, lighting setup
5. **Creates unique composition**: Avoid generic stock photo feel
6. **Optimizes for Nano Banana's strengths**: Paragraph-style prompts, front-loaded subject, specific details

## Critical Requirements for Nano Banana
- Use PARAGRAPH format (not keyword lists)
- Front-load the main subject in first sentence
- Be highly specific about composition, lighting, technical specs
- Include camera/lens details (e.g., "shot with Sony A7III, 85mm f/1.4 lens")
- Specify exact lighting (e.g., "soft golden hour sunlight from camera left")
- Add quality keywords: "high resolution", "professional photography", "8K", "sharp focus"
- End with mood/atmosphere

## Output Format
Return ONLY valid JSON:
\`\`\`json
{
  "optimizedPrompt": "A detailed paragraph-style prompt with subject first, then composition, lighting, technical details, and mood...",
  "negativePrompt": "artifacts to avoid, comma-separated",
  "reasoning": "Why this prompt will work better than generic prompts",
  "expectedIssues": ["potential issues to watch for"],
  "technicalDetails": {
    "composition": "specific framing description",
    "lighting": "exact lighting setup",
    "cameraSettings": "camera, lens, aperture, ISO",
    "colorPalette": "color scheme description"
  },
  "confidenceScore": 85
}
\`\`\`

Confidence score: Your estimate (0-100) of how well this prompt will perform.
Aim for 85+ confidence. If lower, explain why in expectedIssues.`;

export class PromptEnhancementAgent {
  private maxIterations: number = 4;
  private qualityThreshold: number = 80;

  constructor(
    maxIterations: number = 4,
    qualityThreshold: number = 80
  ) {
    this.maxIterations = maxIterations;
    this.qualityThreshold = qualityThreshold;
  }

  /**
   * Main enhancement workflow with iterative refinement
   */
  async enhance(request: PromptEnhancementRequest): Promise<PromptEnhancementResult> {
    const startTime = Date.now();
    const iterations: PromptIterationHistory[] = [];

    console.log('[PromptEnhancement] Starting enhancement workflow...');
    console.log(`  Intent: ${request.userIntent.substring(0, 100)}...`);
    console.log(`  Use Case: ${request.useCase}`);
    console.log(`  Max Iterations: ${this.maxIterations}`);

    // Step 1: Extract visual attributes
    console.log('\n[PromptEnhancement] Step 1: Extracting visual attributes...');
    const attributes = await extractAttributes(request);

    if (!attributes) {
      return {
        success: false,
        finalPrompt: {} as EnhancedPrompt,
        iterations: [],
        totalIterations: 0,
        processingTime: Date.now() - startTime,
        error: 'Failed to extract visual attributes',
      };
    }

    console.log('[PromptEnhancement] Attributes extracted successfully');

    // Step 2: Iterative refinement loop
    let currentPrompt: EnhancedPrompt | null = null;
    let critiqueFeedback = 'None - this is the first iteration.';

    for (let i = 0; i < this.maxIterations; i++) {
      const iterationNum = i + 1;
      console.log(`\n[PromptEnhancement] ━━━ Iteration ${iterationNum}/${this.maxIterations} ━━━`);

      // Generate optimized prompt
      console.log('[PromptEnhancement] Generating optimized prompt...');
      const enhancedPrompt = await this.generateOptimizedPrompt(
        request,
        attributes,
        critiqueFeedback,
        iterationNum
      );

      if (!enhancedPrompt) {
        console.error('[PromptEnhancement] Failed to generate prompt');
        break;
      }

      currentPrompt = enhancedPrompt;

      console.log('[PromptEnhancement] Prompt generated:');
      console.log(`  Confidence: ${enhancedPrompt.confidenceScore}%`);
      console.log(`  Prompt length: ${enhancedPrompt.optimizedPrompt.length} chars`);
      console.log(`  Prompt preview: ${enhancedPrompt.optimizedPrompt.substring(0, 150)}...`);

      // Record iteration
      iterations.push({
        iteration: iterationNum,
        prompt: enhancedPrompt,
        timestamp: Date.now(),
      });

      // Check if we've reached high confidence early
      if (enhancedPrompt.confidenceScore >= 90 && iterationNum >= 2) {
        console.log('[PromptEnhancement] High confidence reached, stopping early');
        break;
      }

      // If not final iteration, prepare feedback for next iteration
      if (iterationNum < this.maxIterations) {
        critiqueFeedback = this.buildIterativeFeedback(enhancedPrompt, iterationNum);
      }
    }

    if (!currentPrompt) {
      return {
        success: false,
        finalPrompt: {} as EnhancedPrompt,
        iterations,
        totalIterations: iterations.length,
        processingTime: Date.now() - startTime,
        error: 'Failed to generate any prompts',
      };
    }

    console.log('\n[PromptEnhancement] ✓ Enhancement complete!');
    console.log(`  Total iterations: ${iterations.length}`);
    console.log(`  Final confidence: ${currentPrompt.confidenceScore}%`);
    console.log(`  Processing time: ${Date.now() - startTime}ms`);

    return {
      success: true,
      finalPrompt: currentPrompt,
      iterations,
      totalIterations: iterations.length,
      processingTime: Date.now() - startTime,
    };
  }

  /**
   * Generate optimized prompt using Gemini 1.5 Pro
   */
  private async generateOptimizedPrompt(
    request: PromptEnhancementRequest,
    attributes: VisualAttributes,
    critiqueFeedback: string,
    iteration: number
  ): Promise<EnhancedPrompt | null> {
    const attributesStr = JSON.stringify(attributes, null, 2);

    const prompt = PROMPT_OPTIMIZATION_TEMPLATE.replace('{userIntent}', request.userIntent)
      .replace('{useCase}', request.useCase)
      .replace('{stylePreference}', request.stylePreference || 'photorealistic')
      .replace('{aspectRatio}', request.aspectRatio || '16:9')
      .replace('{attributes}', attributesStr)
      .replace('{critiqueFeedback}', critiqueFeedback);

    const response = await callGeminiPro([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    if (!response.success) {
      console.error('[PromptEnhancement] Gemini Pro request failed:', response.error);
      return null;
    }

    const parsed = parseJSONResponse<any>(response.content);

    if (!parsed) {
      console.error('[PromptEnhancement] Failed to parse JSON response');
      console.error('Response:', response.content.substring(0, 500));
      return null;
    }

    // Build comprehensive negative prompt
    const baseNegatives = buildNegativePrompt(request);
    const customNegatives = parsed.negativePrompt || '';
    const combinedNegatives = `${baseNegatives}, ${customNegatives}`;

    return {
      optimizedPrompt: parsed.optimizedPrompt,
      negativePrompt: combinedNegatives,
      reasoning: parsed.reasoning,
      expectedIssues: parsed.expectedIssues || [],
      technicalDetails: parsed.technicalDetails || {
        composition: '',
        lighting: '',
        cameraSettings: '',
        colorPalette: '',
      },
      iterationNumber: iteration,
      confidenceScore: parsed.confidenceScore || 70,
    };
  }

  /**
   * Build feedback for next iteration based on current prompt
   */
  private buildIterativeFeedback(prompt: EnhancedPrompt, iteration: number): string {
    const feedback: string[] = [];

    feedback.push(`Iteration ${iteration} generated a prompt with ${prompt.confidenceScore}% confidence.`);

    if (prompt.expectedIssues && prompt.expectedIssues.length > 0) {
      feedback.push('\nExpected issues to address:');
      prompt.expectedIssues.forEach(issue => {
        feedback.push(`- ${issue}`);
      });
    }

    feedback.push('\nFor next iteration, focus on:');
    feedback.push('- Adding more specific technical details');
    feedback.push('- Refining composition to avoid generic stock photo feel');
    feedback.push('- Ensuring lighting description is highly specific');
    feedback.push('- Front-loading the main subject more clearly');

    if (prompt.confidenceScore < 80) {
      feedback.push('- Aim for 80+ confidence by being even more specific and detailed');
    }

    return feedback.join('\n');
  }
}

export type { VisualAttributes } from './attribute-extractor';