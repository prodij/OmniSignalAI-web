/**
 * Image Generation Agent - Usage Examples
 * Demonstrates how to use the autonomous image generation agent
 */

import {
  ImageGenerationAgent,
  generateImageWithAgent,
  PRESET_CONFIGS,
} from './index';

/**
 * Example 1: Simple generation with natural language
 */
async function example1_SimpleGeneration() {
  console.log('\n=== Example 1: Simple Generation ===\n');

  const agent = new ImageGenerationAgent();

  const result = await agent.generate({
    intent: 'Create a professional blog header about AI marketing automation',
  });

  if (result.success) {
    console.log('✓ Image generated successfully!');
    console.log('  URL:', result.imageUrl);
    console.log('\nAgent Reasoning:');
    console.log('  Use Case:', result.reasoning.detectedIntent.useCase);
    console.log('  Topic:', result.reasoning.detectedIntent.topic);
    console.log('  Style:', result.reasoning.detectedIntent.style);
    console.log('  Confidence:', result.reasoning.detectedIntent.confidence + '%');
    console.log('\nOptimized Prompt:');
    console.log('  ', result.reasoning.translatedPrompt.prompt.substring(0, 100) + '...');
    console.log('  Quality Score:', result.reasoning.translatedPrompt.qualityScore);
    console.log('\nProcessing Time:', result.processingTime + 'ms');
  } else {
    console.error('✗ Generation failed:', result.error);
  }

  return result;
}

/**
 * Example 2: Social media post with hints
 */
async function example2_SocialMediaPost() {
  console.log('\n=== Example 2: Social Media Post with Hints ===\n');

  const agent = new ImageGenerationAgent();

  const result = await agent.generate({
    intent: 'productivity tips for entrepreneurs',
    useCase: 'social-post',
    platform: 'instagram',
    stylePreference: 'illustration',
  });

  if (result.success) {
    console.log('✓ Social media graphic created!');
    console.log('  URL:', result.imageUrl);
    console.log('  Detected use case:', result.reasoning.detectedIntent.useCase);
    console.log('  Applied style:', result.reasoning.contextAnalysis.style);
  }

  return result;
}

/**
 * Example 3: Hero banner with refinement
 */
async function example3_HeroBannerWithRefinement() {
  console.log('\n=== Example 3: Hero Banner with Refinement ===\n');

  const agent = new ImageGenerationAgent();

  const result = await agent.generate({
    intent: 'Hero section showing team collaboration in modern office',
    refinementInstructions: [
      'Make the lighting warmer and more golden',
      'Add more diversity in the team composition',
    ],
  });

  if (result.success) {
    console.log('✓ Hero banner created with refinements!');
    console.log('  URL:', result.imageUrl);
    console.log('  Processing time:', result.processingTime + 'ms');
  }

  return result;
}

/**
 * Example 4: Quick helper function
 */
async function example4_QuickHelper() {
  console.log('\n=== Example 4: Quick Helper Function ===\n');

  // One-line generation
  const result = await generateImageWithAgent(
    'Blog header about sustainable fashion trends'
  );

  if (result.success) {
    console.log('✓ Quick generation successful!');
    console.log('  URL:', result.imageUrl);
  }

  return result;
}

/**
 * Example 5: High quality preset
 */
async function example5_HighQualityPreset() {
  console.log('\n=== Example 5: High Quality Preset ===\n');

  const agent = new ImageGenerationAgent(PRESET_CONFIGS.quality);

  const result = await agent.generate({
    intent: 'Professional product feature image of SaaS dashboard analytics',
  });

  if (result.success) {
    console.log('✓ High-quality image generated!');
    console.log('  URL:', result.imageUrl);
    console.log('  Quality score:', result.reasoning.translatedPrompt.qualityScore);
  }

  return result;
}

/**
 * Example 6: Fast generation preset
 */
async function example6_FastPreset() {
  console.log('\n=== Example 6: Fast Generation ===\n');

  const agent = new ImageGenerationAgent(PRESET_CONFIGS.fast);

  const result = await agent.generate({
    intent: 'Social media post about new AI features',
  });

  if (result.success) {
    console.log('✓ Fast generation complete!');
    console.log('  URL:', result.imageUrl);
    console.log('  Processing time:', result.processingTime + 'ms');
  }

  return result;
}

/**
 * Example 7: Debug mode with verbose logging
 */
async function example7_DebugMode() {
  console.log('\n=== Example 7: Debug Mode with Logging ===\n');

  const agent = new ImageGenerationAgent(PRESET_CONFIGS.debug);

  const result = await agent.generate({
    intent: 'Team photo of diverse tech startup founders',
  });

  if (result.success) {
    console.log('\n✓ Generation complete (see logs above)');
    console.log('  URL:', result.imageUrl);
  }

  return result;
}

/**
 * Example 8: Custom configuration
 */
async function example8_CustomConfig() {
  console.log('\n=== Example 8: Custom Configuration ===\n');

  const agent = new ImageGenerationAgent({
    promptTranslation: {
      useTemplates: true,
      enhancePrompts: true,
      addNegativePrompts: true,
      minQualityScore: 75,
    },
    generation: {
      retryOnFailure: true,
      maxRetries: 2,
      enableRefinement: false,
      timeout: 90000,
    },
    logging: {
      verbose: false,
      logIntentDetection: true,
      logPromptTranslation: true,
      logGeneration: false,
    },
  });

  const result = await agent.generate({
    intent: 'Concept illustration of AI-powered automation workflow',
  });

  if (result.success) {
    console.log('✓ Custom config generation successful!');
    console.log('  URL:', result.imageUrl);
  }

  return result;
}

/**
 * Example 9: Multiple generations in sequence
 */
async function example9_MultipleGenerations() {
  console.log('\n=== Example 9: Multiple Generations ===\n');

  const agent = new ImageGenerationAgent();

  const requests = [
    'Blog header about machine learning',
    'Social post about productivity hacks',
    'Hero banner for AI startup',
  ];

  const results = [];

  for (const intent of requests) {
    console.log(`\nGenerating: "${intent}"...`);
    const result = await agent.generate({ intent });

    if (result.success) {
      console.log('  ✓ Success:', result.imageUrl);
      results.push(result);
    } else {
      console.log('  ✗ Failed:', result.error);
    }
  }

  console.log(`\nCompleted ${results.length}/${requests.length} generations`);

  return results;
}

/**
 * Example 10: Error handling
 */
async function example10_ErrorHandling() {
  console.log('\n=== Example 10: Error Handling ===\n');

  const agent = new ImageGenerationAgent();

  // Invalid intent (too short)
  const result = await agent.generate({
    intent: 'image',
  });

  if (!result.success) {
    console.log('✓ Error handled gracefully:');
    console.log('  Error:', result.error);
  }

  // Valid intent
  const validResult = await agent.generate({
    intent: 'Professional headshot of a software engineer',
  });

  if (validResult.success) {
    console.log('\n✓ Valid request succeeded:');
    console.log('  URL:', validResult.imageUrl);
  }

  return validResult;
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  Image Generation Agent - Usage Examples  ║');
  console.log('╚════════════════════════════════════════════╝');

  try {
    // Run one example (uncomment to run specific ones)
    await example1_SimpleGeneration();
    // await example2_SocialMediaPost();
    // await example3_HeroBannerWithRefinement();
    // await example4_QuickHelper();
    // await example5_HighQualityPreset();
    // await example6_FastPreset();
    // await example7_DebugMode();
    // await example8_CustomConfig();
    // await example9_MultipleGenerations();
    // await example10_ErrorHandling();

    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║         Examples Complete                  ║');
    console.log('╚════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n✗ Error running examples:', error);
  }
}

// Export individual examples
export {
  example1_SimpleGeneration,
  example2_SocialMediaPost,
  example3_HeroBannerWithRefinement,
  example4_QuickHelper,
  example5_HighQualityPreset,
  example6_FastPreset,
  example7_DebugMode,
  example8_CustomConfig,
  example9_MultipleGenerations,
  example10_ErrorHandling,
};

// Run if executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}