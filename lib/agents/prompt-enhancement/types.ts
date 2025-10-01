/**
 * Types for Prompt Enhancement Agent
 */

export interface PromptEnhancementRequest {
  userIntent: string;
  useCase: 'blog-header' | 'social-post' | 'hero-banner' | 'product-feature' | 'team-photo' | 'concept-illustration';
  stylePreference?: 'photorealistic' | 'editorial' | 'minimalist' | 'cinematic' | 'artistic';
  aspectRatio?: '16:9' | '1:1' | '4:5' | '9:16';
  additionalContext?: string;
}

export interface EnhancedPrompt {
  optimizedPrompt: string;
  negativePrompt: string;
  reasoning: string;
  expectedIssues: string[];
  technicalDetails: {
    composition: string;
    lighting: string;
    cameraSettings: string;
    colorPalette: string;
  };
  iterationNumber: number;
  confidenceScore: number;
}

export interface ImageCritique {
  artifacts: string[];
  genericIssues: string[];
  compositionProblems: string[];
  lightingIssues: string[];
  overallQuality: number; // 0-100
  suggestedImprovements: string[];
  shouldRefine: boolean;
}

export interface PromptIterationHistory {
  iteration: number;
  prompt: EnhancedPrompt;
  imageUrl?: string;
  critique?: ImageCritique;
  timestamp: number;
}

export interface PromptEnhancementResult {
  success: boolean;
  finalPrompt: EnhancedPrompt;
  iterations: PromptIterationHistory[];
  totalIterations: number;
  finalImageUrl?: string;
  processingTime: number;
  error?: string;
}

export interface GeminiProConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
}

export const DEFAULT_GEMINI_PRO_CONFIG: GeminiProConfig = {
  model: 'google/gemini-2.5-flash-preview-09-2025', // Using Gemini 2.5 Flash for prompt refinement
  temperature: 0.7,
  maxTokens: 8192,
  topP: 0.95,
  topK: 40,
};