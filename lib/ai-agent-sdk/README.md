# AI Agent SDK Documentation

The AI Agent SDK provides a comprehensive toolkit for AI agents to autonomously create, design, and manage content on the OmniSignalAI platform.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Page Management](#page-management)
  - [Component Discovery](#component-discovery)
  - [Media Generation](#media-generation)
- [Complete Examples](#complete-examples)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## Installation

The SDK is built-in to the OmniSignalAI platform. Import it from:

```typescript
import { savePage, getPage, listAvailableComponents, AI_Media } from '@/lib/ai-agent-sdk';
```

---

## Quick Start

### Creating a Simple Page

```typescript
import { savePage } from '@/lib/ai-agent-sdk';

const result = await savePage({
  slug: 'blog/my-first-post',
  frontmatter: {
    title: 'My First AI-Generated Post',
    description: 'This post was created by an AI agent',
    datePublished: new Date().toISOString(),
    category: 'Guides',
    keywords: ['AI', 'Automation'],
    published: true,
    draft: false,
  },
  markdownContent: '## Introduction\n\nThis is my first post!'
});

if (result.success) {
  console.log('Page created at:', result.data.path);
} else {
  console.error('Error:', result.error);
}
```

### Creating a PageBuilder Page

```typescript
import { savePage } from '@/lib/ai-agent-sdk';

const result = await savePage({
  slug: 'blog/ai-powered-page',
  frontmatter: {
    title: 'AI-Powered Page',
    description: 'Built using PageBuilder',
    datePublished: new Date().toISOString(),
    category: 'Technical',
    layout: 'builder',  // Enable PageBuilder
    blocks: [
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
                children: ['Welcome to AI-Powered Content']
              },
              {
                component: 'Text',
                props: { size: 'lg', align: 'center' },
                children: ['This page was generated entirely by AI']
              }
            ]
          }
        ]
      }
    ]
  }
});
```

---

## API Reference

### Page Management

#### `savePage(options: SavePageOptions): Promise<SDKResult>`

Creates or updates a page (MDX file).

**Parameters:**
- `options.slug` (string) - Page slug (e.g., 'blog/my-post')
- `options.frontmatter` (PageFrontmatter) - Page metadata
- `options.markdownContent` (string, optional) - Markdown content
- `options.overwrite` (boolean, optional) - Allow overwriting existing files

**Returns:** Promise with result containing file path

**Example:**
```typescript
const result = await savePage({
  slug: 'blog/new-post',
  frontmatter: {
    title: 'New Post',
    description: 'Description here',
    datePublished: new Date().toISOString(),
    category: 'Guides'
  },
  markdownContent: '## Content here'
});
```

---

#### `getPage(slug: string): Promise<SDKResult<PageData>>`

Reads a page's structured data.

**Parameters:**
- `slug` (string) - Page slug (e.g., 'blog/existing-post')

**Returns:** Promise with result containing frontmatter and content

**Example:**
```typescript
const result = await getPage('blog/existing-post');

if (result.success) {
  console.log('Title:', result.data.frontmatter.title);
  console.log('Content:', result.data.content);
}
```

---

#### `listPages(directory?: string): Promise<SDKResult<string[]>>`

Lists all pages in a directory.

**Parameters:**
- `directory` (string, optional) - Directory to list (default: 'blog')

**Returns:** Promise with result containing page slugs

**Example:**
```typescript
const result = await listPages('blog');

if (result.success) {
  console.log('Available posts:', result.data);
}
```

---

#### `deletePage(slug: string): Promise<SDKResult>`

Deletes a page.

**Parameters:**
- `slug` (string) - Page slug to delete

**Returns:** Promise with result

**Example:**
```typescript
const result = await deletePage('blog/old-post');

if (result.success) {
  console.log('Page deleted successfully');
}
```

---

### Component Discovery

#### `listAvailableComponents(options?: ListComponentsOptions): Promise<SDKResult<ComponentMetadata[]>>`

Lists all available components for PageBuilder.

**Parameters:**
- `options.category` (string, optional) - Filter by category ('layout', 'content', 'marketing', 'design-system')
- `options.includeExamples` (boolean, optional) - Include usage examples

**Returns:** Promise with result containing component metadata

**Example:**
```typescript
const result = await listAvailableComponents({
  category: 'marketing',
  includeExamples: true
});

if (result.success) {
  result.data.forEach(component => {
    console.log(`Component: ${component.name}`);
    console.log(`Description: ${component.description}`);
    console.log(`Props: ${component.props?.join(', ')}`);
    
    if (component.examples) {
      component.examples.forEach(example => {
        console.log(`Example: ${example.description}`);
        console.log(JSON.stringify(example.props, null, 2));
      });
    }
  });
}
```

**Available Categories:**
- `layout` - Section, Container, Grid, ContentSection
- `content` - Card
- `design-system` - Button, Badge, Heading, Text
- `marketing` - HeroSection, PricingSection, SocialProofSection, etc.

---

### Media Generation

The SDK re-exports the entire Media Generator module for convenience.

#### `AI_Media.generateImage(options): Promise<ImageGenerationResult>`

Generates an image using AI.

**Example:**
```typescript
import { AI_Media } from '@/lib/ai-agent-sdk';

const result = await AI_Media.generateImage({
  prompt: 'Professional blog header about AI marketing, modern design, vibrant colors'
});

if (result.success) {
  console.log('Image URL:', result.imageUrl);
  // Use in page: thumbnail: result.imageUrl
}
```

#### `AI_Media.COMMON_TEMPLATES`

Pre-built prompt templates for common use cases.

**Available Templates:**
- `blogHeader(topic)` - Blog article headers
- `socialMediaPost(topic)` - Social media graphics
- `heroSection(concept)` - Hero banners
- `productFeature(product, feature)` - Product showcases
- `teamMember(role, setting)` - Team photos
- `conceptIllustration(concept)` - Concept illustrations

**Example:**
```typescript
import { AI_Media, buildPromptFromTemplate } from '@/lib/ai-agent-sdk';

const prompt = buildPromptFromTemplate(
  AI_Media.COMMON_TEMPLATES.blogHeader('AI marketing automation')
);

const result = await AI_Media.generateImage({ prompt });
```

---

## Complete Examples

### Example 1: Simple Blog Post with Traditional Markdown

```typescript
import { savePage, AI_Media } from '@/lib/ai-agent-sdk';

// Generate thumbnail
const thumbnail = await AI_Media.generateImage({
  prompt: 'Professional blog header about content marketing strategies'
});

// Create blog post
const result = await savePage({
  slug: 'blog/content-marketing-strategies',
  frontmatter: {
    title: '10 Content Marketing Strategies That Work',
    description: 'Proven content marketing strategies for 2025',
    datePublished: new Date().toISOString(),
    category: 'Guides',
    keywords: ['content marketing', 'strategy', 'marketing'],
    tags: ['Marketing', 'Strategy'],
    featured: true,
    published: true,
    thumbnail: thumbnail.imageUrl,
    faq: [
      {
        q: 'What is content marketing?',
        a: 'Content marketing is a strategic approach to creating and distributing valuable content.'
      }
    ]
  },
  markdownContent: `
## Introduction

Content marketing has evolved significantly in recent years...

## Strategy 1: SEO-Optimized Content

Creating content that ranks well in search engines...

## Strategy 2: Multi-Channel Distribution

Distributing content across multiple platforms...

## Conclusion

These strategies will help you succeed in 2025.
  `.trim()
});

console.log('Post created:', result.success);
```

---

### Example 2: PageBuilder Blog Post

```typescript
import { savePage, listAvailableComponents, AI_Media } from '@/lib/ai-agent-sdk';

// Step 1: Generate header image
const headerImage = await AI_Media.generateImage({
  prompt: 'Modern hero banner for AI automation blog, professional, tech-focused'
});

// Step 2: Discover components (optional, for understanding available blocks)
const componentsResult = await listAvailableComponents();

// Step 3: Build page structure
const result = await savePage({
  slug: 'blog/ai-automation-guide',
  frontmatter: {
    title: 'The Complete Guide to AI Automation',
    description: 'Learn how to automate your workflows with AI',
    datePublished: new Date().toISOString(),
    category: 'Guides',
    keywords: ['AI', 'automation', 'workflow'],
    layout: 'builder',
    thumbnail: headerImage.imageUrl,
    blocks: [
      // Hero section
      {
        component: 'Section',
        props: { variant: 'light' },
        children: [
          {
            component: 'Container',
            children: [
              {
                component: 'Heading',
                props: { level: 1, align: 'center', size: '4xl' },
                children: ['The Complete Guide to AI Automation']
              },
              {
                component: 'Text',
                props: { align: 'center', size: 'xl', color: 'muted' },
                children: ['Learn how to automate your workflows with AI']
              }
            ]
          }
        ]
      },
      
      // Features grid
      {
        component: 'Section',
        props: { variant: 'default' },
        children: [
          {
            component: 'Container',
            children: [
              {
                component: 'Heading',
                props: { level: 2, align: 'center', size: '2xl' },
                children: ['Key Benefits']
              },
              {
                component: 'Grid',
                props: { cols: 3, gap: 6 },
                children: [
                  {
                    component: 'Card',
                    props: { variant: 'outline', padding: 'lg' },
                    children: [
                      {
                        component: 'Heading',
                        props: { level: 3, size: 'lg' },
                        children: ['Save Time']
                      },
                      {
                        component: 'Text',
                        children: ['Automate repetitive tasks and focus on what matters']
                      }
                    ]
                  },
                  {
                    component: 'Card',
                    props: { variant: 'outline', padding: 'lg' },
                    children: [
                      {
                        component: 'Heading',
                        props: { level: 3, size: 'lg' },
                        children: ['Increase Accuracy']
                      },
                      {
                        component: 'Text',
                        children: ['AI reduces human error in workflow execution']
                      }
                    ]
                  },
                  {
                    component: 'Card',
                    props: { variant: 'outline', padding: 'lg' },
                    children: [
                      {
                        component: 'Heading',
                        props: { level: 3, size: 'lg' },
                        children: ['Scale Easily']
                      },
                      {
                        component: 'Text',
                        children: ['Handle growing workloads without adding headcount']
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      
      // CTA section
      {
        component: 'Section',
        props: { variant: 'dark' },
        children: [
          {
            component: 'Container',
            children: [
              {
                component: 'Heading',
                props: { level: 2, align: 'center', size: '2xl' },
                children: ['Ready to Get Started?']
              },
              {
                component: 'Button',
                props: { variant: 'primary', size: 'lg' },
                children: ['Start Free Trial']
              }
            ]
          }
        ]
      }
    ]
  }
});

console.log('PageBuilder post created:', result.success);
```

---

### Example 3: Complete AI Agent Workflow

```typescript
import { 
  savePage, 
  getPage, 
  listAvailableComponents,
  listPages,
  AI_Media,
  generateImageWithAgent
} from '@/lib/ai-agent-sdk';

/**
 * Complete workflow: Create a blog post about a trending topic
 */
async function createTrendingPost(topic: string) {
  console.log(`Creating post about: ${topic}`);

  // Step 1: Check if similar posts exist
  const existingPosts = await listPages('blog');
  console.log('Existing posts:', existingPosts.data?.length);

  // Step 2: Generate header image using Image Generation Agent
  const headerImage = await generateImageWithAgent(
    `Create a professional blog header about ${topic}, modern design, high quality`
  );

  if (!headerImage.success) {
    console.error('Image generation failed:', headerImage.error);
    return;
  }

  // Step 3: Discover available components
  const components = await listAvailableComponents({ includeExamples: true });
  console.log('Available components:', components.data?.length);

  // Step 4: Build content structure
  const slug = `blog/${topic.toLowerCase().replace(/\s+/g, '-')}`;
  
  const result = await savePage({
    slug,
    frontmatter: {
      title: `${topic}: A Complete Guide`,
      description: `Everything you need to know about ${topic}`,
      datePublished: new Date().toISOString(),
      category: 'Guides',
      keywords: [topic, 'guide', 'tutorial'],
      tags: ['AI', 'Tutorial'],
      featured: true,
      published: true,
      thumbnail: headerImage.imageUrl,
      layout: 'builder',
      blocks: [
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
                  children: [`${topic}: A Complete Guide`]
                },
                {
                  component: 'Text',
                  props: { align: 'center', size: 'lg' },
                  children: [`Everything you need to know about ${topic}`]
                }
              ]
            }
          ]
        }
      ]
    }
  });

  if (result.success) {
    console.log('✅ Post created successfully at:', result.data.path);
    
    // Step 5: Verify by reading back
    const verification = await getPage(slug);
    if (verification.success) {
      console.log('✅ Post verified:', verification.data.frontmatter.title);
    }
  } else {
    console.error('❌ Failed to create post:', result.error);
  }
}

// Run the workflow
createTrendingPost('AI Content Marketing Automation');
```

---

## Error Handling

All SDK functions return a `SDKResult` object with the following structure:

```typescript
interface SDKResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
```

Always check the `success` field before accessing `data`:

```typescript
const result = await savePage(options);

if (result.success) {
  // Success - data is available
  console.log('Created at:', result.data.path);
} else {
  // Error - check error message
  console.error('Error:', result.error);
  
  // Handle specific errors
  if (result.error?.includes('already exists')) {
    // File already exists - use overwrite: true
  } else if (result.error?.includes('not found')) {
    // File not found
  }
}
```

---

## Best Practices

### 1. Always Validate Results

```typescript
const result = await savePage(options);
if (!result.success) {
  throw new Error(`Failed to save page: ${result.error}`);
}
```

### 2. Use Descriptive Slugs

```typescript
// Good
slug: 'blog/ai-marketing-automation-guide-2025'

// Bad
slug: 'blog/post1'
```

### 3. Include Required Frontmatter

```typescript
frontmatter: {
  title: 'Required',
  description: 'Required for SEO',
  datePublished: new Date().toISOString(),  // Required
  category: 'Guides',  // Required
  keywords: ['ai', 'marketing'],  // Recommended for SEO
  published: true,  // Explicitly set
  draft: false
}
```

### 4. Generate Images Before Creating Pages

```typescript
// Generate all images first
const headerImage = await AI_Media.generateImage({...});
const featureImage1 = await AI_Media.generateImage({...});
const featureImage2 = await AI_Media.generateImage({...});

// Then create page with image URLs
await savePage({
  slug: 'blog/my-post',
  frontmatter: {
    thumbnail: headerImage.imageUrl,
    blocks: [
      { component: 'Image', props: { src: featureImage1.imageUrl } }
    ]
  }
});
```

### 5. Use Component Discovery

```typescript
// Before building complex pages, discover available components
const components = await listAvailableComponents({
  includeExamples: true
});

// Use component metadata to build valid blocks
components.data?.forEach(component => {
  console.log(`${component.name}: ${component.props?.join(', ')}`);
});
```

### 6. Handle Overwrites Carefully

```typescript
// Check if page exists first
const existing = await getPage(slug);

if (existing.success) {
  // Update existing page
  await savePage({
    slug,
    frontmatter: {
      ...existing.data.frontmatter,
      dateModified: new Date().toISOString()
    },
    overwrite: true  // Required to overwrite
  });
} else {
  // Create new page
  await savePage({ slug, frontmatter: {...} });
}
```

### 7. Structure Blocks Properly

```typescript
// Good - Clear hierarchy
blocks: [
  {
    component: 'Section',
    children: [
      {
        component: 'Container',
        children: [
          { component: 'Heading', children: ['Title'] },
          { component: 'Text', children: ['Content'] }
        ]
      }
    ]
  }
]

// Bad - Flat structure
blocks: [
  { component: 'Heading', children: ['Title'] },
  { component: 'Text', children: ['Content'] }
]
```

---

## Additional Resources

- [Media Generator Documentation](../media-generator/README.md)
- [Image Generation Agent Documentation](../agents/image-generation-agent/README.md)
- [AI Agent Integration Plan](../../AI_AGENT_INTEGRATION_PLAN.md)
- [Design System Documentation](../design-system/)

---

## Support

For issues or questions:
1. Check the [Troubleshooting Guide](../../TROUBLESHOOTING.md)
2. Review example usage in this documentation
3. Consult the [Development Guide](../../DEVELOPMENT-GUIDE.md)
