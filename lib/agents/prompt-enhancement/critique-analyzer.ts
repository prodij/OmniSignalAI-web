/**
 * Critique Analyzer
 * Analyzes generated images and provides actionable feedback
 */

import { callGeminiPro, parseJSONResponse } from './gemini-pro-client';
import { ImageCritique } from './types';

const IMAGE_CRITIQUE_PROMPT = `You are an expert photography critic and AI image quality analyst.

Your task: Analyze this AI-generated image and identify quality issues that need fixing.

Original Prompt: {prompt}
Iteration: {iteration}/4

Focus on these categories:

1. **AI Artifacts**: Synthetic textures, impossible physics, anatomical errors (fingers, limbs, faces)
2. **Generic Issues**: Stock photo feel, cliché composition, uninspired styling
3. **Composition Problems**: Poor framing, empty space, cluttered background, weak focal point
4. **Lighting Issues**: Flat lighting, unnatural shadows, incorrect light direction, poor contrast
5. **Overall Quality**: Professional vs amateur feel, realism, attention to detail

Rate overall quality 0-100 (80+ is publication-ready).

Provide ACTIONABLE improvements: What specific changes to the prompt will fix these issues?

Output ONLY valid JSON:
\`\`\`json
{
  "artifacts": ["list specific artifacts found"],
  "genericIssues": ["list generic/cliché elements"],
  "compositionProblems": ["list composition issues"],
  "lightingIssues": ["list lighting problems"],
  "overallQuality": 75,
  "suggestedImprovements": [
    "Add: specific camera angle (e.g., 'shot from slightly above')",
    "Specify: exact lighting setup (e.g., 'soft window light from left')",
    "Replace: vague term with specific detail"
  ],
  "shouldRefine": true
}
\`\`\`

If overall quality is 80+, set shouldRefine to false.`;

export async function analyzeImage(
  imageBase64: string,
  originalPrompt: string,
  iteration: number
): Promise<ImageCritique | null> {
  const prompt = IMAGE_CRITIQUE_PROMPT.replace('{prompt}', originalPrompt).replace(
    '{iteration}',
    iteration.toString()
  );

  const response = await callGeminiPro([
    {
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/png;base64,${imageBase64}`,
          },
        },
      ],
    },
  ]);

  if (!response.success) {
    console.error('[CritiqueAnalyzer] Failed:', response.error);
    return null;
  }

  const critique = parseJSONResponse<ImageCritique>(response.content);

  if (!critique) {
    console.error('[CritiqueAnalyzer] Failed to parse JSON:', response.content.substring(0, 200));
    return null;
  }

  return critique;
}