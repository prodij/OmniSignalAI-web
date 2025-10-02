# OmniSignalAI Marketing Website

The official marketing website for OmniSignalAI - transforming social media content creation from hours to 30 seconds.

## 🚀 Project Overview

This repository contains the marketing website for OmniSignalAI (formerly OmniDraft), an AI-powered social media marketing platform that generates complete campaigns with text and images in 30 seconds.

### Core Value Proposition
- **From Hours to 30 Seconds**: Transform content creation workflow
- **Multi-Platform Optimization**: Generate content for all major social platforms
- **Performance Prediction**: Know what will work before you post
- **AI-First Architecture**: Built from the ground up for AI efficiency

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Shadcn/UI
- **Animations**: Framer Motion
- **Content**: MDX for blog and pages
- **3D Elements**: React Three Fiber
- **Type Safety**: TypeScript
- **Deployment**: Vercel

## 🏗️ Project Structure

```
OmniSignalAI-web/
├── app/                    # Next.js 14 App Router
│   ├── page.tsx           # Homepage
│   ├── demo/              # Interactive demo
│   ├── pricing/           # Pricing page
│   ├── blog/              # Blog section
│   └── case-studies/      # Success stories
├── components/
│   ├── ui/                # Shadcn/UI components
│   ├── marketing/         # Marketing-specific components
│   ├── demo/              # Interactive demo components
│   └── ai-friendly/       # AI-optimized components
├── content/
│   ├── blog/              # Blog posts in MDX
│   ├── pages/             # Marketing pages in MDX
│   └── data/              # Structured data (testimonials, features)
├── design-system/
│   ├── tokens.css         # Design tokens
│   ├── animations.ts      # Animation presets
│   └── themes.ts          # Theme configuration
├── lib/
│   ├── utils.ts           # Utility functions
│   └── mdx.ts             # MDX configuration
├── public/
│   ├── images/            # Static images
│   └── fonts/             # Custom fonts
└── styles/
    └── globals.css        # Global styles
```

## 🎨 Design Philosophy

### AI-Friendly Architecture
- File-based content management for easy AI manipulation
- Design tokens for programmatic visual control
- Component documentation for AI understanding

### Exceptional Design (2024/2025 Trends)
- Interactive 3D elements
- Motion-driven interactions
- Performance prediction visualizations
- Real-time content generation demos

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/OmniSignalAI-web.git

# Navigate to the directory
cd OmniSignalAI-web

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Add your OPENROUTER_API_KEY to .env.local

# Run development server
npm run dev
```

Visit [http://localhost:5000](http://localhost:5000) to see the website.

**📖 New Developer?** 
- Start with [NEW-DEVELOPER-CHECKLIST.md](./NEW-DEVELOPER-CHECKLIST.md) for step-by-step onboarding
- Keep [CHEAT-SHEET.md](./CHEAT-SHEET.md) open for quick copy-paste solutions
- Read [DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md) for comprehensive patterns

## 📝 Content Management

### Creating Blog Posts

Create new MDX files in `content/blog/`:

```mdx
---
title: "Your Blog Title"
date: "2024-12-01"
author: "Author Name"
tags: ["AI", "Marketing"]
seo:
  description: "SEO description"
  keywords: ["keyword1", "keyword2"]
---

Your content here...
```

### Modifying Design Tokens

Edit `design-system/tokens.css` to update colors, spacing, animations:

```css
:root {
  --primary-hue: 240;
  --primary-saturation: 100%;
  --primary-lightness: 50%;
}
```

## 🎯 Key Features

### Homepage Sections
1. **Hero**: 30-second transformation demo
2. **Problem Agitation**: Content creation pain points
3. **Solution**: Before/after visualization
4. **Benefits**: Interactive feature cards
5. **Social Proof**: Customer success stories
6. **How It Works**: 3-step process
7. **Pricing**: ROI-focused tiers
8. **CTA**: Risk reversal and urgency

### Interactive Elements
- Live content generation demo
- 30-second countdown timer
- Platform output previews
- Performance prediction displays
- ROI calculator
- Testimonial videos

## 🧪 Testing

```bash
# Run tests
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy with automatic builds on push

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 🔧 Environment Variables

Create `.env.local`:

```env
# API Endpoints
NEXT_PUBLIC_API_URL=https://api.omnisignalai.com

# Analytics
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token

# Features
NEXT_PUBLIC_ENABLE_DEMO=true
```

## 📊 Performance Targets

- **Lighthouse Score**: 95+
- **Core Web Vitals**: All green
- **Time to Interactive**: <3 seconds
- **First Contentful Paint**: <1 second

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📚 Documentation

### Core Documentation
- [NEW-DEVELOPER-CHECKLIST.md](./NEW-DEVELOPER-CHECKLIST.md) - **First week guide** (START HERE)
- [DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md) - Comprehensive coding standards
- [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) - Fast lookup for common tasks
- [CHEAT-SHEET.md](./CHEAT-SHEET.md) - Copy-paste solutions
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Solutions to common problems
- [DOCUMENTATION-INDEX.md](./DOCUMENTATION-INDEX.md) - Find any documentation
- [CLAUDE.md](./CLAUDE.md) - AI agent instructions (most comprehensive!)

### Project Documentation
- [PLAN.md](./PLAN.md) - Complete website plan and architecture
- [DESIGN_SYSTEM_LEARNINGS.md](./DESIGN_SYSTEM_LEARNINGS.md) - Design system insights
- [CONTENT-GENERATION-SYSTEM.md](./CONTENT-GENERATION-SYSTEM.md) - AI content pipeline

### Component Documentation
- [lib/media-generator/README.md](./lib/media-generator/README.md) - Image generation
- [lib/agents/image-generation-agent/README.md](./lib/agents/image-generation-agent/README.md) - Autonomous image agent

## 🎨 Using Claude Code

This project is optimized for Claude Code assistance:

1. **Creating content**: "Create a blog post about AI in social media marketing"
2. **Updating design**: "Change primary color to purple and increase animation speed"
3. **Adding sections**: "Add a new testimonial section with video support"

## 📄 License

This project is proprietary and confidential.

## 🔗 Links

- **Main App**: [app.omnisignalai.com](https://app.omnisignalai.com)
- **Marketing Site**: [omnisignalai.com](https://omnisignalai.com)
- **Documentation**: [docs.omnisignalai.com](https://docs.omnisignalai.com)

---

Built with ❤️ for marketers who want their lives back.