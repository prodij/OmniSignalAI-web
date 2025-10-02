# Troubleshooting Guide
## Solutions to Common Problems

**Purpose:** Quickly diagnose and fix issues during development

---

## Table of Contents

- [Setup & Installation Issues](#setup--installation-issues)
- [Build & TypeScript Errors](#build--typescript-errors)
- [Runtime Errors](#runtime-errors)
- [Styling & Design System Issues](#styling--design-system-issues)
- [Image Generation Problems](#image-generation-problems)
- [Performance Issues](#performance-issues)
- [Git & Deployment Issues](#git--deployment-issues)

---

## Setup & Installation Issues

### npm install fails

**Symptoms:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Solutions:**

1. **Delete lock file and try again:**
```bash
rm package-lock.json
rm -rf node_modules
npm install
```

2. **Use specific Node version:**
```bash
# Check Node version
node -v

# Should be 18.0.0 or higher
# If not, use nvm:
nvm install 18
nvm use 18
npm install
```

3. **Clear npm cache:**
```bash
npm cache clean --force
npm install
```

### Port 5000 already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Kill process on port 5000:**
```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

2. **Use different port:**
```bash
npm run dev -- -p 3000
```

### Environment variables not loading

**Symptoms:**
- `process.env.OPENROUTER_API_KEY` is undefined
- API calls fail with authentication errors

**Solutions:**

1. **Check file name:**
```bash
# Must be .env.local (not .env)
ls -la .env.local

# If missing, create it:
cp .env.example .env.local
```

2. **Add API key:**
```env
# .env.local
OPENROUTER_API_KEY=sk-your-key-here
```

3. **Restart dev server:**
```bash
# Stop current server (Ctrl+C)
npm run dev
```

4. **For client-side variables:**
```env
# Must have NEXT_PUBLIC_ prefix
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Build & TypeScript Errors

### "Cannot find module" errors

**Symptoms:**
```
error TS2307: Cannot find module '@/lib/design-system'
```

**Solutions:**

1. **Check path aliases in tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

2. **Verify file exists:**
```bash
ls -la lib/design-system/index.ts
```

3. **Restart TypeScript server (VS Code):**
- Cmd/Ctrl + Shift + P
- Type: "TypeScript: Restart TS Server"

4. **Reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json .next
npm install
```

### "Type 'X' is not assignable to type 'Y'"

**Symptoms:**
```typescript
Type 'string | undefined' is not assignable to type 'string'
```

**Solutions:**

1. **Add type guards:**
```typescript
// ❌ Error
function process(value: string | undefined) {
  return value.toUpperCase()
}

// ✅ Fixed
function process(value: string | undefined) {
  if (!value) return ''
  return value.toUpperCase()
}
```

2. **Use optional chaining:**
```typescript
// ❌ Error
const length = data.items.length

// ✅ Fixed
const length = data?.items?.length ?? 0
```

3. **Provide default values:**
```typescript
// ❌ Error
const name = user.name

// ✅ Fixed
const name = user.name || 'Anonymous'
```

### "JSX element implicitly has type 'any'"

**Symptoms:**
```
error TS7026: JSX element implicitly has type 'any'
```

**Solutions:**

1. **Install React types:**
```bash
npm install --save-dev @types/react @types/react-dom
```

2. **Check tsconfig.json includes jsx:**
```json
{
  "compilerOptions": {
    "jsx": "preserve"
  }
}
```

### Build succeeds but type-check fails

**Symptoms:**
```bash
npm run build  # ✅ Success
npm run type-check  # ❌ Errors
```

**Solutions:**

1. **Clear .next directory:**
```bash
rm -rf .next
npm run build
```

2. **Check for @ts-ignore comments:**
```typescript
// ❌ Bad - hides real issues
// @ts-ignore
const value = getData()

// ✅ Fix the underlying issue
const value: DataType = getData()
```

---

## Runtime Errors

### Hydration mismatch

**Symptoms:**
```
Warning: Text content did not match. Server: "X" Client: "Y"
Error: Hydration failed because the initial UI does not match
```

**Common Causes & Solutions:**

1. **Random IDs:**
```typescript
// ❌ Causes hydration mismatch
export function Component() {
  const id = Math.random().toString()
  return <div id={id}>Content</div>
}

// ✅ Fixed with useId
import { useId } from 'react'

export function Component() {
  const id = useId()
  return <div id={id}>Content</div>
}
```

2. **Date/Time formatting:**
```typescript
// ❌ Can differ between server/client
export function Component() {
  return <div>{new Date().toLocaleString()}</div>
}

// ✅ Fixed with client-side only
'use client'

export function Component() {
  const [time, setTime] = useState('')
  
  useEffect(() => {
    setTime(new Date().toLocaleString())
  }, [])
  
  return <div>{time || 'Loading...'}</div>
}
```

3. **Browser-only code:**
```typescript
// ❌ Causes error on server
export function Component() {
  const width = window.innerWidth
  return <div>{width}</div>
}

// ✅ Fixed with effect
export function Component() {
  const [width, setWidth] = useState(0)
  
  useEffect(() => {
    setWidth(window.innerWidth)
  }, [])
  
  return <div>{width}</div>
}
```

### "window is not defined"

**Symptoms:**
```
ReferenceError: window is not defined
```

**Solutions:**

1. **Check for window before using:**
```typescript
// ❌ Error
const isMobile = window.innerWidth < 768

// ✅ Fixed
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
```

2. **Use in useEffect:**
```typescript
// ✅ Only runs on client
useEffect(() => {
  const handleResize = () => {
    console.log(window.innerWidth)
  }
  
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

3. **Mark component as client-only:**
```typescript
'use client'

export function BrowserComponent() {
  const width = window.innerWidth
  return <div>{width}</div>
}
```

### Component not updating

**Symptoms:**
- State changes but UI doesn't update
- Props change but component stays the same

**Solutions:**

1. **Check state mutation:**
```typescript
// ❌ Mutates state directly
const [items, setItems] = useState([1, 2, 3])
items.push(4)  // Wrong!

// ✅ Create new array
setItems([...items, 4])
```

2. **Check object mutation:**
```typescript
// ❌ Mutates object
const [user, setUser] = useState({ name: 'John' })
user.name = 'Jane'  // Wrong!

// ✅ Create new object
setUser({ ...user, name: 'Jane' })
```

3. **Add key prop:**
```typescript
// ❌ Missing key
{items.map(item => <Card>{item.name}</Card>)}

// ✅ With key
{items.map(item => <Card key={item.id}>{item.name}</Card>)}
```

---

## Styling & Design System Issues

### Tailwind classes not applying

**Symptoms:**
- Classes appear in HTML but no styles
- Design system components look unstyled

**Solutions:**

1. **Check PostCSS config exists:**
```bash
cat postcss.config.js

# Should contain:
# module.exports = {
#   plugins: {
#     tailwindcss: {},
#     autoprefixer: {},
#   },
# }
```

2. **Check Tailwind content paths:**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',  // ← Must include this!
    './content/**/*.{md,mdx}',
  ],
}
```

3. **Restart dev server:**
```bash
# Stop server (Ctrl+C)
rm -rf .next
npm run dev
```

4. **Check globals.css is imported:**
```typescript
// app/layout.tsx
import '@/styles/globals.css'  // Must be imported
```

### Design system components not found

**Symptoms:**
```
Cannot find module '@/lib/design-system'
```

**Solutions:**

1. **Check import path:**
```typescript
// ✅ Correct
import { Button } from '@/lib/design-system'

// ❌ Wrong
import { Button } from '@/lib/design-system/base-components'
```

2. **Check file exists:**
```bash
ls lib/design-system/index.ts
```

3. **Check exports:**
```typescript
// lib/design-system/index.ts should export:
export * from './base-components'
export * from './layout-components'
export * from './interactive-components'
export * from './constants'
```

### Custom classes not working

**Symptoms:**
- Custom CSS classes have no effect
- Styles being overridden

**Solutions:**

1. **Increase specificity:**
```css
/* ❌ Too generic */
.button { color: red; }

/* ✅ More specific */
.my-component .button { color: red; }
```

2. **Use !important (last resort):**
```css
.button { color: red !important; }
```

3. **Use Tailwind @apply:**
```css
.custom-button {
  @apply px-4 py-2 bg-blue-500 text-white rounded-md;
}
```

---

## Image Generation Problems

### API key not working

**Symptoms:**
```
Error: API key not configured
Error: Authentication failed
```

**Solutions:**

1. **Check .env.local exists:**
```bash
ls -la .env.local
```

2. **Check API key format:**
```env
# Must be on server side (no NEXT_PUBLIC_ prefix)
OPENROUTER_API_KEY=sk-or-v1-xxxxx
```

3. **Verify key on OpenRouter:**
- Visit https://openrouter.ai/keys
- Check key is active and has credits

4. **Restart dev server:**
```bash
# Environment changes require restart
npm run dev
```

5. **Test validation:**
```typescript
import { validateEnvironment } from '@/lib/media-generator'

const result = validateEnvironment()
console.log(result)  // Should show { isValid: true }
```

### Images not generating

**Symptoms:**
- Generation completes but no image file
- `imageUrl` is undefined

**Solutions:**

1. **Check directory exists:**
```bash
mkdir -p public/generated/images
ls -la public/generated/images/
```

2. **Check permissions:**
```bash
chmod -R 755 public/generated
```

3. **Check API response:**
```typescript
const result = await generateImage({ prompt: 'test' })
console.log('Full result:', result)

if (!result.success) {
  console.error('Error:', result.error)
}
```

4. **Test with simple prompt:**
```typescript
const result = await generateImage({
  prompt: 'A red circle on white background'
})
```

### Rate limit errors

**Symptoms:**
```
Error: Rate limit exceeded
Error: 429 Too Many Requests
```

**Solutions:**

1. **Wait before retrying:**
```typescript
// Wait 60 seconds
await new Promise(resolve => setTimeout(resolve, 60000))
```

2. **Check OpenRouter usage:**
- Visit https://openrouter.ai/activity
- Check rate limits for your tier

3. **Implement retry logic:**
```typescript
async function generateWithRetry(prompt: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const result = await generateImage({ prompt })
    
    if (result.success) return result
    
    if (result.error?.includes('rate limit')) {
      const delay = Math.pow(2, i) * 1000  // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay))
      continue
    }
    
    return result  // Other error, don't retry
  }
}
```

### Poor image quality

**Symptoms:**
- Images are blurry or low quality
- Images don't match prompt

**Solutions:**

1. **Use templates:**
```typescript
import { COMMON_TEMPLATES, buildPromptFromTemplate } from '@/lib/media-generator'

const prompt = buildPromptFromTemplate(
  COMMON_TEMPLATES.blogHeader('Your topic')
)
```

2. **Enhance prompt:**
```typescript
import { enhancePrompt } from '@/lib/media-generator'

const enhanced = enhancePrompt('basic prompt', {
  style: 'photorealistic',
  addDefaults: true
})

const result = await generateImage({ prompt: enhanced.prompt })
```

3. **Add quality keywords:**
```typescript
const prompt = 'Professional office workspace, photorealistic, high resolution, professional photography, natural lighting, sharp focus, 8K quality'
```

4. **Use negative prompts:**
```typescript
const result = await generateImage({
  prompt: 'Professional office workspace',
  negativePrompt: 'blurry, low quality, distorted, amateur, generic stock photo'
})
```

---

## Performance Issues

### Slow page loads

**Symptoms:**
- Pages take long to load
- Lighthouse score is low

**Solutions:**

1. **Optimize images:**
```typescript
// ✅ Use Next.js Image
import Image from 'next/image'

<Image 
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // For above-fold
/>
```

2. **Lazy load components:**
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})
```

3. **Check bundle size:**
```bash
npm run build
# Check output for large bundles
```

4. **Reduce JavaScript:**
```typescript
// ✅ Server component (no JS)
export function StaticComponent() {
  return <div>Static content</div>
}

// Use client components only when needed
```

### Memory leaks

**Symptoms:**
- Browser becomes slow over time
- Dev server crashes

**Solutions:**

1. **Clean up effects:**
```typescript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick')
  }, 1000)
  
  // ✅ Clean up!
  return () => clearInterval(timer)
}, [])
```

2. **Remove event listeners:**
```typescript
useEffect(() => {
  const handler = () => console.log('resize')
  window.addEventListener('resize', handler)
  
  // ✅ Clean up!
  return () => window.removeEventListener('resize', handler)
}, [])
```

3. **Abort fetch requests:**
```typescript
useEffect(() => {
  const controller = new AbortController()
  
  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(data => setData(data))
  
  // ✅ Abort on unmount
  return () => controller.abort()
}, [])
```

---

## Git & Deployment Issues

### Git conflicts

**Symptoms:**
```
CONFLICT (content): Merge conflict in file.tsx
```

**Solutions:**

1. **View conflicted files:**
```bash
git status
```

2. **Open file and resolve:**
```typescript
<<<<<<< HEAD
const value = 'my change'
=======
const value = 'their change'
>>>>>>> branch-name

// Choose one or merge both
const value = 'resolved change'
```

3. **Mark as resolved:**
```bash
git add file.tsx
git commit -m "Resolve merge conflict"
```

### Build fails in production

**Symptoms:**
- Local build works
- Production build fails

**Solutions:**

1. **Test production build locally:**
```bash
npm run build
npm run start
```

2. **Check environment variables:**
```bash
# Vercel dashboard → Settings → Environment Variables
# Ensure all variables are set
```

3. **Check for dynamic imports:**
```typescript
// ❌ Can fail in production
const data = require(`./data/${filename}`)

// ✅ Use static imports or public folder
import data from './data/file.json'
```

### Deployment takes too long

**Symptoms:**
- Vercel deployment timeout
- Build step hangs

**Solutions:**

1. **Check for infinite loops:**
```typescript
// ❌ Infinite loop in build
useEffect(() => {
  setCount(count + 1)  // Missing dependency!
})

// ✅ Fixed
useEffect(() => {
  setCount(count + 1)
}, [])  // Empty deps = run once
```

2. **Reduce dependencies:**
```bash
# Check large packages
npm ls --depth=0

# Remove unused
npm uninstall unused-package
```

3. **Use caching:**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "framework": "nextjs"
}
```

---

## Emergency Fixes

### Nuclear option - Start fresh

If all else fails:

```bash
# 1. Delete everything
rm -rf node_modules
rm -rf .next
rm package-lock.json

# 2. Reinstall
npm install

# 3. Rebuild
npm run build

# 4. Test
npm run dev
```

### Reset to working state

```bash
# Discard all changes
git reset --hard HEAD

# Get latest from main
git fetch origin
git reset --hard origin/main

# Reinstall
npm install
```

---

## Getting More Help

### Check Documentation

1. **This guide** - Common problems
2. **DEVELOPMENT-GUIDE.md** - Detailed patterns
3. **QUICK-REFERENCE.md** - Fast lookups
4. **CLAUDE.md** - AI instructions
5. **Component READMEs** - Specific tools

### Debug Checklist

- [ ] Read error message carefully
- [ ] Check browser console
- [ ] Check terminal output
- [ ] Search this troubleshooting guide
- [ ] Check similar code in repository
- [ ] Google the error message
- [ ] Check GitHub issues

### Enable Debug Mode

```bash
# More verbose logging
DEBUG=* npm run dev

# TypeScript compiler info
npx tsc --extendedDiagnostics
```

---

**Last Updated:** December 2024  
**Related:** DEVELOPMENT-GUIDE.md, QUICK-REFERENCE.md
