# AI Agent Integration Plan for OmniSignalAI

This document outlines the plan to evolve the OmniSignalAI website into a fully generative platform, enabling AI agents to autonomously create, design, and manage content.

## Strategy: Evolving to a Fully Generative Website

The core strategy is to empower AI agents to build and modify the website by interacting with a structured, API-driven system rather than by directly writing raw frontend code. This involves two main phases:
1.  **Architecting for Generative Content**: Building a component-based page builder that renders pages from a JSON schema.
2.  **Developing an AI Agent SDK**: Creating a dedicated toolkit for AI agents to perform actions like creating pages, generating media, and querying available components.

---

### Phase 1: Structured Content & Design Engine

This phase focuses on creating a system where page layouts are defined by structured data (JSON), which is then rendered into components.

#### Task 1.1: Create the `PageBuilder` Component

Create a new component `components/PageBuilder.tsx`. This component will be responsible for parsing a JSON array of "blocks" and rendering the corresponding components from the design system.

```typescript
import { FC } from 'react';
import * as DesignSystem from '@/lib/design-system';
import * as MarketingComponents from '@/components/marketing';

// Combine all available components into one map
const COMPONENT_MAP = {
  ...DesignSystem,
  ...MarketingComponents,
};

interface Block {
  component: keyof typeof COMPONENT_MAP;
  props?: { [key: string]: any };
  children?: Block[];
}

interface PageBuilderProps {
  blocks: Block[];
}

const renderBlock = (block: Block, key: number) => {
  const Component = COMPONENT_MAP[block.component];

  if (!Component) {
    console.warn(`Component "${block.component}" not found.`);
    return null;
  }

  // Recursively render children if they exist
  const children = block.children ? block.children.map(renderBlock) : undefined;

  return (
    <Component key={key} {...block.props}>
      {children}
    </Component>
  );
};

export const PageBuilder: FC<PageBuilderProps> = ({ blocks }) => {
  return <>{blocks.map(renderBlock)}</>;
};
```

#### Task 1.2: Define New MDX Frontmatter Standard

Update the content authoring process to use a new frontmatter `layout: 'builder'` property. When this is present, the page will be rendered using the `PageBuilder`. The AI will generate a `blocks` JSON structure in the frontmatter.

**Example File:** `content/blog/example-ai-post.mdx`
```mdx
---
title: 'The Future of AI in Marketing'
author: 'AI Agent'
date: '2025-10-26'
layout: 'builder' # <-- Signals to use the PageBuilder
blocks:
  - component: 'HeroSection'
    props:
      title: 'The Future of AI in Marketing'
      subtitle: 'How automation is changing the game for creators.'
      imageUrl: '/generated/images/hero_future_ai.png'
  - component: 'ContentSection'
    children:
      - component: 'Card'
        props:
          title: 'Key Trend 1: Hyper-Personalization'
          variant: 'outline'
        children:
          - "AI algorithms can now analyze user data in real-time to deliver personalized content."
---

Traditional markdown content can still be included here for hybrid pages.
```

#### Task 1.3: Update Page Template to Use `PageBuilder`

Modify the Next.js page template (e.g., `app/blog/[slug]/page.tsx`) to conditionally use the `PageBuilder` when `layout: 'builder'` is specified in the frontmatter.

```typescript
import { PageBuilder } from '@/components/PageBuilder';
import { getPostBySlug } from '@/lib/blog-api'; // Assumes a function to fetch post data

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (post.frontmatter.layout === 'builder' && post.frontmatter.blocks) {
    return <PageBuilder blocks={post.frontmatter.blocks} />;
  }

  // Fallback for traditional markdown content
  return (
    <article>
      <h1>{post.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

---

### Phase 2: AI Agent SDK

This phase involves creating a dedicated SDK (`lib/ai-agent-sdk/index.ts`) that abstracts away file system operations and provides a clean API for AI agents.

#### Task 2.1: Create the AI Agent SDK

The SDK will provide functions to manage pages, list components, and generate media.

```typescript
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter'; // Dependency: npm install gray-matter
import { generateImage, COMMON_TEMPLATES, buildPromptFromTemplate } from '@/lib/media-generator';

const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Creates or updates a page (MDX file).
 */
export async function savePage(
  slug: string,
  frontmatter: Record<string, any>,
  markdownContent: string = ''
) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const fileContent = matter.stringify(markdownContent, frontmatter);
  await fs.writeFile(filePath, fileContent);
  return { success: true, path: filePath };
}

/**
 * Reads a page's structured data.
 */
export async function getPage(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    return { success: true, frontmatter, content };
  } catch (error) {
    return { success: false, error: 'Page not found.' };
  }
}

/**
 * Lists all available components for the AI to use.
 * This can be made dynamic by reading from the filesystem.
 */
export async function listAvailableComponents() {
  return {
    success: true,
    components: [
      { name: 'HeroSection', props: ['title', 'subtitle', 'imageUrl', 'ctaButton'] },
      { name: 'PricingSection', props: ['plans'] },
      { name: 'Card', props: ['title', 'variant'] },
      { name: 'ContentSection', props: [] },
    ],
  };
}

// Re-export the image generator for a unified SDK
export const AI_Media = { generateImage, COMMON_TEMPLATES, buildPromptFromTemplate };
```

---

### Phase 3: AI Agent Workflow

With the architecture and SDK in place, an AI agent can follow this high-level workflow to create content.

**Objective**: Create a blog post titled "The Benefits of Automated Content Calendars".

1.  **Generate Media**: The agent calls `AI_Media.generateImage()` with a suitable prompt to get a header image.
2.  **Discover Components**: The agent calls `listAvailableComponents()` to see what building blocks are available.
3.  **Construct Page Blueprint**: The agent generates the JSON `blocks` for the page, using the components and the generated image URL.
4.  **Save Page**: The agent calls `savePage()` with the slug (`blog/automated-content-calendars`), frontmatter (including the `blocks` and `layout: 'builder'`), and any additional markdown content.
5.  **Deploy**: The new file is committed to the repository, triggering a new build and deployment.

---

## Implementation Sprint Breakdown

### Sprint 1: Foundation (Tasks 1.1 - 1.2)
**Goal**: Create the PageBuilder component and extend the schema
- Create `components/PageBuilder.tsx`
- Update `velite.config.ts` to support `layout` and `blocks` fields
- Duration: 1-2 days

### Sprint 2: Integration (Task 1.3)
**Goal**: Wire PageBuilder into the blog rendering system
- Update `app/blog/[slug]/page.tsx` to conditionally use PageBuilder
- Test with example MDX file
- Duration: 1 day

### Sprint 3: AI Agent SDK (Task 2.1)
**Goal**: Build the agent-facing API
- Create `lib/ai-agent-sdk/` directory
- Implement `savePage`, `getPage`, `listAvailableComponents` functions
- Create TypeScript types and interfaces
- Duration: 2-3 days

### Sprint 4: Documentation & Testing (Tasks 3.1 - 3.3)
**Goal**: Complete integration with examples and docs
- Create example AI-generated blog post
- Write comprehensive SDK documentation
- Create usage examples
- Duration: 1-2 days

---

## Technical Considerations

### Security
- Validate all component names before rendering
- Sanitize user-provided content
- Rate limit SDK operations

### Performance
- Lazy load components when possible
- Cache component mappings
- Optimize JSON parsing

### Maintainability
- Keep component registry updated automatically
- Version the SDK API
- Provide migration guides for schema changes

---

## Success Metrics

1. **Component Coverage**: 100% of design system components available to PageBuilder
2. **SDK Adoption**: AI agents can create complete blog posts autonomously
3. **Performance**: PageBuilder rendering within 100ms of traditional MDX
4. **Reliability**: Zero runtime errors for valid block configurations

---

## Future Enhancements

### Phase 4: Advanced Features
- Real-time preview system for AI agents
- Component validation and linting
- Automatic image optimization
- Multi-language content support

### Phase 5: Extended Capabilities
- Dynamic component generation
- A/B testing framework
- Analytics integration
- Content versioning and rollback

---

## Appendix: Component Reference

### Available Design System Components

**Layout Components:**
- `Section` - Page sections with variant support
- `Container` - Content containers with max-width
- `Grid` - Responsive grid layouts
- `ContentSection` - Semantic content areas

**Base Components:**
- `Button` - Call-to-action buttons
- `Card` - Content cards
- `Badge` - Status badges
- `Heading` - Typography headings
- `Text` - Body text with variants

**Marketing Components:**
- `HeroSection` - Hero banners
- `PricingSection` - Pricing tables
- `SocialProofSection` - Testimonials and social proof
- `HowItWorksSection` - Process explanations
- `BenefitsSection` - Feature highlights

### Example Block Configurations

**Hero Section:**
```json
{
  "component": "HeroSection",
  "props": {
    "title": "Your Title",
    "subtitle": "Your Subtitle"
  }
}
```

**Card Grid:**
```json
{
  "component": "Grid",
  "props": {
    "cols": 3,
    "gap": 6
  },
  "children": [
    {
      "component": "Card",
      "props": { "title": "Feature 1" }
    },
    {
      "component": "Card",
      "props": { "title": "Feature 2" }
    },
    {
      "component": "Card",
      "props": { "title": "Feature 3" }
    }
  ]
}
```
