# OmniSignalAI Documentation

Comprehensive guides for working on the OmniSignalAI marketing website.

---

## 📖 Documentation Index

### Essential Reading

**Start here**: [`CLAUDE.md`](../CLAUDE.md) - Primary project guidance for Claude Code

### Specialized Guides

#### Visual Design
📐 [`VISUAL-DESIGN-GUIDE.md`](./VISUAL-DESIGN-GUIDE.md)
- Systematic approach to creating beautiful designs without visual perception
- Six pillars: Data-driven, Mathematical, Accessible, AI-generated, Eye-tracking, Trends
- Design process checklist and objective measurement framework
- **Read when**: Creating or modifying visual components, layouts, styling

**Full framework**: [`VISUAL-DESIGN-FRAMEWORK.md`](../VISUAL-DESIGN-FRAMEWORK.md)

#### Strategy & Planning
📋 [`PLAN.md`](../PLAN.md)
- Comprehensive website strategy and content
- Target audience analysis
- Conversion optimization
- Competitive positioning

#### Design System
🎨 [`DESIGN_SYSTEM_LEARNINGS.md`](../DESIGN_SYSTEM_LEARNINGS.md)
- Design system implementation insights
- Component architecture
- Best practices

---

## 🗂️ File Organization

```
docs/
├── README.md                    # This file (documentation index)
└── VISUAL-DESIGN-GUIDE.md      # Visual design systematic framework

Root level:
├── CLAUDE.md                    # Primary project guidance
├── PLAN.md                      # Website strategy
├── DESIGN_SYSTEM_LEARNINGS.md  # Design system insights
└── VISUAL-DESIGN-FRAMEWORK.md  # Complete visual design reference
```

---

## 🎯 Quick Navigation by Task

### "I need to create a new component"
1. Read: [`CLAUDE.md`](../CLAUDE.md) - Design system patterns
2. Check: `lib/design-system/` for existing components
3. Reference: `components/marketing/` for examples

### "I need to design a landing page"
1. Read: [`VISUAL-DESIGN-GUIDE.md`](./VISUAL-DESIGN-GUIDE.md) - Design framework
2. Check: `app/landing/page.tsx` for reference
3. Use: `lib/design-system/visual-excellence-tokens.ts` for constants

### "I need to generate images"
1. Read: [`CLAUDE.md`](../CLAUDE.md) - AI Media Generation Guide section
2. Use: `lib/agents/image-generation-agent/` for autonomous generation
3. Or: `lib/media-generator/` for direct control

### "I need to understand the content strategy"
1. Read: [`PLAN.md`](../PLAN.md) - Complete strategy
2. Check: Homepage structure and conversion psychology sections

---

## 📚 Additional Resources

### Design Tokens
- `lib/design-system/constants.ts` - Core design system
- `lib/design-system/visual-excellence-tokens.ts` - Visual design constants

### Reference Implementations
- `components/visual/VisualHero.tsx` - Visual design example
- `app/landing/page.tsx` - Conversion-optimized structure
- `app/visual-demo/page.tsx` - Design framework demonstration

### External References
- Linear.app - Dark mode, typography
- Vercel.com - Mesh gradients, performance
- Stripe.com - Whitespace, hierarchy
- Notion.so - Soft colors, friendly tone

---

## 🔄 Keeping Documentation Updated

When you make significant changes:

1. **Update CLAUDE.md** if it affects core project workflow
2. **Update specialized guides** (like VISUAL-DESIGN-GUIDE.md) for domain-specific changes
3. **Update this README** if you add new documentation files
4. **Keep examples in sync** with actual implementation

---

**Last Updated**: 2025-10-03
**Maintained by**: Claude Code (with human oversight)
