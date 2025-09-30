# Blog User Guide for OmniSignalAI

Complete guide for creating, managing, and optimizing blog content with AI assistance and LLM citation optimization.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Creating a New Blog Post](#creating-a-new-blog-post)
3. [Content Structure for LLM Optimization](#content-structure-for-llm-optimization)
4. [AI-Assisted Content Creation](#ai-assisted-content-creation)
5. [Frontmatter Reference](#frontmatter-reference)
6. [Schema Types Explained](#schema-types-explained)
7. [Best Practices for LLM Citations](#best-practices-for-llm-citations)
8. [Testing and Publishing](#testing-and-publishing)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### View Your Blog

**Development:**
```bash
npm run dev
# Visit http://localhost:5000/blog
```

**Production:**
```bash
npm run build && npm start
# Visit http://localhost:5000/blog
```

**Docker:**
```bash
# Development
npm run docker:dev

# Production
npm run docker:prod
# Visit http://localhost:5001/blog
```

### File Locations

- **Blog posts**: `content/blog/*.mdx`
- **Generated types**: `.velite/index.d.ts` (auto-generated, don't edit)
- **Configuration**: `velite.config.ts`

---

## Creating a New Blog Post

### Step 1: Create MDX File

Create a new file in `content/blog/` with a descriptive slug:

```bash
# Good naming convention
content/blog/ai-social-media-automation-guide.mdx
content/blog/instagram-content-calendar-templates.mdx
content/blog/case-study-fashion-brand-ai.mdx

# Avoid
content/blog/post-1.mdx
content/blog/blog-post.mdx
```

### Step 2: Add Frontmatter

Every blog post starts with YAML frontmatter between `---` delimiters:

```yaml
---
title: "Your Blog Post Title (Max 100 chars)"
description: "Clear, concise description for SEO and previews (Max 200 chars)"
datePublished: "2025-01-29T10:00:00Z"
keywords:
  - "keyword one"
  - "keyword two"
  - "keyword three"
category: "Guides"  # Options: Guides, Case Studies, Research, Technical, News
tags: ["AI", "Social Media", "Automation"]
featured: false  # Set to true to show on homepage
schema: "Article"  # Options: Article, HowTo, FAQPage
---
```

### Step 3: Write Content

Write your content in Markdown/MDX after the frontmatter:

```markdown
---
title: "How to Automate Social Media with AI"
# ... frontmatter ...
---

## Quick Answer

AI automation reduces social media management time by 90%. This guide shows you how to implement it in 3 steps.

## What You'll Learn

- How to set up AI tools for content generation
- Best practices for maintaining brand voice
- Real ROI calculations and case studies

## Step-by-Step Guide

### 1. Choose Your Tools

Start by evaluating...
```

### Step 4: Build & Preview

```bash
# Velite will automatically process your content
npm run dev

# View your post at:
# http://localhost:5000/blog/your-slug-here
```

---

## Content Structure for LLM Optimization

LLMs like ChatGPT and Perplexity prefer **structured, scannable content**. Use this template:

### Optimal Post Structure

```markdown
---
# Frontmatter with schema and FAQ
title: "How to [Achieve Goal] in [Timeframe]"
schema: "HowTo"
faq:
  - q: "Most common question about this topic?"
    a: "Direct, complete answer in 1-2 sentences."
  - q: "Second most common question?"
    a: "Another clear, quotable answer."
---

## Quick Answer (First 160 characters)

Direct answer to the main question. This appears in meta descriptions and is often quoted by LLMs.

## Table of Contents

- [What You'll Learn](#what-youll-learn)
- [Step-by-Step Guide](#step-by-step-guide)
- [Real-World Examples](#real-world-examples)
- [FAQ](#faq)
- [Key Takeaways](#key-takeaways)

## What You'll Learn

Clear bullet points:
- Specific outcome 1
- Specific outcome 2
- Specific outcome 3

## Step-by-Step Guide

### 1. First Step (Time: 5 minutes)

**What you need:**
- Requirement 1
- Requirement 2

**Process:**
| Step | Action | Result |
|------|--------|--------|
| 1 | Do this | Get that |
| 2 | Do this | Get that |

### 2. Second Step (Time: 10 minutes)

[Detailed instructions with code examples or screenshots]

## Real-World Examples

### Case Study 1: E-commerce Brand

**Before:**
- Metric: 8 hours/week on content
- Cost: $400/week

**After:**
- Metric: 30 minutes/week
- Cost: $25/week
- **ROI**: 93.75% time savings = $19,500/year

### Case Study 2: SaaS Startup

[Another concrete example with numbers]

## FAQ

### How long does this process take?

With the right tools, approximately 30 minutes for a month of content, compared to 8+ hours manually.

### Does this work for [specific use case]?

Yes, this approach works for [use case] because [reason]. Here's how...

[10-15 questions with direct answers]

## Key Takeaways

- ✅ **Primary takeaway** with specific metric or outcome
- ✅ **Secondary takeaway** with actionable step
- ✅ **ROI statement** with concrete numbers
- ✅ **Best for** [target audience description]
- ✅ **Getting started** with clear next action

## Try It Yourself

[Clear CTA with link to product/service]
```

### Why This Structure Works for LLMs

1. **Quick Answer** - LLMs extract this for summary responses
2. **Structured data** - Tables, lists, and headings are easy to parse
3. **FAQ section** - Directly answers follow-up queries
4. **Specific numbers** - "93.75% time savings" is more citable than "saves time"
5. **Clear sections** - H2/H3 hierarchy helps LLMs understand context

---

## AI-Assisted Content Creation

### Using Claude Code to Generate Blog Posts

#### Prompt Template for New Posts

```
Create a blog post about [topic] targeting [audience].

Structure:
- Title: "How to [achieve goal] in [timeframe]"
- Category: Guides
- Schema: HowTo
- Word count: 2000-2500 words

Include:
1. Quick Answer section (160 chars)
2. 3-step process with timing
3. 2 case studies with real metrics
4. 10 FAQ items
5. Data table comparing before/after
6. Key takeaways section

Tone: Professional, helpful, data-driven
Keywords: [keyword 1], [keyword 2], [keyword 3]

Reference existing post structure from: content/blog/hello-world-omnisignal.mdx
```

#### Prompt Template for Updating Posts

```
Update the blog post at content/blog/[slug].mdx:

Changes needed:
- Add FAQ section with 5 questions
- Update statistics with 2025 data
- Add case study from [company/industry]
- Optimize for LLM citation (add tables, bullet points)

Maintain:
- Existing tone and style
- URL slug (don't change filename)
- Category and tags
```

#### Batch Content Creation

```
Create 5 blog posts for the "Guides" category:

1. "How to Create 30 Days of Instagram Content in 30 Minutes"
2. "AI Content Calendar: Complete Setup Guide for 2025"
3. "Social Media Automation: ROI Calculator and Best Practices"
4. "Brand Voice with AI: How to Maintain Consistency at Scale"
5. "Multi-Platform Posting: AI Scheduling Guide"

For each post:
- 2000+ words
- HowTo schema
- 5+ FAQ items
- Real case studies
- Data tables
- Specific metrics

Save to: content/blog/[descriptive-slug].mdx
```

### AI Editing Checklist

After AI generates content, verify:

- [ ] Title is under 100 characters
- [ ] Description is under 200 characters
- [ ] Keywords array has 3-5 items
- [ ] FAQ section has 5+ questions
- [ ] At least 2 data tables or lists
- [ ] Specific numbers (not "saves time" but "saves 3.5 hours")
- [ ] Clear H2/H3 hierarchy
- [ ] Internal links to other posts
- [ ] CTA to product/service

---

## Frontmatter Reference

### Required Fields

```yaml
title: "String (max 100 chars)"
description: "String (max 200 chars)"
datePublished: "ISO 8601 date (YYYY-MM-DDTHH:MM:SSZ)"
keywords: ["array", "of", "strings"]
category: "Enum: Guides | Case Studies | Research | Technical | News"
```

### Optional Fields

```yaml
# Metadata
dateModified: "ISO 8601 date"
tags: ["array", "of", "strings"]
readTime: 8  # Auto-calculated if omitted (200 words/min)
featured: true  # Shows on homepage
draft: false  # Excludes from build if true

# Author (defaults to OmniSignalAI Team)
author:
  name: "Author Name"
  url: "https://example.com"
  image: "https://example.com/avatar.jpg"

# Schema type (affects JSON-LD markup)
schema: "Article"  # or "HowTo" or "FAQPage"

# Open Graph images
og:
  image: "/og-images/post-name.png"
  imageAlt: "Description of image"

# Related posts (shows at bottom)
related:
  - "slug-of-related-post-1"
  - "slug-of-related-post-2"
```

### FAQ Schema (for LLM optimization)

```yaml
faq:
  - q: "Question text?"
    a: "Direct, complete answer."
  - q: "Another question?"
    a: "Another answer with specifics."
  # Add 5-15 questions
```

### HowTo Steps (for step-by-step guides)

```yaml
schema: "HowTo"
steps:
  - name: "Setup Your Environment"
    description: "Install required tools and configure settings"
    image: "/images/step-1.png"  # Optional
  - name: "Generate Content"
    description: "Use AI to create 30 days of posts"
  - name: "Review and Schedule"
    description: "Quality check and publish to platforms"
```

---

## Schema Types Explained

### When to Use Each Schema

#### Article (Default)
**Best for:** General blog posts, opinions, news, updates

```yaml
schema: "Article"
```

**JSON-LD generated:**
- Basic article markup
- Author, publisher, dates
- Breadcrumbs

**Example posts:**
- "The Future of AI in Social Media Marketing"
- "5 Trends Shaping Content Creation in 2025"
- "Case Study: How Brand X Scaled Content"

#### HowTo (Step-by-Step Guides)
**Best for:** Tutorials, guides, instructions

```yaml
schema: "HowTo"
steps:
  - name: "Step 1 Title"
    description: "What to do"
  - name: "Step 2 Title"
    description: "Next action"
```

**JSON-LD generated:**
- HowTo schema with steps
- Total time required
- Tools/materials needed

**Example posts:**
- "How to Set Up AI Content Generation"
- "Step-by-Step: Building a Content Calendar"
- "Tutorial: Automating Social Media Posts"

**Benefits for LLM citation:**
- Steps are easily extractable
- LLMs can reference specific steps
- Clear procedural structure

#### FAQPage (Q&A Format)
**Best for:** FAQ posts, common questions, troubleshooting

```yaml
schema: "FAQPage"
faq:
  - q: "Question 1?"
    a: "Answer 1"
  - q: "Question 2?"
    a: "Answer 2"
```

**JSON-LD generated:**
- FAQPage schema
- Each question as separate entity
- Direct answers

**Example posts:**
- "AI Content Generation: 20 Common Questions"
- "Social Media Automation FAQ"
- "Troubleshooting Guide: AI Tools"

**Benefits for LLM citation:**
- Direct question-answer pairs
- LLMs quote FAQ answers directly
- Appears in AI search results

---

## Best Practices for LLM Citations

### What Makes Content Citable?

#### ✅ DO: Write for Extractability

**Good (Citable):**
```markdown
## Time Savings Breakdown

| Method | Time | Cost | Efficiency |
|--------|------|------|------------|
| Manual | 8h | $400 | Baseline |
| AI | 30min | $25 | **16x faster** |

**Result**: 93.75% time savings, $4,500 saved annually.
```

**Why it works:**
- Clear table structure
- Specific numbers
- Bold key metrics
- Concrete conclusion

**Bad (Not Citable):**
```markdown
Using AI saves a lot of time and money compared to doing it manually.
```

**Why it fails:**
- Vague claims
- No specific data
- Not extractable

#### ✅ DO: Front-Load Answers

**Good:**
```markdown
### How long does AI content generation take?

With tools like OmniSignalAI, you can generate 30 days of content in approximately 30 minutes, compared to 8+ hours manually—a 93.75% time savings.

The process breaks down to:
- Setup: 5 minutes
- Generation: 15 minutes
- Review: 10 minutes
```

**Why it works:**
- Answer in first sentence
- Specific numbers
- Breakdown for context

**Bad:**
```markdown
### How long does AI content generation take?

Well, it depends on several factors. First, you need to consider your content volume. Then think about your brand voice. After you've done all the setup, which can take some time, you'll start to see efficiency gains...
```

**Why it fails:**
- No direct answer
- Vague language
- Buried information

#### ✅ DO: Use Data Tables

LLMs love structured data:

```markdown
## Performance Comparison

| Platform | Posts/Month | Time (Manual) | Time (AI) | Savings |
|----------|-------------|---------------|-----------|---------|
| Instagram | 30 | 6h | 20min | 94% |
| LinkedIn | 20 | 4h | 15min | 94% |
| Twitter | 60 | 3h | 10min | 95% |
| **Total** | **110** | **13h** | **45min** | **94%** |

**Key insight**: AI reduces 13 hours of manual work to 45 minutes across all platforms.
```

#### ✅ DO: Create FAQ Sections

Every post should have 5-15 FAQ items:

```markdown
## FAQ

### Does AI content maintain brand voice?

Yes, when properly configured with 5-10 example posts and brand guidelines, AI maintains 95%+ consistency with your brand voice. The key is the initial setup phase.

### What's the ROI of AI content tools?

For teams creating 20+ posts per month, ROI is positive within the first month. Average savings: $200-500/month for small teams, $2,000-10,000/month for agencies.

### Can AI create content for multiple platforms?

Yes, modern AI tools can adapt content for Instagram, LinkedIn, Twitter, Facebook, and TikTok simultaneously. Cross-platform adaptation takes 2-3 minutes per content batch.
```

#### ✅ DO: Include Specific Examples

**Good:**
```markdown
### Real Results: E-commerce Fashion Brand

**Challenge**: 6 hours/week creating Instagram content

**Solution**: Implemented OmniSignalAI with brand voice training

**Results**:
- Time reduced to 30 minutes/week (92% savings)
- Content output increased 25% (45 posts/month → 56 posts/month)
- Engagement rate maintained at 4.2%
- Annual savings: $15,600

**Quote**: "We were skeptical about AI maintaining our aesthetic, but after training it with our style guide and best posts, it's indistinguishable from our human-created content." — Marketing Director
```

#### ❌ DON'T: Write Vague Claims

**Avoid:**
- "Saves significant time"
- "Much cheaper than alternatives"
- "Many companies have seen success"
- "Results may vary"
- "It depends on your situation"

**Instead:**
- "Saves 3.5 hours per content batch"
- "Costs $50/month vs $400/month for alternatives"
- "73% of surveyed companies report ROI within 30 days"
- "Average results: 90-95% time savings"
- "Works best for teams creating 20+ posts/month"

### LLM-Optimized Checklist

Before publishing, verify your post has:

#### Content Structure
- [ ] Quick Answer in first paragraph (160 chars)
- [ ] Table of Contents with jump links
- [ ] Clear H2/H3 hierarchy
- [ ] 5+ FAQ questions with direct answers
- [ ] Key Takeaways section with bullet points

#### Data & Evidence
- [ ] At least 2 data tables
- [ ] Specific numbers (not "saves time" but "saves 3.5 hours")
- [ ] 1-2 case studies with metrics
- [ ] Before/after comparisons
- [ ] ROI calculations

#### Formatting for Extraction
- [ ] Use **bold** for key metrics
- [ ] Lists over paragraphs where possible
- [ ] Short sentences (under 25 words)
- [ ] One idea per paragraph
- [ ] Scannable structure (can skim in 30 seconds)

#### Schema Markup
- [ ] Appropriate schema type (Article/HowTo/FAQPage)
- [ ] FAQ array in frontmatter
- [ ] Steps array for HowTo posts
- [ ] All required frontmatter fields

#### Internal Linking
- [ ] Link to 2-3 related posts
- [ ] Link to product/service pages
- [ ] Link to resources/tools
- [ ] Use descriptive anchor text

---

## Testing and Publishing

### Pre-Publish Checklist

#### 1. Build Test

```bash
npm run build
```

**Check for:**
- No TypeScript errors
- Velite builds successfully
- Post appears in build output

#### 2. Visual Test

```bash
npm run dev
# Visit http://localhost:5000/blog/your-slug
```

**Verify:**
- Title and description display correctly
- Images load (if any)
- Tables render properly
- FAQ section appears
- Related posts show (if configured)
- CTA buttons work

#### 3. Schema Validation

**Test JSON-LD:**
1. Visit your post in browser
2. View page source
3. Find `<script type="application/ld+json">`
4. Copy JSON
5. Validate at: https://validator.schema.org/

**Check for:**
- No errors
- Correct schema type (Article/HowTo/FAQPage)
- All expected fields present
- FAQ items structured correctly

#### 4. SEO Check

**Meta tags:**
- Open Graph tags present
- Twitter Card tags present
- Description under 200 chars
- Title under 100 chars

**Tools:**
- https://metatags.io/ - Preview cards
- https://cards-dev.twitter.com/validator - Twitter card validator
- Browser DevTools → SEO audit

#### 5. Mobile Test

```bash
# Chrome DevTools
# Toggle device toolbar
# Test on: iPhone SE, iPad, Desktop
```

**Verify:**
- Content readable on small screens
- Tables scroll horizontally
- Images responsive
- No horizontal scroll on mobile

### Publishing Workflow

#### Option 1: Git Workflow (Recommended)

```bash
# 1. Create post
# content/blog/new-post.mdx

# 2. Test locally
npm run dev

# 3. Build test
npm run build

# 4. Commit
git add content/blog/new-post.mdx
git commit -m "blog: add post about [topic]"

# 5. Push to remote
git push origin main

# 6. Deploy
# (Vercel auto-deploys on push to main)
# OR manually deploy to server
```

#### Option 2: Direct Deployment

```bash
# 1. Create/edit post
# 2. Build production
npm run build

# 3. Deploy with Docker
npm run docker:prod

# OR deploy standalone
npm start
```

### Post-Publish Tasks

#### 1. Submit to Search Engines

```bash
# Google Search Console
https://search.google.com/search-console
# Submit sitemap: https://omnisignalai.com/blog-sitemap.xml
```

#### 2. Share on Social Media

Template:
```
New blog post: [Title] 📝

[One-sentence hook with key metric]

Read the full guide: [URL]

#AI #SocialMedia #ContentCreation
```

#### 3. Monitor Performance

Track:
- Google Analytics: Page views, time on page
- Search Console: Impressions, clicks, position
- LLM citations: Manual monitoring (search "[topic] site:omnisignalai.com" in ChatGPT)

#### 4. Update Internal Links

Add links from older posts to new post when relevant:

```markdown
<!-- In older post -->
Learn more about [topic] in our [comprehensive guide](../new-post-slug).
```

---

## Troubleshooting

### Build Errors

#### Error: "Module not found: Can't resolve '#site/content'"

**Cause**: Velite hasn't generated content yet

**Fix:**
```bash
# Delete .velite directory
rm -rf .velite

# Rebuild
npm run build
```

#### Error: "Invalid frontmatter"

**Cause**: YAML syntax error in frontmatter

**Fix:**
- Check for missing quotes around strings with colons
- Ensure proper indentation (2 spaces)
- Validate YAML: https://www.yamllint.com/

**Common issues:**
```yaml
# Bad - unquoted string with colon
title: How to: Guide

# Good - quoted
title: "How to: Guide"

# Bad - wrong indentation
faq:
- q: "Question?"
  a: "Answer"

# Good - consistent indentation
faq:
  - q: "Question?"
    a: "Answer"
```

#### Error: "Failed to compile" with TypeScript errors

**Cause**: Type mismatch in component props

**Fix:**
```bash
# Check generated types
cat .velite/index.d.ts

# Restart TypeScript server in IDE
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Content Not Showing

#### Post doesn't appear in /blog list

**Checklist:**
- [ ] `published: true` in frontmatter
- [ ] `draft: false` in frontmatter
- [ ] File has `.mdx` extension (not `.md`)
- [ ] File is in `content/blog/` directory
- [ ] Velite build succeeded (check terminal)

**Debug:**
```bash
# Check if Velite sees the file
npm run build 2>&1 | grep "blog"

# Check generated data
node -e "console.log(require('./.velite/index.js').blog)"
```

#### Post shows but content is blank

**Cause**: MDX processing error

**Fix:**
- Check for invalid MDX syntax
- Ensure React components are imported
- Look for console errors in browser

### Performance Issues

#### Build is slow (>30 seconds)

**Cause**: Large number of posts or large images

**Optimize:**
```bash
# Compress images before adding
# Use ImageOptim, TinyPNG, or:
npm install -g sharp-cli
sharp input.jpg --width 1200 --quality 80 --output optimized.jpg
```

#### Hot reload not working

**Cause**: Docker volume configuration or Velite watch mode

**Fix:**
```bash
# Restart dev server
npm run dev

# Or in Docker
npm run docker:down
npm run docker:dev
```

### Schema Issues

#### Schema not validating

**Common fixes:**
- Ensure all required fields present
- Check date format (ISO 8601)
- Validate FAQ answers are non-empty
- Verify steps array for HowTo posts

**Test schema:**
```bash
# Extract schema from built page
curl http://localhost:5000/blog/your-slug | grep -A 50 "application/ld+json"

# Validate online
# Copy JSON to https://validator.schema.org/
```

---

## Quick Reference

### File Naming Convention

```bash
# Good (SEO-friendly slugs)
content/blog/ai-social-media-automation-2025.mdx
content/blog/instagram-content-calendar-template.mdx
content/blog/case-study-fashion-brand-roi.mdx

# Bad
content/blog/post1.mdx
content/blog/blog-post.mdx
content/blog/untitled.mdx
```

### Minimal Post Template

```yaml
---
title: "Your Title Here"
description: "Your description here"
datePublished: "2025-01-29T10:00:00Z"
keywords: ["keyword1", "keyword2", "keyword3"]
category: "Guides"
---

## Quick Answer

[160 character summary]

## Main Content

[Your content here]

## FAQ

### Question 1?
Answer 1

### Question 2?
Answer 2

## Key Takeaways

- Takeaway 1
- Takeaway 2
- Takeaway 3
```

### Common Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run type-check         # Check TypeScript

# Docker
npm run docker:dev         # Dev with Docker
npm run docker:prod        # Prod with Docker
npm run docker:down        # Stop containers

# Deployment
npm start                  # Start production server
git push                   # Auto-deploy (if Vercel configured)
```

---

## Getting Help

### Internal Resources

- **Strategy**: `PLAN-BLOG.md` - Comprehensive blog strategy
- **Design System**: `lib/design-system/` - Component reference
- **Config**: `velite.config.ts` - Content schema
- **Examples**: `content/blog/hello-world-omnisignal.mdx`

### AI Assistant Prompts

**For blog post creation:**
```
Create a blog post about [topic] following the structure in content/blog/hello-world-omnisignal.mdx. Include HowTo schema with 3 steps and 10 FAQ items. Target audience: [description]. Keywords: [list].
```

**For troubleshooting:**
```
I'm getting this error when building my blog: [error message]. The file is content/blog/[filename].mdx. Help me fix it.
```

**For optimization:**
```
Review content/blog/[filename].mdx and optimize it for LLM citations. Add more structured data, tables, and specific metrics. Ensure FAQ section has 10+ questions.
```

---

## Version

**Document Version**: 1.0
**Last Updated**: 2025-01-29
**System Version**: Velite 0.1.0-beta.11 + Next.js 14.0.3

---

**Need more help?** Ask Claude Code to help with any blog-related tasks!