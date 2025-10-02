# Development Guide
## Comprehensive Guide for Extending OmniSignalAI Web Capabilities

**Version:** 1.0  
**Last Updated:** December 2024  
**Purpose:** Prevent common mistakes, ensure consistency, and accelerate development

---

## Table of Contents

1. [Quick Start for New Developers](#quick-start-for-new-developers)
2. [Project Architecture](#project-architecture)
3. [Coding Standards & Patterns](#coding-standards--patterns)
4. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
5. [Agent Development Guide](#agent-development-guide)
6. [Design System Usage](#design-system-usage)
7. [Testing Strategy](#testing-strategy)
8. [Performance Best Practices](#performance-best-practices)
9. [Deployment & CI/CD](#deployment--cicd)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start for New Developers

### First-Time Setup

```bash
# Clone repository
git clone https://github.com/prodij/OmniSignalAI-web.git
cd OmniSignalAI-web

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Required: Add your API keys
# OPENROUTER_API_KEY=your_key_here (for image generation)

# Start development server (runs on port 5000)
npm run dev

# Open browser to http://localhost:5000
```

### Essential Commands

```bash
# Development
npm run dev              # Start dev server (port 5000)
npm run build           # Production build
npm run start           # Start production server

# Quality Checks (ALWAYS run before committing)
npm run type-check      # TypeScript validation
npm run lint            # ESLint checks
npm run format          # Prettier formatting
npm test                # Run tests

# Content Generation
npm run generate:thumbnails           # Generate blog thumbnails
npm run generate:section-images       # Generate section images
```

### First Steps

1. **Read Core Documentation**
   - `README.md` - Project overview
   - `CLAUDE.md` - AI agent instructions (comprehensive!)
   - `DESIGN_SYSTEM_LEARNINGS.md` - Design system insights
   - This file (`DEVELOPMENT-GUIDE.md`) - Coding standards

2. **Understand the Architecture**
   - Next.js 14 with App Router
   - Design system in `lib/design-system/`
   - AI agents in `lib/agents/`
   - Marketing components in `components/marketing/`

3. **Run Type Checking**
   ```bash
   npm run type-check
   ```
   This reveals any existing type issues and helps you understand the codebase.

---

## Project Architecture

### Directory Structure

```
OmniSignalAI-web/
├── app/                          # Next.js 14 App Router
│   ├── page.tsx                 # Homepage
│   ├── blog/                    # Blog section
│   │   ├── page.tsx            # Blog listing
│   │   └── [slug]/page.tsx     # Individual blog post
│   ├── api/                     # API routes
│   │   └── debug/              # Debug endpoints
│   └── layout.tsx               # Root layout
│
├── components/                   # React components
│   ├── marketing/               # Marketing sections
│   │   ├── HeroSection.tsx
│   │   ├── PricingSection.tsx
│   │   └── ...
│   ├── blog/                    # Blog components
│   ├── ui/                      # Shadcn/UI components
│   └── Navigation.tsx
│
├── lib/                          # Core utilities
│   ├── design-system/           # Design system primitives
│   │   ├── constants.ts        # Design tokens
│   │   ├── base-components.tsx # Button, Card, Input, etc.
│   │   ├── layout-components.tsx # Section, Container, Grid
│   │   └── interactive-components.tsx # Tabs, Modal, etc.
│   │
│   ├── agents/                  # AI agent system
│   │   ├── image-generation-agent/  # Autonomous image generation
│   │   ├── prompt-enhancement/      # Prompt optimization
│   │   ├── content-analyzer.ts      # Content analysis
│   │   └── mdx-updater.ts          # MDX file manipulation
│   │
│   ├── media-generator/         # Direct media generation
│   │   ├── image-generator.ts  # Core generation logic
│   │   ├── prompt-guide.ts     # Prompt engineering
│   │   └── utils.ts            # File handling
│   │
│   └── schema/                  # Zod schemas
│       └── blog-schema.ts
│
├── content/                      # MDX content
│   └── blog/                    # Blog posts
│
├── public/                       # Static assets
│   ├── images/                  # Static images
│   └── generated/               # AI-generated content
│       └── images/
│
├── scripts/                      # Automation scripts
│   ├── generate-blog-thumbnails.ts
│   └── test-agent.ts
│
└── styles/                       # Global styles
    └── globals.css
```

### Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│         (Next.js App Router, React Components)           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   DESIGN SYSTEM LAYER                    │
│        (Reusable Components, Design Tokens)              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    AI AGENT LAYER                        │
│    (Autonomous Agents, Content/Image Generation)         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  MEDIA GENERATOR LAYER                   │
│         (OpenRouter API, Image Generation)               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                      │
│        (OpenRouter, Gemini, Analytics, etc.)             │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

**Content Creation Flow:**
```
Blog Post Created (MDX)
  ↓
Content Analyzer extracts sections
  ↓
Image Generation Agent creates intent
  ↓
Media Generator calls OpenRouter API
  ↓
Images saved to public/generated/
  ↓
MDX Updater inserts image references
  ↓
Blog Post Rendered with Images
```

**Component Rendering Flow:**
```
User Request
  ↓
Next.js App Router (SSR/SSG)
  ↓
Design System Components
  ↓
Tailwind CSS Processing
  ↓
Rendered HTML + CSS
```

---

## Coding Standards & Patterns

### TypeScript Best Practices

#### 1. Always Use Explicit Types

**❌ Bad:**
```typescript
function processData(data) {
  return data.map(item => item.value)
}
```

**✅ Good:**
```typescript
interface DataItem {
  id: string
  value: number
}

function processData(data: DataItem[]): number[] {
  return data.map(item => item.value)
}
```

#### 2. Use Type Guards

**❌ Bad:**
```typescript
function handleResponse(response: any) {
  if (response.success) {
    return response.data
  }
}
```

**✅ Good:**
```typescript
interface SuccessResponse {
  success: true
  data: string
}

interface ErrorResponse {
  success: false
  error: string
}

type ApiResponse = SuccessResponse | ErrorResponse

function isSuccessResponse(response: ApiResponse): response is SuccessResponse {
  return response.success === true
}

function handleResponse(response: ApiResponse): string | null {
  if (isSuccessResponse(response)) {
    return response.data
  }
  console.error('Error:', response.error)
  return null
}
```

#### 3. Use Enums or Union Types for Constants

**❌ Bad:**
```typescript
const status = 'pending' // No type safety
```

**✅ Good:**
```typescript
type Status = 'pending' | 'processing' | 'completed' | 'failed'

const status: Status = 'pending'
```

### React Component Patterns

#### 1. Component Structure

**Standard Component Template:**
```typescript
'use client' // Only if using hooks or client-side features

import { useState } from 'react'
import { Button, Card } from '@/lib/design-system'

// Props interface
interface MyComponentProps {
  title: string
  description?: string
  onAction?: () => void
}

// Component with named export
export function MyComponent({ 
  title, 
  description, 
  onAction 
}: MyComponentProps) {
  // State
  const [isActive, setIsActive] = useState(false)

  // Event handlers
  const handleClick = () => {
    setIsActive(!isActive)
    onAction?.()
  }

  // Render
  return (
    <Card>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <Button onClick={handleClick}>
        {isActive ? 'Active' : 'Inactive'}
      </Button>
    </Card>
  )
}
```

#### 2. Use "use client" Directive Appropriately

**When to use `"use client"`:**
- Component uses React hooks (useState, useEffect, etc.)
- Component uses browser APIs (window, document, localStorage)
- Component has event handlers
- Component uses client-side libraries

**When NOT to use `"use client"`:**
- Pure presentational components
- Components that only render children
- Server-side data fetching components

**Example:**
```typescript
// ❌ Unnecessary - no client features
'use client'

export function StaticCard({ title }: { title: string }) {
  return <div>{title}</div>
}

// ✅ Good - uses client features
'use client'

import { useState } from 'react'

export function InteractiveCard({ title }: { title: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div onClick={() => setIsOpen(!isOpen)}>
      {title}
    </div>
  )
}
```

#### 3. Design System First Approach

**❌ Bad - Custom styling:**
```typescript
export function MyButton() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
      Click me
    </button>
  )
}
```

**✅ Good - Use design system:**
```typescript
import { Button } from '@/lib/design-system'

export function MyButton() {
  return (
    <Button variant="primary">
      Click me
    </Button>
  )
}
```

**Available Design System Components:**
- **Base**: Button, Card, Badge, Input, Textarea
- **Layout**: Section, Container, Grid, Flex, ContentSection
- **Interactive**: Tabs, Accordion, Modal, Tooltip

#### 4. Consistent Event Handler Naming

```typescript
// ✅ Good - Consistent naming
const handleClick = () => {}
const handleSubmit = () => {}
const handleChange = () => {}

// ❌ Avoid - Inconsistent
const onClick = () => {}
const doSubmit = () => {}
const changeHandler = () => {}
```

### File Naming Conventions

```
Components:     PascalCase      HeroSection.tsx
Utilities:      kebab-case      image-generator.ts
Types:          kebab-case      blog-schema.ts
Constants:      kebab-case      constants.ts
API Routes:     kebab-case      route.ts (Next.js requirement)
```

### Import Organization

**Order your imports:**
```typescript
// 1. External libraries
import { useState, useEffect } from 'react'
import { NextPage } from 'next'

// 2. Internal absolute imports
import { Button, Card } from '@/lib/design-system'
import { generateImage } from '@/lib/media-generator'

// 3. Relative imports
import { BlogHeader } from './BlogHeader'
import { BlogCard } from './BlogCard'

// 4. Types
import type { BlogPost } from '@/lib/schema/blog-schema'

// 5. Styles (if any)
import './styles.css'
```

### Error Handling Pattern

**Always handle errors gracefully:**
```typescript
// ✅ Good - Comprehensive error handling
async function generateBlogImage(topic: string) {
  try {
    // Validate input
    if (!topic || topic.length < 3) {
      throw new Error('Topic must be at least 3 characters')
    }

    // Attempt generation
    const result = await generateImage({ prompt: topic })

    // Handle API response
    if (!result.success) {
      console.error('Generation failed:', result.error)
      
      // Provide specific error messages
      if (result.error?.includes('API key')) {
        throw new Error('API key not configured. Check .env file')
      }
      if (result.error?.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Try again later')
      }
      
      throw new Error(result.error || 'Unknown error')
    }

    return result.imageUrl
  } catch (error) {
    // Log for debugging
    console.error('Failed to generate image:', error)
    
    // Return safe default or rethrow
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Unexpected error during image generation')
  }
}
```

---

## Common Pitfalls & Solutions

### 1. Hydration Mismatch Errors

**Problem:** Server renders different HTML than client

**❌ Cause:**
```typescript
export function MyComponent() {
  const id = Math.random().toString() // Different on server/client!
  return <div id={id}>Content</div>
}
```

**✅ Solution:**
```typescript
import { useId } from 'react'

export function MyComponent() {
  const id = useId() // Stable ID across server/client
  return <div id={id}>Content</div>
}
```

### 2. Missing PostCSS Configuration

**Problem:** Tailwind CSS not processing

**✅ Solution:** Ensure `postcss.config.js` exists:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3. Design System Components Not Found

**Problem:** `Cannot find module '@/lib/design-system'`

**✅ Solution:** Check `tsconfig.json` has path alias:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 4. Tailwind Not Scanning Design System

**Problem:** Design system classes not working

**✅ Solution:** Update `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',  // ← Critical!
    './content/**/*.{md,mdx}',
  ],
}
```

### 5. Environment Variables Not Loading

**Problem:** `process.env.OPENROUTER_API_KEY` is undefined

**✅ Solution:**
1. Create `.env.local` (not `.env`)
2. Use `NEXT_PUBLIC_` prefix for client-side vars
3. Restart dev server after changes

```env
# Server-side only
OPENROUTER_API_KEY=sk-xxxxx

# Client-side accessible
NEXT_PUBLIC_API_URL=https://api.example.com
```

### 6. Image Generation Failing

**Problem:** Generated images not appearing

**Checklist:**
- [ ] `OPENROUTER_API_KEY` set in `.env.local`
- [ ] Directory exists: `public/generated/images/`
- [ ] Using correct import: `import { generateImage } from '@/lib/media-generator'`
- [ ] Checking result.success before using imageUrl
- [ ] API key has credits on OpenRouter

**Debug:**
```typescript
import { validateEnvironment } from '@/lib/media-generator'

const validation = validateEnvironment()
if (!validation.isValid) {
  console.error('Setup issue:', validation.error)
}
```

### 7. TypeScript Errors in API Routes

**Problem:** "Cannot find module 'next/server'"

**✅ Solution:** Install dependencies and check Node types:
```bash
npm install
# Types should already be in package.json
```

---

## Agent Development Guide

### Agent Architecture Pattern

All agents follow a consistent pattern:

```
Agent/
├── index.ts              # Exports and public API
├── agent.ts              # Core orchestration logic
├── types.ts              # TypeScript interfaces
├── config.ts             # Configuration and presets
├── example-usage.ts      # Usage examples
└── README.md            # Comprehensive documentation
```

### Creating a New Agent

**Step 1: Define Types**
```typescript
// types.ts
export interface AgentRequest {
  input: string
  options?: AgentOptions
}

export interface AgentResponse {
  success: boolean
  output?: string
  error?: string
  reasoning?: {
    // Agent's decision-making process
  }
}

export interface AgentConfig {
  // Configuration options
}
```

**Step 2: Create Agent Class**
```typescript
// agent.ts
import type { AgentRequest, AgentResponse, AgentConfig } from './types'

export class MyAgent {
  private config: AgentConfig

  constructor(config?: Partial<AgentConfig>) {
    this.config = {
      // Default config
      ...config
    }
  }

  async process(request: AgentRequest): Promise<AgentResponse> {
    try {
      // 1. Validate input
      if (!request.input) {
        return {
          success: false,
          error: 'Input is required'
        }
      }

      // 2. Process
      const output = await this.performTask(request.input)

      // 3. Return with reasoning
      return {
        success: true,
        output,
        reasoning: {
          // Document decision process
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async performTask(input: string): Promise<string> {
    // Implementation
    return input.toUpperCase()
  }
}
```

**Step 3: Export Public API**
```typescript
// index.ts
export { MyAgent } from './agent'
export type { AgentRequest, AgentResponse, AgentConfig } from './types'
export { DEFAULT_CONFIG } from './config'

// Helper function
export async function processWithAgent(input: string): Promise<string> {
  const agent = new MyAgent()
  const result = await agent.process({ input })
  
  if (!result.success) {
    throw new Error(result.error)
  }
  
  return result.output!
}
```

**Step 4: Document Usage**
Create comprehensive README.md with:
- Overview and purpose
- Quick start examples
- API reference
- Configuration options
- Error handling
- Integration examples

### Agent Best Practices

**1. Always Provide Reasoning**
```typescript
return {
  success: true,
  output: result,
  reasoning: {
    confidence: 0.85,
    factors: ['keyword match', 'semantic similarity'],
    alternatives: ['option B', 'option C']
  }
}
```

**2. Configuration Presets**
```typescript
// config.ts
export const PRESET_CONFIGS = {
  fast: {
    qualityThreshold: 0.5,
    maxRetries: 1
  },
  quality: {
    qualityThreshold: 0.9,
    maxRetries: 3
  },
  debug: {
    verbose: true,
    logEveryStep: true
  }
}
```

**3. Graceful Degradation**
```typescript
async process(request: AgentRequest): Promise<AgentResponse> {
  try {
    // Try primary method
    return await this.primaryMethod(request)
  } catch (error) {
    console.warn('Primary method failed, trying fallback')
    
    try {
      // Fallback method
      return await this.fallbackMethod(request)
    } catch (fallbackError) {
      // Final error handling
      return {
        success: false,
        error: 'All methods failed'
      }
    }
  }
}
```

---

## Design System Usage

### Design System Philosophy

**Principles:**
1. **Component Reuse**: Never create custom components if design system has equivalent
2. **Composition**: Build complex UIs from simple primitives
3. **Consistency**: Use design tokens for all styling decisions
4. **Type Safety**: All components have full TypeScript support

### Quick Reference

#### Colors
```typescript
// Import from constants
import { colors } from '@/lib/design-system/constants'

// Available colors
colors.brand.primary     // Indigo-500
colors.brand.secondary   // Purple-500
colors.brand.accent      // Cyan-400

colors.semantic.success  // Green-500
colors.semantic.warning  // Amber-400
colors.semantic.error    // Red-500
colors.semantic.info     // Blue-500
```

#### Spacing (8px System)
```typescript
// Always use multiples of 8px
const spacing = {
  xs: 2,   // 16px
  sm: 3,   // 24px
  md: 4,   // 32px
  lg: 6,   // 48px
  xl: 8,   // 64px
  '2xl': 12, // 96px
}

// In Tailwind classes
className="p-4 m-6 gap-8"
```

#### Typography
```typescript
import { Heading, Text } from '@/lib/design-system'

// Headings
<Heading level={1}>H1</Heading>  // 48px
<Heading level={2}>H2</Heading>  // 36px
<Heading level={3}>H3</Heading>  // 30px

// Text variants
<Text variant="large">Large text</Text>    // 20px
<Text variant="base">Base text</Text>      // 16px
<Text variant="small">Small text</Text>    // 14px
```

#### Layout Components
```typescript
import { Section, Container, Grid } from '@/lib/design-system'

// Standard section pattern
<Section variant="light">
  <Container>
    {/* Content */}
  </Container>
</Section>

// Grid layout
<Grid cols={3} gap={4}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```

### Component Examples

#### Creating a Marketing Section
```typescript
'use client'

import { Section, Container, Heading, Text, Button } from '@/lib/design-system'

export function FeatureSection() {
  return (
    <Section variant="default">
      <Container>
        <Heading level={2} align="center">
          Our Features
        </Heading>
        
        <Text variant="large" align="center" className="mt-4">
          Discover what makes us different
        </Text>

        <div className="mt-8 flex justify-center">
          <Button variant="primary" size="lg">
            Get Started
          </Button>
        </div>
      </Container>
    </Section>
  )
}
```

#### Creating a Card Grid
```typescript
import { Grid, Card, Badge } from '@/lib/design-system'

export function FeatureGrid() {
  const features = [
    { title: 'Fast', description: 'Lightning quick', badge: 'New' },
    { title: 'Secure', description: 'Bank-level security', badge: null },
    { title: 'Scalable', description: 'Grows with you', badge: 'Popular' },
  ]

  return (
    <Grid cols={3} gap={6}>
      {features.map(feature => (
        <Card key={feature.title} variant="elevated">
          {feature.badge && (
            <Badge variant="primary">{feature.badge}</Badge>
          )}
          <h3 className="text-xl font-bold mt-2">{feature.title}</h3>
          <p className="text-gray-600 mt-2">{feature.description}</p>
        </Card>
      ))}
    </Grid>
  )
}
```

---

## Testing Strategy

### Test Structure

```
Component.tsx
Component.test.tsx  ← Test file next to component
```

### Testing Patterns

#### 1. Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders with title', () => {
    render(<MyComponent title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<MyComponent onClick={handleClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows description when provided', () => {
    render(<MyComponent title="Test" description="Test description" />)
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })
})
```

#### 2. Agent Testing
```typescript
import { MyAgent } from './agent'

describe('MyAgent', () => {
  let agent: MyAgent

  beforeEach(() => {
    agent = new MyAgent()
  })

  it('processes valid input successfully', async () => {
    const result = await agent.process({ input: 'test' })
    
    expect(result.success).toBe(true)
    expect(result.output).toBeDefined()
  })

  it('handles invalid input gracefully', async () => {
    const result = await agent.process({ input: '' })
    
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('provides reasoning for decisions', async () => {
    const result = await agent.process({ input: 'test' })
    
    expect(result.reasoning).toBeDefined()
  })
})
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for active development
npm test:watch

# Run specific test file
npm test MyComponent.test.tsx

# Run with coverage
npm test -- --coverage
```

---

## Performance Best Practices

### 1. Image Optimization

**Always use Next.js Image component:**
```typescript
import Image from 'next/image'

// ✅ Good - Optimized
<Image 
  src="/images/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // For above-the-fold images
/>

// ❌ Bad - Not optimized
<img src="/images/hero.jpg" alt="Hero image" />
```

### 2. Lazy Loading Components

```typescript
import dynamic from 'next/dynamic'

// Lazy load non-critical components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // Disable SSR if not needed
})
```

### 3. Memoization

```typescript
import { useMemo, useCallback } from 'react'

export function ExpensiveComponent({ data }: { data: any[] }) {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => expensiveTransform(item))
  }, [data])

  // Memoize callbacks
  const handleClick = useCallback(() => {
    console.log('Clicked')
  }, [])

  return <div>{/* Render */}</div>
}
```

### 4. Bundle Size Management

```typescript
// ✅ Good - Tree-shakeable imports
import { Button } from '@/lib/design-system'
import { generateImage } from '@/lib/media-generator'

// ❌ Bad - Imports entire module
import * as DesignSystem from '@/lib/design-system'
```

---

## Deployment & CI/CD

### Pre-Deployment Checklist

```bash
# 1. Type checking
npm run type-check

# 2. Linting
npm run lint

# 3. Build test
npm run build

# 4. Test suite
npm test

# All pass? Ready to deploy! ✅
```

### Environment Variables

**Development (.env.local):**
```env
OPENROUTER_API_KEY=sk-xxxxx
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Production (Vercel):**
Set via Vercel Dashboard:
- `OPENROUTER_API_KEY`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GA_ID`

### Docker Deployment

```bash
# Build production image
npm run docker:build

# Run production container
npm run docker:prod

# Stop containers
npm run docker:down
```

---

## Troubleshooting

### Build Errors

#### "Module not found"
**Cause:** Missing dependency or incorrect import path

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check import path uses correct alias
import { X } from '@/lib/...' # ✅
import { X } from '../../../lib/...' # ❌ Prefer aliases
```

#### "Type errors after update"
**Cause:** TypeScript version mismatch

**Solution:**
```bash
# Clear TypeScript cache
rm -rf .next

# Rebuild
npm run build
```

### Runtime Errors

#### "Hydration mismatch"
**Solution:** Use `useId()` instead of random IDs

#### "window is not defined"
**Solution:** Check for window before using:
```typescript
if (typeof window !== 'undefined') {
  // Safe to use window
}
```

### API Errors

#### Image generation fails
**Debug steps:**
1. Check API key: `echo $OPENROUTER_API_KEY`
2. Verify credits: https://openrouter.ai/credits
3. Test with simple prompt
4. Check `public/generated/images/` directory exists

---

## Quick Reference

### Essential Imports

```typescript
// Design System
import { Button, Card, Badge, Input } from '@/lib/design-system'
import { Section, Container, Grid } from '@/lib/design-system'
import { Heading, Text } from '@/lib/design-system'

// Media Generation
import { generateImage, COMMON_TEMPLATES } from '@/lib/media-generator'

// Image Agent
import { ImageGenerationAgent } from '@/lib/agents/image-generation-agent'

// React
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useId } from 'react'

// Next.js
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
```

### Common Commands

```bash
# Development
npm run dev                # Start dev server
npm run build             # Production build
npm run type-check        # TypeScript validation

# Code Quality
npm run lint              # Lint code
npm run format            # Format code

# Testing
npm test                  # Run tests
npm test:watch           # Watch mode

# Content
npm run generate:thumbnails  # Generate blog thumbnails
```

### File Templates

**Component Template:**
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/lib/design-system'

interface MyComponentProps {
  title: string
}

export function MyComponent({ title }: MyComponentProps) {
  const [state, setState] = useState(false)
  
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={() => setState(!state)}>
        Toggle
      </Button>
    </div>
  )
}
```

**Agent Template:**
```typescript
interface AgentRequest {
  input: string
}

interface AgentResponse {
  success: boolean
  output?: string
  error?: string
}

export class MyAgent {
  async process(request: AgentRequest): Promise<AgentResponse> {
    try {
      // Process
      return { success: true, output: 'result' }
    } catch (error) {
      return { success: false, error: 'error message' }
    }
  }
}
```

---

## Getting Help

### Documentation Resources

1. **Project Documentation**
   - `README.md` - Overview
   - `CLAUDE.md` - AI agent guide (most comprehensive!)
   - `DESIGN_SYSTEM_LEARNINGS.md` - Design insights
   - `lib/media-generator/README.md` - Image generation
   - `lib/agents/image-generation-agent/README.md` - Agent docs

2. **External Resources**
   - Next.js: https://nextjs.org/docs
   - React: https://react.dev
   - Tailwind CSS: https://tailwindcss.com/docs
   - OpenRouter: https://openrouter.ai/docs

### Common Questions

**Q: Which documentation should I read first?**
A: Start with `README.md` → `CLAUDE.md` → this guide

**Q: How do I know if I should use an agent or direct generation?**
A: Use agents for autonomous operation with reasoning. Use direct generation when you have optimized prompts.

**Q: Where should I add new marketing sections?**
A: Create in `components/marketing/`, use design system, add to `app/page.tsx`

**Q: How do I test my changes locally?**
A: `npm run dev` → Open http://localhost:5000 → Test in browser

**Q: My changes aren't showing up?**
A: Clear `.next` folder and rebuild: `rm -rf .next && npm run dev`

---

## Summary

This guide covers the essential patterns and practices for developing in the OmniSignalAI Web codebase. Key takeaways:

1. **Always use the design system** - Never create custom components
2. **Type safety first** - Explicit types prevent bugs
3. **Follow established patterns** - See existing code for examples
4. **Test before committing** - Run type-check, lint, and tests
5. **Document as you go** - Update README files for new features
6. **Check CLAUDE.md** - It has comprehensive AI-specific guidance

When in doubt, look at existing code for examples. Most patterns are already implemented somewhere in the codebase.

**Happy coding! 🚀**
