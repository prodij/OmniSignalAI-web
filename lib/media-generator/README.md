# Media Generator

AI-powered image generation tool for OmniSignalAI marketing campaigns, blog content, and website assets.

## Overview

This module provides a comprehensive toolkit for generating high-quality images using Gemini 2.5 Flash Image Preview via OpenRouter. It's designed specifically for AI agents to create perfect images on-demand with minimal configuration.

**Powered by:** Gemini 2.5 Flash Image Preview via OpenRouter
**Capabilities:** Text-to-image generation (1024px), multi-turn refinement, character consistency, high-quality text rendering

## Quick Start

### 1. Setup

Add your OpenRouter API key to `.env`:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Get an API key at: https://openrouter.ai

### 2. Basic Usage

```typescript
import { generateImage } from '@/lib/media-generator';

const result = await generateImage({
  prompt: 'Professional hero banner for AI-powered social media platform, modern design, vibrant colors, high quality'
});

if (result.success) {
  console.log('Image URL:', result.imageUrl);
  // Use result.imageUrl in your components: /generated/images/...
}
```

### 3. Using Templates (Recommended)

```typescript
import { generateImage, COMMON_TEMPLATES, buildPromptFromTemplate } from '@/lib/media-generator';

// Blog header
const prompt = buildPromptFromTemplate(
  COMMON_TEMPLATES.blogHeader('AI marketing automation')
);

const result = await generateImage({ prompt });
```

## Available Functions

### Core Functions

- **`generateImage(request)`** - Generate a single image
- **`generateImageVariations(prompt, count)`** - Generate multiple variations
- **`refineImage(originalPrompt, instructions, context?)`** - Iteratively refine images

### Prompt Engineering Tools

- **`buildPromptFromTemplate(template)`** - Build prompt from structured template
- **`enhancePrompt(prompt, options?)`** - Auto-enhance basic prompts
- **`validatePrompt(prompt)`** - Check prompt quality and get suggestions

### Common Templates

- `COMMON_TEMPLATES.blogHeader(topic)` - Blog article headers
- `COMMON_TEMPLATES.socialMediaPost(topic)` - Social media graphics
- `COMMON_TEMPLATES.heroSection(concept)` - Website hero banners
- `COMMON_TEMPLATES.productFeature(product, feature)` - Product showcases
- `COMMON_TEMPLATES.teamMember(role, setting)` - Team portraits
- `COMMON_TEMPLATES.conceptIllustration(concept)` - Abstract concepts

### Utilities

- **`validateEnvironment()`** - Check if API key is configured
- **`STYLE_ENHANCEMENTS`** - Style-specific prompt enhancements
- **`DEFAULT_NEGATIVE_PROMPTS`** - Common negative prompts

## Examples

See `example-usage.ts` for comprehensive examples including:

1. Basic image generation
2. Template-based generation
3. Prompt enhancement
4. Multi-turn refinement
5. Generating variations
6. Complete workflow with error handling

## Prompt Engineering Best Practices

### Structure Your Prompts

```
[Subject] + [Style] + [Composition] + [Technical Details] + [Mood/Atmosphere]
```

**Good Example:**
```
"Professional marketing team collaborating in modern office, photorealistic,
medium wide shot with natural depth of field, soft natural lighting from large windows,
warm and productive atmosphere, high quality, detailed"
```

### Be Specific

| Instead of... | Use... |
|--------------|--------|
| "nice colors" | "vibrant teal and orange color palette" |
| "good lighting" | "soft golden hour lighting from the left" |
| "professional" | "professional corporate photography, studio quality" |

### Use Style Keywords

- **Photorealistic**: "photorealistic, high resolution, professional photography, natural lighting, sharp focus, 8K quality"
- **Illustration**: "digital illustration, clean lines, vibrant colors, vector style, modern aesthetic"
- **Minimalist**: "minimalist design, clean composition, negative space, simple geometric shapes"
- **Marketing**: "marketing campaign quality, eye-catching, compelling visual, commercial photography"

### Add Technical Specifications

- **Lighting**: "soft diffused lighting", "dramatic side lighting", "golden hour natural light"
- **Camera**: "medium shot", "wide angle", "shallow depth of field", "eye-level perspective"
- **Composition**: "centered composition", "rule of thirds", "negative space on left"

### Use Negative Prompts

```typescript
const result = await generateImage({
  prompt: 'Professional office workspace',
  negativePrompt: 'blurry, low quality, cluttered, messy, dark, generic stock photo'
});
```

## Architecture

```
lib/media-generator/
├── index.ts              # Main API exports and documentation
├── image-generator.ts    # Core generation logic
├── prompt-guide.ts       # Prompt engineering best practices
├── types.ts              # TypeScript interfaces
├── utils.ts              # Utilities (file handling, validation)
├── example-usage.ts      # Usage examples
└── README.md            # This file
```

## Output Files

Generated images are saved to:
- **Directory**: `public/generated/images/`
- **Format**: `{prompt-slug}-{timestamp}.{extension}`
- **Public URL**: `/generated/images/{filename}`
- **Resolution**: 1024px (Gemini default)

Example output:
```typescript
{
  success: true,
  imageUrl: '/generated/images/modern-office-workspace-1735516800000.png',
  filePath: '/home/.../public/generated/images/modern-office-workspace-1735516800000.png',
  prompt: 'modern office workspace with laptop',
  base64Data: 'data:image/png;base64,...'
}
```

## Error Handling

Always check for success and handle errors appropriately:

```typescript
const result = await generateImage({ prompt });

if (!result.success) {
  if (result.error?.includes('API key')) {
    // API authentication failed
  } else if (result.error?.includes('rate limit')) {
    // Rate limit exceeded
  } else if (result.error?.includes('timeout')) {
    // Request timeout
  }
  return null;
}

// Success - use the image
return result.imageUrl;
```

## Model Information

**Model**: `google/gemini-2.5-flash-image-preview`

**Capabilities:**
- Text-to-image generation (1024px resolution)
- Multi-turn conversations for iterative refinement
- Character consistency across generations
- High-quality text rendering within images
- Natural language image editing
- Blending multiple images
- Targeted transformations

**Limitations:**
- Video generation not yet available on OpenRouter
- Maximum prompt length: 2000 characters
- SynthID watermark included in all generated images

## TypeScript Support

Full TypeScript definitions included:

```typescript
interface ImageGenerationRequest {
  prompt: string;
  filename?: string;
  referenceImages?: string[];
  negativePrompt?: string;
  context?: string[];
}

interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  filePath?: string;
  prompt: string;
  error?: string;
  base64Data?: string;
}
```

## For AI Agents

This tool is specifically designed for AI agent consumption with:

- **Clear API**: Simple, consistent function signatures
- **Rich TypeScript types**: Full type safety and IntelliSense support
- **Comprehensive documentation**: All functions and patterns documented
- **Error handling**: Graceful error handling with detailed messages
- **Prompt engineering guidance**: Built-in best practices and templates
- **Examples**: Real-world usage patterns

Import pattern for AI agents:
```typescript
import {
  generateImage,
  COMMON_TEMPLATES,
  buildPromptFromTemplate,
  enhancePrompt,
} from '@/lib/media-generator';
```

## Video Generation

**Status**: Not yet available

OpenRouter does not currently support video generation models. Video support is on their roadmap.

**Workaround**: Use ImageRouter API (https://api.imagerouter.io) for video generation (separate service)

**Recommended**: Focus on image generation for now, monitor OpenRouter for video model availability

## Resources

- **OpenRouter**: https://openrouter.ai
- **OpenRouter Docs**: https://openrouter.ai/docs
- **Gemini Docs**: https://ai.google.dev/gemini-api/docs/image-generation
- **Project CLAUDE.md**: See AI Media Generation Guide section

## Support

For issues or questions:
1. Check `CLAUDE.md` for comprehensive usage guide
2. Review `example-usage.ts` for working examples
3. Verify `OPENROUTER_API_KEY` is set in `.env`
4. Check OpenRouter API status and limits

---

**Built for OmniSignalAI** - AI-powered content creation platform