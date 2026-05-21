#!/usr/bin/env node

/**
 * Configuration Checker for HUVOICE AI Voice Agent
 * Validates all required API keys and configuration
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(80));
console.log('🔍 HUVOICE AI CONFIGURATION CHECKER');
console.log('='.repeat(80) + '\n');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf-8');
} catch (error) {
  console.error('❌ ERROR: .env.local file not found!');
  console.error(`   Expected at: ${envPath}`);
  process.exit(1);
}

// Parse env file
const parseEnv = (content) => {
  const env = {};
  content.split(/\r?\n/).forEach((line) => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        env[key] = value;
      }
    }
  });
  return env;
};

const env = parseEnv(envContent);

console.log('📋 CONFIGURATION STATUS:\n');

// Check OpenAI API Key
const openaiKey = env.OPENAI_API_KEY;
const hasValidOpenAI = openaiKey && 
  !openaiKey.includes('your-real') && 
  !openaiKey.includes('sk-proj-xxxxx') &&
  openaiKey !== 'undefined' &&
  openaiKey.startsWith('sk-');

console.log('1️⃣  OpenAI API Key:');
if (!openaiKey) {
  console.log('   ❌ NOT FOUND in .env.local');
  console.log('   📖 Get key at: https://platform.openai.com/account/api-keys');
} else if (!hasValidOpenAI) {
  console.log('   ⚠️  PLACEHOLDER VALUE (not a real key)');
  console.log('   Current value:', openaiKey);
  console.log('   📖 Get real key at: https://platform.openai.com/account/api-keys');
} else {
  console.log('   ✅ VALID - Real API key configured');
  console.log('   Key preview:', openaiKey.substring(0, 20) + '...');
}

// Check ElevenLabs API Key
const elevenLabsKey = env.ELEVENLABS_API_KEY;
const hasValidElevenLabs = elevenLabsKey && 
  !elevenLabsKey.includes('your-real') && 
  elevenLabsKey !== 'undefined';

console.log('\n2️⃣  ElevenLabs API Key (Optional - for voice):');
if (!elevenLabsKey) {
  console.log('   ⚠️  NOT CONFIGURED');
  console.log('   📖 Get key at: https://elevenlabs.io/app/account/settings');
} else if (!hasValidElevenLabs) {
  console.log('   ⚠️  PLACEHOLDER VALUE (not a real key)');
  console.log('   Current value:', elevenLabsKey);
} else {
  console.log('   ✅ VALID - Real API key configured');
}

// Check Webhook
const webhookUrl = env.AI_WEBHOOK_URL || 'https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI';
console.log('\n3️⃣  n8n Webhook URL:');
if (webhookUrl === 'your-n8n-webhook-url-here' || !webhookUrl) {
  console.log('   ⚠️  PLACEHOLDER OR NOT CONFIGURED');
  console.log('   Will use production default: https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI');
} else {
  console.log('   ✅ CONFIGURED');
  console.log('   URL:', webhookUrl);
}

// Summary
console.log('\n' + '='.repeat(80));
console.log('📊 SUMMARY:\n');

if (hasValidOpenAI) {
  console.log('✅ Application is READY to use!');
  console.log('   - OpenAI API key is valid');
  console.log('   - Can process text and voice requests');
  if (hasValidElevenLabs) {
    console.log('   - ElevenLabs is configured for voice responses');
  } else {
    console.log('   - Will use browser voice for responses (optional)');
  }
  console.log('\n   Start server: npm run dev');
  console.log('   Open browser: http://localhost:3000');
} else {
  console.log('❌ CONFIGURATION ERROR - Application CANNOT run yet\n');
  console.log('Required:');
  console.log('  1. Get OpenAI API key from: https://platform.openai.com/account/api-keys');
  console.log('  2. Replace "sk-your-real-api-key-here" in .env.local with your actual key');
  console.log('  3. Save the file');
  console.log('  4. Restart the dev server: npm run dev\n');
  
  console.log('Optional:');
  console.log('  - Get ElevenLabs key for better voice responses');
  console.log('  - Configure custom n8n webhook if needed');
}

console.log('\n' + '='.repeat(80) + '\n');

// Exit with appropriate code
process.exit(hasValidOpenAI ? 0 : 1);
