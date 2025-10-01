/**
 * Test Prompt Enhancement Agent
 */

import 'dotenv/config';
import { PromptEnhancementAgent } from '../lib/agents/prompt-enhancement';

async function testPromptEnhancement() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  Prompt Enhancement Agent Test             ║');
  console.log('╚════════════════════════════════════════════╝\n');

  const agent = new PromptEnhancementAgent(3, 80); // 3 iterations, 80% quality threshold

  const testCase = {
    userIntent: 'Professional blog header about social media marketing challenges. Show a stressed marketing manager dealing with multiple platforms and deadlines.',
    useCase: 'blog-header' as const,
    stylePreference: 'photorealistic' as const,
    aspectRatio: '16:9' as const,
  };

  console.log('Test Case:');
  console.log(`  Intent: ${testCase.userIntent}`);
  console.log(`  Use Case: ${testCase.useCase}`);
  console.log(`  Style: ${testCase.stylePreference}\n`);

  console.log('Starting enhancement workflow...\n');

  const result = await agent.enhance(testCase);

  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  Enhancement Complete                      ║');
  console.log('╚════════════════════════════════════════════╝\n');

  if (!result.success) {
    console.error('❌ Enhancement failed:', result.error);
    return;
  }

  console.log('📊 Results:');
  console.log(`  Total iterations: ${result.totalIterations}`);
  console.log(`  Processing time: ${(result.processingTime / 1000).toFixed(2)}s`);
  console.log(`  Final confidence: ${result.finalPrompt.confidenceScore}%\n`);

  console.log('🎯 Final Optimized Prompt:');
  console.log('━'.repeat(80));
  console.log(result.finalPrompt.optimizedPrompt);
  console.log('━'.repeat(80));

  console.log('\n🚫 Negative Prompt:');
  console.log(result.finalPrompt.negativePrompt.split(',').slice(0, 10).join(', ') + '...');

  console.log('\n💡 Reasoning:');
  console.log(result.finalPrompt.reasoning);

  console.log('\n⚙️ Technical Details:');
  console.log(`  Composition: ${result.finalPrompt.technicalDetails.composition}`);
  console.log(`  Lighting: ${result.finalPrompt.technicalDetails.lighting}`);
  console.log(`  Camera: ${result.finalPrompt.technicalDetails.cameraSettings}`);
  console.log(`  Colors: ${result.finalPrompt.technicalDetails.colorPalette}`);

  if (result.finalPrompt.expectedIssues.length > 0) {
    console.log('\n⚠️  Expected Issues:');
    result.finalPrompt.expectedIssues.forEach(issue => {
      console.log(`  • ${issue}`);
    });
  }

  console.log('\n📝 Iteration History:');
  result.iterations.forEach((iter, idx) => {
    console.log(`\n  Iteration ${idx + 1}:`);
    console.log(`    Confidence: ${iter.prompt.confidenceScore}%`);
    console.log(`    Prompt length: ${iter.prompt.optimizedPrompt.length} chars`);
    console.log(`    Preview: ${iter.prompt.optimizedPrompt.substring(0, 100)}...`);
  });

  console.log('\n✅ Test complete!\n');
}

testPromptEnhancement().catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});