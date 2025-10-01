/**
 * Blog Section Image Generator Script
 * Generates contextual images for blog post sections
 */

import 'dotenv/config';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { ImageGenerationAgent } from '../lib/agents/image-generation-agent';

interface BlogPost {
  filePath: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  sections: BlogSection[];
}

interface BlogSection {
  heading: string;
  level: number;
  content: string;
  startLine: number;
}

interface GeneratedImage {
  section: string;
  imageUrl: string;
  prompt: string;
}

/**
 * Parse blog post sections
 */
function parseSections(content: string): BlogSection[] {
  const lines = content.split('\n');
  const sections: BlogSection[] = [];
  let currentSection: BlogSection | null = null;

  lines.forEach((line, index) => {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);

    if (headingMatch) {
      // Save previous section
      if (currentSection) {
        sections.push(currentSection);
      }

      // Start new section
      currentSection = {
        heading: headingMatch[2],
        level: headingMatch[1].length,
        content: '',
        startLine: index,
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  });

  // Add last section
  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Identify sections that need images
 */
function identifySectionsNeedingImages(sections: BlogSection[]): BlogSection[] {
  // Priority order for section selection
  const priorityKeywords = [
    'problem',
    'challenge',
    'issue',
    'difficulty',
    'pain',
    'what you',
    'why',
  ];

  const candidates = sections.filter(section => {
    // Skip FAQ and small sections
    if (section.heading.toLowerCase().includes('faq')) return false;
    if (section.heading.toLowerCase().includes('quick answer')) return false;
    if (section.heading.toLowerCase().includes('key takeaway')) return false;
    if (section.heading.toLowerCase().includes('getting started')) return false;
    if (section.content.length < 200) return false;

    // Only level 2 headings (##)
    return section.level === 2;
  });

  // Sort by priority keywords
  candidates.sort((a, b) => {
    const aHasPriority = priorityKeywords.some(keyword =>
      a.heading.toLowerCase().includes(keyword)
    );
    const bHasPriority = priorityKeywords.some(keyword =>
      b.heading.toLowerCase().includes(keyword)
    );

    if (aHasPriority && !bHasPriority) return -1;
    if (!aHasPriority && bHasPriority) return 1;
    return 0;
  });

  // Return only the top 1 section
  return candidates.slice(0, 1);
}

/**
 * Generate image for a blog section
 */
async function generateSectionImage(
  agent: ImageGenerationAgent,
  post: BlogPost,
  section: BlogSection
): Promise<GeneratedImage | null> {
  // Create more specific intent with emphasis on filling the frame
  const contentPreview = section.content.substring(0, 400).replace(/\n+/g, ' ').trim();

  const intent = `Full-frame editorial photography for blog article section.
    Article: "${post.title}"
    Section: "${section.heading}"
    Context: ${contentPreview}

    IMPORTANT: Create a wide horizontal composition (16:9 ratio) that completely fills the frame edge-to-edge.
    Style: Professional magazine-quality photography, cinematic lighting, shallow depth of field.
    Subject should dominate the frame with no empty space or borders.
    Modern, clean, business/editorial aesthetic.`;

  console.log(`\nGenerating image for section: ${section.heading}`);
  console.log(`Content preview: ${contentPreview.substring(0, 150)}...`);

  try {
    const result = await agent.generate({
      intent,
      useCase: 'blog-header',
      stylePreference: 'photorealistic',
      filename: `${post.slug}-section-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50)}`,
    });

    if (result.success && result.imageUrl) {
      console.log(`✓ Generated: ${result.imageUrl}`);
      console.log(`  File: ${result.filePath}`);
      return {
        section: section.heading,
        imageUrl: result.imageUrl,
        prompt: intent,
      };
    } else {
      console.error(`✗ Failed: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error(`✗ Error: ${error}`);
    return null;
  }
}

/**
 * Insert images into blog content
 */
function insertImagesIntoContent(
  content: string,
  sections: BlogSection[],
  images: GeneratedImage[]
): string {
  let updatedContent = content;
  const lines = updatedContent.split('\n');

  // Build image map
  const imageMap = new Map<string, string>();
  images.forEach(img => {
    imageMap.set(img.section, img.imageUrl);
  });

  // Insert images after section headings
  let offset = 0;
  sections.forEach(section => {
    const imageUrl = imageMap.get(section.heading);
    if (!imageUrl) return;

    // Find the line with this heading
    const headingPattern = `${'#'.repeat(section.level)} ${section.heading}`;
    const lineIndex = lines.findIndex((line, idx) =>
      idx >= section.startLine + offset && line.trim() === headingPattern
    );

    if (lineIndex !== -1) {
      // Insert image after heading (with blank line)
      const imageMarkdown = `\n![${section.heading}](${imageUrl})\n`;
      lines.splice(lineIndex + 1, 0, imageMarkdown);
      offset += 1;
    }
  });

  return lines.join('\n');
}

/**
 * Scan all blog posts
 */
async function scanBlogPosts(): Promise<BlogPost[]> {
  const contentDir = join(process.cwd(), 'content', 'blog');
  const files = await readdir(contentDir);
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

  const posts: BlogPost[] = [];

  for (const file of mdxFiles) {
    const filePath = join(contentDir, file);
    const fileContent = await readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    const sections = parseSections(content);

    posts.push({
      filePath,
      slug: data.slug || file.replace('.mdx', ''),
      title: data.title || 'Untitled',
      description: data.description || '',
      content,
      sections,
    });
  }

  return posts;
}

/**
 * Main execution
 */
async function main() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  Blog Section Image Generator              ║');
  console.log('╚════════════════════════════════════════════╝\n');

  // Parse command line arguments
  const args = process.argv.slice(2);
  const specificSlug = args.find((arg) => !arg.startsWith('--'));

  console.log('Settings:');
  console.log(`  Specific post: ${specificSlug || 'all'}\n`);

  // Scan blog posts
  console.log('Scanning blog posts...');
  let posts = await scanBlogPosts();
  console.log(`Found ${posts.length} blog posts\n`);

  // Filter to specific post if requested
  if (specificSlug) {
    posts = posts.filter((p) => p.slug === specificSlug);
    if (posts.length === 0) {
      console.error(`✗ Post not found: ${specificSlug}`);
      process.exit(1);
    }
  }

  // Initialize agent
  const agent = new ImageGenerationAgent({
    promptTranslation: {
      useTemplates: true,
      enhancePrompts: true,
      addNegativePrompts: true,
      minQualityScore: 75,
    },
    generation: {
      retryOnFailure: true,
      maxRetries: 3,
      enableRefinement: false,
      timeout: 120000,
    },
    logging: {
      verbose: false,
      logIntentDetection: false,
      logPromptTranslation: false,
      logGeneration: true,
    },
  });

  // Process each post
  const results = {
    postsProcessed: 0,
    imagesGenerated: 0,
    imagesFailed: 0,
  };

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    console.log(`\n[${i + 1}/${posts.length}] Processing: ${post.slug}`);
    console.log(`  Title: ${post.title}`);
    console.log(`  Total sections: ${post.sections.length}`);

    // Identify sections needing images
    const sectionsForImages = identifySectionsNeedingImages(post.sections);
    console.log(`  Sections needing images: ${sectionsForImages.length}`);

    if (sectionsForImages.length === 0) {
      console.log('  ⊘ No suitable sections found');
      continue;
    }

    // Generate images for each section
    const generatedImages: GeneratedImage[] = [];

    for (let j = 0; j < sectionsForImages.length; j++) {
      const section = sectionsForImages[j];

      console.log(`\n  [${j + 1}/${sectionsForImages.length}] Section: "${section.heading}"`);

      const image = await generateSectionImage(agent, post, section);

      if (image) {
        generatedImages.push(image);
        results.imagesGenerated++;

        // Show preview information
        console.log(`\n  📋 PREVIEW:`);
        console.log(`     Post: ${post.title}`);
        console.log(`     Section: ${section.heading}`);
        console.log(`     Image: ${image.imageUrl}`);
        console.log(`     Prompt: ${image.prompt.substring(0, 200)}...`);
      } else {
        results.imagesFailed++;
      }

      // Rate limiting: wait 2 seconds between requests
      if (j < sectionsForImages.length - 1) {
        console.log('  ⏱ Waiting 2s before next section...');
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    // Show summary and ask for approval
    if (generatedImages.length > 0) {
      console.log(`\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`  📊 Generated ${generatedImages.length} image(s) for "${post.title}"`);
      console.log(`  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      generatedImages.forEach((img, idx) => {
        console.log(`\n  ${idx + 1}. Section: "${img.section}"`);
        console.log(`     Image: ${img.imageUrl}`);
      });

      console.log(`\n  ⚠️  IMAGES GENERATED BUT NOT INSERTED INTO POST YET`);
      console.log(`     Review images in: /public/generated/images/`);
      console.log(`     To insert into post, use: --approve flag`);
      console.log(`     To regenerate, delete images and run again\n`);
    }

    results.postsProcessed++;

    // Wait before next post
    if (i < posts.length - 1) {
      console.log('\n  ⏱ Waiting 3s before next post...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  // Summary
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  Generation Complete                       ║');
  console.log('╚════════════════════════════════════════════╝\n');
  console.log('Results:');
  console.log(`  Posts processed: ${results.postsProcessed}`);
  console.log(`  ✓ Images generated: ${results.imagesGenerated}`);
  console.log(`  ✗ Images failed: ${results.imagesFailed}\n`);
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('\n✗ Script failed:', error);
    process.exit(1);
  });
}

export { scanBlogPosts, generateSectionImage, insertImagesIntoContent };