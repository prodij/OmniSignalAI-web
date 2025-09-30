import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const computedFields = <T extends { slug: string }>(data: T) => ({
  ...data,
  slugAsParams: data.slug.split("/").slice(1).join("/"),
});

const blog = defineCollection({
  name: "Blog",
  pattern: "blog/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(100),
      description: s.string().max(200),
      datePublished: s.isodate(),
      dateModified: s.isodate().optional(),

      // Author information
      author: s.object({
        name: s.string(),
        url: s.string().url(),
        image: s.string().url().optional(),
      }).default({
        name: "OmniSignalAI Team",
        url: "https://omnisignalai.com",
      }),

      // SEO & categorization
      keywords: s.array(s.string()),
      category: s.enum(["Guides", "Case Studies", "Research", "Technical", "News"]),
      tags: s.array(s.string()).optional(),
      readTime: s.number().int().positive().optional(),
      featured: s.boolean().default(false),

      // Thumbnail image
      thumbnail: s.string().optional(),

      // Schema.org type for structured data
      schema: s.enum(["Article", "HowTo", "FAQPage"]).optional().default("Article"),

      // FAQ for structured data
      faq: s.array(s.object({
        q: s.string(),
        a: s.string(),
      })).optional(),

      // HowTo steps (if schema: "HowTo")
      steps: s.array(s.object({
        name: s.string(),
        description: s.string(),
        image: s.string().url().optional(),
      })).optional(),

      // Open Graph
      og: s.object({
        image: s.string(),
        imageAlt: s.string(),
      }).optional(),

      // Related posts (slugs)
      related: s.array(s.string()).optional(),

      // Publishing
      draft: s.boolean().default(false),
      published: s.boolean().default(true),

      // MDX body
      body: s.mdx(),
    })
    .transform((data) => {
      // Calculate read time if not provided (avg 200 words/min)
      const wordCount = data.body.split(/\s+/).length;
      const calculatedReadTime = Math.ceil(wordCount / 200);

      return {
        ...computedFields(data),
        readTime: data.readTime || calculatedReadTime,
        permalink: `/blog/${data.slug.split("/").slice(1).join("/")}`,
      };
    }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { blog },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: "github-dark" }],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
    remarkPlugins: [],
  },
});