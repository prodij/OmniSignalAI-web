/**
 * Blog Thumbnail Generator Script
 * Automatically generates thumbnails for all blog posts using the Image Generation Agent
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
  category: string;
  hasThumbnail: boolean;
  currentThumbnail?: string;
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
    const content = await readFile(filePath, 'utf-8');
    const { data } = matter(content);

    posts.push({
      filePath,
      slug: data.slug || file.replace('.mdx', ''),
      title: data.title || 'Untitled',
      description: data.description || '',
      category: data.category || 'Guides',
      hasThumbnail: !!data.thumbnail,
      currentThumbnail: data.thumbnail,
    });
  }

  return posts;
}

/**
 * Generate thumbnail using the Image Generation Agent
 */
async function generateThumbnail(post: BlogPost): Promise<string | null> {
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
      verbose: true,
      logIntentDetection: true,
      logPromptTranslation: true,
      logGeneration: true,
    },
  });

  // Create intent based on blog post metadata
  const intent = `Professional blog header thumbnail for article titled "${post.title}". ${post.description}. Category: ${post.category}. Modern, editorial style, engaging and informative.`;

  console.log(`\nGenerating thumbnail for: ${post.title}`);
  console.log(`Intent: ${intent.substring(0, 100)}...`);

  try {
    const result = await agent.generate({
      intent,
      useCase: 'blog-header',
      stylePreference: 'editorial',
      filename: `blog-${post.slug}`,
    });

    if (result.success && result.imageUrl) {
      console.log(`✓ Generated: ${result.imageUrl}`);
      console.log(`  Confidence: ${result.reasoning.detectedIntent.confidence}%`);
      console.log(`  Quality: ${result.reasoning.translatedPrompt.qualityScore}/100`);
      return result.imageUrl;
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
 * Update blog post frontmatter with thumbnail path
 */
async function updatePostThumbnail(post: BlogPost, thumbnailUrl: string): Promise<void> {
  const content = await readFile(post.filePath, 'utf-8');
  const { data, content: body } = matter(content);

  // Update thumbnail in frontmatter
  data.thumbnail = thumbnailUrl;

  // Reconstruct file with updated frontmatter
  const updatedContent = matter.stringify(body, data);

  await writeFile(post.filePath, updatedContent, 'utf-8');

  console.log(`✓ Updated frontmatter: ${post.filePath}`);
}

/**
 * Main execution
 */
async function main() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  Blog Thumbnail Generator                  ║');
  console.log('╚════════════════════════════════════════════╝\n');

  // Parse command line arguments
  const args = process.argv.slice(2);
  const forceRegenerate = args.includes('--force');
  const specificSlug = args.find((arg) => !arg.startsWith('--'));

  console.log('Settings:');
  console.log(`  Force regenerate: ${forceRegenerate}`);
  console.log(`  Specific post: ${specificSlug || 'all'}\n`);

  // Scan blog posts
  console.log('Scanning blog posts...');
  const posts = await scanBlogPosts();
  console.log(`Found ${posts.length} blog posts\n`);

  // Filter posts to process
  let postsToProcess = posts;

  if (specificSlug) {
    postsToProcess = posts.filter((p) => p.slug === specificSlug);
    if (postsToProcess.length === 0) {
      console.error(`✗ Post not found: ${specificSlug}`);
      process.exit(1);
    }
  }

  if (!forceRegenerate) {
    postsToProcess = postsToProcess.filter((p) => !p.hasThumbnail);
    console.log(`${postsToProcess.length} posts need thumbnails\n`);
  } else {
    console.log(`Regenerating thumbnails for ${postsToProcess.length} posts\n`);
  }

  if (postsToProcess.length === 0) {
    console.log('✓ All posts already have thumbnails!');
    console.log('  Use --force to regenerate existing thumbnails');
    return;
  }

  // Generate thumbnails
  const results = {
    successful: 0,
    failed: 0,
    skipped: 0,
  };

  for (let i = 0; i < postsToProcess.length; i++) {
    const post = postsToProcess[i];

    console.log(`\n[${i + 1}/${postsToProcess.length}] Processing: ${post.slug}`);
    console.log(`  Title: ${post.title}`);
    console.log(`  Has thumbnail: ${post.hasThumbnail ? 'Yes' : 'No'}`);

    // Skip if has thumbnail and not forcing
    if (post.hasThumbnail && !forceRegenerate) {
      console.log('  ⊘ Skipping (already has thumbnail)');
      results.skipped++;
      continue;
    }

    // Generate thumbnail
    const thumbnailUrl = await generateThumbnail(post);

    if (thumbnailUrl) {
      // Update post frontmatter
      await updatePostThumbnail(post, thumbnailUrl);
      results.successful++;
    } else {
      results.failed++;
    }

    // Rate limiting: wait 2 seconds between requests
    if (i < postsToProcess.length - 1) {
      console.log('  ⏱ Waiting 2s before next request...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Summary
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  Generation Complete                       ║');
  console.log('╚════════════════════════════════════════════╝\n');
  console.log('Results:');
  console.log(`  ✓ Successful: ${results.successful}`);
  console.log(`  ✗ Failed: ${results.failed}`);
  console.log(`  ⊘ Skipped: ${results.skipped}`);
  console.log(`  Total processed: ${results.successful + results.failed}\n`);

  if (results.failed > 0) {
    console.log('⚠️  Some thumbnails failed to generate.');
    console.log('   Run the script again to retry failed posts.');
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('\n✗ Script failed:', error);
    process.exit(1);
  });
}

export { scanBlogPosts, generateThumbnail, updatePostThumbnail };