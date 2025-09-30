/**
 * Core Image Generation Logic
 * Powered by Gemini 2.5 Flash Image Preview via OpenRouter
 */

import {
  ImageGenerationRequest,
  ImageGenerationResponse,
  OpenRouterImageResponse,
} from './types';
import {
  validateEnvironment,
  generateFilename,
  saveBase64Image,
  retryWithBackoff,
  formatErrorMessage,
  sanitizePrompt,
  parseOpenRouterError,
} from './utils';

/**
 * OpenRouter API configuration
 */
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'google/gemini-2.5-flash-image-preview';

/**
 * Generate an image using OpenRouter's Gemini 2.5 Flash Image Preview
 */
export async function generateImage(
  request: ImageGenerationRequest
): Promise<ImageGenerationResponse> {
  // Validate environment
  const envValidation = validateEnvironment();
  if (!envValidation.isValid) {
    return {
      success: false,
      prompt: request.prompt,
      error: envValidation.error,
    };
  }

  try {
    // Sanitize and prepare prompt
    const sanitizedPrompt = sanitizePrompt(request.prompt);

    // Build messages array for API
    const messages = buildMessages(sanitizedPrompt, request);

    // Call OpenRouter API with retry logic
    const response = await retryWithBackoff(
      () => callOpenRouterAPI(messages),
      3,
      1000
    );

    // Extract image from response
    const imageData = extractImageFromResponse(response);

    if (!imageData) {
      return {
        success: false,
        prompt: request.prompt,
        error: 'No image data in response. The model may not have generated an image.',
      };
    }

    // Generate filename and save image
    const filename = generateFilename(sanitizedPrompt, request.filename);
    const { filePath, publicUrl } = await saveBase64Image(imageData, filename);

    return {
      success: true,
      prompt: request.prompt,
      imageUrl: publicUrl,
      filePath,
      base64Data: imageData,
    };
  } catch (error) {
    return {
      success: false,
      prompt: request.prompt,
      error: formatErrorMessage(error),
    };
  }
}

/**
 * Build messages array for OpenRouter API
 */
function buildMessages(
  prompt: string,
  request: ImageGenerationRequest
): Array<{ role: string; content: any }> {
  const messages: Array<{ role: string; content: any }> = [];

  // Add context if provided (for multi-turn refinement)
  if (request.context && request.context.length > 0) {
    request.context.forEach((contextMessage, index) => {
      messages.push({
        role: index % 2 === 0 ? 'user' : 'assistant',
        content: contextMessage,
      });
    });
  }

  // Add main prompt
  let fullPrompt = prompt;

  // Add negative prompt if provided
  if (request.negativePrompt) {
    fullPrompt += `\n\nAvoid: ${request.negativePrompt}`;
  }

  messages.push({
    role: 'user',
    content: fullPrompt,
  });

  return messages;
}

/**
 * Call OpenRouter API
 */
async function callOpenRouterAPI(
  messages: Array<{ role: string; content: any }>
): Promise<OpenRouterImageResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY!;

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://omnisignalai.com',
      'X-Title': 'OmniSignalAI Media Generator',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages,
      modalities: ['image', 'text'], // Required for image generation
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMessage = parseOpenRouterError({
      status: response.status,
      statusText: response.statusText,
      body: errorBody,
    });
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data as OpenRouterImageResponse;
}

/**
 * Extract image data from OpenRouter response
 */
function extractImageFromResponse(
  response: OpenRouterImageResponse
): string | null {
  const choice = response.choices[0];
  if (!choice?.message?.images || choice.message.images.length === 0) {
    return null;
  }

  // Return first image (Gemini typically returns one image per request)
  return choice.message.images[0].image_url.url;
}

/**
 * Generate multiple image variations
 */
export async function generateImageVariations(
  prompt: string,
  count: number = 3
): Promise<ImageGenerationResponse[]> {
  const requests = Array.from({ length: count }, (_, i) => ({
    prompt: `${prompt} (variation ${i + 1})`,
    filename: `${generateFilename(prompt)}-var-${i + 1}`,
  }));

  // Generate all variations in parallel
  const results = await Promise.all(requests.map((req) => generateImage(req)));

  return results;
}

/**
 * Refine an existing image with additional instructions
 */
export async function refineImage(
  originalPrompt: string,
  refinementInstructions: string,
  previousContext?: string[]
): Promise<ImageGenerationResponse> {
  const context = previousContext || [originalPrompt];

  return generateImage({
    prompt: refinementInstructions,
    context,
  });
}