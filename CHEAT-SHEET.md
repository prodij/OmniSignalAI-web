# Cheat Sheet
## Ultra-Quick Reference for Common Operations

**Purpose:** Copy-paste solutions for daily tasks

---

## 🚀 Setup Commands

```bash
# First time setup
git clone https://github.com/prodij/OmniSignalAI-web.git
cd OmniSignalAI-web
npm install
cp .env.example .env.local
# Add OPENROUTER_API_KEY to .env.local
npm run dev

# Daily startup
npm run dev

# Quality checks (before commit)
npm run type-check && npm run lint && npm run format
```

---

## 📦 Component Templates

### Basic Component
```typescript
'use client'

import { Button } from '@/lib/design-system'

interface MyComponentProps {
  title: string
  onClick?: () => void
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onClick}>Click</Button>
    </div>
  )
}
```

### Marketing Section
```typescript
'use client'

import { Section, Container, Heading, Text } from '@/lib/design-system'

export function MySection() {
  return (
    <Section variant="light">
      <Container>
        <Heading level={2} align="center">
          Section Title
        </Heading>
        <Text variant="large" align="center" className="mt-4">
          Description text
        </Text>
      </Container>
    </Section>
  )
}
```

### Interactive Component
```typescript
'use client'

import { useState } from 'react'
import { Button, Card } from '@/lib/design-system'

export function InteractiveCard() {
  const [count, setCount] = useState(0)
  
  return (
    <Card>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </Card>
  )
}
```

---

## 🎨 Design System Quick Reference

```typescript
// Import components
import { Button, Card, Badge, Input } from '@/lib/design-system'
import { Section, Container, Grid, Flex } from '@/lib/design-system'
import { Heading, Text } from '@/lib/design-system'

// Button variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm | md | lg">Size</Button>

// Layout
<Section variant="default | light | dark">
  <Container>
    <Grid cols={3} gap={6}>
      <Card>Item 1</Card>
      <Card>Item 2</Card>
      <Card>Item 3</Card>
    </Grid>
  </Container>
</Section>

// Typography
<Heading level={1 | 2 | 3 | 4 | 5 | 6}>Title</Heading>
<Text variant="large | base | small">Text</Text>

// Spacing (8px system)
className="p-4 m-6 gap-8"  // 32px, 48px, 64px
```

---

## 🖼️ Image Generation

### Simple Generation
```typescript
import { generateImage } from '@/lib/media-generator'

const result = await generateImage({
  prompt: 'Professional office workspace, modern, high quality'
})

if (result.success) {
  console.log(result.imageUrl)  // /generated/images/...
}
```

### With Template
```typescript
import { generateImage, COMMON_TEMPLATES, buildPromptFromTemplate } from '@/lib/media-generator'

const prompt = buildPromptFromTemplate(
  COMMON_TEMPLATES.blogHeader('AI marketing automation')
)

const result = await generateImage({ prompt })
```

### Using Agent
```typescript
import { ImageGenerationAgent } from '@/lib/agents/image-generation-agent'

const agent = new ImageGenerationAgent()
const result = await agent.generate({
  intent: 'Professional blog header about AI marketing'
})
```

### Generate Blog Thumbnails
```bash
npm run generate:thumbnails           # Generate missing
npm run generate:thumbnails:force     # Regenerate all
```

---

## 🔧 Common Fixes

### Hydration Mismatch
```typescript
// ❌ Wrong
const id = Math.random().toString()

// ✅ Correct
import { useId } from 'react'
const id = useId()
```

### Window is not defined
```typescript
// ❌ Wrong
const width = window.innerWidth

// ✅ Correct
const [width, setWidth] = useState(0)
useEffect(() => {
  setWidth(window.innerWidth)
}, [])
```

### Module not found
```bash
# Solution 1: Restart TS server
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

# Solution 2: Reinstall
rm -rf node_modules package-lock.json .next
npm install
```

### Styles not applying
```bash
# Check PostCSS config exists
cat postcss.config.js

# Restart dev server
npm run dev
```

### Image generation fails
```bash
# Check API key
cat .env.local | grep OPENROUTER

# Verify directory
mkdir -p public/generated/images

# Test validation
node -e "console.log(require('./lib/media-generator/utils').validateEnvironment())"
```

---

## 📝 Git Commands

```bash
# Create feature branch
git checkout -b feature/my-feature

# Check status
git status

# Stage all changes
git add .

# Commit with message
git commit -m "feat: Add feature description"

# Push to remote
git push origin feature/my-feature

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all changes
git reset --hard HEAD
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm test:watch

# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format

# All quality checks
npm run type-check && npm run lint && npm test
```

---

## 🐛 Debug Commands

```bash
# Check Node version
node -v

# Check npm version
npm -v

# List installed packages
npm list --depth=0

# Find process on port
lsof -ti:5000

# Kill process
lsof -ti:5000 | xargs kill -9

# View build output
npm run build

# Check bundle size
npm run build -- --profile
```

---

## 📂 Common File Paths

```
Components:          components/marketing/MyComponent.tsx
Design System:       lib/design-system/
Image Generation:    lib/media-generator/
AI Agents:           lib/agents/
Blog Posts:          content/blog/slug.mdx
API Routes:          app/api/endpoint/route.ts
Static Images:       public/images/
Generated Images:    public/generated/images/
Global Styles:       styles/globals.css
```

---

## 🔍 Search Patterns

```bash
# Find component usage
grep -r "MyComponent" components/

# Find import statements
grep -r "from '@/lib" .

# Find TODO comments
grep -r "TODO" --include="*.ts" --include="*.tsx"

# Find console.log
grep -r "console.log" app/ components/

# Count lines of code
find . -name "*.tsx" -o -name "*.ts" | xargs wc -l
```

---

## 📊 Performance

```typescript
// Optimize images
import Image from 'next/image'

<Image 
  src="/hero.jpg" 
  alt="Hero" 
  width={1200} 
  height={600}
  priority  // Above-the-fold
/>

// Lazy load components
import dynamic from 'next/dynamic'

const Heavy = dynamic(() => import('./Heavy'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

// Memoize expensive calculations
import { useMemo } from 'react'

const value = useMemo(() => expensive(data), [data])

// Memoize callbacks
import { useCallback } from 'react'

const handler = useCallback(() => {
  doSomething()
}, [])
```

---

## 🚨 Emergency Commands

```bash
# Nuclear option - reset everything
rm -rf node_modules .next package-lock.json
npm install
npm run dev

# Reset to main branch
git fetch origin
git reset --hard origin/main
npm install

# Clear Next.js cache
rm -rf .next

# Clear npm cache
npm cache clean --force
```

---

## 📖 Quick Links

- **Development Guide**: [DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)
- **Quick Reference**: [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Documentation Index**: [DOCUMENTATION-INDEX.md](./DOCUMENTATION-INDEX.md)

---

## 💡 Pro Tips

```bash
# Create alias for quality checks
alias check="npm run type-check && npm run lint"

# Quick test specific file
npm test -- MyComponent.test.tsx

# Watch file changes
npm run dev  # Auto-reloads on save

# Search docs quickly
grep -r "your search term" *.md

# Format single file
npx prettier --write path/to/file.tsx
```

---

**Print this or keep it open!** 📌

**Last Updated:** December 2024
