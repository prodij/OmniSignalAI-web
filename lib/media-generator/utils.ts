/**
 * Utility functions for media generation
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

/**
 * Validate environment configuration
 */
export function validateEnvironment(): {
  isValid: boolean;
  error?: string;
} {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return {
      isValid: false,
      error: 'OPENROUTER_API_KEY is not set in environment variables. Please add it to your .env file.',
    };
  }

  if (apiKey.length < 10) {
    return {
      isValid: false,
      error: 'OPENROUTER_API_KEY appears to be invalid (too short).',
    };
  }

  return { isValid: true };
}

/**
 * Generate a unique filename based on prompt and timestamp
 */
export function generateFilename(prompt: string, customFilename?: string): string {
  if (customFilename) {
    // Sanitize custom filename
    return customFilename.replace(/[^a-zA-Z0-9-_]/g, '_');
  }

  // Generate from prompt
  const timestamp = Date.now();
  const promptSlug = prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .substring(0, 50)
    .replace(/^-|-$/g, '');

  return `${promptSlug}-${timestamp}`;
}

/**
 * Convert base64 data URL to file and save it
 */
export async function saveBase64Image(
  base64Data: string,
  filename: string
): Promise<{ filePath: string; publicUrl: string }> {
  // Extract base64 content (remove data:image/png;base64, prefix)
  const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);

  if (!matches) {
    throw new Error('Invalid base64 image data format');
  }

  const extension = matches[1]; // png, jpeg, etc.
  const base64Content = matches[2];

  // Ensure output directory exists
  const outputDir = path.join(process.cwd(), 'public', 'generated', 'images');
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  // Generate full file path
  const fullFilename = `${filename}.${extension}`;
  const filePath = path.join(outputDir, fullFilename);

  // Convert base64 to buffer and save
  const buffer = Buffer.from(base64Content, 'base64');
  await writeFile(filePath, buffer);

  // Return both file system path and public URL
  const publicUrl = `/generated/images/${fullFilename}`;

  return { filePath, publicUrl };
}

/**
 * Retry logic for API calls
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries - 1) {
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Format error messages for user-friendly display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('API key')) {
      return 'API authentication failed. Please check your OPENROUTER_API_KEY.';
    }

    if (error.message.includes('rate limit')) {
      return 'Rate limit exceeded. Please try again in a few moments.';
    }

    if (error.message.includes('timeout')) {
      return 'Request timed out. The image generation is taking longer than expected.';
    }

    return error.message;
  }

  return 'An unknown error occurred during image generation.';
}

/**
 * Sanitize prompt to remove potentially problematic content
 */
export function sanitizePrompt(prompt: string): string {
  // Remove excessive whitespace
  let sanitized = prompt.trim().replace(/\s+/g, ' ');

  // Remove potentially problematic characters
  sanitized = sanitized.replace(/[<>]/g, '');

  // Limit length (Gemini handles long prompts well, but set reasonable limit)
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000);
  }

  return sanitized;
}

/**
 * Parse OpenRouter API error responses
 */
export function parseOpenRouterError(response: {
  status: number;
  statusText: string;
  body?: any;
}): string {
  const { status, statusText, body } = response;

  // Common HTTP status codes
  switch (status) {
    case 401:
      return 'Authentication failed. Invalid API key.';
    case 403:
      return 'Access forbidden. Check your API key permissions.';
    case 429:
      return 'Rate limit exceeded. Please try again later.';
    case 500:
    case 502:
    case 503:
      return 'OpenRouter service error. Please try again later.';
    default:
      if (body?.error?.message) {
        return body.error.message;
      }
      return `API error: ${statusText}`;
  }
}