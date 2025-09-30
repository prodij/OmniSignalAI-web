/**
 * OmniSignalAI Media Generator
 *
 * AI-powered image generation tool for marketing campaigns, blog content, and website assets.
 * Powered by Gemini 2.5 Flash Image Preview via OpenRouter.
 *
 * @module media-generator
 *
 * @example Basic Usage
 * ```typescript
 * import { generateImage } from '@/lib/media-generator';
 *
 * const result = await generateImage({
 *   prompt: 'Professional hero banner for AI-powered social media platform, modern design, vibrant colors'
 * });
 *
 * if (result.success) {
 *   console.log('Image URL:', result.imageUrl);
 * }
 * ```
 *
 * @example Using Prompt Templates
 * ```typescript
 * import { generateImage, COMMON_TEMPLATES, buildPromptFromTemplate } from '@/lib/media-generator';
 *
 * const prompt = buildPromptFromTemplate(
 *   COMMON_TEMPLATES.blogHeader('AI marketing automation')
 * );
 *
 * const result = await generateImage({ prompt });
 * ```
 *
 * @example Multi-turn Refinement
 * ```typescript
 * import { generateImage, refineImage } from '@/lib/media-generator';
 *
 * // Generate initial image
 * const initial = await generateImage({
 *   prompt: 'Modern office workspace with laptop'
 * });
 *
 * // Refine it
 * const refined = await refineImage(
 *   'Modern office workspace with laptop',
 *   'Make the lighting warmer and add plants in the background'
 * );
 * ```
 */

// Core functionality
export {
  generateImage,
  generateImageVariations,
  refineImage,
} from './image-generator';

// Types
export type {
  ImageGenerationRequest,
  ImageGenerationResponse,
  EnhancedPrompt,
  ImageStyle,
  PromptTemplate,
} from './types';

// Prompt engineering tools
export {
  buildPromptFromTemplate,
  enhancePrompt,
  validatePrompt,
  getExamplePrompts,
  COMMON_TEMPLATES,
  STYLE_ENHANCEMENTS,
  DEFAULT_NEGATIVE_PROMPTS,
  PROMPT_BEST_PRACTICES,
} from './prompt-guide';

// Utilities
export { validateEnvironment } from './utils';

/**
 * Quick start guide for AI agents
 */
export const AGENT_QUICK_START = {
  purpose: 'Generate high-quality images for marketing campaigns, blog articles, and website content',

  models: {
    current: 'google/gemini-2.5-flash-image-preview',
    capabilities: [
      'Text-to-image generation (1024px)',
      'Multi-turn conversations for refinement',
      'Character consistency across generations',
      'High-quality text rendering in images',
      'Natural language image editing',
    ],
  },

  setup: {
    requirements: ['OPENROUTER_API_KEY in .env file'],
    installation: 'Already installed - import from @/lib/media-generator',
  },

  basicUsage: `
    import { generateImage } from '@/lib/media-generator';

    const result = await generateImage({
      prompt: 'your detailed prompt here'
    });
  `,

  bestPractices: [
    'Be specific and detailed in prompts',
    'Use COMMON_TEMPLATES for consistent results',
    'Include style specifications (photorealistic, illustration, etc.)',
    'Add technical details (lighting, camera angle, composition)',
    'Use enhancePrompt() to improve basic prompts',
    'Use validatePrompt() to check prompt quality before generation',
    'Use refineImage() for iterative improvements',
  ],

  commonUseCases: {
    blogHeader: 'COMMON_TEMPLATES.blogHeader(topic)',
    socialMedia: 'COMMON_TEMPLATES.socialMediaPost(topic)',
    heroSection: 'COMMON_TEMPLATES.heroSection(concept)',
    productFeature: 'COMMON_TEMPLATES.productFeature(product, feature)',
  },

  errorHandling: `
    const result = await generateImage({ prompt });

    if (!result.success) {
      console.error('Generation failed:', result.error);
      // Handle error appropriately
    } else {
      // Use result.imageUrl for web display
      // Use result.filePath for server-side operations
    }
  `,

  videoGeneration: {
    status: 'Not yet available',
    reason: 'OpenRouter does not currently support video generation models',
    workaround: 'Use ImageRouter API for video generation (separate service)',
    roadmap: 'Coming soon to OpenRouter',
  },
};

/**
 * Configuration constants
 */
export const CONFIG = {
  MODEL: 'google/gemini-2.5-flash-image-preview',
  OUTPUT_DIR: 'public/generated/images',
  MAX_PROMPT_LENGTH: 2000,
  DEFAULT_IMAGE_SIZE: 1024,
  SUPPORTED_FORMATS: ['png', 'jpeg', 'jpg'],
} as const;