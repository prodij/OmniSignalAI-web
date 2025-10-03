import { Metadata } from 'next'
import { resolvePosts } from '@/lib/content/resolver'
import { BlogList } from '@/components/blog/BlogList'
import { Section, Container } from '@/lib/design-system/base-components'
import { Heading, Text } from '@/lib/design-system/base-components'
import { generateWebSiteSchema } from '@/lib/schema/blog-schema'

export const metadata: Metadata = {
  title: 'Blog | OmniSignalAI',
  description: 'Learn how AI transforms social media content creation. Guides, case studies, and insights on AI-powered content generation.',
  openGraph: {
    title: 'OmniSignalAI Blog',
    description: 'Learn how AI transforms social media content creation',
    url: 'https://omnisignalai.com/blog',
    type: 'website',
  },
}

export default async function BlogPage() {
  // Resolve posts from API or static (dual content system)
  const resolvedPosts = await resolvePosts({ published: true })

  // Ensure all required fields have defaults
  const publishedPosts = resolvedPosts.map((post) => ({
    ...post,
    readTime: post.readTime || 5,
    category: post.category || 'General',
  }))

  // Sort by date
  const sortedPosts = publishedPosts.sort(
    (a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  )

  // Get featured posts
  const featuredPosts = sortedPosts.filter((post) => post.featured)

  // Get recent posts (non-featured)
  const recentPosts = sortedPosts.filter((post) => !post.featured)

  const schema = generateWebSiteSchema()

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero Section */}
      <Section variant="dark" padding="xl" className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
        <Container>
          <div className="max-w-3xl mx-auto text-center text-white">
            <Heading as="h1" size="4xl" className="mb-6">
              OmniSignalAI Blog
            </Heading>
            <Text size="xl" className="text-white/90">
              Learn how AI transforms social media content creation. Practical guides, real case
              studies, and insights on AI-powered workflows.
            </Text>
          </div>
        </Container>
      </Section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <Section variant="default" padding="xl" className="bg-neutral-50 dark:bg-neutral-900">
          <Container>
            <div className="mb-12">
              <Heading as="h2" size="3xl" className="mb-4">
                Featured Posts
              </Heading>
              <Text size="lg" className="text-neutral-600 dark:text-neutral-400">
                Our most popular and impactful articles
              </Text>
            </div>
            <BlogList posts={featuredPosts} />
          </Container>
        </Section>
      )}

      {/* All Posts */}
      <Section variant="default" padding="xl" className="bg-white dark:bg-neutral-950">
        <Container>
          <div className="mb-12">
            <Heading as="h2" size="3xl" className="mb-4">
              {featuredPosts.length > 0 ? 'Recent Posts' : 'All Posts'}
            </Heading>
            <Text size="lg" className="text-neutral-600 dark:text-neutral-400">
              Stay updated with the latest in AI content creation
            </Text>
          </div>
          <BlogList posts={recentPosts} />
        </Container>
      </Section>
    </>
  )
}