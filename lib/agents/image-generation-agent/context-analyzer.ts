/**
 * Context Analyzer
 * Analyzes detected intent to determine optimal style, composition, and technical requirements
 */

import { DetectedIntent, ContextAnalysis, UseCase, StylePreference } from './types';

/**
 * Aspect ratio recommendations by use case
 */
const ASPECT_RATIOS: Record<UseCase, string> = {
  'blog-header': '16:9',
  'social-post': '1:1',
  'hero-banner': '16:9',
  'product-feature': '4:3',
  'team-photo': '3:4',
  'concept-illustration': '16:9',
  custom: '16:9',
};

/**
 * Composition recommendations by use case
 */
const COMPOSITION_SPECS: Record<
  UseCase,
  { framing?: string; perspective?: string; focus?: string }
> = {
  'blog-header': {
    framing: 'wide banner format',
    perspective: 'eye-level or slightly elevated',
    focus: 'centered or rule of thirds',
  },
  'social-post': {
    framing: 'square format, bold central focus',
    perspective: 'direct, engaging angle',
    focus: 'centered with negative space',
  },
  'hero-banner': {
    framing: 'wide panoramic view',
    perspective: 'dramatic perspective',
    focus: 'layered depth',
  },
  'product-feature': {
    framing: 'clean background, product in focus',
    perspective: 'slight angle showcasing features',
    focus: 'product centered',
  },
  'team-photo': {
    framing: 'medium shot, portrait orientation',
    perspective: 'eye-level, slight angle',
    focus: 'subject centered with soft background',
  },
  'concept-illustration': {
    framing: 'balanced, centered composition',
    perspective: 'abstract or flat design',
    focus: 'concept as focal point',
  },
  custom: {
    framing: 'balanced composition',
    perspective: 'natural perspective',
    focus: 'subject-focused',
  },
};

/**
 * Technical specifications by style
 */
const TECHNICAL_SPECS: Record<
  StylePreference,
  { lighting?: string; camera?: string; quality?: string }
> = {
  photorealistic: {
    lighting: 'natural lighting, soft diffused',
    camera: 'professional camera, shallow depth of field',
    quality: 'high resolution, sharp focus, detailed textures, 8K quality',
  },
  illustration: {
    lighting: 'flat or stylized lighting',
    camera: 'illustrative perspective',
    quality: 'clean lines, vibrant colors, vector-quality',
  },
  minimalist: {
    lighting: 'clean, even lighting',
    camera: 'simple perspective',
    quality: 'clean, crisp, high contrast',
  },
  professional: {
    lighting: 'professional studio lighting',
    camera: 'professional camera setup',
    quality: 'high resolution, polished, refined',
  },
  marketing: {
    lighting: 'dramatic, eye-catching lighting',
    camera: 'dynamic angles',
    quality: 'commercial quality, high impact',
  },
  editorial: {
    lighting: 'natural or ambient lighting',
    camera: 'magazine-quality photography',
    quality: 'publication-ready, sophisticated',
  },
  'social-media': {
    lighting: 'bright, vibrant lighting',
    camera: 'mobile-friendly perspective',
    quality: 'shareable quality, attention-grabbing',
  },
  custom: {
    lighting: 'appropriate lighting',
    camera: 'standard perspective',
    quality: 'high quality',
  },
};

/**
 * Mood keywords by use case and style
 */
const MOOD_KEYWORDS: Record<UseCase, string[]> = {
  'blog-header': ['informative', 'engaging', 'professional', 'thoughtful'],
  'social-post': ['attention-grabbing', 'shareable', 'energetic', 'vibrant'],
  'hero-banner': ['impressive', 'inspiring', 'memorable', 'impactful'],
  'product-feature': ['appealing', 'innovative', 'desirable', 'premium'],
  'team-photo': ['approachable', 'confident', 'professional', 'authentic'],
  'concept-illustration': ['clear', 'insightful', 'creative', 'elegant'],
  custom: ['professional', 'high-quality', 'engaging'],
};

/**
 * Color palette suggestions by topic keywords
 */
const COLOR_PALETTES: Record<string, string[]> = {
  technology: ['blue', 'cyan', 'silver', 'modern gradients'],
  business: ['navy', 'gray', 'professional tones'],
  creative: ['vibrant', 'colorful', 'bold contrasts'],
  nature: ['green', 'earth tones', 'natural colors'],
  health: ['blue', 'green', 'white', 'calming tones'],
  finance: ['blue', 'gold', 'professional', 'trustworthy colors'],
  education: ['blue', 'orange', 'bright', 'engaging colors'],
  food: ['warm tones', 'appetizing colors', 'natural'],
};

/**
 * Context Analyzer class
 */
export class ContextAnalyzer {
  /**
   * Analyze context from detected intent
   */
  analyzeContext(detectedIntent: DetectedIntent): ContextAnalysis {
    const { useCase, topic, style, platform } = detectedIntent;

    // Determine composition
    const composition = {
      aspectRatio: ASPECT_RATIOS[useCase],
      framing: COMPOSITION_SPECS[useCase].framing,
      perspective: COMPOSITION_SPECS[useCase].perspective,
    };

    // Determine technical specs
    const technical = {
      lighting: TECHNICAL_SPECS[style].lighting,
      camera: TECHNICAL_SPECS[style].camera,
      quality: TECHNICAL_SPECS[style].quality,
    };

    // Determine mood
    const mood = this.determineMood(useCase, style, topic);

    // Determine color palette
    const colors = this.determineColorPalette(topic);

    // Extract subject
    const subject = this.extractSubject(topic, useCase);

    return {
      useCase,
      subject,
      style,
      composition,
      technical,
      mood,
      colors,
    };
  }

  /**
   * Determine mood based on use case, style, and topic
   */
  private determineMood(useCase: UseCase, style: StylePreference, topic: string): string[] {
    const mood: string[] = [];

    // Add base moods from use case
    mood.push(...MOOD_KEYWORDS[useCase]);

    // Add style-specific moods
    const styleModifiers: Record<StylePreference, string[]> = {
      photorealistic: ['authentic', 'realistic', 'natural'],
      illustration: ['creative', 'artistic', 'stylized'],
      minimalist: ['clean', 'simple', 'elegant'],
      professional: ['polished', 'refined', 'sophisticated'],
      marketing: ['compelling', 'persuasive', 'impactful'],
      editorial: ['sophisticated', 'thoughtful', 'refined'],
      'social-media': ['trendy', 'viral', 'engaging'],
      custom: [],
    };

    mood.push(...styleModifiers[style]);

    // Add topic-specific moods
    const topicLower = topic.toLowerCase();
    if (topicLower.includes('innovative') || topicLower.includes('futuristic')) {
      mood.push('cutting-edge', 'forward-thinking');
    }
    if (topicLower.includes('warm') || topicLower.includes('friendly')) {
      mood.push('welcoming', 'approachable');
    }
    if (topicLower.includes('professional') || topicLower.includes('corporate')) {
      mood.push('business-like', 'trustworthy');
    }
    if (topicLower.includes('creative') || topicLower.includes('artistic')) {
      mood.push('imaginative', 'expressive');
    }

    // Remove duplicates and limit
    return Array.from(new Set(mood)).slice(0, 5);
  }

  /**
   * Determine color palette suggestions
   */
  private determineColorPalette(topic: string): string[] {
    const topicLower = topic.toLowerCase();

    // Check for color palette keywords
    for (const [category, palette] of Object.entries(COLOR_PALETTES)) {
      if (topicLower.includes(category)) {
        return palette;
      }
    }

    // Check for specific color mentions in topic
    const colorKeywords = ['blue', 'red', 'green', 'yellow', 'purple', 'orange', 'vibrant', 'warm', 'cool'];
    const mentionedColors = colorKeywords.filter((color) => topicLower.includes(color));

    if (mentionedColors.length > 0) {
      return mentionedColors;
    }

    // Default: professional color palette
    return ['professional', 'modern', 'balanced'];
  }

  /**
   * Extract and enhance subject description
   */
  private extractSubject(topic: string, useCase: UseCase): string {
    // Add use case context to subject
    const useCasePrefixes: Record<UseCase, string> = {
      'blog-header': 'Editorial photography for blog article about',
      'social-post': 'Eye-catching social media graphic about',
      'hero-banner': 'Hero banner showcasing',
      'product-feature': 'Professional product showcase of',
      'team-photo': 'Professional portrait of',
      'concept-illustration': 'Abstract illustration of',
      custom: 'Image of',
    };

    const prefix = useCasePrefixes[useCase];
    return `${prefix} ${topic}`;
  }

  /**
   * Validate context analysis quality
   */
  validateContext(context: ContextAnalysis): { isComplete: boolean; missing: string[] } {
    const missing: string[] = [];

    if (!context.subject) missing.push('subject');
    if (!context.style) missing.push('style');
    if (!context.composition.aspectRatio) missing.push('aspect ratio');
    if (!context.technical.quality) missing.push('quality specifications');
    if (!context.mood || context.mood.length === 0) missing.push('mood/atmosphere');

    return {
      isComplete: missing.length === 0,
      missing,
    };
  }

  /**
   * Enhance context with additional details
   */
  enhanceContext(context: ContextAnalysis, additionalDetails: string): ContextAnalysis {
    const enhanced = { ...context };

    // Parse additional details and enhance context
    const details = additionalDetails.toLowerCase();

    // Enhance mood
    if (details.includes('energetic') || details.includes('dynamic')) {
      enhanced.mood.push('energetic', 'dynamic');
    }
    if (details.includes('calm') || details.includes('peaceful')) {
      enhanced.mood.push('calm', 'peaceful');
    }

    // Enhance colors
    const colorMentions = ['blue', 'red', 'green', 'vibrant', 'warm', 'cool'];
    for (const color of colorMentions) {
      if (details.includes(color)) {
        if (!enhanced.colors) enhanced.colors = [];
        enhanced.colors.push(color);
      }
    }

    // Remove duplicates
    enhanced.mood = Array.from(new Set(enhanced.mood));
    if (enhanced.colors) {
      enhanced.colors = Array.from(new Set(enhanced.colors));
    }

    return enhanced;
  }
}