/**
 * Agent Configuration
 * Default configuration for the Image Generation Agent
 */

import { AgentConfig } from './types';

/**
 * Default agent configuration
 */
export const DEFAULT_CONFIG: AgentConfig = {
  /** Model configuration */
  model: 'google/gemini-2.5-flash-image-preview',

  /** Prompt translation settings */
  promptTranslation: {
    useTemplates: true,
    enhancePrompts: true,
    addNegativePrompts: true,
    minQualityScore: 60,
    useLLMEnhancement: false, // Use Gemini 2.5 Flash for advanced prompt refinement
    llmEnhancementIterations: 3, // Number of refinement iterations (2-4 recommended)
  },

  /** Generation settings */
  generation: {
    retryOnFailure: true,
    maxRetries: 3,
    enableRefinement: true,
    timeout: 120000, // 2 minutes
  },

  /** File management */
  fileManagement: {
    outputDirectory: 'public/generated/images',
    filenamePattern: '{slug}-{timestamp}',
  },

  /** Logging */
  logging: {
    verbose: false,
    logIntentDetection: false,
    logPromptTranslation: false,
    logGeneration: false,
  },
};

/**
 * Create custom configuration by merging with defaults
 */
export function createConfig(overrides?: Partial<AgentConfig>): AgentConfig {
  if (!overrides) return DEFAULT_CONFIG;

  return {
    model: overrides.model || DEFAULT_CONFIG.model,
    promptTranslation: {
      ...DEFAULT_CONFIG.promptTranslation,
      ...overrides.promptTranslation,
    },
    generation: {
      ...DEFAULT_CONFIG.generation,
      ...overrides.generation,
    },
    fileManagement: {
      ...DEFAULT_CONFIG.fileManagement,
      ...overrides.fileManagement,
    },
    logging: {
      ...DEFAULT_CONFIG.logging,
      ...overrides.logging,
    },
  };
}

/**
 * Preset configurations for common scenarios
 */
export const PRESET_CONFIGS = {
  /**
   * Fast generation with minimal quality checks
   */
  fast: createConfig({
    promptTranslation: {
      useTemplates: true,
      enhancePrompts: false,
      addNegativePrompts: true,
      minQualityScore: 50,
    },
    generation: {
      retryOnFailure: false,
      maxRetries: 1,
      enableRefinement: false,
      timeout: 60000,
    },
    logging: {
      verbose: false,
      logIntentDetection: false,
      logPromptTranslation: false,
      logGeneration: false,
    },
  }),

  /**
   * High quality generation with all optimizations
   */
  quality: createConfig({
    promptTranslation: {
      useTemplates: true,
      enhancePrompts: true,
      addNegativePrompts: true,
      minQualityScore: 80,
    },
    generation: {
      retryOnFailure: true,
      maxRetries: 3,
      enableRefinement: true,
      timeout: 180000,
    },
    logging: {
      verbose: false,
      logIntentDetection: false,
      logPromptTranslation: false,
      logGeneration: false,
    },
  }),

  /**
   * Debug mode with verbose logging
   */
  debug: createConfig({
    promptTranslation: {
      useTemplates: true,
      enhancePrompts: true,
      addNegativePrompts: true,
      minQualityScore: 60,
    },
    generation: {
      retryOnFailure: true,
      maxRetries: 3,
      enableRefinement: true,
      timeout: 120000,
    },
    logging: {
      verbose: true,
      logIntentDetection: true,
      logPromptTranslation: true,
      logGeneration: true,
    },
  }),
};