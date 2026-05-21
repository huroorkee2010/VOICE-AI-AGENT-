#!/usr/bin/env node

/**
 * Complete Setup Verification Script
 * Validates all configurations and performs health checks
 */

const fs = require('fs');
const path = require('path');

console.log('\n================================================================================');
console.log('✅ HUVOICE AI - COMPLETE SETUP VERIFICATION');
console.log('================================================================================\n');

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, icon, message) {
  console.log(`${colors[color]}${icon} ${message}${colors.reset}`);
}

// 1. Check .env.local
console.log('📋 STEP 1: Configuration Files\n');

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  log('green', '✅', '.env.local exists');
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  // Check OpenAI key
  const openaiMatch = envContent.match(/OPENAI_API_KEY=(.+)/);
  const openaiKey = openaiMatch ? openaiMatch[1].trim() : '';
  
  if (!openaiKey || openaiKey === 'sk-your-real-api-key-here') {
    log('red', '❌', 'OPENAI_API_KEY: Placeholder value (NOT VALID)');
    log('yellow', '⚠️', '   Get key from: https://platform.openai.com/account/api-keys');
  } else if (openaiKey.startsWith('sk-')) {
    log('green', '✅', `OPENAI_API_KEY: Valid format (${openaiKey.substring(0, 20)}...)`);
  } else {
    log('red', '❌', 'OPENAI_API_KEY: Invalid format');
  }
  
  // Check Webhook URL
  const webhookMatch = envContent.match(/AI_WEBHOOK_URL=(.+)/);
  if (webhookMatch) {
    log('green', '✅', `Custom Webhook: ${webhookMatch[1].trim()}`);
  } else {
    log('blue', 'ℹ️', 'No custom webhook URL (will use production default)');
  }
  
  // Check ElevenLabs
  const elevenMatch = envContent.match(/ELEVENLABS_API_KEY=(.+)/);
  const elevenKey = elevenMatch ? elevenMatch[1].trim() : '';
  if (elevenKey && elevenKey !== 'your-real-elevenlabs-api-key') {
    log('green', '✅', 'ELEVENLABS_API_KEY: Configured');
  } else {
    log('blue', 'ℹ️', 'ElevenLabs: Not configured (optional)');
  }
} else {
  log('red', '❌', '.env.local file not found');
  log('yellow', '⚠️', '   Run: npm install (includes setup)');
}

console.log('\n');

// 2. Check package.json
console.log('📋 STEP 2: Dependencies\n');

const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  log('green', '✅', 'package.json exists');
  
  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    
    const requiredDeps = {
      'next': '✅ Next.js',
      'react': '✅ React',
      'typescript': '✅ TypeScript',
      'openai': '✅ OpenAI SDK',
      'zustand': '✅ Zustand (state)',
    };
    
    for (const [dep, label] of Object.entries(requiredDeps)) {
      if (pkg.dependencies?.[dep]) {
        log('green', '✅', `${label}: ${pkg.dependencies[dep]}`);
      } else {
        log('red', '❌', `${label}: Not installed`);
      }
    }
  } catch (err) {
    log('red', '❌', 'Error reading package.json');
  }
} else {
  log('red', '❌', 'package.json not found');
}

console.log('\n');

// 3. Check source files
console.log('📋 STEP 3: Source Files\n');

const criticalFiles = {
  'app/api/chat/route.ts': 'Chat API endpoint',
  'app/layout.tsx': 'Layout component',
  'hooks/useVoiceChat.ts': 'Voice chat hook',
  'lib/api-client.ts': 'API client',
  'components/assistant/MicrophoneButton.tsx': 'Microphone button',
};

let filesOk = true;
for (const [file, desc] of Object.entries(criticalFiles)) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    log('green', '✅', `${desc}`);
  } else {
    log('red', '❌', `${desc} (${file})`);
    filesOk = false;
  }
}

console.log('\n');

// 4. Production Configuration
console.log('📋 STEP 4: Production Configuration\n');

log('green', '✅', 'Production Webhook URL:');
log('cyan', '   ', 'https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI');

log('blue', 'ℹ️', 'Behavior:');
log('cyan', '   ', '• Tries webhook first (10 second timeout)');
log('cyan', '   ', '• Falls back to OpenAI if webhook fails');
log('cyan', '   ', '• User always gets a response');

console.log('\n');

// 5. Health Check Summary
console.log('📋 STEP 5: Setup Status\n');

const envContent = fs.readFileSync(envPath, 'utf-8');
const openaiMatch = envContent.match(/OPENAI_API_KEY=(.+)/);
const openaiKey = openaiMatch ? openaiMatch[1].trim() : '';
const hasValidOpenAI = openaiKey && openaiKey !== 'sk-your-real-api-key-here' && openaiKey.startsWith('sk-');

if (hasValidOpenAI) {
  log('green', '✅', 'Setup Status: READY TO RUN');
  console.log('\n🚀 Your application is ready to go!\n');
  
  console.log('Start server:');
  log('cyan', '   ', 'npm run dev\n');
  
  console.log('Then:');
  log('cyan', '   ', '1. Open http://localhost:3000');
  log('cyan', '   ', '2. Click microphone or type message');
  log('cyan', '   ', '3. Get AI response\n');
} else {
  log('yellow', '⚠️', 'Setup Status: NOT READY');
  console.log('\n📝 Required Actions:\n');
  
  if (!hasValidOpenAI) {
    console.log('1. Get OpenAI API Key');
    log('cyan', '   ', 'Go to: https://platform.openai.com/account/api-keys');
    log('cyan', '   ', 'Create new secret key\n');
    
    console.log('2. Add to .env.local');
    log('cyan', '   ', 'Replace: OPENAI_API_KEY=sk-your-real-api-key-here');
    log('cyan', '   ', 'With: OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxx\n');
    
    console.log('3. Save and restart');
    log('cyan', '   ', 'npm run dev\n');
  }
}

// 6. Troubleshooting
console.log('📋 STEP 6: Troubleshooting\n');

if (!hasValidOpenAI) {
  log('red', '❌', 'Issue: Getting "Chat request error: 0"');
  log('yellow', 'Fix:', 'Set valid OPENAI_API_KEY in .env.local');
}

if (!filesOk) {
  log('red', '❌', 'Issue: Missing source files');
  log('yellow', 'Fix:', 'Run: npm install');
}

console.log('\n');

// 7. Quick Actions
console.log('📋 STEP 7: Quick Commands\n');

console.log('Diagnostic tools:');
log('cyan', '   ', 'node scripts/webhook-diagnostic.js    # Test webhook');
log('cyan', '   ', 'node scripts/check-config.js          # Check configuration');
log('cyan', '   ', 'npm run dev                            # Start server\n');

console.log('Resources:');
log('cyan', '   ', 'QUICK_START_NOW.md        # 5-minute quick start');
log('cyan', '   ', 'WEBHOOK_SETUP_N8N.md      # How to set up n8n');
log('cyan', '   ', 'README.md                 # Full documentation\n');

// 8. Final Summary
console.log('================================================================================');
if (hasValidOpenAI) {
  log('green', '✅', 'SETUP COMPLETE - READY TO USE');
  console.log('================================================================================\n');
  console.log('Your AI Voice Agent is ready to go! 🚀\n');
  console.log('Run: npm run dev\n');
} else {
  log('yellow', '⚠️', 'SETUP INCOMPLETE - FOLLOW INSTRUCTIONS ABOVE');
  console.log('================================================================================\n');
  console.log('Complete setup in 5 minutes! See QUICK_START_NOW.md\n');
}
