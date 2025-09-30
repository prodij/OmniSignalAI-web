/**
 * Prompt Engineering Guide for AI Image Generation
 * Based on 2025 best practices for Gemini 2.5 Flash Image Preview
 */

import { PromptTemplate, EnhancedPrompt, ImageStyle } from './types';

/**
 * Style-specific prompt enhancements optimized for Gemini
 */
export const STYLE_ENHANCEMENTS: Record<ImageStyle, string> = {
  photorealistic:
    'photorealistic, high resolution, professional photography, natural lighting, sharp focus, detailed textures, 8K quality',
  illustration:
    'digital illustration, clean lines, vibrant colors, professional design, vector style, modern aesthetic',
  minimalist:
    'minimalist design, clean composition, negative space, simple geometric shapes, limited color palette, modern and elegant',
  professional:
    'professional business photography, corporate style, clean background, studio lighting, polished and refined',
  marketing:
    'marketing campaign quality, eye-catching, compelling visual, commercial photography, brand-focused, professional',
  editorial:
    'editorial photography, magazine quality, artistic composition, storytelling visual, sophisticated lighting',
  'social-media':
    'social media optimized, engaging, vibrant, attention-grabbing, mobile-friendly composition, trending aesthetic',
  'hero-banner':
    'hero banner style, wide composition, dramatic, professional, high-impact visual, website header quality',
  custom: '',
};

/**
 * Common negative prompts to avoid unwanted elements
 */
export const DEFAULT_NEGATIVE_PROMPTS = [
  'blurry',
  'low quality',
  'distorted',
  'watermark',
  'text overlay',
  'extra limbs',
  'deformed',
  'pixelated',
  'artificial',
  'generic stock photo',
];

/**
 * Best practices for prompt engineering
 */
export const PROMPT_BEST_PRACTICES = {
  structure: [
    'Start with the main subject (what)',
    'Add descriptive details (how it looks)',
    'Specify style and aesthetic (how it should feel)',
    'Include composition details (framing, angle)',
    'Add technical specifications (lighting, camera)',
  ],
  specificity: [
    'Use concrete, specific language instead of vague terms',
    'Include exact colors, sizes, and quantities',
    'Specify camera angles and perspectives',
    'Detail lighting conditions and mood',
  ],
  iteration: [
    'Generate first, then refine iteratively',
    'Change one aspect at a time for control',
    'Use multi-turn conversations for consistency',
    'Reference previous images when iterating',
  ],
  geminiSpecific: [
    'Works well with paragraph-style prompts',
    'Supports multi-turn refinement conversations',
    'Can maintain character consistency across images',
    'Excellent at text rendering within images',
    'Handles complex blending and transformations',
  ],
};

/**
 * Build a structured prompt from template
 */
export function buildPromptFromTemplate(template: PromptTemplate): string {
  const parts: string[] = [];

  // Main subject (required)
  parts.push(template.subject);

  // Style enhancements
  if (template.style && template.style !== 'custom') {
    parts.push(STYLE_ENHANCEMENTS[template.style]);
  }

  // Composition
  if (template.composition) {
    parts.push(template.composition);
  }

  // Action/scene
  if (template.action) {
    parts.push(template.action);
  }

  // Location/environment
  if (template.location) {
    parts.push(`set in ${template.location}`);
  }

  // Additional details
  if (template.details && template.details.length > 0) {
    parts.push(template.details.join(', '));
  }

  // Technical specifications
  if (template.technical && template.technical.length > 0) {
    parts.push(template.technical.join(', '));
  }

  return parts.filter(Boolean).join(', ');
}

/**
 * Enhance a basic prompt with best practices
 */
export function enhancePrompt(
  basicPrompt: string,
  options?: {
    style?: ImageStyle;
    addDefaults?: boolean;
    customEnhancements?: string[];
  }
): EnhancedPrompt {
  const enhancements: string[] = [];
  const parts: string[] = [basicPrompt];

  // Add style enhancements
  if (options?.style && options.style !== 'custom') {
    parts.push(STYLE_ENHANCEMENTS[options.style]);
    enhancements.push(`Added ${options.style} style enhancements`);
  }

  // Add default quality enhancements
  if (options?.addDefaults !== false) {
    parts.push('high quality, professional, detailed');
    enhancements.push('Added default quality enhancements');
  }

  // Add custom enhancements
  if (options?.customEnhancements && options.customEnhancements.length > 0) {
    parts.push(...options.customEnhancements);
    enhancements.push('Added custom enhancements');
  }

  return {
    prompt: parts.join(', '),
    negativePrompt: DEFAULT_NEGATIVE_PROMPTS.join(', '),
    enhancements,
  };
}

/**
 * Pre-built templates for common use cases
 */
export const COMMON_TEMPLATES = {
  blogHeader: (topic: string): PromptTemplate => ({
    subject: `professional blog header image about ${topic}`,
    style: 'editorial',
    composition: 'wide banner format, centered composition',
    technical: ['soft lighting', 'depth of field', 'subtle gradients'],
    details: ['modern', 'clean', 'engaging'],
  }),

  socialMediaPost: (topic: string): PromptTemplate => ({
    subject: `eye-catching social media graphic about ${topic}`,
    style: 'social-media',
    composition: 'square format, bold central focus',
    technical: ['vibrant colors', 'high contrast'],
    details: ['trendy', 'shareable', 'attention-grabbing'],
  }),

  productFeature: (product: string, feature: string): PromptTemplate => ({
    subject: `${product} showcasing ${feature}`,
    style: 'marketing',
    composition: 'clean background, product in focus',
    technical: ['professional lighting', 'sharp details'],
    details: ['modern', 'premium quality', 'appealing'],
  }),

  heroSection: (concept: string): PromptTemplate => ({
    subject: `hero banner illustrating ${concept}`,
    style: 'hero-banner',
    composition: 'wide panoramic view, dramatic perspective',
    technical: ['cinematic lighting', 'depth', 'high resolution'],
    details: ['impressive', 'memorable', 'professional'],
  }),

  teamMember: (role: string, setting: string): PromptTemplate => ({
    subject: `professional ${role} portrait`,
    style: 'professional',
    location: setting,
    composition: 'medium shot, slight angle',
    technical: ['natural lighting', 'soft focus background'],
    details: ['approachable', 'confident', 'authentic'],
  }),

  conceptIllustration: (concept: string): PromptTemplate => ({
    subject: `abstract illustration of ${concept}`,
    style: 'illustration',
    composition: 'balanced, centered',
    technical: ['clean lines', 'flat design', 'modern color palette'],
    details: ['clear', 'professional', 'engaging'],
  }),
};

/**
 * Validate prompt quality and provide suggestions
 */
export function validatePrompt(prompt: string): {
  isValid: boolean;
  score: number;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let score = 100;

  // Check length
  if (prompt.length < 10) {
    suggestions.push('Prompt is too short. Add more descriptive details.');
    score -= 30;
  } else if (prompt.length < 30) {
    suggestions.push('Consider adding more specific details for better results.');
    score -= 10;
  }

  // Check for vague terms
  const vagueTerms = ['nice', 'good', 'cool', 'awesome', 'thing', 'stuff'];
  const hasVagueTerms = vagueTerms.some((term) =>
    prompt.toLowerCase().includes(term)
  );
  if (hasVagueTerms) {
    suggestions.push('Replace vague terms with specific descriptive language.');
    score -= 15;
  }

  // Check for style specification
  const hasStyleKeywords = Object.values(STYLE_ENHANCEMENTS).some((style) =>
    prompt.toLowerCase().includes(style.toLowerCase().split(',')[0])
  );
  if (!hasStyleKeywords) {
    suggestions.push('Consider adding a style specification (e.g., photorealistic, illustration).');
    score -= 10;
  }

  // Check for technical details
  const technicalTerms = ['lighting', 'camera', 'angle', 'composition', 'focus'];
  const hasTechnicalTerms = technicalTerms.some((term) =>
    prompt.toLowerCase().includes(term)
  );
  if (!hasTechnicalTerms) {
    suggestions.push('Add technical details like lighting or camera angle for more control.');
    score -= 10;
  }

  return {
    isValid: score >= 50,
    score: Math.max(0, score),
    suggestions,
  };
}

/**
 * Generate example prompts for different scenarios
 */
export function getExamplePrompts() {
  return {
    marketing: {
      prompt: buildPromptFromTemplate(COMMON_TEMPLATES.heroSection('AI-powered content creation')),
      description: 'Hero banner for marketing page',
    },
    blog: {
      prompt: buildPromptFromTemplate(COMMON_TEMPLATES.blogHeader('social media marketing strategies')),
      description: 'Blog article header image',
    },
    social: {
      prompt: buildPromptFromTemplate(
        COMMON_TEMPLATES.socialMediaPost('productivity tips for entrepreneurs')
      ),
      description: 'Social media post graphic',
    },
    product: {
      prompt: buildPromptFromTemplate(
        COMMON_TEMPLATES.productFeature('SaaS dashboard', 'analytics visualization')
      ),
      description: 'Product feature showcase',
    },
  };
}