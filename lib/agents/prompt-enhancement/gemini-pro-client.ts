/**
 * Gemini 1.5 Pro API Client
 * Used for prompt refinement and image critique
 */

import { GeminiProConfig, DEFAULT_GEMINI_PRO_CONFIG } from './types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface GeminiProMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

export interface GeminiProResponse {
  success: boolean;
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
}

/**
 * Call Gemini 1.5 Pro via OpenRouter
 */
export async function callGeminiPro(
  messages: GeminiProMessage[],
  config: Partial<GeminiProConfig> = {}
): Promise<GeminiProResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      content: '',
      error: 'OPENROUTER_API_KEY not found in environment',
    };
  }

  const fullConfig = { ...DEFAULT_GEMINI_PRO_CONFIG, ...config };

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://omnisignalai.com',
        'X-Title': 'OmniSignalAI Prompt Enhancement',
      },
      body: JSON.stringify({
        model: fullConfig.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: fullConfig.temperature,
        max_tokens: fullConfig.maxTokens,
        top_p: fullConfig.topP,
        top_k: fullConfig.topK,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        content: '',
        error: `API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`,
      };
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return {
        success: false,
        content: '',
        error: 'No response from API',
      };
    }

    return {
      success: true,
      content: data.choices[0].message.content,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  } catch (error) {
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Parse JSON response from Gemini Pro
 * Handles code blocks and direct JSON
 */
export function parseJSONResponse<T>(content: string): T | null {
  try {
    // Try direct parse first
    return JSON.parse(content);
  } catch {
    // Try extracting from code block
    const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {
        return null;
      }
    }
    return null;
  }
}