# Image Generation Agent

**Autonomous AI agent for intelligent image generation** - Converts natural language intent into optimized Nano Banana (Gemini 2.5 Flash) prompts and generates high-quality images.

## Overview

This agent handles the complete workflow from understanding what you want → optimizing for Gemini → generating images → saving to filesystem.

**Key Features:**
- 🧠 **Natural Language Understanding** - Just describe what you want
- 🎯 **Automatic Intent Detection** - Classifies use case, topic, and style
- 🔧 **Nano Banana Optimization** - Prompts specifically tuned for Gemini 2.5 Flash
- 🔄 **Multi-turn Refinement** - Iteratively improve images
- 💾 **Filesystem Integration** - Automatic saving to web-accessible paths
- 🔍 **Transparent Reasoning** - See how the agent made decisions

## Quick Start

### 1. Simple Usage

```typescript
import { ImageGenerationAgent } from '@/lib/agents/image-generation-agent';

const agent = new ImageGenerationAgent();

const result = await agent.generate({
  intent: 'Create a professional blog header about AI marketing automation'
});

if (result.success) {
  console.log('Image URL:', result.imageUrl);
}
```

### 2. One-Line Helper

```typescript
import { generateImageWithAgent } from '@/lib/agents/image-generation-agent';

const result = await generateImageWithAgent(
  'Social media post about productivity tips'
);
```

## How It Works

```
┌─────────────────────────────────────────────┐
│ User Intent (Natural Language)             │
│ "Create blog header about AI marketing"    │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│ 1. INTENT DETECTION                         │
│ - Use Case: blog-header                     │
│ - Topic: AI marketing                       │
│ - Style: editorial                          │
│ - Confidence: 85%                           │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│ 2. CONTEXT ANALYSIS                         │
│ - Composition: 16:9, wide banner            │
│ - Technical: natural lighting, high res     │
│ - Mood: informative, professional           │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│ 3. PROMPT TRANSLATION (Nano Banana)         │
│ "Editorial photography for blog article     │
│  about AI marketing automation, wide        │
│  banner format 16:9, professional magazine  │
│  quality, engaging composition, modern      │
│  business setting, soft natural lighting,   │
│  vibrant yet professional color palette,    │
│  high resolution, detailed, informative     │
│  and professional atmosphere"               │
│                                             │
│ Negative: "blurry, low quality, generic"   │
│ Quality Score: 85/100                       │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│ 4. IMAGE GENERATION (OpenRouter)            │
│ - Model: google/gemini-2.5-flash-image     │
│ - Retry on failure: Yes                     │
│ - Max retries: 3                            │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│ 5. FILE MANAGEMENT                          │
│ - Save to: public/generated/images/         │
│ - Public URL: /generated/images/...         │
│ - Return: imageUrl, filePath, reasoning     │
└─────────────────────────────────────────────┘
```

## Supported Use Cases

The agent automatically detects these use cases:

| Use Case | Description | Example Intent |
|----------|-------------|----------------|
| `blog-header` | Article headers | "Blog header about sustainable fashion" |
| `social-post` | Social media graphics | "Instagram post about productivity tips" |
| `hero-banner` | Website hero sections | "Hero banner showing team collaboration" |
| `product-feature` | Product showcases | "Product image of SaaS dashboard analytics" |
| `team-photo` | Team portraits | "Professional photo of tech startup founder" |
| `concept-illustration` | Abstract concepts | "Illustration of AI-powered workflow" |

## Advanced Usage

### With Hints

Provide hints to improve detection accuracy:

```typescript
const result = await agent.generate({
  intent: 'productivity tips for entrepreneurs',
  useCase: 'social-post',
  platform: 'instagram',
  stylePreference: 'illustration'
});
```

### With Refinement

Iteratively improve the generated image:

```typescript
const result = await agent.generate({
  intent: 'Team collaboration in modern office',
  refinementInstructions: [
    'Make the lighting warmer',
    'Add more diversity in team composition'
  ]
});
```

### With Custom Configuration

```typescript
const agent = new ImageGenerationAgent({
  promptTranslation: {
    minQualityScore: 80,
    enhancePrompts: true
  },
  generation: {
    maxRetries: 2,
    enableRefinement: true
  },
  logging: {
    verbose: true,
    logIntentDetection: true
  }
});
```

### Using Presets

```typescript
import { ImageGenerationAgent, PRESET_CONFIGS } from '@/lib/agents/image-generation-agent';

// Fast generation (minimal quality checks)
const fastAgent = new ImageGenerationAgent(PRESET_CONFIGS.fast);

// High quality (all optimizations)
const qualityAgent = new ImageGenerationAgent(PRESET_CONFIGS.quality);

// Debug mode (verbose logging)
const debugAgent = new ImageGenerationAgent(PRESET_CONFIGS.debug);
```

## Response Format

```typescript
interface ImageGenerationAgentResponse {
  success: boolean;
  imageUrl?: string;              // /generated/images/...
  filePath?: string;              // Full filesystem path

  reasoning: {
    detectedIntent: {
      useCase: 'blog-header';
      topic: 'AI marketing automation';
      style: 'editorial';
      confidence: 85;
      signals: ['use-case: blog', 'style: professional'];
    };
    contextAnalysis: {
      composition: { aspectRatio: '16:9', ... };
      technical: { lighting: '...', ... };
      mood: ['informative', 'professional'];
    };
    translatedPrompt: {
      prompt: 'Optimized prompt...';
      negativePrompt: 'blurry, low quality...';
      qualityScore: 85;
      optimizations: ['Front-loaded subject', ...];
    };
  };

  originalIntent: string;
  processingTime?: number;        // Milliseconds
  error?: string;
}
```

## Configuration Options

```typescript
interface AgentConfig {
  model?: string;                 // Default: google/gemini-2.5-flash-image-preview

  promptTranslation: {
    useTemplates: boolean;        // Use pre-built templates (default: true)
    enhancePrompts: boolean;      // Auto-enhance prompts (default: true)
    addNegativePrompts: boolean;  // Add negative prompts (default: true)
    minQualityScore: number;      // Min acceptable score (default: 60)
  };

  generation: {
    retryOnFailure: boolean;      // Retry on failure (default: true)
    maxRetries: number;           // Max retry attempts (default: 3)
    enableRefinement: boolean;    // Multi-turn refinement (default: true)
    timeout: number;              // Timeout in ms (default: 120000)
  };

  fileManagement: {
    outputDirectory: string;      // Output dir (default: public/generated/images)
    filenamePattern: string;      // Pattern (default: {slug}-{timestamp})
  };

  logging: {
    verbose: boolean;             // Verbose logging (default: false)
    logIntentDetection: boolean;  // Log intent detection (default: false)
    logPromptTranslation: boolean;// Log prompt translation (default: false)
    logGeneration: boolean;       // Log generation (default: false)
  };
}
```

## Nano Banana Optimization

The agent applies Gemini 2.5 Flash specific optimizations:

### 1. Paragraph Style Prompts
Gemini works best with flowing, detailed paragraph descriptions rather than comma-separated keywords.

### 2. Front-loaded Subject
Most important information (subject and use case) comes first.

### 3. Style Descriptors
Specific style keywords that Gemini understands well.

### 4. Technical Details
Lighting, camera, composition specifications.

### 5. Quality Terms
High-impact quality keywords: "high resolution", "professional quality", "detailed"

### 6. Mood/Atmosphere
Emotional context at the end for better understanding.

## Examples

See `example-usage.ts` for comprehensive examples:

1. **Simple Generation** - Basic natural language request
2. **Social Media Post** - With hints and platform specification
3. **Hero Banner** - With multi-turn refinement
4. **Quick Helper** - One-line generation
5. **High Quality** - Using quality preset
6. **Fast Generation** - Using fast preset
7. **Debug Mode** - With verbose logging
8. **Custom Config** - Custom configuration options
9. **Multiple Generations** - Sequential batch processing
10. **Error Handling** - Graceful error handling

## Intent Detection

The agent uses pattern matching and keyword analysis to detect:

### Use Case Signals
- "blog", "article" → blog-header
- "social", "instagram" → social-post
- "hero", "banner" → hero-banner
- "product", "feature" → product-feature
- "team", "portrait" → team-photo
- "concept", "illustration" → concept-illustration

### Style Signals
- "photo", "realistic" → photorealistic
- "illustration", "drawn" → illustration
- "minimal", "simple" → minimalist
- "professional", "corporate" → professional

### Platform Signals
- "twitter", "tweet" → twitter
- "linkedin" → linkedin
- "instagram", "ig" → instagram

## Error Handling

```typescript
const result = await agent.generate({ intent: 'your request' });

if (!result.success) {
  if (result.error?.includes('API key')) {
    // Handle: API key not set or invalid
  } else if (result.error?.includes('rate limit')) {
    // Handle: Rate limit exceeded
  } else if (result.error?.includes('Invalid intent')) {
    // Handle: Intent too short or vague
  } else {
    // Handle: Other errors
  }
}
```

## Best Practices

### 1. Be Specific
```typescript
// Good
"Professional blog header about sustainable fashion trends in 2025"

// Too vague
"fashion image"
```

### 2. Include Context
```typescript
// Good
"Hero banner showing diverse team collaborating in modern tech office"

// Missing context
"people working"
```

### 3. Use Hints When Needed
```typescript
// If agent misdetects, provide hints
agent.generate({
  intent: "AI automation workflow",
  useCase: 'concept-illustration',  // Force illustration
  stylePreference: 'minimalist'     // Force minimalist style
});
```

### 4. Enable Logging for Debugging
```typescript
const agent = new ImageGenerationAgent({
  logging: { verbose: true, logIntentDetection: true }
});
```

## Architecture

```
lib/agents/image-generation-agent/
├── index.ts                  # Main exports & quick helpers
├── agent.ts                  # Core agent orchestration
├── intent-detector.ts        # NLP-based intent classification
├── context-analyzer.ts       # Style & technical analysis
├── prompt-translator.ts      # Nano Banana optimization
├── types.ts                  # TypeScript interfaces
├── config.ts                 # Configuration & presets
├── example-usage.ts          # Usage examples
└── README.md                # This file
```

## Integration with Media Generator

This agent builds on top of the media-generator module:

```
Agent Layer (High-level, autonomous)
    ↓
Media Generator (Low-level, direct control)
    ↓
OpenRouter API (Gemini 2.5 Flash)
```

**Use the agent when:**
- You want automatic intent detection
- You want optimized prompts for Gemini
- You want transparent reasoning
- You're building tools for other AI agents

**Use media-generator directly when:**
- You already have optimized prompts
- You need fine-grained control
- You want to use templates manually

## For AI Agents

This tool is specifically designed for AI agent consumption:

```typescript
// Blog agent creating article header
import { ImageGenerationAgent } from '@/lib/agents/image-generation-agent';

const agent = new ImageGenerationAgent();

const result = await agent.generate({
  intent: `Blog header image for article titled: "${articleTitle}"`,
});

if (result.success) {
  // Use result.imageUrl in blog post
  // result.reasoning provides transparency
}
```

## TypeScript Support

Full TypeScript definitions included with IntelliSense support:

```typescript
import type {
  ImageGenerationAgentRequest,
  ImageGenerationAgentResponse,
  DetectedIntent,
  ContextAnalysis,
  TranslatedPrompt,
} from '@/lib/agents/image-generation-agent';
```

## Performance

- **Average processing time**: 15-30 seconds
- **Intent detection**: < 100ms
- **Prompt translation**: < 50ms
- **Image generation**: 10-25 seconds (OpenRouter API)
- **File saving**: < 1 second

## Limitations

- Video generation not yet available (OpenRouter roadmap)
- Maximum prompt length: 2000 characters
- Rate limits apply (OpenRouter account limits)
- SynthID watermark included in all images

## Resources

- **OpenRouter**: https://openrouter.ai
- **Gemini Docs**: https://ai.google.dev/gemini-api/docs/image-generation
- **Media Generator**: See `lib/media-generator/README.md`
- **Project Docs**: See `CLAUDE.md` for full integration guide

---

**Built for OmniSignalAI** - AI-powered content creation platform