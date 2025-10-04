# Visual Design Guide
## Claude Code's Systematic Approach to Design Excellence

> **Core Philosophy**: Beauty isn't subjective—it's systematic.
>
> Every design decision must be backed by data, mathematics, proven patterns, or measurable standards.

---

## Quick Reference

**When to use this guide**: Any time you're creating or modifying visual components, layouts, or styling.

**Key principle**: Never say "this looks good"—always show measurable evidence.

---

## Six Pillars of Visual Design

### 1. Data-Driven Design

**Instead of**: "This looks nice"
**Always do**: Analyze what converts

```typescript
// Research process:
1. Analyze top SaaS sites (Linear.app, Vercel, Stripe, Notion)
2. Extract patterns: colors, typography, spacing, animations
3. Study conversion data and A/B test results
4. Apply eye-tracking research (F-pattern, Z-pattern)
5. Follow 2024-2025 trends (neo-brutalism, dark mode, glassmorphism)
```

**Reference sources**:
- Awwwards winners
- Top SaaS conversion benchmarks
- Eye-tracking research
- WCAG guidelines
- Core Web Vitals

---

### 2. Mathematical Beauty

**Golden Ratio (φ = 1.618)**
```typescript
// Layout proportions
visual: '61.8%'  // Dominant side
text: '38.2%'    // Supporting side

// Typography scale: base × 1.618
```

**8px Spacing System**
```typescript
spacing: [0, 8, 16, 24, 32, 48, 64, 96, 128]
// All spacing = multiples of 8px
```

**Perfect Fourth Scale (1.333)**
```typescript
xs: '12px'
sm: '16px'    // 12 × 1.333
base: '18px'
lg: '24px'    // 18 × 1.333
xl: '32px'    // 24 × 1.333
```

**60-30-10 Color Rule**
```typescript
primary: '60%'    // Backgrounds, main UI
secondary: '30%'  // Sections, accents
accent: '10%'     // CTAs, highlights
```

---

### 3. Accessibility = Measured Excellence

**NEVER guess—ALWAYS calculate**

```typescript
// Contrast ratios (WCAG AAA)
normal text: ≥ 7:1
large text: ≥ 4.5:1

// Minimum sizes
fontSize: '16px'
touchTarget: '44px'
focusOutline: '3px'

// Color-blind safe
primary: '#0066CC'    // Blue
secondary: '#FF6600'  // Orange
success: '#00AA00'    // Green
error: '#CC0000'      // Red
```

---

### 4. AI-Generated Visuals

```typescript
import { generateImageWithAgent } from '@/lib/agents/image-generation-agent';

// Custom visuals (not stock photos)
const heroImage = await generateImageWithAgent(
  'Modern SaaS dashboard, clean UI, gradient background'
);
```

**Why custom over stock**:
- Brand consistency
- Perfect specs
- No generic feel
- Systematic visual language

---

### 5. Eye-Tracking Patterns

**F-Pattern (Content pages)**
```
[Logo]                    [Nav]
┌─────────────────────────────┐
│ Headline ←─────────────────│ Hotspot
│ Subtext ←──────────────────│ Hotspot
│ Body (left-align)          │ Scannable
└─────────────────────────────┘
```

**Z-Pattern (Landing pages)**
```
[Logo] ──→ [Primary CTA]
  ╲         ╱
    ╲     ╱
   [Content]
    ╱     ╲
  ╱         ╲
[Feature] ──→ [Secondary CTA]
```

**Whitespace Rules**:
- Minimum: 50%
- Optimal: 60%
- Luxury: 70%

---

### 6. Current Trends (2024-2025)

**Neo-Brutalism**:
- High contrast colors
- Bold typography (800-900 weight)
- Hard shadows

**Dark Mode First**:
- Base: `#08090a` (near-black)
- 62.54% user preference

**Glassmorphism**:
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.2);
```

**Mesh Gradients**:
```css
radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.8) 0px, transparent 50%),
radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.6) 0px, transparent 50%),
radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.7) 0px, transparent 50%)
```

---

## Design Process Checklist

### Step 1: Research
- [ ] Analyze 3-5 top SaaS sites
- [ ] Extract colors, typography, spacing
- [ ] Note animations and interactions
- [ ] Study conversion optimizations

### Step 2: Apply Math
- [ ] Golden Ratio (61.8% / 38.2%)
- [ ] 8px spacing system
- [ ] Perfect Fourth typography (1.333)
- [ ] 60-30-10 color rule

### Step 3: Validate Accessibility
- [ ] Contrast ratios ≥ 7:1 (AAA)
- [ ] Font size ≥ 16px
- [ ] Touch targets ≥ 44px
- [ ] Color-blind test

### Step 4: Generate Visuals
- [ ] Use Image Generation Agent
- [ ] Avoid stock photos
- [ ] Brand consistency
- [ ] Optimize specs

### Step 5: Apply Patterns
- [ ] F-pattern or Z-pattern
- [ ] CTA in attention hotspot
- [ ] Asymmetric balance (60/40)

### Step 6: Follow Trends
- [ ] Dark mode default
- [ ] Neo-brutalist touches
- [ ] Glassmorphism overlays
- [ ] Mesh gradient backgrounds

### Step 7: Measure Performance
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Lighthouse ≥ 95

---

## Measuring Success

**Objective metrics only**:

```typescript
// Accessibility
✓ Contrast: ≥ 7:1
✓ Touch targets: ≥ 44px
✓ Focus: 3px visible
✓ Font: ≥ 16px
Score: 100/100

// Performance
✓ LCP: < 2.5s
✓ FID: < 100ms
✓ CLS: < 0.1
Score: 98/100

// Conversion
✓ Layout: F/Z-pattern
✓ Hierarchy: 3 levels
✓ Whitespace: ≥ 60%
✓ CTA contrast: ≥ 12:1
```

---

## Key Resources

**Design Tokens**: `lib/design-system/visual-excellence-tokens.ts`
**Reference Component**: `components/visual/VisualHero.tsx`
**Live Demo**: `app/visual-demo/page.tsx`
**Full Framework**: `VISUAL-DESIGN-FRAMEWORK.md`

**Reference Sites**:
- Linear.app - Dark mode, typography
- Vercel.com - Gradients, performance
- Stripe.com - Whitespace, hierarchy
- Notion.so - Soft colors, friendly

**Tools**:
- Image Generation Agent
- Contrast calculator
- WebFetch for analysis

---

## The Core Principle

> **"I can't see beauty, but I can systematize it."**

Every "beautiful" website follows measurable patterns:
- Mathematical proportions ✓
- High contrast ratios ✓
- Generous whitespace ✓
- Consistent spacing ✓
- Purposeful animation ✓
- Optimal performance ✓

**When a human says**: "This looks good" → Can't explain why

**When I say**: "This works" → I show you:
- Contrast ratio: 7.5:1 ✓
- Performance: LCP 1.8s ✓
- Layout: Golden Ratio ✓
- Accessibility: 100/100 ✓

**Result**: Objectively excellent design, backed by data and mathematics.
