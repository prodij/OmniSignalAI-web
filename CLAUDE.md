# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OmniSignalAI marketing website - AI-powered social media content generation platform that transforms content creation from hours to 30 seconds. Built with Next.js 14, designed for both exceptional UX and AI-friendly content management.

## Development Commands

### Core Commands
```bash
# Development server (runs on port 5000)
npm run dev

# Production build
npm run build

# Start production server (port 5000)
npm start

# Type checking (run before commits)
npm run type-check

# Linting
npm run lint

# Code formatting
npm run format
```

### Testing
```bash
# Run all tests
npm test

# Watch mode for active development
npm test:watch
```

### Docker Commands
```bash
# Development environment
npm run docker:dev

# Build Docker image
npm run docker:build

# Production deployment
npm run docker:prod

# Stop containers
npm run docker:down
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Custom Design System
- **Animations**: Framer Motion (planned)
- **Type Safety**: TypeScript with strict mode
- **Deployment**: Docker + Vercel ready

### Design System Location
All design primitives are centralized in `lib/design-system/`:
- `constants.ts` - Colors, typography, spacing (8px system), shadows, animation durations
- `base-components.tsx` - Button, Card, Badge, Input with variant support
- `layout-components.tsx` - Section, Container, Grid, Flex, ContentSection
- `interactive-components.tsx` - Tabs, Accordion, Modal, Tooltip
- `utils.ts` - CSS class utilities and variant helpers

**CRITICAL**: Always import from design system instead of writing custom styles:
```typescript
// Good - Uses design system
import { Button, Card } from '@/lib/design-system'

// Bad - Custom implementation
const MyButton = () => <button className="px-4 py-2">...</button>
```

### Directory Structure
```
app/                      # Next.js 14 App Router pages
components/marketing/     # Page sections (HeroSection, PricingSection, etc.)
lib/design-system/        # Design system primitives
content/                  # MDX content (blog, pages, data)
public/                   # Static assets
styles/                   # Global CSS
```

### Path Aliases (TypeScript)
```typescript
@/components/*  // ./components/*
@/app/*         // ./app/*
@/lib/*         // ./lib/*
@/content/*     // ./content/*
```

## Critical Configuration Knowledge

### PostCSS Required
The project uses Tailwind CSS which requires PostCSS. Configuration is in `postcss.config.js`:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Tailwind Content Paths
`tailwind.config.js` must scan all component directories:
```javascript
content: [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './app/**/*.{ts,tsx}',
  './lib/**/*.{ts,tsx}',      // Critical: Design system
  './content/**/*.{md,mdx}',
]
```

### SSR Compatibility
All components must be SSR-safe. Common issues:
- Use `useId()` instead of `Math.random()` for IDs to prevent hydration mismatch
- Mark client components with `"use client"` directive when using hooks
- Avoid `window` or `document` access without client-side checks

## Design System Patterns

### Component Composition
Build complex UIs from simple primitives:
```typescript
// Pattern: Compose sections from design system
import { Section, Container, Heading, Text, Button } from '@/lib/design-system'

export const MySection = () => (
  <Section variant="light">
    <Container>
      <Heading level={2}>Title</Heading>
      <Text variant="large">Description</Text>
      <Button variant="primary">Action</Button>
    </Container>
  </Section>
)
```

### Design Tokens
All design decisions come from `lib/design-system/constants.ts`:
- **Colors**: `colors.brand.primary`, `colors.semantic.success`
- **Spacing**: 8px system - use multiples (2, 4, 6, 8, 12, 16, 24)
- **Typography**: Predefined sizes (xs, sm, base, lg, xl, 2xl, etc.)
- **Breakpoints**: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)

### Animation System
Custom animations defined in `tailwind.config.js`:
- `animate-fade-in` - Basic opacity fade
- `animate-fade-in-up` - Fade with upward motion
- `animate-slide-up` - Slide from bottom
- `animate-bounce-x` - Horizontal bounce
- `animate-bounce-gentle` - Subtle vertical bounce
- `animate-pulse-sequence` - Sequential pulsing

## Page Architecture

### Homepage Structure (app/page.tsx)
Marketing sections rendered in sequence:
1. HeroSection - Primary value prop and CTA
2. ProblemSection - Pain points and agitation
3. SolutionSection - Before/after demonstration
4. BenefitsSection - Feature highlights
5. SocialProofSection - Testimonials and metrics
6. HowItWorksSection - 3-step process
7. PricingSection - Pricing tiers and ROI
8. FinalCTASection - Risk reversal and urgency

### Component Pattern
Each marketing section follows this pattern:
```typescript
// components/marketing/ExampleSection.tsx
"use client"

import { Section, Container, Heading } from '@/lib/design-system'

export const ExampleSection = () => {
  return (
    <Section variant="default">
      <Container>
        <Heading level={2} align="center">
          Section Title
        </Heading>
        {/* Section content */}
      </Container>
    </Section>
  )
}
```

## Testing Guidelines

Tests should:
- Use Jest and React Testing Library
- Focus on user behavior, not implementation details
- Test accessibility (ARIA labels, keyboard navigation)
- Avoid mocking unless absolutely necessary

## Performance Requirements

Target metrics:
- **Lighthouse Score**: 95+
- **Core Web Vitals**: All green
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

Optimization strategies:
- Use Next.js Image component for all images
- Lazy load non-critical components
- Keep bundle size < 200KB gzipped
- Minimize animation complexity on mobile

## Content Management Strategy

### Future MDX Integration
The site is designed for AI-friendly content management:
- Blog posts will use MDX format
- Frontmatter controls design and behavior
- Design tokens allow programmatic styling
- Component documentation enables AI understanding

## Deployment

### Environment Variables (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.omnisignalai.com
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_ENABLE_DEMO=true
```

### Docker Deployment
- Multi-stage build optimized for production
- Standalone output enabled in `next.config.js`
- Runs on port 5000 by default

### Vercel Deployment
- Automatic builds on push to main
- Environment variables set in Vercel dashboard
- Zero-config deployment (Next.js optimized)

## Common Issues and Solutions

### Issue: Styles not applying
- **Solution**: Check if PostCSS is configured (`postcss.config.js`)
- **Solution**: Verify Tailwind content paths include your file
- **Solution**: Restart dev server after config changes

### Issue: Hydration mismatch errors
- **Solution**: Use `useId()` instead of random IDs
- **Solution**: Add `"use client"` directive for components with hooks
- **Solution**: Ensure server and client render identical HTML

### Issue: Design system imports not working
- **Solution**: Check path aliases in `tsconfig.json`
- **Solution**: Verify file exists in `lib/design-system/`
- **Solution**: Restart TypeScript server

## Key Project Documents

- `PLAN.md` - Comprehensive website strategy and content
- `DESIGN_SYSTEM_LEARNINGS.md` - Design system implementation insights
- `README.md` - Project overview and setup instructions

## Development Philosophy

**From PLAN.md research:**
- AI-first architecture (built for AI, not AI-added)
- Conversion optimization over visual complexity
- Component reusability over custom implementations
- Mobile-first responsive design
- Accessibility compliance (WCAG 2.1 AA)

**SaaS Website Best Practices:**
- Clear value propositions with specific time savings
- Benefit-focused copy (outcomes, not features)
- Real product screenshots over abstract illustrations
- Social proof with specific customer results
- Single focused CTA per section