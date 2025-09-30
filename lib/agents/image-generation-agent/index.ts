/**
 * Image Generation Agent
 * Autonomous agent for AI-powered image generation
 *
 * @example Basic Usage
 * ```typescript
 * import { ImageGenerationAgent } from '@/lib/agents/image-generation-agent';
 *
 * const agent = new ImageGenerationAgent();
 *
 * const result = await agent.generate({
 *   intent: 'Create a professional blog header about AI marketing automation'
 * });
 *
 * if (result.success) {
 *   console.log('Image created:', result.imageUrl);
 *   console.log('Detected:', result.reasoning.detectedIntent.useCase);
 * }
 * ```
 *
 * @example With Configuration
 * ```typescript
 * const agent = new ImageGenerationAgent({
 *   logging: {
 *     verbose: true,
 *     logIntentDetection: true,
 *   }
 * });
 * ```
 */

// Main agent
export { ImageGenerationAgent } from './agent';

// Types
export type {
  ImageGenerationAgentRequest,
  ImageGenerationAgentResponse,
  AgentConfig,
  DetectedIntent,
  ContextAnalysis,
  TranslatedPrompt,
  UseCase,
  Platform,
  StylePreference,
} from './types';

// Configuration
export { DEFAULT_CONFIG, PRESET_CONFIGS, createConfig } from './config';

// Components (for advanced usage)
export { IntentDetector } from './intent-detector';
export { ContextAnalyzer } from './context-analyzer';
export { PromptTranslator } from './prompt-translator';

/**
 * Quick start helper - create and use agent in one call
 */
export async function generateImageWithAgent(intent: string) {
  const { ImageGenerationAgent: Agent } = await import('./agent');
  const agent = new Agent();
  return agent.generate({ intent });
}

/**
 * Agent capabilities and features
 */
export const AGENT_CAPABILITIES = {
  name: 'Image Generation Agent',
  version: '1.0.0',

  features: [
    'Natural language intent detection',
    'Automatic use case classification (6 types)',
    'Context-aware prompt optimization',
    'Nano Banana (Gemini 2.5 Flash) specific tuning',
    'Multi-turn refinement support',
    'Automatic retry with exponential backoff',
    'Transparent reasoning and logging',
  ],

  supportedUseCases: [
    'blog-header - Article header images',
    'social-post - Social media graphics',
    'hero-banner - Website hero sections',
    'product-feature - Product showcases',
    'team-photo - Team member portraits',
    'concept-illustration - Abstract concepts',
  ],

  workflow: [
    '1. Intent Detection - Parse natural language',
    '2. Context Analysis - Determine optimal specs',
    '3. Prompt Translation - Optimize for Nano Banana',
    '4. Image Generation - Call OpenRouter API',
    '5. File Management - Save to web-accessible location',
  ],
};