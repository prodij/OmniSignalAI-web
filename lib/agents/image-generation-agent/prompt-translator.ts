/**
 * Prompt Translator
 * Translates context analysis into optimized prompts for Nano Banana (Gemini 2.5 Flash Image Preview)
 */

import { ContextAnalysis, TranslatedPrompt } from './types';
import { validatePrompt } from '@/lib/media-generator';

/**
 * Nano Banana (Gemini) specific optimizations
 */
const GEMINI_OPTIMIZATIONS = {
  /**
   * Gemini works best with paragraph-style prompts
   * that combine all elements into a flowing description
   */
  useParagraphStyle: true,

  /**
   * Front-load the most important information (subject and use case)
   */
  frontLoadSubject: true,

  /**
   * Include specific style descriptors that Gemini understands well
   */
  useStyleDescriptors: true,

  /**
   * Add quality and technical terms that improve output
   */
  addQualityTerms: true,

  /**
   * End with mood/atmosphere for emotional context
   */
  endWithMood: true,
};

/**
 * Quality enhancement keywords for Gemini
 */
const QUALITY_KEYWORDS = [
  'high resolution',
  'professional quality',
  'detailed',
  'sharp focus',
  '8K quality',
];

/**
 * Default negative prompts optimized for Gemini
 */
const DEFAULT_NEGATIVE_PROMPTS = [
  'blurry',
  'low quality',
  'distorted',
  'watermark',
  'text overlay',
  'pixelated',
  'amateur',
  'generic stock photo',
  'cluttered',
  'messy',
];

/**
 * Prompt Translator class
 */
export class PromptTranslator {
  /**
   * Translate context analysis into optimized Nano Banana prompt
   */
  translateToPrompt(context: ContextAnalysis): TranslatedPrompt {
    const promptParts: string[] = [];
    const optimizations: string[] = [];

    // 1. Start with subject (front-load most important info)
    promptParts.push(context.subject);
    optimizations.push('Front-loaded subject for Gemini optimization');

    // 2. Add composition details
    if (context.composition) {
      const compositionParts: string[] = [];

      if (context.composition.framing) {
        compositionParts.push(context.composition.framing);
      }
      if (context.composition.perspective) {
        compositionParts.push(context.composition.perspective);
      }
      if (context.composition.aspectRatio) {
        compositionParts.push(`aspect ratio ${context.composition.aspectRatio}`);
      }

      if (compositionParts.length > 0) {
        promptParts.push(compositionParts.join(', '));
        optimizations.push('Added composition specifications');
      }
    }

    // 3. Add technical specifications
    if (context.technical) {
      const technicalParts: string[] = [];

      if (context.technical.lighting) {
        technicalParts.push(context.technical.lighting);
      }
      if (context.technical.camera) {
        technicalParts.push(context.technical.camera);
      }

      if (technicalParts.length > 0) {
        promptParts.push(technicalParts.join(', '));
        optimizations.push('Added technical photography details');
      }
    }

    // 4. Add color palette if specified
    if (context.colors && context.colors.length > 0) {
      promptParts.push(`${context.colors.join(' and ')} color palette`);
      optimizations.push('Specified color palette');
    }

    // 5. Add quality keywords (Gemini-specific)
    const qualityTerms = this.selectQualityKeywords(context);
    promptParts.push(qualityTerms.join(', '));
    optimizations.push('Added Gemini-optimized quality keywords');

    // 6. End with mood/atmosphere (Gemini understands emotional context well)
    if (context.mood && context.mood.length > 0) {
      const moodPhrase = `${context.mood.slice(0, 3).join(', ')} atmosphere`;
      promptParts.push(moodPhrase);
      optimizations.push('Added mood/atmosphere for emotional context');
    }

    // Combine into paragraph-style prompt (Gemini optimization)
    const prompt = promptParts.join(', ');

    // Generate negative prompt
    const negativePrompt = this.generateNegativePrompt(context);

    // Calculate quality score
    const qualityScore = this.calculateQualityScore(prompt);

    return {
      prompt,
      negativePrompt,
      optimizations,
      qualityScore,
    };
  }

  /**
   * Select appropriate quality keywords based on context
   */
  private selectQualityKeywords(context: ContextAnalysis): string[] {
    const keywords: string[] = [];

    // Always include base quality
    keywords.push('high resolution', 'professional quality', 'detailed');

    // Add style-specific keywords
    if (context.style === 'photorealistic') {
      keywords.push('sharp focus', '8K quality');
    } else if (context.style === 'illustration') {
      keywords.push('clean lines', 'vibrant colors');
    } else if (context.style === 'minimalist') {
      keywords.push('clean', 'crisp');
    }

    // Add technical quality from context
    if (context.technical?.quality) {
      const qualityTerms = context.technical.quality.split(',').map((t) => t.trim());
      keywords.push(...qualityTerms.slice(0, 2)); // Add first 2 terms
    }

    // Remove duplicates and limit to 5
    return Array.from(new Set(keywords)).slice(0, 5);
  }

  /**
   * Generate negative prompt based on context
   */
  private generateNegativePrompt(context: ContextAnalysis): string {
    const negatives = [...DEFAULT_NEGATIVE_PROMPTS];

    // Add use-case specific negatives
    if (context.useCase === 'blog-header') {
      negatives.push('clickbait', 'sensational');
    } else if (context.useCase === 'social-post') {
      negatives.push('boring', 'unappealing');
    } else if (context.useCase === 'hero-banner') {
      negatives.push('small', 'unimpressive');
    } else if (context.useCase === 'product-feature') {
      negatives.push('damaged', 'cheap-looking');
    } else if (context.useCase === 'team-photo') {
      negatives.push('unflattering', 'awkward');
    }

    // Add style-specific negatives
    if (context.style === 'photorealistic') {
      negatives.push('artificial', 'fake', 'CGI');
    } else if (context.style === 'illustration') {
      negatives.push('photographic', 'realistic');
    } else if (context.style === 'minimalist') {
      negatives.push('cluttered', 'busy', 'complex');
    }

    // Remove duplicates
    return Array.from(new Set(negatives)).join(', ');
  }

  /**
   * Calculate quality score for the generated prompt
   */
  private calculateQualityScore(prompt: string): number {
    // Use existing validation from media-generator
    const validation = validatePrompt(prompt);

    return validation.score;
  }

  /**
   * Enhance prompt with additional details
   */
  enhancePrompt(
    basePrompt: TranslatedPrompt,
    additionalDetails: string
  ): TranslatedPrompt {
    // Append additional details to prompt
    const enhancedPrompt = `${basePrompt.prompt}, ${additionalDetails}`;

    // Recalculate quality score
    const qualityScore = this.calculateQualityScore(enhancedPrompt);

    return {
      ...basePrompt,
      prompt: enhancedPrompt,
      qualityScore,
      optimizations: [
        ...basePrompt.optimizations,
        'Enhanced with additional user details',
      ],
    };
  }

  /**
   * Optimize prompt for multi-turn refinement
   */
  optimizeForRefinement(
    originalPrompt: TranslatedPrompt,
    refinementInstructions: string
  ): string {
    // For Gemini, refinement instructions can be more conversational
    // Focus on what to change rather than repeating everything
    return `Based on the previous image, ${refinementInstructions}. Maintain the overall style and quality.`;
  }

  /**
   * Validate translated prompt meets quality standards
   */
  validateTranslation(translated: TranslatedPrompt): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check prompt length
    if (translated.prompt.length < 50) {
      issues.push('Prompt too short - may not have enough detail for quality output');
    }

    if (translated.prompt.length > 2000) {
      issues.push('Prompt too long - may exceed model limits');
    }

    // Check quality score
    if (translated.qualityScore < 60) {
      issues.push(
        `Quality score (${translated.qualityScore}) below recommended threshold (60)`
      );
    }

    // Check for required elements
    const hasSubject = translated.prompt.length > 10;
    const hasQuality = QUALITY_KEYWORDS.some((kw) =>
      translated.prompt.toLowerCase().includes(kw.toLowerCase())
    );

    if (!hasSubject) {
      issues.push('Missing clear subject description');
    }

    if (!hasQuality) {
      issues.push('Missing quality specifications');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  /**
   * Get example translations for different use cases
   */
  getExampleTranslations(): Record<string, TranslatedPrompt> {
    return {
      'blog-header': {
        prompt:
          'Editorial photography for blog article about AI marketing automation, wide banner format 16:9, professional magazine quality, engaging composition, modern business setting, soft natural lighting, vibrant yet professional color palette, high resolution, detailed, informative and professional atmosphere',
        negativePrompt:
          'blurry, low quality, distorted, watermark, text overlay, pixelated, amateur, generic stock photo, clickbait',
        optimizations: [
          'Front-loaded subject',
          'Added composition specs',
          'Added technical details',
          'Added quality keywords',
          'Added mood/atmosphere',
        ],
        qualityScore: 85,
      },
      'social-post': {
        prompt:
          'Eye-catching social media graphic about productivity tips, square format 1:1, bold central focus, vibrant gradient colors, high contrast, modern aesthetic, attention-grabbing composition, high resolution, professional design, energetic and engaging atmosphere',
        negativePrompt:
          'blurry, low quality, distorted, watermark, pixelated, amateur, generic stock photo, boring, unappealing',
        optimizations: [
          'Front-loaded subject',
          'Added composition specs',
          'Added quality keywords',
          'Added mood/atmosphere',
        ],
        qualityScore: 90,
      },
    };
  }
}