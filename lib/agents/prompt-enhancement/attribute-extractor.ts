/**
 * Attribute Extractor
 * Extracts visual attributes from user intent
 */

import { callGeminiPro, parseJSONResponse } from './gemini-pro-client';
import { PromptEnhancementRequest } from './types';

export interface VisualAttributes {
  subject: string;
  composition: {
    framing: string;
    perspective: string;
    focalPoint: string;
  };
  lighting: {
    type: string;
    direction: string;
    mood: string;
  };
  style: {
    genre: string;
    aesthetic: string;
    references: string[];
  };
  technical: {
    camera: string;
    lens: string;
    aperture: string;
    iso: string;
  };
  colors: {
    palette: string[];
    temperature: string;
    saturation: string;
  };
  mood: string[];
}

const ATTRIBUTE_EXTRACTION_PROMPT = `You are an expert photography director and visual analyst.

Your task: Analyze the user's intent and extract detailed visual attributes that will guide image generation.

User Intent: {userIntent}
Use Case: {useCase}
Style Preference: {stylePreference}
Aspect Ratio: {aspectRatio}

Extract these attributes:

1. **Subject**: The main focus/subject of the image
2. **Composition**: Framing, perspective, focal point
3. **Lighting**: Type (natural/studio/ambient), direction, mood
4. **Style**: Genre, aesthetic, visual references
5. **Technical**: Camera type, lens, aperture, ISO
6. **Colors**: Palette, temperature (warm/cool), saturation
7. **Mood**: Emotional atmosphere (professional, energetic, calm, etc.)

Output ONLY valid JSON in this exact format:
\`\`\`json
{
  "subject": "...",
  "composition": {
    "framing": "...",
    "perspective": "...",
    "focalPoint": "..."
  },
  "lighting": {
    "type": "...",
    "direction": "...",
    "mood": "..."
  },
  "style": {
    "genre": "...",
    "aesthetic": "...",
    "references": ["..."]
  },
  "technical": {
    "camera": "...",
    "lens": "...",
    "aperture": "...",
    "iso": "..."
  },
  "colors": {
    "palette": ["..."],
    "temperature": "...",
    "saturation": "..."
  },
  "mood": ["..."]
}
\`\`\`

Be specific and detailed. Focus on attributes that will produce photorealistic, professional results.`;

export async function extractAttributes(
  request: PromptEnhancementRequest
): Promise<VisualAttributes | null> {
  const prompt = ATTRIBUTE_EXTRACTION_PROMPT.replace('{userIntent}', request.userIntent)
    .replace('{useCase}', request.useCase)
    .replace('{stylePreference}', request.stylePreference || 'photorealistic')
    .replace('{aspectRatio}', request.aspectRatio || '16:9');

  const response = await callGeminiPro([
    {
      role: 'user',
      content: prompt,
    },
  ]);

  if (!response.success) {
    console.error('[AttributeExtractor] Failed:', response.error);
    return null;
  }

  const attributes = parseJSONResponse<VisualAttributes>(response.content);

  if (!attributes) {
    console.error('[AttributeExtractor] Failed to parse JSON:', response.content.substring(0, 200));
    return null;
  }

  return attributes;
}