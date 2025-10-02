# Quick Reference Guide
## Fast Lookup for Common Development Tasks

**Purpose:** Instant answers to "How do I...?" questions

---

## Table of Contents

- [Setup & Configuration](#setup--configuration)
- [Component Development](#component-development)
- [Image Generation](#image-generation)
- [Design System](#design-system)
- [Common Tasks](#common-tasks)
- [Debugging](#debugging)
- [Git Workflow](#git-workflow)

---

## Setup & Configuration

### Initial Setup
```bash
git clone https://github.com/prodij/OmniSignalAI-web.git
cd OmniSignalAI-web
npm install
cp .env.example .env.local
# Add OPENROUTER_API_KEY to .env.local
npm run dev
```

### Environment Variables
```env
# .env.local
OPENROUTER_API_KEY=sk-xxxxx                    # Required for image generation
NEXT_PUBLIC_API_URL=http://localhost:5000      # Optional
```

### Common Commands
```bash
npm run dev              # Start dev server (port 5000)
npm run build           # Production build
npm run type-check      # Validate TypeScript
npm run lint            # Check code style
npm run format          # Format code
npm test                # Run tests
```

---

## Component Development

### Create a New Component

**Location:** `components/marketing/MyComponent.tsx`

**Template:**
```typescript
'use client'

import { Button, Card } from '@/lib/design-system'

interface MyComponentProps {
  title: string
  description?: string
}

export function MyComponent({ title, description }: MyComponentProps) {
  return (
    <Card>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </Card>
  )
}
```

### Add Component to Page

**File:** `app/page.tsx`

```typescript
import { MyComponent } from '@/components/marketing/MyComponent'

export default function HomePage() {
  return (
    <>
      {/* Other sections */}
      <MyComponent title="New Section" />
    </>
  )
}
```

### Use Client-Side Features

**When to add `'use client'`:**
- Using React hooks (useState, useEffect)
- Using event handlers (onClick, onChange)
- Using browser APIs (window, localStorage)

```typescript
'use client'

import { useState } from 'react'

export function InteractiveComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

---

## Image Generation

### Generate a Single Image

```typescript
import { generateImage } from '@/lib/media-generator'

const result = await generateImage({
  prompt: 'Professional hero banner for AI-powered platform, modern design, vibrant colors'
})

if (result.success) {
  console.log('Image URL:', result.imageUrl)
  // Use: <img src={result.imageUrl} alt="..." />
}
```

### Use Templates (Recommended)

```typescript
import { generateImage, COMMON_TEMPLATES, buildPromptFromTemplate } from '@/lib/media-generator'

// Blog header
const blogPrompt = buildPromptFromTemplate(
  COMMON_TEMPLATES.blogHeader('AI marketing trends 2025')
)
const result = await generateImage({ prompt: blogPrompt })

// Social media post
const socialPrompt = buildPromptFromTemplate(
  COMMON_TEMPLATES.socialMediaPost('productivity tips')
)

// Hero banner
const heroPrompt = buildPromptFromTemplate(
  COMMON_TEMPLATES.heroSection('AI-powered content creation')
)
```

### Use Image Generation Agent

**For autonomous operation:**
```typescript
import { ImageGenerationAgent } from '@/lib/agents/image-generation-agent'

const agent = new ImageGenerationAgent()

const result = await agent.generate({
  intent: 'Create a professional blog header about AI marketing automation'
})

if (result.success) {
  console.log('Image:', result.imageUrl)
  console.log('Use case detected:', result.reasoning.detectedIntent.useCase)
}
```

### Generate Blog Thumbnails

```bash
# Generate for all blog posts without thumbnails
npm run generate:thumbnails

# Force regenerate all
npm run generate:thumbnails:force

# Generate section images
npm run generate:section-images
```

### Check API Configuration

```typescript
import { validateEnvironment } from '@/lib/media-generator'

const validation = validateEnvironment()
if (!validation.isValid) {
  console.error('Setup required:', validation.error)
}
```

---

## Design System

### Import Components

```typescript
// Base components
import { Button, Card, Badge, Input, Textarea } from '@/lib/design-system'

// Layout components
import { Section, Container, Grid, Flex } from '@/lib/design-system'

// Interactive components
import { Tabs, Accordion, Modal, Tooltip } from '@/lib/design-system'

// Typography
import { Heading, Text } from '@/lib/design-system'

// Constants
import { colors, spacing, typography } from '@/lib/design-system/constants'
```

### Common Patterns

**Section with Container:**
```typescript
<Section variant="light">
  <Container>
    <Heading level={2}>Section Title</Heading>
    {/* Content */}
  </Container>
</Section>
```

**Button Variants:**
```typescript
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

**Card Variants:**
```typescript
<Card variant="default">Default card</Card>
<Card variant="elevated">Elevated card</Card>
<Card variant="outlined">Outlined card</Card>
```

**Grid Layout:**
```typescript
<Grid cols={3} gap={6}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>

// Responsive
<Grid cols={{ sm: 1, md: 2, lg: 3 }} gap={4}>
  {/* Items */}
</Grid>
```

**Typography:**
```typescript
<Heading level={1}>H1 Title</Heading>
<Heading level={2}>H2 Title</Heading>
<Heading level={3}>H3 Title</Heading>

<Text variant="large">Large text</Text>
<Text variant="base">Base text</Text>
<Text variant="small">Small text</Text>
```

---

## Common Tasks

### Add a New Marketing Section

**1. Create component:**
```typescript
// components/marketing/FeatureSection.tsx
'use client'

import { Section, Container, Heading, Grid, Card } from '@/lib/design-system'

export function FeatureSection() {
  return (
    <Section variant="light">
      <Container>
        <Heading level={2} align="center">Our Features</Heading>
        <Grid cols={3} gap={6} className="mt-8">
          <Card>Feature 1</Card>
          <Card>Feature 2</Card>
          <Card>Feature 3</Card>
        </Grid>
      </Container>
    </Section>
  )
}
```

**2. Add to homepage:**
```typescript
// app/page.tsx
import { FeatureSection } from '@/components/marketing/FeatureSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />  {/* ← Add here */}
      <PricingSection />
    </>
  )
}
```

### Create a Blog Post

**1. Create MDX file:**
```mdx
---
title: "Your Blog Title"
date: "2024-12-30"
author: "Your Name"
excerpt: "Brief description"
tags: ["AI", "Marketing"]
published: true
---

# Introduction

Your content here...

## Section 1

More content...
```

**2. Place in:** `content/blog/your-slug.mdx`

**3. Generate thumbnail:**
```bash
npm run generate:thumbnails
```

### Add an API Route

**1. Create route file:**
```typescript
// app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Process request
  
  return NextResponse.json({ success: true })
}
```

**2. Access at:** `http://localhost:5000/api/my-endpoint`

### Add Global Styles

**File:** `styles/globals.css`

```css
/* Add custom styles */
.my-custom-class {
  /* Avoid if possible - use design system */
}

/* Override Tailwind if needed */
@layer components {
  .btn-special {
    @apply px-4 py-2 bg-purple-600 text-white rounded-lg;
  }
}
```

---

## Debugging

### Common Errors & Fixes

**"Module not found: '@/lib/design-system'"**
```bash
# Check tsconfig.json has path aliases
# Restart TypeScript server
# Reinstall: rm -rf node_modules && npm install
```

**"Hydration mismatch"**
```typescript
// ❌ Bad
const id = Math.random().toString()

// ✅ Good
import { useId } from 'react'
const id = useId()
```

**"window is not defined"**
```typescript
// ❌ Bad
const width = window.innerWidth

// ✅ Good
const [width, setWidth] = useState(0)

useEffect(() => {
  setWidth(window.innerWidth)
}, [])
```

**"Image generation fails"**
```bash
# Check API key
cat .env.local | grep OPENROUTER

# Verify directory exists
ls -la public/generated/images/

# Test validation
node -e "require('./lib/media-generator/utils').validateEnvironment()"
```

**"Tailwind classes not working"**
```bash
# Check PostCSS config exists
cat postcss.config.js

# Check Tailwind content paths
cat tailwind.config.js | grep content -A 10

# Restart dev server
npm run dev
```

### View Build Output

```bash
# Build and check for errors
npm run build

# Check bundle size
npm run build -- --profile

# Analyze bundle
npm install -D @next/bundle-analyzer
```

### Check TypeScript Errors

```bash
# All errors
npm run type-check

# Specific file
npx tsc --noEmit app/page.tsx
```

### Debug with Console

```typescript
// During development
console.log('Debug info:', data)
console.error('Error:', error)
console.table(arrayData)

// Production - use proper logging
if (process.env.NODE_ENV === 'development') {
  console.log('Dev only log')
}
```

---

## Git Workflow

### Standard Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# ... edit files ...

# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "feat: Add new feature"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

### Commit Message Format

```
type: Brief description

Examples:
feat: Add blog image generation
fix: Resolve hydration mismatch in header
docs: Update development guide
style: Format code with prettier
refactor: Simplify agent configuration
test: Add component tests
chore: Update dependencies
```

### Before Pushing

```bash
# Run quality checks
npm run type-check
npm run lint
npm run format
npm test

# All pass? Good to push!
git push
```

### Undo Changes

```bash
# Undo uncommitted changes to file
git checkout -- filename

# Undo all uncommitted changes
git reset --hard

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

---

## Performance Tips

### Optimize Images

```typescript
import Image from 'next/image'

// ✅ Always use Next.js Image
<Image 
  src="/images/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // For above-the-fold images
/>
```

### Lazy Load Components

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { ssr: false, loading: () => <p>Loading...</p> }
)
```

### Memoize Expensive Calculations

```typescript
import { useMemo } from 'react'

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])
```

### Tree-Shakeable Imports

```typescript
// ✅ Good - Only imports what you need
import { Button } from '@/lib/design-system'

// ❌ Bad - Imports everything
import * as DS from '@/lib/design-system'
```

---

## Keyboard Shortcuts (VS Code)

```
Cmd/Ctrl + P        - Quick file open
Cmd/Ctrl + Shift + P - Command palette
Cmd/Ctrl + B        - Toggle sidebar
Cmd/Ctrl + `        - Toggle terminal
Cmd/Ctrl + /        - Toggle comment
Cmd/Ctrl + D        - Select next occurrence
Cmd/Ctrl + F        - Find
Cmd/Ctrl + Shift + F - Find in files
F2                  - Rename symbol
Alt + Up/Down       - Move line up/down
```

---

## Need More Help?

### Documentation Hierarchy

1. **This file** - Quick answers
2. **DEVELOPMENT-GUIDE.md** - Comprehensive guide
3. **CLAUDE.md** - AI agent instructions (most detailed!)
4. **README.md** - Project overview
5. **Specific READMEs** - Component/agent docs

### External Resources

- **Next.js:** https://nextjs.org/docs
- **React:** https://react.dev
- **Tailwind:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs

### When Stuck

1. Check existing code for examples
2. Search this guide for your question
3. Read CLAUDE.md for detailed context
4. Check component README files
5. Review error messages carefully

---

**Last Updated:** December 2024  
**Related:** DEVELOPMENT-GUIDE.md, CLAUDE.md
