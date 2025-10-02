import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { blog } from '#site/content'
import { BlogHeader } from '@/components/blog/BlogHeader'
import { BlogContent } from '@/components/blog/BlogContent'
import { generateBlogSchema } from '@/lib/schema/blog-schema'
import { MDXContent } from '@/components/blog/MDXContent'
import { PageBuilder } from '@/components/PageBuilder'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function getPostFromParams(params: BlogPostPageProps['params']) {
  const slug = params?.slug
  const post = blog.find((post) => post.slugAsParams === slug)

  if (!post || !post.published || post.draft) {
    return null
  }

  return post
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params)

  if (!post) {
    return {}
  }

  return {
    title: `${post.title} | OmniSignalAI Blog`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author.name, url: post.author.url }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      authors: [post.author.name],
      url: `https://omnisignalai.com/blog/${post.slugAsParams}`,
      images: post.og?.image ? [{ url: post.og.image, alt: post.og.imageAlt }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.og?.image ? [post.og.image] : [],
    },
  }
}

export async function generateStaticParams(): Promise<
  BlogPostPageProps['params'][]
> {
  return blog
    .filter((post) => post.published && !post.draft)
    .map((post) => ({
      slug: post.slugAsParams,
    }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostFromParams(params)

  if (!post) {
    notFound()
  }

  const schema = generateBlogSchema({
    title: post.title,
    description: post.description,
    slug: post.slugAsParams,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: post.author,
    category: post.category,
    keywords: post.keywords,
    schema: post.schema,
    faq: post.faq,
    steps: post.steps,
    readTime: post.readTime,
  })

  // Check if this is a PageBuilder layout
  if (post.layout === 'builder' && post.blocks) {
    return (
      <>
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        {/* Render using PageBuilder */}
        <PageBuilder blocks={post.blocks} />
      </>
    )
  }

  // Default MDX rendering
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Blog Header */}
      <BlogHeader
        title={post.title}
        description={post.description}
        datePublished={post.datePublished}
        dateModified={post.dateModified}
        readTime={post.readTime}
        category={post.category}
        tags={post.tags}
        author={post.author}
      />

      {/* Blog Content */}
      <BlogContent>
        <MDXContent code={post.body} />
      </BlogContent>
    </>
  )
}