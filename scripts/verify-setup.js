#!/usr/bin/env node

/**
 * 🔍 API Keys & Environment Verification Script
 * 
 * Usage: npm run verify
 * 
 * This script checks:
 * ✅ API keys are set (not placeholders)
 * ✅ Environment variables are loaded
 * ✅ All required services are configured
 * ✅ Production readiness
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset}  ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ️${colors.reset}  ${msg}`),
  title: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
  blank: () => console.log(''),
};

let checksPassed = 0;
let checksFailed = 0;

// Helper functions
function isPlaceholder(value) {
  if (!value) return true;
  const placeholders = [
    'your-real',
    'sk-your-real',
    'replace-',
    'placeholder',
    'example',
    'test-key',
  ];
  return placeholders.some(p => value.toLowerCase().includes(p));
}

function readEnv(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key) {
          env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
    return env;
  } catch (e) {
    return {};
  }
}

function checkRequired(name, value, description = '') {
  log.blank();
  if (!value || isPlaceholder(value)) {
    log.error(`${name} - NOT SET`);
    if (description) log.info(description);
    checksFailed++;
    return false;
  } else {
    const masked = value.substring(0, 10) + '...' + value.substring(value.length - 5);
    log.success(`${name} - SET (${masked})`);
    checksPassed++;
    return true;
  }
}

function checkOptional(name, value, description = '') {
  log.blank();
  if (!value || isPlaceholder(value)) {
    log.warning(`${name} - NOT SET (optional)`);
    if (description) log.info(description);
  } else {
    const masked = value.substring(0, 10) + '...' + value.substring(value.length - 5);
    log.success(`${name} - SET (${masked})`);
    checksPassed++;
  }
}

// Main verification
async function verify() {
  log.title('🔍 API Keys & Environment Verification');
  
  // Read .env.local
  const envPath = path.join(__dirname, '.env.local');
  const envData = readEnv(envPath);
  
  log.info(`Reading from: ${envPath}`);
  
  // Check required API keys
  log.title('📋 REQUIRED API KEYS');
  
  checkRequired(
    'OPENAI_API_KEY',
    envData.OPENAI_API_KEY,
    'Get from: https://platform.openai.com/account/api-keys'
  );
  
  checkRequired(
    'ELEVENLABS_API_KEY',
    envData.ELEVENLABS_API_KEY,
    'Get from: https://elevenlabs.io/account/settings/api-keys'
  );
  
  checkRequired(
    'ELEVENLABS_VOICE_ID',
    envData.ELEVENLABS_VOICE_ID,
    'Default: 21m00Tcm4TlvDq8ikWAM'
  );
  
  // Check optional API keys
  log.title('🟡 OPTIONAL API KEYS');
  
  checkOptional(
    'DEEPGRAM_API_KEY',
    envData.DEEPGRAM_API_KEY,
    'Optional - Get from: https://console.deepgram.com/'
  );
  
  // Check configuration
  log.title('⚙️  APPLICATION CONFIGURATION');
  
  log.blank();
  if (envData.AI_WEBHOOK_URL) {
    log.success(`AI_WEBHOOK_URL - ${envData.AI_WEBHOOK_URL}`);
    checksPassed++;
  } else {
    log.info('AI_WEBHOOK_URL - Using default n8n webhook');
  }
  
  log.blank();
  if (envData.NEXT_PUBLIC_APP_NAME) {
    log.success(`NEXT_PUBLIC_APP_NAME - ${envData.NEXT_PUBLIC_APP_NAME}`);
    checksPassed++;
  }
  
  log.blank();
  if (envData.NEXT_PUBLIC_DEBUG_MODE === 'false') {
    log.success('NEXT_PUBLIC_DEBUG_MODE - false (Production ready)');
    checksPassed++;
  } else if (envData.NEXT_PUBLIC_DEBUG_MODE === 'true') {
    log.warning('NEXT_PUBLIC_DEBUG_MODE - true (Development mode)');
  } else {
    log.info('NEXT_PUBLIC_DEBUG_MODE - Not set');
  }
  
  // Summary
  log.title('📊 VERIFICATION SUMMARY');
  
  log.blank();
  log.success(`Checks passed: ${checksPassed}`);
  log.blank();
  
  if (checksFailed > 0) {
    log.error(`Checks failed: ${checksFailed}`);
    log.blank();
    log.title('❌ SETUP INCOMPLETE');
    log.info('You need to add the REQUIRED API keys before the app will work.');
    log.blank();
    log.info('Steps:');
    log.info('1. Get API keys from the services listed above');
    log.info('2. Update .env.local with your real keys');
    log.info('3. Restart dev server: npm run dev');
    log.info('4. Run this script again to verify');
    log.info('5. See API_KEYS_SETUP.md for detailed instructions');
    log.blank();
    process.exit(1);
  } else {
    log.title('✅ SETUP COMPLETE!');
    log.info('All required API keys are configured.');
    log.blank();
    log.info('Next steps:');
    log.info('1. Restart dev server: npm run dev');
    log.info('2. Open http://localhost:3000');
    log.info('3. Test: Send a message - AI should respond!');
    log.info('4. For production: Add same keys to Vercel environment variables');
    log.blank();
    process.exit(0);
  }
}

// Run verification
verify().catch(error => {
  log.error(`Verification failed: ${error.message}`);
  process.exit(1);
});
