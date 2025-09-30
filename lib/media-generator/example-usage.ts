/**
 * Example Usage of Media Generator
 *
 * This file demonstrates how to use the media generator tool for various use cases.
 * For AI agents: Copy these patterns for your specific needs.
 */

import {
  generateImage,
  generateImageVariations,
  refineImage,
  COMMON_TEMPLATES,
  buildPromptFromTemplate,
  enhancePrompt,
  validatePrompt,
  validateEnvironment,
} from './index';

/**
 * Example 1: Basic Image Generation
 */
async function example1_BasicGeneration() {
  console.log('Example 1: Basic Image Generation');

  const result = await generateImage({
    prompt:
      'Professional hero banner for AI-powered social media platform, modern design, vibrant gradient colors, high quality, 8K',
  });

  if (result.success) {
    console.log('✓ Generated image:', result.imageUrl);
  } else {
    console.error('✗ Generation failed:', result.error);
  }

  return result;
}

/**
 * Example 2: Using Template for Blog Header
 */
async function example2_BlogHeaderTemplate() {
  console.log('\nExample 2: Blog Header Template');

  const prompt = buildPromptFromTemplate(
    COMMON_TEMPLATES.blogHeader('AI marketing automation trends 2025')
  );

  console.log('Generated prompt:', prompt);

  const result = await generateImage({ prompt });

  if (result.success) {
    console.log('✓ Blog header created:', result.imageUrl);
  } else {
    console.error('✗ Failed:', result.error);
  }

  return result;
}

/**
 * Example 3: Social Media Post with Enhancement
 */
async function example3_EnhancedSocialPost() {
  console.log('\nExample 3: Enhanced Social Media Post');

  // Start with a basic prompt
  const basicPrompt = 'team collaboration in modern workspace';

  // Validate it
  const validation = validatePrompt(basicPrompt);
  console.log('Prompt score:', validation.score);
  console.log('Suggestions:', validation.suggestions);

  // Enhance it
  const enhanced = enhancePrompt(basicPrompt, {
    style: 'photorealistic',
    addDefaults: true,
  });

  console.log('Enhanced prompt:', enhanced.prompt);

  // Generate
  const result = await generateImage({
    prompt: enhanced.prompt,
    negativePrompt: 'cluttered, messy, dark, low quality',
  });

  if (result.success) {
    console.log('✓ Social media image created:', result.imageUrl);
  } else {
    console.error('✗ Failed:', result.error);
  }

  return result;
}

/**
 * Example 4: Hero Section Banner
 */
async function example4_HeroBanner() {
  console.log('\nExample 4: Hero Section Banner');

  const prompt = buildPromptFromTemplate(
    COMMON_TEMPLATES.heroSection('AI-powered content creation platform')
  );

  const result = await generateImage({
    prompt,
    filename: 'hero-banner-ai-platform',
  });

  if (result.success) {
    console.log('✓ Hero banner created:', result.imageUrl);
    console.log('  File saved as:', result.filePath);
  } else {
    console.error('✗ Failed:', result.error);
  }

  return result;
}

/**
 * Example 5: Product Feature Showcase
 */
async function example5_ProductFeature() {
  console.log('\nExample 5: Product Feature Showcase');

  const prompt = buildPromptFromTemplate(
    COMMON_TEMPLATES.productFeature('OmniSignalAI dashboard', 'real-time analytics')
  );

  const result = await generateImage({ prompt });

  if (result.success) {
    console.log('✓ Product feature image:', result.imageUrl);
  } else {
    console.error('✗ Failed:', result.error);
  }

  return result;
}

/**
 * Example 6: Multi-turn Refinement
 */
async function example6_MultiTurnRefinement() {
  console.log('\nExample 6: Multi-turn Refinement');

  // Initial generation
  console.log('Step 1: Generate initial image...');
  const initial = await generateImage({
    prompt: 'Modern office workspace with laptop and coffee cup',
  });

  if (!initial.success) {
    console.error('✗ Initial generation failed:', initial.error);
    return initial;
  }

  console.log('✓ Initial image:', initial.imageUrl);

  // First refinement
  console.log('Step 2: Refine with warmer lighting...');
  const refined = await refineImage(
    'Modern office workspace with laptop and coffee cup',
    'Make the lighting warmer and more golden, add some indoor plants in the background'
  );

  if (!refined.success) {
    console.error('✗ Refinement failed:', refined.error);
    return refined;
  }

  console.log('✓ Refined image:', refined.imageUrl);

  // Second refinement
  console.log('Step 3: Add more details...');
  const final = await refineImage(
    'Modern office workspace with laptop and coffee cup',
    'Change the laptop screen to show a colorful dashboard interface',
    [
      'Modern office workspace with laptop and coffee cup',
      'Make the lighting warmer and more golden, add some indoor plants in the background',
    ]
  );

  if (final.success) {
    console.log('✓ Final refined image:', final.imageUrl);
  } else {
    console.error('✗ Final refinement failed:', final.error);
  }

  return final;
}

/**
 * Example 7: Generate Multiple Variations
 */
async function example7_GenerateVariations() {
  console.log('\nExample 7: Generate Multiple Variations');

  const variations = await generateImageVariations(
    'Professional headshot of a tech entrepreneur, clean background, confident expression, natural lighting',
    3
  );

  variations.forEach((result, index) => {
    if (result.success) {
      console.log(`✓ Variation ${index + 1}:`, result.imageUrl);
    } else {
      console.error(`✗ Variation ${index + 1} failed:`, result.error);
    }
  });

  return variations;
}

/**
 * Example 8: Complete Workflow with Error Handling
 */
async function example8_CompleteWorkflow() {
  console.log('\nExample 8: Complete Workflow with Error Handling');

  // 1. Validate environment
  console.log('Step 1: Validate environment...');
  const envCheck = validateEnvironment();
  if (!envCheck.isValid) {
    console.error('✗ Environment validation failed:', envCheck.error);
    console.log('  → Please set OPENROUTER_API_KEY in your .env file');
    return null;
  }
  console.log('✓ Environment configured');

  // 2. Validate prompt
  console.log('\nStep 2: Validate prompt...');
  const basicPrompt = 'marketing banner about AI';
  const validation = validatePrompt(basicPrompt);
  console.log(`  Prompt score: ${validation.score}/100`);

  if (validation.suggestions.length > 0) {
    console.log('  Suggestions:');
    validation.suggestions.forEach((s) => console.log(`    - ${s}`));
  }

  // 3. Enhance prompt
  console.log('\nStep 3: Enhance prompt...');
  const enhanced = enhancePrompt(basicPrompt, {
    style: 'marketing',
    addDefaults: true,
  });
  console.log('  Enhanced prompt:', enhanced.prompt);

  // 4. Generate image
  console.log('\nStep 4: Generate image...');
  const result = await generateImage({
    prompt: enhanced.prompt,
    negativePrompt: enhanced.negativePrompt,
  });

  if (!result.success) {
    console.error('✗ Generation failed:', result.error);

    // Handle specific errors
    if (result.error?.includes('API key')) {
      console.log('  → Check your OPENROUTER_API_KEY configuration');
    } else if (result.error?.includes('rate limit')) {
      console.log('  → Rate limit exceeded. Wait a moment and try again.');
    } else if (result.error?.includes('timeout')) {
      console.log('  → Request timed out. Try a simpler prompt or retry.');
    }

    return null;
  }

  console.log('✓ Image generated successfully!');
  console.log('  Public URL:', result.imageUrl);
  console.log('  File path:', result.filePath);

  return result;
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('=== Media Generator Examples ===\n');

  // Check environment first
  const envCheck = validateEnvironment();
  if (!envCheck.isValid) {
    console.error('❌ Cannot run examples:', envCheck.error);
    console.log('\n💡 Setup Instructions:');
    console.log('   1. Sign up at https://openrouter.ai');
    console.log('   2. Create an API key');
    console.log('   3. Add to .env file: OPENROUTER_API_KEY=your_key_here');
    return;
  }

  console.log('✓ Environment configured. Running examples...\n');

  // Run examples (comment out to run specific ones)
  await example1_BasicGeneration();
  // await example2_BlogHeaderTemplate();
  // await example3_EnhancedSocialPost();
  // await example4_HeroBanner();
  // await example5_ProductFeature();
  // await example6_MultiTurnRefinement();
  // await example7_GenerateVariations();
  // await example8_CompleteWorkflow();

  console.log('\n=== Examples Complete ===');
}

// Export individual examples for selective use
export {
  example1_BasicGeneration,
  example2_BlogHeaderTemplate,
  example3_EnhancedSocialPost,
  example4_HeroBanner,
  example5_ProductFeature,
  example6_MultiTurnRefinement,
  example7_GenerateVariations,
  example8_CompleteWorkflow,
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}