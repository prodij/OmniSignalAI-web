/**
 * AI Agent SDK for OmniSignalAI
 *
 * A comprehensive toolkit for AI agents to create, design, and manage content
 * on the OmniSignalAI platform.
 *
 * @module ai-agent-sdk
 *
 * ## Quick Start
 *
 * ### Creating a Page with PageBuilder
 *
 * ```typescript
 * import { savePage, AI_Media } from '@/lib/ai-agent-sdk';
 *
 * // 1. Generate a header image
 * const imageResult = await AI_Media.generateImage({
 *   prompt: 'Professional blog header about AI marketing automation'
 * });
 *
 * // 2. Create page with PageBuilder blocks
 * const result = await savePage({
 *   slug: 'blog/ai-marketing-guide',
 *   frontmatter: {
 *     title: 'The Complete Guide to AI Marketing Automation',
 *     description: 'Learn how AI is transforming marketing workflows',
 *     datePublished: new Date().toISOString(),
 *     category: 'Guides',
 *     keywords: ['AI', 'Marketing', 'Automation'],
 *     layout: 'builder',
 *     blocks: [
 *       {
 *         component: 'Section',
 *         props: { variant: 'light' },
 *         children: [
 *           {
 *             component: 'Container',
 *             children: [
 *               {
 *                 component: 'Heading',
 *                 props: { level: 1, align: 'center' },
 *                 children: ['The Complete Guide to AI Marketing Automation']
 *               },
 *               {
 *                 component: 'Text',
 *                 props: { align: 'center', size: 'lg' },
 *                 children: ['Learn how AI is transforming marketing workflows']
 *               }
 *             ]
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * });
 * ```
 *
 * ### Discovering Available Components
 *
 * ```typescript
 * import { listAvailableComponents } from '@/lib/ai-agent-sdk';
 *
 * const result = await listAvailableComponents({ includeExamples: true });
 *
 * if (result.success) {
 *   result.data.forEach(component => {
 *     console.log(`${component.name}: ${component.description}`);
 *     console.log(`Props: ${component.props?.join(', ')}`);
 *   });
 * }
 * ```
 *
 * ### Reading and Updating Existing Pages
 *
 * ```typescript
 * import { getPage, savePage } from '@/lib/ai-agent-sdk';
 *
 * // Read existing page
 * const pageResult = await getPage('blog/existing-post');
 *
 * if (pageResult.success) {
 *   const { frontmatter, content } = pageResult.data;
 *
 *   // Update and save
 *   await savePage({
 *     slug: 'blog/existing-post',
 *     frontmatter: {
 *       ...frontmatter,
 *       dateModified: new Date().toISOString(),
 *       featured: true
 *     },
 *     markdownContent: content,
 *     overwrite: true
 *   });
 * }
 * ```
 */

// Export types
export type {
  SDKResult,
  ComponentMetadata,
  PageBlock,
  PageFrontmatter,
  PageData,
  SavePageOptions,
  ListComponentsOptions,
} from './types'

// Export page management functions
export {
  savePage,
  getPage,
  listAvailableComponents,
  listPages,
  deletePage,
} from './page-management'

// Re-export media generator for unified SDK
export {
  generateImage,
  generateImageVariations,
  refineImage,
  COMMON_TEMPLATES,
  buildPromptFromTemplate,
  enhancePrompt,
  validatePrompt,
  validateEnvironment,
} from '@/lib/media-generator'

// Re-export image generation agent
export {
  ImageGenerationAgent,
  generateImageWithAgent,
  PRESET_CONFIGS,
} from '@/lib/agents/image-generation-agent'

// Convenience object for media operations
import * as MediaGenerator from '@/lib/media-generator'

export const AI_Media = MediaGenerator

/**
 * Complete AI Agent Workflow Example
 *
 * This demonstrates the full workflow an AI agent would follow to create
 * a complete blog post using the SDK.
 */
export const EXAMPLE_WORKFLOW = `
// Step 1: Generate header image
import { AI_Media, savePage, listAvailableComponents } from '@/lib/ai-agent-sdk';

const headerImage = await AI_Media.generateImage({
  prompt: 'Professional blog header about AI marketing trends, modern design'
});

// Step 2: Discover available components
const components = await listAvailableComponents({ includeExamples: true });

// Step 3: Build page structure
const blocks = [
  {
    component: 'Section',
    props: { variant: 'light' },
    children: [
      {
        component: 'Container',
        children: [
          {
            component: 'Heading',
            props: { level: 1, align: 'center' },
            children: ['AI Marketing Trends 2025']
          }
        ]
      }
    ]
  }
];

// Step 4: Save the page
const result = await savePage({
  slug: 'blog/ai-marketing-trends-2025',
  frontmatter: {
    title: 'AI Marketing Trends 2025',
    description: 'Discover the latest AI marketing trends',
    datePublished: new Date().toISOString(),
    category: 'Research',
    layout: 'builder',
    blocks,
    thumbnail: headerImage.imageUrl
  }
});

console.log('Page created:', result.data?.path);
`
