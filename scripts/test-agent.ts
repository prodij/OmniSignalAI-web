/**
 * Test Image Generation Agent
 */

import 'dotenv/config';
import { ImageGenerationAgent } from '../lib/agents/image-generation-agent';

async function testAgent() {
  console.log('Testing Image Generation Agent...\n');

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
      timeout: 120000,
    },
    logging: {
      verbose: true,
      logIntentDetection: true,
      logPromptTranslation: true,
      logGeneration: true,
    },
  });

  const intent = 'Professional blog header thumbnail about social media marketing. Modern, editorial style, engaging and informative.';

  console.log('Intent:', intent);
  console.log('\n---\n');

  try {
    const result = await agent.generate({
      intent,
      useCase: 'blog-header',
      stylePreference: 'editorial',
      filename: 'test-blog-thumbnail',
    });

    console.log('\n---\n');
    console.log('Result:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('\n✓ Success!');
      console.log('Image URL:', result.imageUrl);
      console.log('File Path:', result.filePath);
    } else {
      console.log('\n✗ Failed');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.error('\n✗ Exception:', error);
  }
}

testAgent().catch(console.error);