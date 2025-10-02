# New Developer Checklist
## Your First Day Setup Guide

Welcome to OmniSignalAI Web! This checklist will get you productive quickly.

---

## ✅ Day 1: Environment Setup

### Part 1: Clone & Install (15 minutes)

- [ ] **Clone repository**
  ```bash
  git clone https://github.com/prodij/OmniSignalAI-web.git
  cd OmniSignalAI-web
  ```

- [ ] **Check Node version**
  ```bash
  node -v  # Should be 18.0.0 or higher
  ```
  If not, install Node 18+: https://nodejs.org/

- [ ] **Install dependencies**
  ```bash
  npm install
  ```
  This takes 2-3 minutes. ☕

- [ ] **Create environment file**
  ```bash
  cp .env.example .env.local
  ```

- [ ] **Get API keys** (optional for basic development)
  - OpenRouter API: https://openrouter.ai
  - Add to `.env.local`: `OPENROUTER_API_KEY=sk-xxxxx`

- [ ] **Start dev server**
  ```bash
  npm run dev
  ```
  Opens on http://localhost:5000

- [ ] **Verify it works**
  - Open browser to http://localhost:5000
  - Should see the homepage
  - No console errors

### Part 2: Tool Setup (10 minutes)

- [ ] **Install VS Code extensions** (recommended)
  - ESLint
  - Prettier
  - TypeScript and JavaScript
  - Tailwind CSS IntelliSense

- [ ] **Configure VS Code settings**
  ```json
  // .vscode/settings.json (create if needed)
  {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "typescript.preferences.importModuleSpecifier": "non-relative"
  }
  ```

- [ ] **Test code formatting**
  ```bash
  npm run format
  npm run lint
  ```

---

## 📚 Day 1-2: Read Documentation (2 hours)

### Essential Reading (Priority Order)

- [ ] **[README.md](./README.md)** (10 min)
  - Project overview
  - Tech stack
  - Basic structure

- [ ] **[DOCUMENTATION-INDEX.md](./DOCUMENTATION-INDEX.md)** (5 min)
  - Find what you need
  - Understand doc structure

- [ ] **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** (20 min)
  - Common commands
  - Quick examples
  - Keep this open while coding!

- [ ] **[DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)** (60 min)
  - Coding standards
  - Design patterns
  - Common pitfalls
  - **THIS IS THE MOST IMPORTANT DOC**

- [ ] **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** (10 min)
  - Skim through issues
  - Bookmark for later

### Optional Reading (Based on Your Role)

**If you're working with AI/Images:**
- [ ] [CLAUDE.md](./CLAUDE.md) (30 min)
- [ ] [lib/media-generator/README.md](./lib/media-generator/README.md) (15 min)

**If you're working on design:**
- [ ] [DESIGN_SYSTEM_LEARNINGS.md](./DESIGN_SYSTEM_LEARNINGS.md) (15 min)

**If you're working on content:**
- [ ] [BLOG-CREATION-GUIDE.md](./BLOG-CREATION-GUIDE.md) (20 min)

---

## 🛠️ Day 2-3: Hands-On Practice

### Exercise 1: Build a Simple Component (30 min)

- [ ] **Create new component**
  ```bash
  # Create file: components/marketing/TestSection.tsx
  ```

- [ ] **Use design system**
  ```typescript
  'use client'
  
  import { Section, Container, Heading, Button } from '@/lib/design-system'
  
  export function TestSection() {
    return (
      <Section variant="light">
        <Container>
          <Heading level={2}>My Test Section</Heading>
          <Button variant="primary">Click Me</Button>
        </Container>
      </Section>
    )
  }
  ```

- [ ] **Add to homepage**
  ```typescript
  // app/page.tsx
  import { TestSection } from '@/components/marketing/TestSection'
  
  export default function HomePage() {
    return (
      <>
        {/* ... other sections ... */}
        <TestSection />
      </>
    )
  }
  ```

- [ ] **View in browser**
  - Check http://localhost:5000
  - See your component
  - Verify styling works

- [ ] **Run quality checks**
  ```bash
  npm run type-check  # No errors?
  npm run lint       # All good?
  npm run format     # Formatted?
  ```

### Exercise 2: Generate an Image (20 min)

- [ ] **Create test script**
  ```typescript
  // scripts/test-image-gen.ts
  import 'dotenv/config'
  import { generateImage } from '../lib/media-generator'
  
  async function test() {
    const result = await generateImage({
      prompt: 'A professional office workspace, modern, clean, high quality'
    })
    
    if (result.success) {
      console.log('✅ Success:', result.imageUrl)
    } else {
      console.error('❌ Failed:', result.error)
    }
  }
  
  test()
  ```

- [ ] **Run test**
  ```bash
  npx tsx scripts/test-image-gen.ts
  ```

- [ ] **Check generated image**
  ```bash
  ls -la public/generated/images/
  ```

### Exercise 3: Make a Small Change (30 min)

Pick ONE simple task:

- [ ] **Option A: Update text**
  - Change homepage hero title
  - See it update in browser

- [ ] **Option B: Add a button**
  - Add a button to a section
  - Make it log to console on click

- [ ] **Option C: Style something**
  - Change a color using design tokens
  - Verify it updates

**After your change:**
- [ ] Run `npm run type-check`
- [ ] Run `npm run lint`
- [ ] Verify in browser
- [ ] Commit your change:
  ```bash
  git checkout -b test/my-first-change
  git add .
  git commit -m "test: My first change"
  ```

---

## 🎯 Day 3-5: Real Task

### Before Starting

- [ ] **Understand the task**
  - Read requirements carefully
  - Ask questions if unclear

- [ ] **Find examples**
  - Search codebase for similar code
  - Check documentation for patterns

- [ ] **Create branch**
  ```bash
  git checkout -b feature/your-feature-name
  ```

### During Development

- [ ] **Follow patterns** from DEVELOPMENT-GUIDE.md
- [ ] **Use design system** components
- [ ] **Keep QUICK-REFERENCE.md** open
- [ ] **Test frequently** in browser
- [ ] **Check types** with `npm run type-check`

### Before Committing

- [ ] **Quality checks pass**
  ```bash
  npm run type-check  # ✅
  npm run lint        # ✅
  npm run format      # ✅
  npm test            # ✅ (if tests exist)
  ```

- [ ] **Manual testing**
  - Feature works as expected
  - No console errors
  - No visual regressions

- [ ] **Clean commit**
  ```bash
  git status  # Only relevant files
  git add .
  git commit -m "feat: Your feature description"
  ```

---

## 🆘 When You Get Stuck

### Debugging Steps

1. **Read error message carefully**
   - Often tells you exactly what's wrong

2. **Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**
   - Search for your error
   - Follow solution steps

3. **Search codebase**
   ```bash
   # Find similar code
   grep -r "pattern you're looking for" .
   ```

4. **Check documentation**
   - [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) for commands
   - [DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md) for patterns
   - [DOCUMENTATION-INDEX.md](./DOCUMENTATION-INDEX.md) to find docs

5. **Google the error**
   - Include "Next.js" or "React" in search
   - Check Stack Overflow

6. **Ask for help**
   - Describe what you tried
   - Share error messages
   - Link to relevant code

---

## 📊 Your Progress Tracker

### Week 1 Goals

- [x] Environment setup
- [ ] Read core documentation
- [ ] Build first component
- [ ] Generate first image
- [ ] Complete first real task

### Week 2 Goals

- [ ] Understand design system deeply
- [ ] Build complex components
- [ ] Write tests
- [ ] Review others' code

### Week 3-4 Goals

- [ ] Work independently
- [ ] Help others
- [ ] Suggest improvements
- [ ] Master the codebase

---

## 🎓 Learning Resources

### Internal Documentation
- [DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md) - Comprehensive guide
- [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) - Fast lookup
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Problem solutions
- [CLAUDE.md](./CLAUDE.md) - AI capabilities

### External Resources
- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

### Video Tutorials (If Needed)
- Next.js 14 App Router: YouTube search
- React Hooks: Official React docs
- TypeScript Basics: TypeScript handbook

---

## ✨ Success Indicators

You're ready to work independently when you can:

- [ ] Start dev server without help
- [ ] Create a new component using design system
- [ ] Generate images using the media generator
- [ ] Debug common errors using TROUBLESHOOTING.md
- [ ] Find information in documentation quickly
- [ ] Pass all quality checks before committing
- [ ] Understand the project architecture

---

## 🚀 Next Steps

After completing this checklist:

1. **Pick a real task** from backlog
2. **Ask questions** when stuck
3. **Review others' code** to learn
4. **Update docs** when you find gaps
5. **Help the next new developer** with onboarding

---

## 📝 Notes Section

Use this space to track your progress:

```
What I learned today:
- 

Questions I have:
- 

Resources I found helpful:
- 

Things to remember:
- 
```

---

**Welcome to the team! 🎉**

**Questions?** Check [DOCUMENTATION-INDEX.md](./DOCUMENTATION-INDEX.md) or ask for help.

**Last Updated:** December 2024
