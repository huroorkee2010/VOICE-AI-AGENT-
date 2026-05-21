#!/usr/bin/env node

/**
 * Production Webhook Diagnostic & Test Tool
 * Tests the n8n webhook connectivity, response format, and error handling
 */

const https = require('https');
const http = require('http');

const WEBHOOK_URL = 'https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI';

console.log('\n' + '='.repeat(80));
console.log('🧪 PRODUCTION WEBHOOK DIAGNOSTIC TEST');
console.log('='.repeat(80));
console.log(`📍 Webhook URL: ${WEBHOOK_URL}`);
console.log(`⏱️  Testing at: ${new Date().toISOString()}`);
console.log('='.repeat(80) + '\n');

async function fetchWithTimeout(url, options, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const timeoutId = setTimeout(() => {
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);

    const req = protocol.request(url, options, (res) => {
      clearTimeout(timeoutId);
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({ status: res.statusCode, statusText: res.statusMessage, data, headers: res.headers });
      });
    });

    req.on('error', (error) => {
      clearTimeout(timeoutId);
      reject(error);
    });

    req.end();
  });
}

async function testWebhookConnectivity() {
  console.log('Test 1️⃣: Webhook Connectivity\n');
  
  try {
    const startTime = Date.now();
    
    const payload = JSON.stringify({
      message: 'Hello, testing webhook connectivity',
      history: [],
      timestamp: new Date().toISOString(),
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'HUVOICE-AI-Diagnostic/1.0',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const response = await fetchWithTimeout(WEBHOOK_URL, options, 15000);
    const duration = Date.now() - startTime;

    console.log(`✅ Webhook is REACHABLE`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Response Time: ${duration}ms`);
    console.log(`   Response Size: ${response.data.length} bytes`);
    
    let responseData;
    try {
      responseData = JSON.parse(response.data);
      console.log(`   Format: JSON`);
    } catch {
      console.log(`   Format: Text/Plain`);
      responseData = { raw: response.data };
    }

    if (response.status === 200 || response.status === 201) {
      console.log(`   ✅ HTTP Status: Success (${response.status})`);
      return { success: true, duration, response: responseData };
    } else {
      console.log(`   ⚠️  HTTP Status: ${response.status} (not success)`);
      return { success: false, duration, status: response.status, error: response.data.substring(0, 200) };
    }

  } catch (error) {
    console.log(`❌ Webhook is NOT REACHABLE`);
    console.log(`   Error: ${error.message}`);
    console.log(`   Type: ${error.constructor.name}`);
    return { success: false, error: error.message };
  }
}

async function testResponseFormat() {
  console.log('\n\nTest 2️⃣: Response Format\n');

  const testMessages = [
    'Hello',
    'What is 2+2?',
    'Tell me a joke',
  ];

  for (const message of testMessages) {
    console.log(`Testing message: "${message}"`);
    
    try {
      const payload = JSON.stringify({
        message,
        history: [],
        timestamp: new Date().toISOString(),
      });

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'HUVOICE-AI-Diagnostic/1.0',
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      const response = await fetchWithTimeout(WEBHOOK_URL, options, 15000);
      
      let responseData;
      try {
        responseData = JSON.parse(response.data);
      } catch {
        responseData = { raw: response.data };
      }

      // Try to extract message from response
      const extractedMessage = 
        responseData?.response ||
        responseData?.message ||
        responseData?.text ||
        responseData?.reply ||
        responseData?.output ||
        responseData?.answer ||
        responseData?.result ||
        responseData?.content ||
        responseData?.body?.message ||
        responseData?.data?.message ||
        (typeof responseData === 'string' ? responseData : null);

      if (extractedMessage) {
        console.log(`   ✅ Message extracted: ${String(extractedMessage).substring(0, 80)}...`);
      } else {
        console.log(`   ⚠️  Could not extract message from response`);
        console.log(`   Response keys: ${Object.keys(responseData).join(', ')}`);
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

async function testWithLocalServer() {
  console.log('\n\nTest 3️⃣: Local Server Integration\n');

  console.log('📝 Instructions to test with local server:');
  console.log('   1. Make sure Next.js dev server is running: npm run dev');
  console.log('   2. Open browser: http://localhost:3000');
  console.log('   3. Click microphone or type a message');
  console.log('   4. Check browser console for detailed logs');
  console.log('   5. If webhook fails, OpenAI fallback should activate');
  console.log('');
  console.log('📊 Expected behavior:');
  console.log('   ✅ Webhook attempt logged: 🔗 Step 1: Trying n8n webhook...');
  console.log('   ✅ Response parsed: ✅ Webhook response parsed successfully');
  console.log('   ✅ AI responds: AI message returned to user');
  console.log('');
  console.log('⚠️  If webhook fails:');
  console.log('   1. Check webhook URL is correct');
  console.log('   2. Verify n8n workflow is active');
  console.log('   3. Check n8n workflow response format');
  console.log('   4. App should fallback to OpenAI automatically');
}

async function runDiagnostics() {
  try {
    console.log('🔍 Running comprehensive webhook diagnostics...\n');
    
    const result1 = await testWebhookConnectivity();
    await testResponseFormat();
    await testWithLocalServer();

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 DIAGNOSTIC SUMMARY');
    console.log('='.repeat(80));

    if (result1.success) {
      console.log('✅ Webhook Connectivity: PASSED');
      console.log('   - Webhook is reachable and responding');
      console.log('   - Response time: ' + result1.duration + 'ms');
    } else {
      console.log('❌ Webhook Connectivity: FAILED');
      console.log('   - Webhook is not reachable');
      console.log('   - Error: ' + (result1.error || result1.status));
      console.log('');
      console.log('🔧 Troubleshooting:');
      console.log('   1. Check if n8n webhook URL is correct');
      console.log('   2. Verify n8n workflow is deployed and active');
      console.log('   3. Check n8n workflow settings and permissions');
      console.log('   4. Test n8n webhook directly from n8n interface');
    }

    console.log('\n' + '='.repeat(80));
    console.log('📖 NEXT STEPS');
    console.log('='.repeat(80));
    console.log('1. If webhook works: Application will use it automatically');
    console.log('2. If webhook fails: Application falls back to OpenAI API');
    console.log('3. Ensure OPENAI_API_KEY is set in .env.local for fallback');
    console.log('4. Monitor server logs for detailed error messages');
    console.log('5. Check browser console for client-side logs');
    console.log('\n' + '='.repeat(80) + '\n');

  } catch (error) {
    console.error('Diagnostic error:', error);
    process.exit(1);
  }
}

// Run diagnostics
runDiagnostics();
