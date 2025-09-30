/**
 * Image Generation Agent Types
 * TypeScript interfaces for autonomous image generation
 */

/**
 * Use case categories for image generation
 */
export type UseCase =
  | 'blog-header'
  | 'social-post'
  | 'hero-banner'
  | 'product-feature'
  | 'team-photo'
  | 'concept-illustration'
  | 'custom';

/**
 * Target platforms for image generation
 */
export type Platform =
  | 'web'
  | 'blog'
  | 'twitter'
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'email'
  | 'print';

/**
 * Style preferences for image generation
 */
export type StylePreference =
  | 'photorealistic'
  | 'illustration'
  | 'minimalist'
  | 'professional'
  | 'marketing'
  | 'editorial'
  | 'social-media'
  | 'custom';

/**
 * Agent request interface - simple natural language input
 */
export interface ImageGenerationAgentRequest {
  /** Natural language description of what to generate */
  intent: string;

  /** Optional use case hint (auto-detected if not provided) */
  useCase?: UseCase;

  /** Optional platform hint (auto-detected if not provided) */
  platform?: Platform;

  /** Optional style preference (auto-detected if not provided) */
  stylePreference?: StylePreference;

  /** Optional refinement instructions for multi-turn generation */
  refinementInstructions?: string[];

  /** Optional custom filename */
  filename?: string;
}

/**
 * Detected intent from user request
 */
export interface DetectedIntent {
  /** Primary use case */
  useCase: UseCase;

  /** Main topic/subject */
  topic: string;

  /** Detected style */
  style: StylePreference;

  /** Target platform (if detected) */
  platform?: Platform;

  /** Confidence score (0-100) */
  confidence: number;

  /** Key phrases that influenced detection */
  signals: string[];
}

/**
 * Context analysis result
 */
export interface ContextAnalysis {
  /** Use case type */
  useCase: UseCase;

  /** Main subject/topic */
  subject: string;

  /** Visual style to use */
  style: StylePreference;

  /** Composition requirements */
  composition: {
    aspectRatio?: string;
    framing?: string;
    perspective?: string;
  };

  /** Technical specifications */
  technical: {
    lighting?: string;
    camera?: string;
    quality?: string;
  };

  /** Mood/atmosphere */
  mood: string[];

  /** Color palette suggestions */
  colors?: string[];
}

/**
 * Translated prompt optimized for Nano Banana
 */
export interface TranslatedPrompt {
  /** Optimized prompt for Gemini 2.5 Flash */
  prompt: string;

  /** Negative prompt to avoid unwanted elements */
  negativePrompt: string;

  /** Applied optimizations */
  optimizations: string[];

  /** Estimated quality score (0-100) */
  qualityScore: number;
}

/**
 * Agent response with transparency
 */
export interface ImageGenerationAgentResponse {
  /** Whether generation was successful */
  success: boolean;

  /** Public URL to generated image */
  imageUrl?: string;

  /** File system path */
  filePath?: string;

  /** Agent reasoning (for transparency) */
  reasoning: {
    detectedIntent: DetectedIntent;
    contextAnalysis: ContextAnalysis;
    translatedPrompt: TranslatedPrompt;
  };

  /** Original user intent */
  originalIntent: string;

  /** Error message if failed */
  error?: string;

  /** Processing time in milliseconds */
  processingTime?: number;
}

/**
 * Agent configuration
 */
export interface AgentConfig {
  /** Model to use (default: google/gemini-2.5-flash-image-preview) */
  model?: string;

  /** Prompt translation settings */
  promptTranslation: {
    /** Use pre-built templates when available */
    useTemplates: boolean;

    /** Auto-enhance prompts with best practices */
    enhancePrompts: boolean;

    /** Add negative prompts automatically */
    addNegativePrompts: boolean;

    /** Minimum quality score to accept (0-100) */
    minQualityScore: number;
  };

  /** Generation settings */
  generation: {
    /** Retry on failure */
    retryOnFailure: boolean;

    /** Maximum retry attempts */
    maxRetries: number;

    /** Enable multi-turn refinement */
    enableRefinement: boolean;

    /** Timeout in milliseconds */
    timeout: number;
  };

  /** File management */
  fileManagement: {
    /** Output directory */
    outputDirectory: string;

    /** Filename pattern */
    filenamePattern: string;
  };

  /** Logging */
  logging: {
    /** Enable verbose logging */
    verbose: boolean;

    /** Log intent detection */
    logIntentDetection: boolean;

    /** Log prompt translation */
    logPromptTranslation: boolean;

    /** Log generation details */
    logGeneration: boolean;
  };
}

/**
 * Intent detection patterns
 */
export interface IntentPattern {
  /** Use case this pattern matches */
  useCase: UseCase;

  /** Keywords that trigger this pattern */
  keywords: string[];

  /** Confidence boost for this pattern */
  confidenceBoost: number;
}

/**
 * Style detection signals
 */
export interface StyleSignal {
  /** Style this signal indicates */
  style: StylePreference;

  /** Keywords that indicate this style */
  keywords: string[];

  /** Weight of this signal */
  weight: number;
}