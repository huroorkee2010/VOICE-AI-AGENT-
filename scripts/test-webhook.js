#!/usr/bin/env node

/**
 * Webhook Testing Utility
 * Tests the n8n webhook connectivity and response format
 */

const WEBHOOK_URL = 'https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI';

async function testWebhookConnectivity() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 WEBHOOK CONNECTIVITY TEST');
  console.log('='.repeat(70));
  console.log('📍 Webhook URL:', WEBHOOK_URL);
  console.log('⏱️  Testing at:', new Date().toISOString());
  console.log('='.repeat(70) + '\n');

  const testCases = [
    {
      name: 'Simple Message',
      payload: { message: 'Hello, how are you?' },
    },
    {
      name: 'Message with History',
      payload: {
        message: 'What was I asking before?',
        history: [
          { role: 'user', content: 'Tell me a joke' },
          { role: 'assistant', content: 'Why did the chicken cross the road? To get to the other side!' },
        ],
      },
    },
    {
      name: 'Complex Query',
      payload: { message: 'Explain quantum computing in simple terms' },
    },
  ];

  const results = [];

  for (const testCase of testCases) {
    console.log(`\n📋 Test Case: ${testCase.name}`);
    console.log('─'.repeat(70));

    try {
      const startTime = Date.now();

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'HUVOICE-AI-Test/1.0',
        },
        body: JSON.stringify(testCase.payload),
      });

      const duration = Date.now() - startTime;
      const responseText = await response.text();
      let responseData;

      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { raw: responseText };
      }

      const success = response.ok;
      const status = `${response.status} ${response.statusText}`;

      console.log(`✅ Status: ${status}`);
      console.log(`⏱️  Response Time: ${duration}ms`);
      console.log(`📦 Response Size: ${responseText.length} bytes`);
      console.log(`📄 Response Format: ${typeof responseData === 'object' ? 'JSON' : 'Text'}`);

      if (success) {
        console.log(`✅ Status: PASS`);
        const message = extractMessage(responseData);
        console.log(`💬 Message Preview: ${message.substring(0, 100)}...`);
      } else {
        console.log(`❌ Status: FAIL`);
        console.log(`Error: ${responseText.substring(0, 200)}`);
      }

      results.push({
        testCase: testCase.name,
        success,
        status,
        duration,
      });
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      results.push({
        testCase: testCase.name,
        success: false,
        error: error.message,
      });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(70));

  const passCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  console.log(`✅ Passed: ${passCount}/${results.length}`);
  console.log(`❌ Failed: ${failCount}/${results.length}`);

  results.forEach((result) => {
    const status = result.success ? '✅' : '❌';
    const time = result.duration ? `${result.duration}ms` : 'Error';
    console.log(`${status} ${result.testCase}: ${result.status || result.error} (${time})`);
  });

  console.log('='.repeat(70) + '\n');

  // Exit code
  const allPassed = failCount === 0;
  process.exit(allPassed ? 0 : 1);
}

function extractMessage(payload) {
  // Try multiple common response formats
  return (
    payload?.response ||
    payload?.message ||
    payload?.text ||
    payload?.reply ||
    payload?.output ||
    payload?.answer ||
    payload?.result ||
    payload?.content ||
    payload?.body?.message ||
    payload?.body?.response ||
    payload?.body?.text ||
    payload?.data?.message ||
    payload?.data?.text ||
    payload?.data?.response ||
    (typeof payload === 'string' ? payload : JSON.stringify(payload).substring(0, 100)) ||
    '(No message found)'
  );
}

// Run tests
testWebhookConnectivity().catch((error) => {
  console.error('Test runner error:', error);
  process.exit(1);
});
