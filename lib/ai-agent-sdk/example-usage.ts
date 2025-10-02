/**
 * Example Usage: AI Agent SDK
 *
 * This script demonstrates how AI agents can use the SDK to create content.
 * Run with: tsx lib/ai-agent-sdk/example-usage.ts
 */

import {
  savePage,
  getPage,
  listAvailableComponents,
  listPages,
  // AI_Media - Commented out since we need API key
} from './index'

/**
 * Example 1: Discover Available Components
 */
async function example1_discoverComponents() {
  console.log('\n=== Example 1: Discover Components ===\n')

  const result = await listAvailableComponents({ includeExamples: true })

  if (result.success && result.data) {
    console.log(`✅ Found ${result.data.length} components\n`)

    // Show first 5 components
    result.data.slice(0, 5).forEach((component) => {
      console.log(`📦 ${component.name}`)
      console.log(`   Category: ${component.category}`)
      console.log(`   Props: ${component.props?.join(', ')}`)
      if (component.examples && component.examples.length > 0) {
        console.log(`   Example: ${component.examples[0].description}`)
      }
      console.log()
    })
  } else {
    console.error('❌ Error:', result.error)
  }
}

/**
 * Example 2: List Existing Pages
 */
async function example2_listPages() {
  console.log('\n=== Example 2: List Existing Pages ===\n')

  const result = await listPages('blog')

  if (result.success && result.data) {
    console.log(`✅ Found ${result.data.length} blog posts\n`)
    result.data.slice(0, 5).forEach((slug) => {
      console.log(`📄 ${slug}`)
    })
  } else {
    console.error('❌ Error:', result.error)
  }
}

/**
 * Example 3: Read Existing Page
 */
async function example3_readPage() {
  console.log('\n=== Example 3: Read Existing Page ===\n')

  const result = await getPage('blog/hello-world-omnisignal')

  if (result.success && result.data) {
    console.log('✅ Page loaded successfully\n')
    console.log(`Title: ${result.data.frontmatter.title}`)
    console.log(`Description: ${result.data.frontmatter.description}`)
    console.log(`Category: ${result.data.frontmatter.category}`)
    console.log(`Keywords: ${result.data.frontmatter.keywords?.join(', ')}`)
    console.log(`Layout: ${result.data.frontmatter.layout || 'default'}`)
    console.log(`Content length: ${result.data.content.length} characters`)
  } else {
    console.error('❌ Error:', result.error)
  }
}

/**
 * Example 4: Create Simple Markdown Page
 */
async function example4_createMarkdownPage() {
  console.log('\n=== Example 4: Create Simple Markdown Page ===\n')

  const result = await savePage({
    slug: 'blog/test-ai-agent-post',
    frontmatter: {
      title: 'Test Post Created by AI Agent',
      description: 'This post was created programmatically using the AI Agent SDK',
      datePublished: new Date().toISOString(),
      category: 'Technical',
      keywords: ['ai', 'automation', 'sdk'],
      tags: ['AI', 'Test'],
      draft: true, // Mark as draft so it doesn't appear in production
      published: false,
    },
    markdownContent: `
## Introduction

This blog post was created programmatically using the AI Agent SDK.

## Features

The SDK provides:
- Page management (create, read, update, delete)
- Component discovery
- Media generation integration
- Type-safe TypeScript interfaces

## Conclusion

The AI Agent SDK makes it easy for AI agents to create content autonomously.
    `.trim(),
  })

  if (result.success && result.data) {
    console.log('✅ Page created successfully')
    console.log(`Path: ${result.data.path}`)
  } else {
    console.error('❌ Error:', result.error)
  }
}

/**
 * Example 5: Create PageBuilder Page
 */
async function example5_createPageBuilderPage() {
  console.log('\n=== Example 5: Create PageBuilder Page ===\n')

  const result = await savePage({
    slug: 'blog/test-pagebuilder-post',
    frontmatter: {
      title: 'PageBuilder Test Post',
      description: 'Testing the PageBuilder functionality',
      datePublished: new Date().toISOString(),
      category: 'Technical',
      keywords: ['pagebuilder', 'test'],
      draft: true,
      published: false,
      layout: 'builder',
      blocks: [
        {
          component: 'Section',
          props: { variant: 'light' },
          children: [
            {
              component: 'Container',
              children: [
                {
                  component: 'Heading',
                  props: { level: 1, align: 'center', size: '3xl' },
                  children: ['PageBuilder Test Post'],
                },
                {
                  component: 'Text',
                  props: { align: 'center', size: 'lg' },
                  children: ['This page was built using the PageBuilder system'],
                },
              ],
            },
          ],
        },
        {
          component: 'Section',
          props: { variant: 'default' },
          children: [
            {
              component: 'Container',
              children: [
                {
                  component: 'Heading',
                  props: { level: 2, align: 'center' },
                  children: ['Features'],
                },
                {
                  component: 'Grid',
                  props: { cols: 3, gap: 6 },
                  children: [
                    {
                      component: 'Card',
                      props: { variant: 'outline', padding: 'lg' },
                      children: [
                        {
                          component: 'Heading',
                          props: { level: 3 },
                          children: ['Component-Based'],
                        },
                        {
                          component: 'Text',
                          children: ['Build pages from design system components'],
                        },
                      ],
                    },
                    {
                      component: 'Card',
                      props: { variant: 'outline', padding: 'lg' },
                      children: [
                        {
                          component: 'Heading',
                          props: { level: 3 },
                          children: ['Type-Safe'],
                        },
                        {
                          component: 'Text',
                          children: ['Full TypeScript support for blocks'],
                        },
                      ],
                    },
                    {
                      component: 'Card',
                      props: { variant: 'outline', padding: 'lg' },
                      children: [
                        {
                          component: 'Heading',
                          props: { level: 3 },
                          children: ['AI-Friendly'],
                        },
                        {
                          component: 'Text',
                          children: ['Easy for AI agents to generate'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  })

  if (result.success && result.data) {
    console.log('✅ PageBuilder page created successfully')
    console.log(`Path: ${result.data.path}`)
  } else {
    console.error('❌ Error:', result.error)
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🤖 AI Agent SDK - Example Usage\n')
  console.log('This script demonstrates the core capabilities of the AI Agent SDK.')

  try {
    await example1_discoverComponents()
    await example2_listPages()
    await example3_readPage()
    await example4_createMarkdownPage()
    await example5_createPageBuilderPage()

    console.log('\n✅ All examples completed successfully!\n')
    console.log('Note: Test pages were created with draft: true to prevent them from appearing in production.')
  } catch (error) {
    console.error('\n❌ Error running examples:', error)
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error)
}

export { main }
