# AI Agent Integration - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AI AGENT INTEGRATION                              │
│                     OmniSignalAI Web Platform                            │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           AI AGENT LAYER                                 │
│                                                                           │
│  ┌────────────────────┐  ┌────────────────────┐  ┌──────────────────┐  │
│  │  Content Agent     │  │  Design Agent      │  │  Media Agent     │  │
│  │  (Creates posts)   │  │  (Styles pages)    │  │  (Generates      │  │
│  │                    │  │                    │  │   images)        │  │
│  └────────┬───────────┘  └────────┬───────────┘  └────────┬─────────┘  │
│           │                       │                       │              │
│           └───────────────────────┼───────────────────────┘              │
│                                   │                                      │
└───────────────────────────────────┼──────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         AI AGENT SDK                                     │
│                    lib/ai-agent-sdk/                                     │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  PAGE MANAGEMENT                                                  │  │
│  │  • savePage(options)          - Create/update pages               │  │
│  │  • getPage(slug)              - Read page data                    │  │
│  │  • listPages(directory)       - List all pages                    │  │
│  │  • deletePage(slug)           - Remove pages                      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  COMPONENT DISCOVERY                                              │  │
│  │  • listAvailableComponents()  - Get all components                │  │
│  │  • Categories: layout, content, design-system, marketing          │  │
│  │  • Metadata: name, props, examples                                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  MEDIA INTEGRATION                                                │  │
│  │  • AI_Media.generateImage()   - Generate images                   │  │
│  │  • AI_Media.COMMON_TEMPLATES  - Pre-built prompts                 │  │
│  │  • generateImageWithAgent()   - Autonomous generation             │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        PAGEBUILDER SYSTEM                                │
│                    components/PageBuilder.tsx                            │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  COMPONENT MAPPING                                                │  │
│  │  • Design System: Button, Card, Badge, Heading, Text, Input      │  │
│  │  • Layout: Section, Container, Grid, ContentSection              │  │
│  │  • Marketing: HeroSection, PricingSection, etc. (10 components)  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  RENDERING ENGINE                                                 │  │
│  │  • Parse JSON blocks                                              │  │
│  │  • Render components recursively                                  │  │
│  │  • Support nested hierarchies                                     │  │
│  │  • Handle string & component children                             │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         CONTENT LAYER                                    │
│                                                                           │
│  ┌──────────────────────┐      ┌──────────────────────┐                │
│  │  TRADITIONAL MDX     │      │  PAGEBUILDER MDX     │                │
│  │  layout: default     │      │  layout: builder     │                │
│  │                      │      │  blocks: [...]       │                │
│  │  ---                 │      │                      │                │
│  │  title: Post         │      │  ---                 │                │
│  │  category: Guides    │      │  title: Post         │                │
│  │  ---                 │      │  category: Guides    │                │
│  │                      │      │  layout: builder     │                │
│  │  ## Markdown         │      │  blocks:             │                │
│  │  Content here...     │      │    - component:      │                │
│  │                      │      │        Section       │                │
│  └──────────────────────┘      │      children: [...] │                │
│                                 │  ---                 │                │
│                                 │                      │                │
│                                 │  ## Optional         │                │
│                                 │  Markdown here...    │                │
│                                 └──────────────────────┘                │
│                                                                           │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       RENDERING PIPELINE                                 │
│                    app/blog/[slug]/page.tsx                              │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  CONDITIONAL RENDERING                                            │  │
│  │                                                                    │  │
│  │  if (post.layout === 'builder' && post.blocks) {                 │  │
│  │    return <PageBuilder blocks={post.blocks} />                   │  │
│  │  }                                                                 │  │
│  │                                                                    │  │
│  │  // Default MDX rendering                                         │  │
│  │  return (                                                          │  │
│  │    <BlogHeader {...post} />                                       │  │
│  │    <BlogContent>                                                   │  │
│  │      <MDXContent code={post.body} />                              │  │
│  │    </BlogContent>                                                  │  │
│  │  )                                                                 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         FINAL OUTPUT                                     │
│                    Rendered HTML/React                                   │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  • SEO optimized                                                  │  │
│  │  • Design system compliant                                        │  │
│  │  • Responsive layout                                              │  │
│  │  • Accessibility features                                         │  │
│  │  • Performance optimized                                          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘


════════════════════════════════════════════════════════════════════════════
                          DATA FLOW EXAMPLE
════════════════════════════════════════════════════════════════════════════

1. AI AGENT REQUEST
   ┌──────────────────────────────────────────────┐
   │ "Create a blog post about AI automation"    │
   └──────────────────┬───────────────────────────┘
                      │
                      ▼
2. SDK OPERATIONS
   ┌──────────────────────────────────────────────┐
   │ • listAvailableComponents()                  │
   │   → Returns 30+ components                   │
   │                                              │
   │ • AI_Media.generateImage({...})              │
   │   → Returns image URL                        │
   │                                              │
   │ • savePage({                                 │
   │     slug: 'blog/ai-automation',              │
   │     frontmatter: {                           │
   │       layout: 'builder',                     │
   │       blocks: [                              │
   │         {                                    │
   │           component: 'Section',              │
   │           children: [...]                    │
   │         }                                    │
   │       ]                                      │
   │     }                                        │
   │   })                                         │
   └──────────────────┬───────────────────────────┘
                      │
                      ▼
3. FILE SYSTEM
   ┌──────────────────────────────────────────────┐
   │ content/blog/ai-automation.mdx               │
   │                                              │
   │ ---                                          │
   │ title: AI Automation Guide                   │
   │ layout: builder                              │
   │ blocks:                                      │
   │   - component: Section                       │
   │     children: [...]                          │
   │ ---                                          │
   └──────────────────┬───────────────────────────┘
                      │
                      ▼
4. VELITE BUILD
   ┌──────────────────────────────────────────────┐
   │ • Parse frontmatter (layout, blocks)         │
   │ • Generate type-safe content objects         │
   │ • Export to .velite/                         │
   └──────────────────┬───────────────────────────┘
                      │
                      ▼
5. PAGE RENDERING
   ┌──────────────────────────────────────────────┐
   │ • Detect layout: 'builder'                   │
   │ • Use PageBuilder component                  │
   │ • Render blocks recursively                  │
   │ • Apply design system styles                 │
   └──────────────────┬───────────────────────────┘
                      │
                      ▼
6. FINAL PAGE
   ┌──────────────────────────────────────────────┐
   │ https://omnisignalai.com/blog/ai-automation  │
   │                                              │
   │ ┌──────────────────────────────────────────┐ │
   │ │ Beautiful, functional blog post           │ │
   │ │ • Component-based layout                  │ │
   │ │ • AI-generated images                     │ │
   │ │ • Design system styling                   │ │
   │ │ • SEO optimized                           │ │
   │ └──────────────────────────────────────────┘ │
   └──────────────────────────────────────────────┘


════════════════════════════════════════════════════════════════════════════
                      COMPONENT HIERARCHY EXAMPLE
════════════════════════════════════════════════════════════════════════════

blocks: [
  {
    component: 'Section',                    ← Top-level layout
    props: { variant: 'light' },
    children: [
      {
        component: 'Container',              ← Content container
        children: [
          {
            component: 'Heading',            ← Typography
            props: { level: 1, align: 'center' },
            children: ['Page Title']
          },
          {
            component: 'Grid',               ← Layout grid
            props: { cols: 3, gap: 6 },
            children: [
              {
                component: 'Card',           ← Content card
                props: { variant: 'outline' },
                children: [
                  {
                    component: 'Heading',    ← Card title
                    props: { level: 3 },
                    children: ['Feature 1']
                  },
                  {
                    component: 'Text',       ← Card body
                    children: ['Description text']
                  }
                ]
              },
              // More cards...
            ]
          }
        ]
      }
    ]
  }
]

Renders to:
<Section variant="light">
  <Container>
    <Heading level={1} align="center">Page Title</Heading>
    <Grid cols={3} gap={6}>
      <Card variant="outline">
        <Heading level={3}>Feature 1</Heading>
        <Text>Description text</Text>
      </Card>
      <!-- More cards... -->
    </Grid>
  </Container>
</Section>


════════════════════════════════════════════════════════════════════════════
                           KEY BENEFITS
════════════════════════════════════════════════════════════════════════════

For AI Agents:
  ✓ No JSX/React code required
  ✓ JSON-based component composition
  ✓ Complete component discovery
  ✓ Type-safe interfaces
  ✓ Integrated media generation

For Developers:
  ✓ Backward compatible (no breaking changes)
  ✓ Design system enforcement
  ✓ Type safety throughout
  ✓ Clear separation of concerns
  ✓ Comprehensive documentation

For Content:
  ✓ Consistent design across all pages
  ✓ Rapid content production
  ✓ Flexible layouts
  ✓ Professional results
  ✓ SEO optimized

For Platform:
  ✓ Scalable architecture
  ✓ Easy to extend
  ✓ Performance optimized
  ✓ Maintainable codebase
  ✓ Future-proof design
