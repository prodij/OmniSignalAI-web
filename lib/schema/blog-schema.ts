/**
 * JSON-LD Schema Generation for Blog Posts
 * Optimizes content for LLM indexing and search engine understanding
 */

interface Author {
  name: string
  url: string
  image?: string
}

interface FAQ {
  q: string
  a: string
}

interface Step {
  name: string
  description: string
  image?: string
}

interface BlogPost {
  title: string
  description: string
  slug: string
  datePublished: string
  dateModified?: string
  author: Author
  category: string
  keywords: string[]
  schema?: 'Article' | 'HowTo' | 'FAQPage'
  faq?: FAQ[]
  steps?: Step[]
  readTime: number
}

/**
 * Generate base Article schema
 */
function generateArticleSchema(post: BlogPost, permalink: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      '@type': 'Organization',
      name: post.author.name,
      url: post.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'OmniSignalAI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://omnisignalai.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': permalink,
    },
    keywords: post.keywords.join(', '),
    articleSection: post.category,
    timeRequired: `PT${post.readTime}M`,
  }
}

/**
 * Generate HowTo schema for step-by-step guides
 */
function generateHowToSchema(post: BlogPost, permalink: string) {
  const baseSchema = generateArticleSchema(post, permalink)

  if (!post.steps || post.steps.length === 0) {
    return baseSchema
  }

  return {
    ...baseSchema,
    '@type': 'HowTo',
    step: post.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.description,
      ...(step.image && {
        image: {
          '@type': 'ImageObject',
          url: step.image,
        },
      }),
    })),
    totalTime: `PT${post.readTime}M`,
  }
}

/**
 * Generate FAQPage schema for Q&A content
 */
function generateFAQSchema(post: BlogPost, permalink: string) {
  const baseSchema = generateArticleSchema(post, permalink)

  if (!post.faq || post.faq.length === 0) {
    return baseSchema
  }

  return {
    ...baseSchema,
    '@type': ['Article', 'FAQPage'],
    mainEntity: post.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
}

/**
 * Generate BreadcrumbList schema for navigation
 */
function generateBreadcrumbSchema(post: BlogPost, permalink: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://omnisignalai.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://omnisignalai.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: permalink,
      },
    ],
  }
}

/**
 * Main function to generate all appropriate schemas for a blog post
 */
export function generateBlogSchema(post: BlogPost): object {
  const permalink = `https://omnisignalai.com/blog/${post.slug}`

  let mainSchema

  switch (post.schema) {
    case 'HowTo':
      mainSchema = generateHowToSchema(post, permalink)
      break
    case 'FAQPage':
      mainSchema = generateFAQSchema(post, permalink)
      break
    default:
      mainSchema = generateArticleSchema(post, permalink)
  }

  // Always include breadcrumb for navigation context
  const breadcrumbSchema = generateBreadcrumbSchema(post, permalink)

  // Return array of schemas
  return {
    '@context': 'https://schema.org',
    '@graph': [mainSchema, breadcrumbSchema],
  }
}

/**
 * Generate WebSite schema for blog index page
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OmniSignalAI Blog',
    description: 'Learn how AI transforms social media content creation',
    url: 'https://omnisignalai.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'OmniSignalAI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://omnisignalai.com/logo.png',
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://omnisignalai.com/blog?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}