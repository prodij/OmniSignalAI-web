# Blog Strategy & Implementation Plan

## Executive Summary

This document outlines the strategy for adding a blog to OmniSignalAI that is optimized for:
1. **AI-managed content** - Claude Code can directly create, edit, and manage posts
2. **LLM discoverability** - Content structured for ChatGPT/Perplexity indexing
3. **Conversion optimization** - Every post drives trial signups
4. **Technical consistency** - Integrates with existing design system

**Key Decision**: Use file-based MDX with Velite (not wholesale template adoption, but pattern extraction).

---

## Platform Selection

### Chosen Solution: File-Based MDX + Velite

**Why this wins for AI management:**
- ✅ **Direct file system access** - Claude reads/writes markdown files natively
- ✅ **No authentication barriers** - No API keys or external service complexity
- ✅ **Git-native workflow** - Version control, branching, rollbacks built-in
- ✅ **Type-safe** - Velite generates TypeScript types from content schema
- ✅ **Stack alignment** - Already using Next.js 14 App Router
- ✅ **LLM-parseable** - Plain markdown = easy for ChatGPT/Perplexity to parse
- ✅ **Zero runtime dependencies** - Static generation, no CMS server needed

### Reference Implementation

**Template**: [jolbol1/nextjs-velite-blog-template](https://github.com/jolbol1/nextjs-velite-blog-template)

**What to extract:**
- Velite configuration patterns (`velite.config.ts`)
- Content schema structure (frontmatter + validation)
- MDX component integration setup
- Build pipeline configuration

**What NOT to copy:**
- ❌ Their Shadcn components → Use our existing design system
- ❌ Their styling patterns → Maintain our Tailwind constants
- ❌ Their layout components → Use our `lib/design-system/`

**Why selective extraction matters:**
- Maintains design consistency across marketing site + blog
- Single source of truth for components (easier for AI to manage)
- Avoids design system drift and maintenance burden

### Alternatives Considered & Rejected

| Platform | AI-Friendly? | Rejection Reason |
|----------|--------------|------------------|
| **Contentlayer** | Yes | Abandoned since 2023, Next.js 14 conflicts |
| **Sanity/Strapi** | No | External auth, API complexity, hosting costs |
| **Tina CMS** | Partial | Git-lock can confuse AI, visual editor unnecessary |
| **Keystatic** | Yes | Too immature, smaller ecosystem than Velite |
| **Payload CMS** | Partial | Overkill unless blog becomes major product feature |
| **WordPress API** | No | Over-engineered, requires separate server |

---

## Site Architecture

### Directory Structure

```
app/
├── (marketing)/              # Current homepage
│   └── page.tsx
├── blog/                     # NEW - Blog hub
│   ├── page.tsx             # Blog index (list, filters, search)
│   ├── [slug]/              # Individual blog posts
│   │   └── page.tsx
│   ├── category/[category]/ # Category pages
│   │   └── page.tsx
│   └── tag/[tag]/           # Tag pages (optional)
│       └── page.tsx
├── resources/               # FUTURE - Content hub expansion
│   ├── guides/
│   ├── case-studies/
│   └── templates/
└── api/
    └── og/                  # Dynamic OG images for social/LLM preview
        └── [slug]/
            └── route.ts

content/
├── blog/                    # Markdown/MDX files
│   ├── ai-social-media-complete-guide.mdx
│   ├── 30-days-content-30-minutes.mdx
│   ├── real-case-studies-time-savings.mdx
│   └── ...
└── config/
    └── blog-schema.ts       # Velite schema definitions

components/
├── marketing/               # Existing sections
└── blog/                    # NEW - Blog components
    ├── BlogCard.tsx
    ├── BlogList.tsx
    ├── BlogHeader.tsx
    ├── BlogContent.tsx      # MDX wrapper with design system
    ├── TableOfContents.tsx
    ├── ShareButtons.tsx
    └── RelatedPosts.tsx

lib/design-system/           # Existing (no changes needed)
    ├── constants.ts
    ├── base-components.tsx
    ├── layout-components.tsx
    └── ...
```

### Homepage Integration Points

**Primary: Dedicated `/blog` route**
- Don't clutter homepage with blog content
- Maintain focus on conversion

**Secondary: Enhance existing sections**
- **SocialProofSection**: Add "Latest from our blog" module
  - Show 3 most recent/featured posts
  - Cards use existing design system
  - CTA: "Read more insights →"
- **Footer**: Add blog link to main navigation
  - Position: After "Pricing", before "About"

**Tertiary: Future `/resources` hub**
- Blog becomes one section of content ecosystem
- Add: Guides, Case Studies, Templates, Tools
- Creates content moat for SEO

---

## Content Strategy

### The 4-Tier Content Pyramid

#### Tier 1: Product-Adjacent (High Conversion Intent)
**Goal**: Catch purchase-intent searches, naturally mention OmniSignalAI

**Topics:**
- "How to Create 30 Days of Social Media Content in 30 Minutes with AI"
- "AI Social Media Content Generation: Complete 2025 Guide"
- "From 4 Hours to 30 Seconds: Real Time Savings Case Studies"
- "Best AI Social Media Tools Compared [OmniSignalAI vs Alternatives]"
- "Social Media Manager's Guide to AI Automation"
- "How to Maintain Brand Voice with AI-Generated Content"

**Structure:**
- Open with direct problem → solution
- Include time savings comparisons
- Real screenshots/examples
- Strong CTA to free trial
- Expected conversion: 2-5%

#### Tier 2: SEO & Traffic (Broad Reach)
**Goal**: Rank for high-volume terms, build domain authority

**Topics:**
- "Social Media Content Calendar Templates [By Industry] 2025"
- "1000+ Instagram Caption Ideas by Category"
- "Social Media Posting Schedule: Data-Driven Guide"
- "Social Media Metrics That Actually Matter [Analytics Guide]"
- "Best Times to Post on Social Media [2025 Data]"
- "Social Media Content Types: The Complete List"

**Structure:**
- Comprehensive (2000-3000 words)
- Heavy use of lists, tables, data
- Downloadable resources
- Soft CTA to product
- Expected conversion: 0.5-1%

#### Tier 3: Thought Leadership (LLM Training Data Goldmine)
**Goal**: Get cited by ChatGPT/Perplexity, establish expertise

**Topics:**
- "The Future of AI in Social Media Marketing: 2025 Research Report"
- "How AI is Democratizing Content Creation for Small Businesses"
- "AI-Generated Content: Ethics, Attribution, and Best Practices"
- "The Economics of AI-Assisted vs Manual Content Creation [ROI Study]"
- "Social Media Evolution: From Manual to AI-Native Workflows"
- "AI's Impact on Social Media Manager Roles [Survey Results]"

**Structure:**
- Original research/data
- Expert interviews
- Clear methodology
- Citable statistics
- FAQ section for LLM extraction
- Expected conversion: 0.2-0.5% (long-tail brand building)

#### Tier 4: Technical Deep Dives (Developer Audience + LLM Credibility)
**Goal**: Signal technical depth, attract developer audience

**Topics:**
- "Building AI Content Pipelines: Architecture Patterns"
- "Prompt Engineering for Brand-Consistent Social Content"
- "RAG Systems for Brand Voice: Implementation Guide"
- "Fine-Tuning vs Prompting for Social Media AI: When to Use Each"
- "AI Content Quality Metrics: What to Measure and How"
- "Scaling AI Content Generation: Infrastructure Considerations"

**Structure:**
- Code examples
- Architecture diagrams
- Performance benchmarks
- Technical accuracy prioritized
- Expected conversion: 0.1-0.3% (developer credibility play)

### Content Synergy with Marketing Site

**Every blog post reinforces core value props:**
- **Time savings** - "30 seconds vs 4 hours" becomes recurring theme
- **Quality maintenance** - Address "AI content is low quality" objection
- **Ease of use** - Show simple workflows, not complex technical setups
- **Real results** - Case studies, data, testimonials throughout

**Internal linking strategy:**
- Blog posts → Homepage sections
- Blog posts → Pricing page (with trial context)
- Homepage → Blog (social proof + authority building)

**Conversion funnel:**
```
Blog Post → Learn Problem/Solution → See Time Savings →
Try Free Trial → Experience Product → Convert to Paid
```

---

## LLM Optimization Strategy

### Why This Matters

**The opportunity:**
- ChatGPT, Perplexity, Claude, and other LLMs are becoming primary research tools
- Users ask: "best AI social media tools", "how to automate content creation"
- LLMs synthesize answers from indexed content and cite sources
- **Goal**: Be the cited source when users ask AI about social media automation

**The mechanism:**
- LLMs use structured data to understand content
- Common Crawl, Bing Index, and live web lookups feed LLM knowledge
- Well-structured content is easier to extract and cite
- Authority + clarity = higher likelihood of inclusion

### Content Structure for Maximum Pickup

#### Frontmatter Schema (YAML)

```yaml
---
# Core metadata
title: "How to Create 30 Days of Social Media Content in 30 Minutes"
description: "Use AI to generate a month of social content in 30 minutes vs 4 hours manually. Step-by-step guide with examples."
datePublished: "2025-01-15T10:00:00Z"
dateModified: "2025-01-20T15:30:00Z"

# Author info
author:
  name: "OmniSignalAI Team"
  url: "https://omnisignalai.com"
  image: "https://omnisignalai.com/team-photo.jpg"

# SEO & categorization
keywords:
  - "ai social media content"
  - "social media content calendar"
  - "ai content generation"
  - "social media automation"
category: "Guides"
tags: ["AI", "Social Media", "Content Creation", "Automation"]
readTime: 8
featured: true

# Schema.org type (triggers specific structured data)
schema: "HowTo"  # Options: Article, HowTo, FAQPage

# FAQ for structured data extraction
faq:
  - q: "How long does AI content generation take?"
    a: "With tools like OmniSignalAI, you can generate 30 days of content in ~30 minutes vs 4+ hours manually."
  - q: "Is AI-generated content as good as human-written?"
    a: "When properly prompted with brand voice, AI content maintains quality while dramatically reducing time investment by 93%."
  - q: "What's the ROI of AI content generation?"
    a: "Teams save 3.5 hours per content batch, translating to ~$200-500 in labor costs per month for small teams."

# Open Graph for social sharing
og:
  image: "/og-images/ai-content-generation-guide.png"
  imageAlt: "AI Social Media Content Generation Workflow Diagram"

# Related posts (internal linking)
related:
  - "best-ai-social-media-tools-2025"
  - "real-case-studies-time-savings"
---
```

#### Content Structure Template

```markdown
## Quick Answer (First 160 characters = meta description)
AI tools can generate 30 days of social content in 30 minutes. This guide shows the exact process: setup (5min), generation (15min), review (10min).

## Table of Contents
- [What You'll Learn](#what-youll-learn)
- [Step-by-Step Process](#step-by-step-process)
- [Time Savings Breakdown](#time-savings)
- [FAQ](#faq)
- [Key Takeaways](#takeaways)

## What You'll Learn
Clear, scannable bullet points that LLMs can extract:
- How to set up AI tools for brand-consistent content
- The exact 3-step process for generating 30 days of posts
- Real time comparisons: AI (30min) vs Manual (4+ hours)
- Quality control workflows that maintain brand standards

## Step-by-Step Process

### 1. Setup Your Brand Voice (5 minutes)
[Lists and tables = easy to extract]

**What you need:**
- Brand guidelines document
- 5-10 example posts in your voice
- Target audience description

**Process:**
| Step | Action | Time |
|------|--------|------|
| 1 | Upload brand guidelines | 1min |
| 2 | Add example posts | 2min |
| 3 | Configure tone settings | 2min |

### 2. Generate Content (15 minutes)
[Specific, actionable steps with code/examples]

```
Example prompt structure:
"Create 30 Instagram posts for [industry] targeting [audience]
with [tone] that highlight [themes]. Use brand voice from examples."
```

**Output expectations:**
- 30 posts with captions
- Relevant hashtags
- Posting schedule suggestions

### 3. Review and Schedule (10 minutes)
[Numbered lists for procedural clarity]

1. Review first 5 posts for brand alignment
2. Make any voice adjustments
3. Approve remaining batch
4. Export to scheduling tool

## Time Savings Breakdown
[Data-rich section for citation]

| Method | Time Required | Cost (at $50/hr) | Posts per Hour |
|--------|---------------|------------------|----------------|
| Manual | 8 hours | $400 | 3.75 |
| AI-Assisted | 30 minutes | $25 | 60 |
| **Savings** | **93.75%** | **$375** | **16x faster** |

## Real-World Results
[Case studies with specific numbers]

**E-commerce Brand (Fashion)**
- Previous: 6 hours/week on content = $15,600/year
- With AI: 45 minutes/week = $1,950/year
- Savings: **$13,650/year**

## FAQ
[Structured Q&A for FAQ schema]

### How long does AI content generation take?
With tools like OmniSignalAI, you can generate 30 days of content in approximately 30 minutes, compared to 4+ hours manually.

### Is AI-generated content as good as human-written?
When properly prompted with brand voice examples, AI content maintains quality standards while reducing time investment by 93%.

[10-15 FAQs covering common objections and questions]

## Key Takeaways
[Bullet points for easy extraction]

- **93.75% time savings**: 30 minutes vs 8 hours for 30 days of content
- **Quality maintained**: Proper setup ensures brand voice consistency
- **Best for**: Teams creating 20+ posts per month across multiple platforms
- **ROI**: Pays for itself in first month for teams valuing time at $50+/hour
- **Getting started**: Free trial requires no credit card, 5-minute setup

## Try It Yourself
[Clear CTA with no-friction entry]

Start your free trial of OmniSignalAI - no credit card required. Generate your first 30 days of content in the next 30 minutes.

[CTA Button: "Start Free Trial →"]
```

### Technical Implementation

#### robots.txt Configuration

```txt
# Allow all standard crawlers
User-agent: *
Allow: /

# Explicitly allow LLM bots
User-agent: GPTBot
Allow: /blog/
Allow: /resources/

User-agent: CCBot
Allow: /blog/
Allow: /resources/

User-agent: PerplexityBot
Allow: /blog/
Allow: /resources/

User-agent: Claude-Web
Allow: /blog/
Allow: /resources/

User-agent: anthropic-ai
Allow: /blog/
Allow: /resources/

# Sitemap for crawling
Sitemap: https://omnisignalai.com/sitemap.xml
Sitemap: https://omnisignalai.com/blog-sitemap.xml
```

#### JSON-LD Schema Generation

```typescript
// app/blog/[slug]/page.tsx
import { generateBlogSchema } from '@/lib/schema'

export default function BlogPost({ post }) {
  const schema = generateBlogSchema(post)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Post content */}
    </>
  )
}

// lib/schema.ts
export function generateBlogSchema(post: BlogPost) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": post.schema || "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.datePublished,
    "dateModified": post.dateModified,
    "author": {
      "@type": "Organization",
      "name": post.author.name,
      "url": post.author.url
    },
    "publisher": {
      "@type": "Organization",
      "name": "OmniSignalAI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://omnisignalai.com/logo.png"
      }
    },
    "image": post.og.image,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://omnisignalai.com/blog/${post.slug}`
    }
  }

  // Add HowTo schema if applicable
  if (post.schema === "HowTo" && post.steps) {
    return {
      ...baseSchema,
      "@type": "HowTo",
      "step": post.steps.map((step, i) => ({
        "@type": "HowToStep",
        "position": i + 1,
        "name": step.name,
        "text": step.description,
        "image": step.image
      }))
    }
  }

  // Add FAQ schema if applicable
  if (post.faq && post.faq.length > 0) {
    return {
      ...baseSchema,
      "@type": "FAQPage",
      "mainEntity": post.faq.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    }
  }

  return baseSchema
}
```

#### Velite Configuration

```typescript
// velite.config.ts
import { defineConfig, s } from 'velite'

export default defineConfig({
  collections: {
    blog: {
      name: 'Blog',
      pattern: 'blog/**/*.mdx',
      schema: s.object({
        // Core fields
        title: s.string().max(100),
        description: s.string().max(200),
        slug: s.slug('blog'),
        datePublished: s.isodate(),
        dateModified: s.isodate().optional(),

        // Author
        author: s.object({
          name: s.string(),
          url: s.string().url(),
          image: s.string().url().optional()
        }),

        // SEO & categorization
        keywords: s.array(s.string()),
        category: s.enum(['Guides', 'Case Studies', 'Research', 'Technical', 'News']),
        tags: s.array(s.string()),
        readTime: s.number().int().positive(),
        featured: s.boolean().default(false),

        // Schema type
        schema: s.enum(['Article', 'HowTo', 'FAQPage']).optional(),

        // FAQ for structured data
        faq: s.array(s.object({
          q: s.string(),
          a: s.string()
        })).optional(),

        // HowTo steps (if schema: "HowTo")
        steps: s.array(s.object({
          name: s.string(),
          description: s.string(),
          image: s.string().url().optional()
        })).optional(),

        // Open Graph
        og: s.object({
          image: s.string(),
          imageAlt: s.string()
        }),

        // Related posts
        related: s.array(s.string()).optional(),

        // Generated fields
        body: s.markdown(),
        excerpt: s.excerpt(),
        toc: s.toc(),

        // Metadata
        draft: s.boolean().default(false),
        publishedAt: s.isodate()
      })
      .transform((data) => ({
        ...data,
        permalink: `/blog/${data.slug}`,
        // Generate reading time if not provided
        readTime: data.readTime || Math.ceil(data.body.split(' ').length / 200)
      }))
    }
  }
})
```

### Content Optimization Checklist

**Every blog post must include:**
- ✅ Clear H1 with primary keyword
- ✅ H2/H3 hierarchy (LLMs use heading structure)
- ✅ First paragraph = direct answer (160 chars)
- ✅ Table of contents with jump links
- ✅ Lists and tables (easy to extract)
- ✅ Data/statistics with sources
- ✅ FAQ section (5-15 questions)
- ✅ Key takeaways section (bullet points)
- ✅ Clear CTA to product
- ✅ Schema markup (JSON-LD)
- ✅ Internal links to related content
- ✅ External links to authoritative sources
- ✅ Alt text on all images
- ✅ Meta description (150-160 chars)
- ✅ OpenGraph tags for social sharing

**LLM-specific optimizations:**
- ✅ Use natural, conversational language
- ✅ Answer questions directly (no fluff)
- ✅ Include specific numbers and data
- ✅ Structure for "snippet extraction"
- ✅ Use "People also ask" format
- ✅ Define acronyms and technical terms
- ✅ Include comparison tables
- ✅ Add "Quick Answer" section at top

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
**Goal**: Blog infrastructure ready for content

**Tasks:**
1. ✅ Document strategy (this file)
2. ⬜ Install and configure Velite
3. ⬜ Create content schema (`velite.config.ts`)
4. ⬜ Build blog page components using design system
   - `BlogCard.tsx` - Uses Card, Badge, Text components
   - `BlogList.tsx` - Uses Grid, Container
   - `BlogHeader.tsx` - Uses Heading, Text, Breadcrumbs
   - `BlogContent.tsx` - MDX wrapper with design tokens
5. ⬜ Set up routing (`app/blog/`, `app/blog/[slug]/`)
6. ⬜ Implement JSON-LD schema generation
7. ⬜ Configure robots.txt for LLM bots
8. ⬜ Create 1 sample blog post (test all features)

**Success criteria:**
- Blog index page renders
- Single blog post displays correctly
- All design system components work
- Schema markup validates (schema.org validator)
- No TypeScript errors

### Phase 2: Content Creation (Week 2-3)
**Goal**: 10 high-quality posts across all tiers

**Content batch 1 (Tier 1 - High conversion):**
1. "How to Create 30 Days of Social Media Content in 30 Minutes"
2. "AI Social Media Content Generation: Complete 2025 Guide"
3. "From 4 Hours to 30 Seconds: Real Case Studies"

**Content batch 2 (Tier 2 - SEO):**
4. "Social Media Content Calendar Templates by Industry"
5. "1000+ Instagram Caption Ideas [Free Resource]"
6. "Social Media Posting Schedule: Data-Driven Guide"

**Content batch 3 (Tier 3 - Thought leadership):**
7. "The Future of AI in Social Media: 2025 Research Report"
8. "How AI is Democratizing Content Creation"

**Content batch 4 (Tier 4 - Technical):**
9. "Building AI Content Pipelines: Architecture Guide"
10. "Prompt Engineering for Brand Voice: Complete Guide"

**Success criteria:**
- All posts follow content structure template
- Each post has FAQ section
- All posts have schema markup
- Internal linking complete
- Images optimized and have alt text

### Phase 3: Integration & SEO (Week 4)
**Goal**: Blog integrated with marketing site, SEO configured

**Tasks:**
1. ⬜ Add blog section to SocialProofSection
   - "Latest from our blog" heading
   - 3 featured posts in card grid
   - "Read more insights →" CTA
2. ⬜ Update footer navigation with blog link
3. ⬜ Generate XML sitemap for blog
4. ⬜ Set up Google Search Console
5. ⬜ Submit sitemap to Google
6. ⬜ Configure Bing Webmaster Tools
7. ⬜ Set up analytics tracking for blog
8. ⬜ Implement share buttons (LinkedIn, Twitter)
9. ⬜ Add related posts section
10. ⬜ Create dynamic OG image generation (`/api/og/[slug]`)

**Success criteria:**
- Blog visible on homepage
- Sitemap indexed by Google
- Analytics tracking confirmed
- Social sharing works
- All internal links functional

### Phase 4: Optimization & Expansion (Ongoing)
**Goal**: Iterate based on data, expand content library

**Metrics to track:**
- Organic traffic to blog (Google Analytics)
- Blog → Trial conversion rate
- Time on page (engagement signal)
- Keyword rankings (Ahrefs/SEMrush)
- LLM citations (manual monitoring)
- Internal link click-through

**Content cadence:**
- 2-3 new posts per week (mix of tiers)
- Update existing posts quarterly
- Refresh data/statistics monthly
- Add new FAQ items based on support questions

**Expansion opportunities:**
- Add `/resources/` hub (guides, templates, tools)
- Create downloadable content (PDFs, spreadsheets)
- Build interactive calculators (ROI, time savings)
- Launch guest posting program
- Create video content (embed in posts)

---

## AI Management Workflow

### How Claude Code Manages Content

**Creating a new blog post:**
```
User: "Create a blog post about Instagram content calendars"

Claude:
1. Reads existing posts to understand tone/structure
2. Checks content schema (velite.config.ts) for required fields
3. Creates new MDX file in content/blog/
4. Generates frontmatter with all required metadata
5. Writes content following structure template
6. Adds FAQ section with schema markup
7. Includes internal links to related posts
8. Saves file → Velite auto-generates TypeScript types
9. Verifies no build errors
```

**Editing existing content:**
```
User: "Update the AI social media guide with 2025 data"

Claude:
1. Reads current post (content/blog/ai-social-media-guide.mdx)
2. Identifies sections with outdated data
3. Uses Edit tool to replace specific sections
4. Updates dateModified in frontmatter
5. Verifies internal links still valid
6. Checks schema markup still correct
```

**Batch operations:**
```
User: "Add FAQ sections to all Tier 1 posts"

Claude:
1. Globs content/blog/*.mdx, filters by category
2. Reads each post
3. Generates relevant FAQs based on content
4. Edits each post to add FAQ section
5. Updates frontmatter with faq array
6. Verifies schema generation works
```

### File-Based Benefits

**Version control:**
- Every change tracked in git
- Easy rollbacks if AI makes mistakes
- Diff view shows exactly what changed

**No external dependencies:**
- No API rate limits
- No authentication issues
- Works offline
- No vendor lock-in

**Type safety:**
- Velite generates types from schema
- TypeScript catches errors at build time
- AI can read types to understand structure

**Simplicity:**
- AI reads markdown = native capability
- No learning curve for content format
- Human-readable, human-editable

---

## Success Metrics

### Short-term (Month 1-3)

**Traffic:**
- 1,000+ monthly blog visitors
- 20+ referring domains
- 50+ keyword rankings

**Engagement:**
- 3+ minute average time on page
- 30%+ scroll depth
- 5%+ internal link clicks

**Conversion:**
- 1-2% blog → trial signup rate
- 10+ trial signups attributed to blog
- 50+ email captures from content upgrades

### Medium-term (Month 4-6)

**Traffic:**
- 5,000+ monthly blog visitors
- 50+ referring domains
- 200+ keyword rankings
- 3+ posts ranking top 10

**LLM presence:**
- 5+ verifiable citations in ChatGPT/Perplexity
- Brand mentioned in AI responses to industry queries
- Content appearing in AI summaries

**Conversion:**
- 2-3% blog → trial signup rate
- 50+ trial signups attributed to blog
- 200+ email captures

### Long-term (Month 7-12)

**Traffic:**
- 20,000+ monthly blog visitors
- 100+ referring domains
- 500+ keyword rankings
- 10+ posts ranking top 3

**Authority:**
- Domain Rating 40+ (Ahrefs)
- Regular LLM citations across multiple topics
- Inbound links from industry publications

**Conversion:**
- 3-5% blog → trial signup rate
- 200+ trial signups attributed to blog
- 20%+ of new customers cite blog as discovery source

**Content library:**
- 50+ published posts
- 100+ internal linking connections
- 5+ pillar content pieces (3,000+ words)
- Resource hub launched

---

## Risk Mitigation

### Technical Risks

**Risk: Build failures from invalid frontmatter**
- Mitigation: Velite schema validation catches errors at build time
- Claude reads schema before creating content
- CI/CD pipeline blocks bad deploys

**Risk: Design system drift (blog components diverge)**
- Mitigation: All blog components import from `lib/design-system/`
- Code review enforces this pattern
- AI instructed to never create custom styles

**Risk: MDX complexity breaks AI editing**
- Mitigation: Keep MDX simple, use standard components
- Claude trained on MDX format
- Fallback: Edit as plain markdown

### Content Risks

**Risk: AI-generated content is low quality**
- Mitigation: Human review before publish (Phase 2)
- Use AI as draft generator, human as editor
- Quality checklist for every post

**Risk: Content doesn't rank (SEO failure)**
- Mitigation: Follow proven structure template
- Research keywords before writing
- Analyze competitor top-ranking posts
- Iterate based on Search Console data

**Risk: Blog doesn't convert (traffic but no signups)**
- Mitigation: Every post has clear CTA
- A/B test CTA placement and copy
- Internal linking drives to high-converting pages
- Exit intent popups on blog (Phase 4)

### Operational Risks

**Risk: Can't maintain content cadence**
- Mitigation: Start with 2 posts/week (manageable)
- Build content backlog during Phase 2
- AI assists with 80% of drafting
- Batch content creation sessions

**Risk: Content becomes outdated quickly**
- Mitigation: Quarterly refresh schedule
- Tag posts with "Updated [Date]"
- Monitor competitors for new trends
- Update statistics monthly

---

## Open Questions

**To decide before implementation:**

1. **Comment system?**
   - Options: Disqus, Giscus (GitHub discussions), or no comments
   - Recommendation: Start without, add later if engagement high

2. **Newsletter integration?**
   - Where: End of each post, popup, dedicated page?
   - Recommendation: Email capture at post end (ConvertKit/Mailchimp)

3. **Search functionality?**
   - Client-side (Algolia) or server-side?
   - Recommendation: Start with category/tag filters, add search in Phase 4

4. **Dynamic OG images?**
   - Generate at build time or runtime API?
   - Recommendation: Runtime API (`/api/og/[slug]`) using @vercel/og

5. **Content upgrades?**
   - Gated downloads (email required) or free?
   - Recommendation: Mix - some free, some gated for lead gen

6. **Guest posting?**
   - Accept guest posts from industry experts?
   - Recommendation: Phase 4 consideration, focus on owned content first

7. **Multi-language support?**
   - Internationalization from day 1 or later?
   - Recommendation: English only initially, add i18n if international traffic grows

---

## Next Steps

**Immediate actions:**
1. ✅ Document strategy (this file) - COMPLETE
2. ⬜ Review and approve approach
3. ⬜ Clone jolbol1 template to `/tmp` for reference
4. ⬜ Extract velite.config.ts and adapt
5. ⬜ Create content schema
6. ⬜ Build first blog component (BlogCard)
7. ⬜ Create sample blog post
8. ⬜ Verify build works

**Decision required from user:**
- Approve overall strategy?
- Any changes to content tiers?
- Preferred timeline (aggressive or conservative)?
- Resource allocation (AI-only or human editor involved)?

---

**Document version**: 1.0
**Last updated**: 2025-01-29
**Owner**: OmniSignalAI Team
**Status**: Pending approval