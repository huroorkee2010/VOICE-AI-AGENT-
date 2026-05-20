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
  if (!value || isPlaceholder(value)) {
    log.error(`${name} - NOT SET`);
    if (description) log.info(description);
    checksFailed++;
    return false;
  } else {
    checksPassed++;
    return true;
  }
}

function checkOptional(name, value, description = '') {
  if (!value || isPlaceholder(value)) {
    // Skip optional warnings
  } else {
    checksPassed++;
  }
}

// Main verification
async function verify() {
  log.title('🔍 API Keys & Environment Verification');
  
  // Read .env.local
  const envPath = path.join(__dirname, '.env.local');
  const envData = readEnv(envPath);
  
  // Check required API keys
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
  checkOptional(
    'DEEPGRAM_API_KEY',
    envData.DEEPGRAM_API_KEY,
    'Optional - Get from: https://console.deepgram.com/'
  );
  
  // Check configuration
  if (envData.AI_WEBHOOK_URL) {
    checksPassed++;
  } else {
    log.info('AI_WEBHOOK_URL - Using default n8n webhook');
  }
  
  if (envData.NEXT_PUBLIC_APP_NAME) {
    checksPassed++;
  }
  if (envData.NEXT_PUBLIC_DEBUG_MODE === 'false') {
    checksPassed++;
  }
  
  // Summary - Clean, simple output
  log.title('Verification Result');
  log.blank();
  
  if (checksFailed > 0) {
    log.error(`Setup incomplete - ${checksFailed} issue(s) found`);
    log.blank();
    log.info('To fix: Add API keys to .env.local and restart dev server');
    log.info('See: GETTING_STARTED.md for detailed instructions');
    log.blank();
    process.exit(1);
  } else {
    log.success('All checks passed - Setup complete!');
    log.blank();
    log.info('You can now: npm run dev');
    log.blank();
    process.exit(0);
  }
}

// Run verification
verify().catch(error => {
  log.error(`Verification failed: ${error.message}`);
  process.exit(1);
});
