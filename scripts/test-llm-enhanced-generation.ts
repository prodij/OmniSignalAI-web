/**
 * Test Image Generation with LLM-Enhanced Prompts
 */

import 'dotenv/config';
import { ImageGenerationAgent } from '../lib/agents/image-generation-agent';

async function testLLMEnhancedGeneration() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  LLM-Enhanced Image Generation Test        ║');
  console.log('╚════════════════════════════════════════════╝\n');

  // Create agent with LLM enhancement enabled
  const agent = new ImageGenerationAgent({
    promptTranslation: {
      useTemplates: true,
      enhancePrompts: true,
      addNegativePrompts: true,
      minQualityScore: 75,
      useLLMEnhancement: true,  // ← Enable LLM enhancement
      llmEnhancementIterations: 2, // Fast test with 2 iterations
    },
    generation: {
      retryOnFailure: true,
      maxRetries: 3,
      enableRefinement: false,
      timeout: 180000,
    },
    logging: {
      verbose: true,
      logIntentDetection: true,
      logPromptTranslation: true,
      logGeneration: true,
    },
  });

  const intent = 'Professional blog header showing the problem of manual social media content creation. Stressed marketing manager overwhelmed by multiple platforms and tight deadlines.';

  console.log('Test Intent:');
  console.log(`  ${intent}\n`);

  console.log('Starting generation with LLM enhancement...\n');

  const result = await agent.generate({
    intent,
    useCase: 'blog-header',
    stylePreference: 'photorealistic',
    filename: 'test-llm-enhanced',
  });

  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  Generation Complete                       ║');
  console.log('╚════════════════════════════════════════════╝\n');

  if (result.success) {
    console.log('✅ Success!');
    console.log(`  Image URL: ${result.imageUrl}`);
    console.log(`  File Path: ${result.filePath}`);
    console.log(`  Processing Time: ${result.processingTime ? (result.processingTime / 1000).toFixed(2) : 'N/A'}s\n`);

    console.log('📊 Quality Metrics:');
    console.log(`  Detected Intent Confidence: ${result.reasoning.detectedIntent.confidence}%`);
    console.log(`  Prompt Quality Score: ${result.reasoning.translatedPrompt.qualityScore}%\n`);

    console.log('🎯 Optimizations Applied:');
    result.reasoning.translatedPrompt.optimizations.forEach((opt, idx) => {
      console.log(`  ${idx + 1}. ${opt}`);
    });

    console.log('\n💡 Note: With LLM enhancement enabled, the prompt was refined');
    console.log('   by Gemini 2.5 Flash for optimal quality and artifact-free output.\n');
  } else {
    console.error('❌ Generation failed:', result.error);
  }
}

testLLMEnhancedGeneration().catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});