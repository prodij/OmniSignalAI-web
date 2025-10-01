/**
 * Negative Prompt Builder
 * Generates anti-artifact negative prompts
 */

import { PromptEnhancementRequest } from './types';

/**
 * Common AI artifacts to avoid
 */
const COMMON_ARTIFACTS = [
  'blurry',
  'low quality',
  'distorted',
  'pixelated',
  'amateur',
  'synthetic',
  'artificial',
  'fake looking',
  'watermark',
  'text overlay',
  'logo',
  'signature',
];

/**
 * Anatomical artifacts (for images with people)
 */
const ANATOMICAL_ARTIFACTS = [
  'extra fingers',
  'missing fingers',
  'deformed hands',
  'mutated hands',
  'extra limbs',
  'missing limbs',
  'fused fingers',
  'bad anatomy',
  'unnatural proportions',
  'asymmetric face',
];

/**
 * Photography artifacts
 */
const PHOTOGRAPHY_ARTIFACTS = [
  'poor composition',
  'cluttered background',
  'messy',
  'chaotic',
  'oversaturated',
  'undersaturated',
  'overexposed',
  'underexposed',
  'harsh shadows',
  'flat lighting',
  'unnatural lighting',
];

/**
 * Generic/stock photo issues
 */
const GENERIC_ISSUES = [
  'generic stock photo',
  'cliché',
  'boring',
  'uninspired',
  'typical',
  'overused concept',
  'clickbait',
  'sensational',
];

/**
 * Use case specific artifacts
 */
const USE_CASE_ARTIFACTS: Record<string, string[]> = {
  'blog-header': ['clickbait style', 'sensational', 'over-dramatic', 'cheesy'],
  'social-post': ['too busy', 'overwhelming', 'hard to read', 'cluttered'],
  'hero-banner': ['empty space', 'sparse', 'underwhelming', 'plain'],
  'product-feature': ['unrealistic product', 'floating objects', 'impossible physics'],
  'team-photo': ['stiff poses', 'forced smiles', 'awkward positioning'],
  'concept-illustration': ['too literal', 'uninspired metaphor', 'confusing concept'],
};

/**
 * Build comprehensive negative prompt
 */
export function buildNegativePrompt(
  request: PromptEnhancementRequest,
  additionalNegatives: string[] = []
): string {
  const negatives: string[] = [];

  // Add common artifacts
  negatives.push(...COMMON_ARTIFACTS);

  // Add photography artifacts
  negatives.push(...PHOTOGRAPHY_ARTIFACTS);

  // Add generic issues
  negatives.push(...GENERIC_ISSUES);

  // Check if intent likely includes people
  const hasPeople =
    request.userIntent.toLowerCase().includes('person') ||
    request.userIntent.toLowerCase().includes('people') ||
    request.userIntent.toLowerCase().includes('man') ||
    request.userIntent.toLowerCase().includes('woman') ||
    request.userIntent.toLowerCase().includes('team') ||
    request.userIntent.toLowerCase().includes('worker') ||
    request.userIntent.toLowerCase().includes('executive') ||
    request.useCase === 'team-photo';

  if (hasPeople) {
    negatives.push(...ANATOMICAL_ARTIFACTS);
  }

  // Add use case specific negatives
  const useCaseNegatives = USE_CASE_ARTIFACTS[request.useCase];
  if (useCaseNegatives) {
    negatives.push(...useCaseNegatives);
  }

  // Add any additional negatives
  if (additionalNegatives.length > 0) {
    negatives.push(...additionalNegatives);
  }

  // Deduplicate and join
  const uniqueNegatives = Array.from(new Set(negatives));

  return uniqueNegatives.join(', ');
}

/**
 * Extract additional negatives from critique
 */
export function extractNegativesFromCritique(critique: string): string[] {
  const negatives: string[] = [];

  // Common patterns in critiques
  const patterns = [
    /avoid\s+([^.,]+)/gi,
    /remove\s+([^.,]+)/gi,
    /eliminate\s+([^.,]+)/gi,
    /reduce\s+([^.,]+)/gi,
    /fix\s+([^.,]+)/gi,
  ];

  patterns.forEach(pattern => {
    const matches = critique.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        negatives.push(match[1].trim().toLowerCase());
      }
    }
  });

  return negatives;
}