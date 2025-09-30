/**
 * Intent Detector
 * Analyzes natural language requests to detect use case, topic, and style
 */

import {
  UseCase,
  Platform,
  StylePreference,
  DetectedIntent,
  IntentPattern,
  StyleSignal,
} from './types';

/**
 * Use case detection patterns
 */
const USE_CASE_PATTERNS: IntentPattern[] = [
  {
    useCase: 'blog-header',
    keywords: ['blog', 'article', 'post header', 'header image', 'blog banner', 'article header'],
    confidenceBoost: 30,
  },
  {
    useCase: 'social-post',
    keywords: ['social', 'tweet', 'linkedin post', 'instagram', 'facebook post', 'social media'],
    confidenceBoost: 30,
  },
  {
    useCase: 'hero-banner',
    keywords: ['hero', 'banner', 'landing page', 'hero section', 'main banner', 'website header'],
    confidenceBoost: 30,
  },
  {
    useCase: 'product-feature',
    keywords: ['product', 'feature', 'showcase', 'demo', 'product shot', 'feature image'],
    confidenceBoost: 30,
  },
  {
    useCase: 'team-photo',
    keywords: ['team', 'portrait', 'headshot', 'team member', 'staff photo', 'employee'],
    confidenceBoost: 30,
  },
  {
    useCase: 'concept-illustration',
    keywords: ['concept', 'illustration', 'abstract', 'diagram', 'infographic', 'visual concept'],
    confidenceBoost: 30,
  },
];

/**
 * Style detection signals
 */
const STYLE_SIGNALS: StyleSignal[] = [
  {
    style: 'photorealistic',
    keywords: ['photo', 'photograph', 'realistic', 'real', 'photorealistic', 'camera'],
    weight: 1.0,
  },
  {
    style: 'illustration',
    keywords: ['illustration', 'illustrated', 'drawn', 'graphic', 'cartoon', 'animated'],
    weight: 1.0,
  },
  {
    style: 'minimalist',
    keywords: ['minimal', 'minimalist', 'simple', 'clean', 'basic', 'stripped down'],
    weight: 1.0,
  },
  {
    style: 'professional',
    keywords: ['professional', 'corporate', 'business', 'formal', 'executive'],
    weight: 0.8,
  },
  {
    style: 'marketing',
    keywords: ['marketing', 'promotional', 'advertising', 'campaign', 'commercial'],
    weight: 0.8,
  },
  {
    style: 'editorial',
    keywords: ['editorial', 'magazine', 'publication', 'journalistic'],
    weight: 0.8,
  },
  {
    style: 'social-media',
    keywords: ['social media', 'shareable', 'viral', 'engaging', 'trendy'],
    weight: 0.8,
  },
];

/**
 * Platform detection keywords
 */
const PLATFORM_KEYWORDS: Record<Platform, string[]> = {
  web: ['website', 'web', 'landing page', 'homepage'],
  blog: ['blog', 'article', 'post'],
  twitter: ['twitter', 'tweet', 'x post'],
  linkedin: ['linkedin', 'professional network'],
  instagram: ['instagram', 'ig', 'insta'],
  facebook: ['facebook', 'fb'],
  email: ['email', 'newsletter', 'campaign'],
  print: ['print', 'brochure', 'flyer', 'poster'],
};

/**
 * Intent Detector class
 */
export class IntentDetector {
  /**
   * Detect intent from natural language request
   */
  detectIntent(intent: string): DetectedIntent {
    const normalizedIntent = intent.toLowerCase();

    // Detect use case
    const useCase = this.detectUseCase(normalizedIntent);

    // Extract topic
    const topic = this.extractTopic(intent, useCase);

    // Detect style
    const style = this.detectStyle(normalizedIntent);

    // Detect platform
    const platform = this.detectPlatform(normalizedIntent);

    // Calculate confidence
    const confidence = this.calculateConfidence(normalizedIntent, useCase, style);

    // Identify key signals
    const signals = this.identifySignals(normalizedIntent, useCase, style);

    return {
      useCase,
      topic,
      style,
      platform,
      confidence,
      signals,
    };
  }

  /**
   * Detect use case from intent
   */
  private detectUseCase(normalizedIntent: string): UseCase {
    const scores: Record<UseCase, number> = {
      'blog-header': 0,
      'social-post': 0,
      'hero-banner': 0,
      'product-feature': 0,
      'team-photo': 0,
      'concept-illustration': 0,
      'custom': 0,
    };

    // Check each pattern
    for (const pattern of USE_CASE_PATTERNS) {
      for (const keyword of pattern.keywords) {
        if (normalizedIntent.includes(keyword)) {
          scores[pattern.useCase] += pattern.confidenceBoost;
        }
      }
    }

    // Find highest score
    let maxScore = 0;
    let detectedUseCase: UseCase = 'custom';

    for (const [useCase, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedUseCase = useCase as UseCase;
      }
    }

    return detectedUseCase;
  }

  /**
   * Extract main topic from intent
   */
  private extractTopic(intent: string, useCase: UseCase): string {
    // Remove use case keywords
    let topic = intent;

    for (const pattern of USE_CASE_PATTERNS) {
      for (const keyword of pattern.keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        topic = topic.replace(regex, '');
      }
    }

    // Remove common prepositions and articles
    const stopWords = ['about', 'for', 'of', 'with', 'showing', 'depicting', 'a', 'an', 'the'];
    for (const word of stopWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      topic = topic.replace(regex, '');
    }

    // Clean up whitespace
    topic = topic.trim().replace(/\s+/g, ' ');

    // If topic is empty, use generic based on use case
    if (!topic) {
      const genericTopics: Record<UseCase, string> = {
        'blog-header': 'article content',
        'social-post': 'social media content',
        'hero-banner': 'website hero',
        'product-feature': 'product showcase',
        'team-photo': 'team member',
        'concept-illustration': 'abstract concept',
        'custom': 'custom content',
      };
      topic = genericTopics[useCase];
    }

    return topic;
  }

  /**
   * Detect style preference
   */
  private detectStyle(normalizedIntent: string): StylePreference {
    const scores: Record<StylePreference, number> = {
      photorealistic: 0,
      illustration: 0,
      minimalist: 0,
      professional: 0,
      marketing: 0,
      editorial: 0,
      'social-media': 0,
      custom: 0,
    };

    // Check style signals
    for (const signal of STYLE_SIGNALS) {
      for (const keyword of signal.keywords) {
        if (normalizedIntent.includes(keyword)) {
          scores[signal.style] += signal.weight * 10;
        }
      }
    }

    // Find highest score
    let maxScore = 0;
    let detectedStyle: StylePreference = 'professional'; // Default

    for (const [style, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedStyle = style as StylePreference;
      }
    }

    // If no clear style detected, use default
    if (maxScore === 0) {
      detectedStyle = 'professional';
    }

    return detectedStyle;
  }

  /**
   * Detect target platform
   */
  private detectPlatform(normalizedIntent: string): Platform | undefined {
    for (const [platform, keywords] of Object.entries(PLATFORM_KEYWORDS)) {
      for (const keyword of keywords) {
        if (normalizedIntent.includes(keyword)) {
          return platform as Platform;
        }
      }
    }

    return undefined;
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(
    normalizedIntent: string,
    useCase: UseCase,
    style: StylePreference
  ): number {
    let confidence = 50; // Base confidence

    // Boost for use case detection
    const useCasePattern = USE_CASE_PATTERNS.find((p) => p.useCase === useCase);
    if (useCasePattern) {
      const hasKeyword = useCasePattern.keywords.some((k) => normalizedIntent.includes(k));
      if (hasKeyword) confidence += 20;
    }

    // Boost for style detection
    const styleSignal = STYLE_SIGNALS.find((s) => s.style === style);
    if (styleSignal) {
      const hasKeyword = styleSignal.keywords.some((k) => normalizedIntent.includes(k));
      if (hasKeyword) confidence += 15;
    }

    // Boost for length and detail
    const wordCount = normalizedIntent.split(/\s+/).length;
    if (wordCount >= 5) confidence += 10;
    if (wordCount >= 10) confidence += 5;

    // Cap at 100
    return Math.min(confidence, 100);
  }

  /**
   * Identify key signals that influenced detection
   */
  private identifySignals(
    normalizedIntent: string,
    useCase: UseCase,
    style: StylePreference
  ): string[] {
    const signals: string[] = [];

    // Add use case keywords found
    const useCasePattern = USE_CASE_PATTERNS.find((p) => p.useCase === useCase);
    if (useCasePattern) {
      for (const keyword of useCasePattern.keywords) {
        if (normalizedIntent.includes(keyword)) {
          signals.push(`use-case: ${keyword}`);
        }
      }
    }

    // Add style keywords found
    const styleSignal = STYLE_SIGNALS.find((s) => s.style === style);
    if (styleSignal) {
      for (const keyword of styleSignal.keywords) {
        if (normalizedIntent.includes(keyword)) {
          signals.push(`style: ${keyword}`);
        }
      }
    }

    return signals;
  }

  /**
   * Validate intent quality
   */
  validateIntent(intent: string): { isValid: boolean; suggestions: string[] } {
    const suggestions: string[] = [];
    let isValid = true;

    // Check length
    if (intent.length < 10) {
      isValid = false;
      suggestions.push('Intent is too short. Provide more detail about what you want to create.');
    }

    // Check for vague terms
    const vagueTerms = ['image', 'picture', 'graphic', 'visual', 'something'];
    const hasOnlyVagueTerms = vagueTerms.some(
      (term) => intent.toLowerCase() === term || intent.toLowerCase() === `a ${term}`
    );

    if (hasOnlyVagueTerms) {
      isValid = false;
      suggestions.push(
        'Intent is too vague. Specify what the image should depict (e.g., "blog header about AI marketing").'
      );
    }

    return { isValid, suggestions };
  }
}