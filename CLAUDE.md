# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OmniSignalAI marketing website - AI-powered social media content generation platform that transforms content creation from hours to 30 seconds. Built with Next.js 14, designed for both exceptional UX and AI-friendly content management.

## Development Commands

### Core Commands
```bash
# Development server (runs on port 5000)
npm run dev

# Production build
npm run build

# Start production server (port 5000)
npm start

# Type checking (run before commits)
npm run type-check

# Linting
npm run lint

# Code formatting
npm run format
```

### Testing
```bash
# Run all tests
npm test

# Watch mode for active development
npm test:watch
```

### Docker Commands
```bash
# Development environment
npm run docker:dev

# Build Docker image
npm run docker:build

# Production deployment
npm run docker:prod

# Stop containers
npm run docker:down
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Custom Design System
- **Animations**: Framer Motion (planned)
- **Type Safety**: TypeScript with strict mode
- **Deployment**: Docker + Vercel ready

### Design System Location
All design primitives are centralized in `lib/design-system/`:
- `constants.ts` - Colors, typography, spacing (8px system), shadows, animation durations
- `base-components.tsx` - Button, Card, Badge, Input with variant support
- `layout-components.tsx` - Section, Container, Grid, Flex, ContentSection
- `interactive-components.tsx` - Tabs, Accordion, Modal, Tooltip
- `utils.ts` - CSS class utilities and variant helpers

**CRITICAL**: Always import from design system instead of writing custom styles:
```typescript
// Good - Uses design system
import { Button, Card } from '@/lib/design-system'

// Bad - Custom implementation
const MyButton = () => <button className="px-4 py-2">...</button>
```

### Directory Structure
```
app/                      # Next.js 14 App Router pages
components/marketing/     # Page sections (HeroSection, PricingSection, etc.)
lib/design-system/        # Design system primitives
content/                  # MDX content (blog, pages, data)
public/                   # Static assets
styles/                   # Global CSS
```

### Path Aliases (TypeScript)
```typescript
@/components/*  // ./components/*
@/app/*         // ./app/*
@/lib/*         // ./lib/*
@/content/*     // ./content/*
```

### Media Generator Tool
Located in `lib/media-generator/` - AI-powered image generation for marketing content, blog headers, and website assets.

**Key Files:**
- `index.ts` - Main API exports and quick start guide
- `image-generator.ts` - Core generation logic using OpenRouter/Gemini
- `prompt-guide.ts` - Prompt engineering best practices and templates
- `types.ts` - TypeScript interfaces for AI agent consumption
- `utils.ts` - File handling, validation, error handling

**Powered by:**
- **Model**: Gemini 2.5 Flash Image Preview via OpenRouter
- **Capabilities**: Text-to-image (1024px), multi-turn refinement, character consistency, high-quality text rendering
- **Output**: Base64 images saved to `public/generated/images/`

## AI Media Generation Guide

### Setup Requirements

1. **Environment Variable**: Add to `.env`:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

2. **Get API Key**: Sign up at https://openrouter.ai and create an API key

### Basic Usage (For AI Agents)

```typescript
import { generateImage } from '@/lib/media-generator';

// Simple generation
const result = await generateImage({
  prompt: 'Professional hero banner for AI-powered social media platform, modern design, vibrant colors, high quality'
});

if (result.success) {
  console.log('Image URL:', result.imageUrl);      // For web display: /generated/images/...
  console.log('File path:', result.filePath);      // For server use: /home/.../public/generated/...
} else {
  console.error('Error:', result.error);
}
```

### Using Prompt Templates (Recommended)

**Common templates provide consistent, high-quality results:**

```typescript
import { generateImage, COMMON_TEMPLATES, buildPromptFromTemplate } from '@/lib/media-generator';

// Blog header image
const blogPrompt = buildPromptFromTemplate(
  COMMON_TEMPLATES.blogHeader('AI marketing automation trends 2025')
);
const blogImage = await generateImage({ prompt: blogPrompt });

// Social media post
const socialPrompt = buildPromptFromTemplate(
  COMMON_TEMPLATES.socialMediaPost('productivity tips for entrepreneurs')
);
const socialImage = await generateImage({ prompt: socialPrompt });

// Hero section banner
const heroPrompt = buildPromptFromTemplate(
  COMMON_TEMPLATES.heroSection('AI-powered content creation platform')
);
const heroImage = await generateImage({ prompt: heroPrompt });

// Product feature showcase
const productPrompt = buildPromptFromTemplate(
  COMMON_TEMPLATES.productFeature('OmniSignalAI dashboard', 'real-time analytics')
);
const productImage = await generateImage({ prompt: productPrompt });
```

### Available Templates

| Template | Use Case | Example |
|----------|----------|---------|
| `blogHeader(topic)` | Blog article headers | Editorial style, wide banner |
| `socialMediaPost(topic)` | Social media graphics | Square format, vibrant, attention-grabbing |
| `heroSection(concept)` | Website hero banners | Panoramic, cinematic, high-impact |
| `productFeature(product, feature)` | Product showcases | Clean background, professional lighting |
| `teamMember(role, setting)` | Team photos | Professional portraits, approachable |
| `conceptIllustration(concept)` | Abstract concepts | Clean illustration, modern design |

### Prompt Enhancement

**Enhance basic prompts automatically:**

```typescript
import { enhancePrompt, validatePrompt } from '@/lib/media-generator';

// Check prompt quality
const validation = validatePrompt('office workspace');
console.log('Score:', validation.score);         // 60
console.log('Suggestions:', validation.suggestions);

// Enhance with style
const enhanced = enhancePrompt('office workspace', {
  style: 'photorealistic',
  addDefaults: true
});

console.log('Enhanced prompt:', enhanced.prompt);
// "office workspace, photorealistic, high resolution, professional photography, natural lighting, sharp focus, detailed textures, 8K quality, high quality, professional, detailed"

const result = await generateImage({ prompt: enhanced.prompt });
```

### Multi-Turn Refinement

**Iteratively improve images through conversation:**

```typescript
import { generateImage, refineImage } from '@/lib/media-generator';

// Generate initial image
const initial = await generateImage({
  prompt: 'Modern office workspace with laptop and coffee'
});

// Refine with additional instructions
const refined = await refineImage(
  'Modern office workspace with laptop and coffee',
  'Make the lighting warmer, add plants in the background, and include a notebook'
);

// Further refinement (maintains context)
const final = await refineImage(
  'Modern office workspace with laptop and coffee',
  'Change the laptop to show a dashboard interface',
  [
    'Modern office workspace with laptop and coffee',
    'Make the lighting warmer, add plants in the background, and include a notebook'
  ]
);
```

### Image Variations

**Generate multiple variations of the same concept:**

```typescript
import { generateImageVariations } from '@/lib/media-generator';

const variations = await generateImageVariations(
  'Professional headshot of a tech CEO, clean background, confident expression',
  3  // Generate 3 variations
);

variations.forEach((result, index) => {
  if (result.success) {
    console.log(`Variation ${index + 1}:`, result.imageUrl);
  }
});
```

### Prompt Engineering Best Practices

**For AI Agents: Follow these guidelines for optimal results**

#### 1. Structure Your Prompts
```
[Subject] + [Style] + [Composition] + [Technical Details] + [Mood/Atmosphere]
```

**Good Example:**
```typescript
"Professional marketing team collaborating in modern office, photorealistic,
medium wide shot with natural depth of field, soft natural lighting from large windows,
warm and productive atmosphere, high quality, detailed"
```

**Bad Example:**
```typescript
"some people working"  // Too vague, lacks detail
```

#### 2. Be Specific

| Instead of... | Use... |
|--------------|--------|
| "nice colors" | "vibrant teal and orange color palette" |
| "good lighting" | "soft golden hour lighting from the left" |
| "professional" | "professional corporate photography, studio quality" |
| "modern" | "modern minimalist design, clean lines, negative space" |

#### 3. Use Style Keywords

- **Photorealistic**: "photorealistic, high resolution, professional photography, natural lighting, sharp focus, 8K quality"
- **Illustration**: "digital illustration, clean lines, vibrant colors, vector style, modern aesthetic"
- **Minimalist**: "minimalist design, clean composition, negative space, simple geometric shapes, limited color palette"
- **Marketing**: "marketing campaign quality, eye-catching, compelling visual, commercial photography, brand-focused"

#### 4. Add Technical Specifications

- **Lighting**: "soft diffused lighting", "dramatic side lighting", "golden hour natural light"
- **Camera**: "medium shot", "wide angle", "shallow depth of field", "eye-level perspective"
- **Composition**: "centered composition", "rule of thirds", "negative space on left"
- **Quality**: "high resolution", "sharp focus", "detailed textures", "professional quality"

#### 5. Use Negative Prompts

**Avoid unwanted elements:**
```typescript
const result = await generateImage({
  prompt: 'Professional office workspace',
  negativePrompt: 'blurry, low quality, cluttered, messy, dark, generic stock photo'
});
```

**Default negative prompts automatically included:**
- blurry, low quality, distorted, watermark, text overlay, extra limbs, deformed, pixelated, artificial, generic stock photo

### Example Prompts for Common Use Cases

#### Blog Article Headers
```typescript
const prompt = `Editorial photography for blog article about ${topic},
wide banner format 16:9, professional magazine quality, engaging composition,
subtle depth of field, modern and sophisticated, high quality, detailed`;
```

#### Social Media Posts
```typescript
const prompt = `Eye-catching social media graphic about ${topic},
square format, bold central focus, vibrant colors, high contrast,
trendy aesthetic, attention-grabbing, shareable, professional design`;
```

#### Marketing Hero Banners
```typescript
const prompt = `Hero banner showcasing ${concept},
wide panoramic view, dramatic perspective, cinematic lighting,
depth and dimension, high resolution, impressive, memorable, professional,
premium quality, modern design`;
```

#### Product Screenshots
```typescript
const prompt = `Professional product screenshot of ${product} ${feature},
clean white background, centered composition, professional lighting,
sharp details, high resolution, marketing quality, modern and appealing`;
```

### Error Handling

**Always check for success and handle errors:**

```typescript
const result = await generateImage({ prompt: 'your prompt here' });

if (!result.success) {
  // Common error scenarios:

  if (result.error?.includes('API key')) {
    // API authentication failed - check OPENROUTER_API_KEY
    console.error('Please set OPENROUTER_API_KEY in .env');
  }
  else if (result.error?.includes('rate limit')) {
    // Rate limit exceeded - wait and retry
    console.error('Rate limit exceeded. Try again in a few moments.');
  }
  else if (result.error?.includes('timeout')) {
    // Request timeout - image generation taking too long
    console.error('Generation timeout. Try a simpler prompt or retry.');
  }
  else {
    // Other error
    console.error('Generation failed:', result.error);
  }

  return null;
}

// Success - use the image
return result.imageUrl;  // Returns: /generated/images/your-image.png
```

### Environment Validation

**Check configuration before generation:**

```typescript
import { validateEnvironment } from '@/lib/media-generator';

const validation = validateEnvironment();

if (!validation.isValid) {
  console.error('Setup required:', validation.error);
  // Handle: API key not set or invalid
}
```

### Video Generation

**Current Status**: Not yet available
- OpenRouter does not currently support video generation models
- Video support is on OpenRouter's roadmap ("coming soon")
- **Workaround**: Use ImageRouter API (https://api.imagerouter.io) for video generation (separate service)
- **Recommended**: Focus on image generation for now, monitor OpenRouter for video model availability

### Quick Reference for AI Agents

```typescript
// Import everything you need
import {
  generateImage,              // Core function
  generateImageVariations,    // Multiple variations
  refineImage,               // Iterative refinement
  COMMON_TEMPLATES,          // Pre-built templates
  buildPromptFromTemplate,   // Build from template
  enhancePrompt,             // Auto-enhance prompts
  validatePrompt,            // Check prompt quality
  validateEnvironment,       // Check API key setup
} from '@/lib/media-generator';

// Quick generation
const result = await generateImage({
  prompt: 'detailed prompt here'
});

// Template-based (recommended)
const prompt = buildPromptFromTemplate(
  COMMON_TEMPLATES.blogHeader('your topic')
);
const result = await generateImage({ prompt });

// With enhancements
const enhanced = enhancePrompt('basic prompt', {
  style: 'photorealistic'
});
const result = await generateImage({
  prompt: enhanced.prompt
});
```

### Output Files

**Generated images are saved to:**
- **Directory**: `public/generated/images/`
- **Filename format**: `{prompt-slug}-{timestamp}.{extension}`
- **Public URL**: `/generated/images/{filename}`
- **Format**: PNG (base64 converted to file)
- **Resolution**: 1024px (Gemini default)

**Example output:**
```typescript
{
  success: true,
  imageUrl: '/generated/images/modern-office-workspace-1735516800000.png',
  filePath: '/home/prodij/OmniSignalAI-web/public/generated/images/modern-office-workspace-1735516800000.png',
  prompt: 'modern office workspace with laptop',
  base64Data: 'data:image/png;base64,...'
}
```

## Image Generation Agent (Autonomous)

### Overview

The **Image Generation Agent** is an autonomous system that handles the complete workflow from natural language intent → optimized prompt → generated image. It's specifically designed for AI agents (blog agents, designer agents) to generate images on-demand.

**Located in**: `lib/agents/image-generation-agent/`

**Key Benefits:**
- 🧠 Natural language understanding - just describe what you want
- 🎯 Automatic use case detection (blog header, social post, hero banner, etc.)
- 🔧 Nano Banana (Gemini 2.5 Flash) specific optimization
- 🔄 Multi-turn refinement support
- 🔍 Transparent reasoning - see how decisions are made

### Quick Start (For AI Agents)

**Simple one-liner:**
```typescript
import { generateImageWithAgent } from '@/lib/agents/image-generation-agent';

const result = await generateImageWithAgent(
  'Create a professional blog header about AI marketing automation'
);

if (result.success) {
  console.log('Image:', result.imageUrl);
}
```

**Full agent usage:**
```typescript
import { ImageGenerationAgent } from '@/lib/agents/image-generation-agent';

const agent = new ImageGenerationAgent();

const result = await agent.generate({
  intent: 'Create a professional blog header about AI marketing automation'
});

if (result.success) {
  console.log('Image:', result.imageUrl);
  console.log('Detected use case:', result.reasoning.detectedIntent.useCase);
  console.log('Optimized prompt:', result.reasoning.translatedPrompt.prompt);
  console.log('Quality score:', result.reasoning.translatedPrompt.qualityScore);
}
```

### Agent Workflow

```
1. INTENT DETECTION
   ↓ Parse natural language
   ↓ Classify use case (blog-header, social-post, hero-banner, etc.)
   ↓ Extract topic, style, platform
   ↓ Calculate confidence score

2. CONTEXT ANALYSIS
   ↓ Determine composition (aspect ratio, framing, perspective)
   ↓ Determine technical specs (lighting, camera, quality)
   ↓ Determine mood/atmosphere
   ↓ Suggest color palette

3. PROMPT TRANSLATION (Nano Banana Optimized)
   ↓ Apply Gemini-specific optimizations
   ↓ Structure: Subject + Style + Technical + Mood
   ↓ Generate negative prompts
   ↓ Calculate quality score

4. IMAGE GENERATION
   ↓ Call media-generator with optimized prompt
   ↓ Retry on failure (exponential backoff)
   ↓ Apply refinements if requested

5. FILE MANAGEMENT
   ↓ Save to public/generated/images/
   ↓ Return imageUrl + filePath + reasoning
```

### Supported Use Cases

The agent automatically detects 6 use case types:

| Use Case | Keywords | Example Intent |
|----------|----------|----------------|
| **blog-header** | blog, article, header | "Blog header about sustainable fashion" |
| **social-post** | social, tweet, instagram | "Instagram post about productivity tips" |
| **hero-banner** | hero, banner, landing | "Hero banner showing team collaboration" |
| **product-feature** | product, feature, showcase | "Product image of SaaS dashboard" |
| **team-photo** | team, portrait, headshot | "Professional photo of tech founder" |
| **concept-illustration** | concept, illustration | "Illustration of AI workflow" |

### Advanced Usage

**With hints (improves detection accuracy):**
```typescript
const result = await agent.generate({
  intent: 'productivity tips for entrepreneurs',
  useCase: 'social-post',           // Force specific use case
  platform: 'instagram',            // Target platform
  stylePreference: 'illustration'   // Force specific style
});
```

**With multi-turn refinement:**
```typescript
const result = await agent.generate({
  intent: 'Hero section showing team collaboration',
  refinementInstructions: [
    'Make the lighting warmer and more golden',
    'Add more diversity in the team composition'
  ]
});
```

**With custom configuration:**
```typescript
import { ImageGenerationAgent, PRESET_CONFIGS } from '@/lib/agents/image-generation-agent';

// High quality mode (all optimizations)
const qualityAgent = new ImageGenerationAgent(PRESET_CONFIGS.quality);

// Fast mode (minimal quality checks)
const fastAgent = new ImageGenerationAgent(PRESET_CONFIGS.fast);

// Debug mode (verbose logging)
const debugAgent = new ImageGenerationAgent(PRESET_CONFIGS.debug);

// Custom config
const customAgent = new ImageGenerationAgent({
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

### Response Structure

```typescript
interface ImageGenerationAgentResponse {
  success: boolean;
  imageUrl?: string;                // /generated/images/...
  filePath?: string;                // Full filesystem path

  // Transparent reasoning
  reasoning: {
    detectedIntent: {
      useCase: 'blog-header';
      topic: 'AI marketing automation';
      style: 'editorial';
      confidence: 85;
      signals: ['use-case: blog', 'style: professional'];
    };

    contextAnalysis: {
      composition: { aspectRatio: '16:9', framing: '...', ... };
      technical: { lighting: '...', camera: '...', quality: '...' };
      mood: ['informative', 'professional', 'engaging'];
      colors: ['professional', 'modern', 'balanced'];
    };

    translatedPrompt: {
      prompt: 'Editorial photography for blog article about AI marketing automation, wide banner format 16:9, professional magazine quality, engaging composition, modern business setting, soft natural lighting, vibrant yet professional color palette, high resolution, detailed, informative and professional atmosphere';
      negativePrompt: 'blurry, low quality, distorted, watermark, text overlay, pixelated, amateur, generic stock photo, clickbait';
      qualityScore: 85;
      optimizations: ['Front-loaded subject', 'Added composition specs', ...];
    };
  };

  originalIntent: string;
  processingTime?: number;          // Milliseconds
  error?: string;
}
```

### Nano Banana (Gemini) Optimization

The agent applies Gemini 2.5 Flash specific optimizations:

**1. Paragraph Style** - Gemini works best with flowing, detailed descriptions
**2. Front-loaded Subject** - Most important info first
**3. Style Descriptors** - Specific keywords Gemini understands well
**4. Technical Details** - Lighting, camera, composition specifications
**5. Quality Terms** - "high resolution", "professional quality", "detailed"
**6. Mood/Atmosphere** - Emotional context at the end

**Example translation:**
```
User Intent: "Blog header about AI marketing"

Agent Output:
"Editorial photography for blog article about AI marketing automation,
wide banner format 16:9, professional magazine quality, engaging composition,
modern business setting with technology elements, soft natural lighting,
vibrant yet professional color palette, high resolution, sharp focus, detailed,
informative and professional atmosphere"
```

### For Different AI Agents

**Blog Agent:**
```typescript
const agent = new ImageGenerationAgent();

// Generating article header
const headerResult = await agent.generate({
  intent: `Blog header for article: "${articleTitle}"`
});
```

**Social Media Agent:**
```typescript
// Generating social post
const postResult = await agent.generate({
  intent: `Social media graphic about ${topic}`,
  platform: 'instagram',
  useCase: 'social-post'
});
```

**Website Designer Agent:**
```typescript
// Generating hero banner
const heroResult = await agent.generate({
  intent: `Hero banner showcasing ${concept}`,
  useCase: 'hero-banner'
});
```

**Content Generation AI:**
```typescript
// Generate images for multiple sections
const images = await Promise.all([
  agent.generate({ intent: 'Hero banner for AI startup' }),
  agent.generate({ intent: 'Team photo of diverse founders' }),
  agent.generate({ intent: 'Product showcase of dashboard analytics' })
]);
```

### Error Handling

```typescript
const result = await agent.generate({ intent: 'your request' });

if (!result.success) {
  if (result.error?.includes('Invalid intent')) {
    // Intent too short or vague
    console.error('Please provide more detail about what to create');
  }
  else if (result.error?.includes('API key')) {
    // API key not set or invalid
    console.error('Configure OPENROUTER_API_KEY in .env');
  }
  else if (result.error?.includes('rate limit')) {
    // Rate limit exceeded
    console.error('Rate limit exceeded, try again later');
  }
  else {
    // Other error
    console.error('Generation failed:', result.error);
  }
}
```

### Best Practices for AI Agents

**1. Be Specific:**
```typescript
// Good
"Professional blog header about sustainable fashion trends in 2025"

// Too vague
"fashion image"
```

**2. Include Context:**
```typescript
// Good
"Hero banner showing diverse team collaborating in modern tech office"

// Missing context
"people working"
```

**3. Use Hints When Needed:**
```typescript
// If agent misdetects, provide hints
agent.generate({
  intent: "AI automation workflow",
  useCase: 'concept-illustration',  // Force use case
  stylePreference: 'minimalist'     // Force style
});
```

**4. Check Reasoning:**
```typescript
if (result.success) {
  // Verify agent understood correctly
  console.log('Agent detected:', result.reasoning.detectedIntent);

  // If wrong, regenerate with hints
  if (result.reasoning.detectedIntent.useCase !== expectedUseCase) {
    // Regenerate with explicit use case
  }
}
```

### Agent vs Direct Media Generator

**Use Agent when:**
- You want automatic intent detection
- You want Gemini-optimized prompts
- You want transparent reasoning
- You're building tools for other AI agents
- You want high-level, autonomous operation

**Use media-generator directly when:**
- You already have optimized prompts
- You need fine-grained control
- You want to use templates manually
- You need maximum performance (skip intent detection)

### Configuration Presets

**PRESET_CONFIGS.fast** - Minimal quality checks, faster generation
- minQualityScore: 50
- retryOnFailure: false
- enableRefinement: false

**PRESET_CONFIGS.quality** - Maximum quality, all optimizations
- minQualityScore: 80
- retryOnFailure: true (3 attempts)
- enableRefinement: true

**PRESET_CONFIGS.debug** - Verbose logging for debugging
- verbose: true
- logIntentDetection: true
- logPromptTranslation: true
- logGeneration: true

### Agent Architecture

```
lib/agents/image-generation-agent/
├── index.ts                  # Main exports & helpers
├── agent.ts                  # Core orchestration
├── intent-detector.ts        # NLP intent classification
├── context-analyzer.ts       # Context & style analysis
├── prompt-translator.ts      # Nano Banana optimization
├── types.ts                  # TypeScript interfaces
├── config.ts                 # Configuration & presets
├── example-usage.ts          # 10 usage examples
└── README.md                 # Comprehensive docs
```

### Performance

- **Intent detection**: < 100ms
- **Context analysis**: < 50ms
- **Prompt translation**: < 50ms
- **Image generation**: 10-25 seconds (OpenRouter API)
- **Total processing time**: 15-30 seconds average

### Resources

- **Agent README**: `lib/agents/image-generation-agent/README.md`
- **Examples**: `lib/agents/image-generation-agent/example-usage.ts`
- **Media Generator**: `lib/media-generator/`
- **OpenRouter**: https://openrouter.ai

## Critical Configuration Knowledge

### PostCSS Required
The project uses Tailwind CSS which requires PostCSS. Configuration is in `postcss.config.js`:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Tailwind Content Paths
`tailwind.config.js` must scan all component directories:
```javascript
content: [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './app/**/*.{ts,tsx}',
  './lib/**/*.{ts,tsx}',      // Critical: Design system
  './content/**/*.{md,mdx}',
]
```

### SSR Compatibility
All components must be SSR-safe. Common issues:
- Use `useId()` instead of `Math.random()` for IDs to prevent hydration mismatch
- Mark client components with `"use client"` directive when using hooks
- Avoid `window` or `document` access without client-side checks

## Design System Patterns

### Component Composition
Build complex UIs from simple primitives:
```typescript
// Pattern: Compose sections from design system
import { Section, Container, Heading, Text, Button } from '@/lib/design-system'

export const MySection = () => (
  <Section variant="light">
    <Container>
      <Heading level={2}>Title</Heading>
      <Text variant="large">Description</Text>
      <Button variant="primary">Action</Button>
    </Container>
  </Section>
)
```

### Design Tokens
All design decisions come from `lib/design-system/constants.ts`:
- **Colors**: `colors.brand.primary`, `colors.semantic.success`
- **Spacing**: 8px system - use multiples (2, 4, 6, 8, 12, 16, 24)
- **Typography**: Predefined sizes (xs, sm, base, lg, xl, 2xl, etc.)
- **Breakpoints**: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)

### Animation System
Custom animations defined in `tailwind.config.js`:
- `animate-fade-in` - Basic opacity fade
- `animate-fade-in-up` - Fade with upward motion
- `animate-slide-up` - Slide from bottom
- `animate-bounce-x` - Horizontal bounce
- `animate-bounce-gentle` - Subtle vertical bounce
- `animate-pulse-sequence` - Sequential pulsing

## Page Architecture

### Homepage Structure (app/page.tsx)
Marketing sections rendered in sequence:
1. HeroSection - Primary value prop and CTA
2. ProblemSection - Pain points and agitation
3. SolutionSection - Before/after demonstration
4. BenefitsSection - Feature highlights
5. SocialProofSection - Testimonials and metrics
6. HowItWorksSection - 3-step process
7. PricingSection - Pricing tiers and ROI
8. FinalCTASection - Risk reversal and urgency

### Component Pattern
Each marketing section follows this pattern:
```typescript
// components/marketing/ExampleSection.tsx
"use client"

import { Section, Container, Heading } from '@/lib/design-system'

export const ExampleSection = () => {
  return (
    <Section variant="default">
      <Container>
        <Heading level={2} align="center">
          Section Title
        </Heading>
        {/* Section content */}
      </Container>
    </Section>
  )
}
```

## Testing Guidelines

Tests should:
- Use Jest and React Testing Library
- Focus on user behavior, not implementation details
- Test accessibility (ARIA labels, keyboard navigation)
- Avoid mocking unless absolutely necessary

## Performance Requirements

Target metrics:
- **Lighthouse Score**: 95+
- **Core Web Vitals**: All green
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

Optimization strategies:
- Use Next.js Image component for all images
- Lazy load non-critical components
- Keep bundle size < 200KB gzipped
- Minimize animation complexity on mobile

## Content Management Strategy

### Future MDX Integration
The site is designed for AI-friendly content management:
- Blog posts will use MDX format
- Frontmatter controls design and behavior
- Design tokens allow programmatic styling
- Component documentation enables AI understanding

## Deployment

### Environment Variables (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.omnisignalai.com
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_ENABLE_DEMO=true
```

### Docker Deployment
- Multi-stage build optimized for production
- Standalone output enabled in `next.config.js`
- Runs on port 5000 by default

### Vercel Deployment
- Automatic builds on push to main
- Environment variables set in Vercel dashboard
- Zero-config deployment (Next.js optimized)

## Common Issues and Solutions

### Issue: Styles not applying
- **Solution**: Check if PostCSS is configured (`postcss.config.js`)
- **Solution**: Verify Tailwind content paths include your file
- **Solution**: Restart dev server after config changes

### Issue: Hydration mismatch errors
- **Solution**: Use `useId()` instead of random IDs
- **Solution**: Add `"use client"` directive for components with hooks
- **Solution**: Ensure server and client render identical HTML

### Issue: Design system imports not working
- **Solution**: Check path aliases in `tsconfig.json`
- **Solution**: Verify file exists in `lib/design-system/`
- **Solution**: Restart TypeScript server

## Key Project Documents

- `PLAN.md` - Comprehensive website strategy and content
- `DESIGN_SYSTEM_LEARNINGS.md` - Design system implementation insights
- `README.md` - Project overview and setup instructions

## Development Philosophy

**From PLAN.md research:**
- AI-first architecture (built for AI, not AI-added)
- Conversion optimization over visual complexity
- Component reusability over custom implementations
- Mobile-first responsive design
- Accessibility compliance (WCAG 2.1 AA)

**SaaS Website Best Practices:**
- Clear value propositions with specific time savings
- Benefit-focused copy (outcomes, not features)
- Real product screenshots over abstract illustrations
- Social proof with specific customer results
- Single focused CTA per section

## Visual Design

**When working on visual design, layouts, or styling:**

📖 **Read**: `docs/VISUAL-DESIGN-GUIDE.md` for complete systematic design framework

**Quick principles**:
- Never say "this looks good"—show measurable evidence (contrast ratios, performance metrics)
- Use `lib/design-system/visual-excellence-tokens.ts` for all design constants
- Apply Golden Ratio (61.8% / 38.2%), 8px spacing, WCAG AAA contrast (≥7:1)
- Generate custom visuals with Image Generation Agent (not stock photos)
- Follow F-pattern (content) or Z-pattern (landing) layouts
- Measure success: Accessibility 100/100, Performance ≥95, Conversion optimized

**Reference implementation**: `components/visual/VisualHero.tsx`
**Live demo**: `app/visual-demo/page.tsx`

**Core philosophy**: Beauty is systematic, not subjective. Every design decision backed by data, mathematics, or proven patterns.