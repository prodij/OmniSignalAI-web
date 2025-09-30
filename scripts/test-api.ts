/**
 * Test OpenRouter API Connection
 */

import 'dotenv/config';

async function testAPI() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error('❌ OPENROUTER_API_KEY not found in environment');
    return;
  }

  console.log('✓ API Key found');
  console.log('Testing OpenRouter API connection...\n');

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://omnisignalai.com',
        'X-Title': 'OmniSignalAI Test',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: 'Generate a simple test image of a blue circle'
          }
        ],
        modalities: ['image', 'text'],
      }),
    });

    console.log('Status:', response.status, response.statusText);

    const data = await response.json();

    console.log('\nResponse:');
    console.log(JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✓ API connection successful!');
      if (data.choices?.[0]?.message?.images) {
        console.log('✓ Image generation working!');
      }
    } else {
      console.log('\n❌ API request failed');
      console.log('Error details:', data);
    }

  } catch (error) {
    console.error('❌ Request error:', error);
  }
}

testAPI().catch(console.error);