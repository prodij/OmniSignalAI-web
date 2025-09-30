/**
 * Media Generator Types
 * TypeScript interfaces for AI-powered image generation
 */

/**
 * Image generation request parameters
 */
export interface ImageGenerationRequest {
  /** The text prompt describing the image to generate */
  prompt: string;

  /** Optional filename (without extension). Auto-generated if not provided */
  filename?: string;

  /** Optional reference images for style consistency */
  referenceImages?: string[];

  /** Negative prompt: what to avoid in the image */
  negativePrompt?: string;

  /** Additional context or instructions for multi-turn refinement */
  context?: string[];
}

/**
 * Image generation response
 */
export interface ImageGenerationResponse {
  /** Whether the generation was successful */
  success: boolean;

  /** Public URL to the generated image */
  imageUrl?: string;

  /** Local file path (for server-side use) */
  filePath?: string;

  /** Original prompt used */
  prompt: string;

  /** Error message if generation failed */
  error?: string;

  /** Base64 image data (optional, for direct use) */
  base64Data?: string;
}

/**
 * Prompt engineering helper result
 */
export interface EnhancedPrompt {
  /** The enhanced prompt ready for generation */
  prompt: string;

  /** Negative prompt to avoid unwanted elements */
  negativePrompt?: string;

  /** Explanation of enhancements made */
  enhancements: string[];
}

/**
 * Image style presets for common use cases
 */
export type ImageStyle =
  | 'photorealistic'
  | 'illustration'
  | 'minimalist'
  | 'professional'
  | 'marketing'
  | 'editorial'
  | 'social-media'
  | 'hero-banner'
  | 'custom';

/**
 * Prompt template for structured generation
 */
export interface PromptTemplate {
  /** Main subject of the image */
  subject: string;

  /** Visual style/aesthetic */
  style: ImageStyle;

  /** Composition details (angle, framing, etc.) */
  composition?: string;

  /** Action or scene description */
  action?: string;

  /** Location or environment */
  location?: string;

  /** Additional details */
  details?: string[];

  /** Technical specifications (lighting, camera, etc.) */
  technical?: string[];
}

/**
 * OpenRouter API response structure
 */
export interface OpenRouterImageResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
      images?: Array<{
        type: 'image_url';
        image_url: {
          url: string; // data:image/png;base64,...
        };
      }>;
    };
  }>;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}