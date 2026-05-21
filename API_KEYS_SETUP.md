# 🔑 Complete API Keys & Environment Setup Guide

## Table of Contents
1. [OpenAI API Key](#openai-api-key-required)
2. [ElevenLabs API Key](#elevenlabs-api-key-required)
3. [Deepgram API Key](#deepgram-api-key-optional)
4. [Local Development Setup](#local-development-setup)
5. [Vercel Production Setup](#vercel-production-setup)
6. [Verification & Testing](#verification--testing)

---

## 🟢 OpenAI API Key (REQUIRED)

### Why You Need It
The OpenAI API key is **essential** for:
- AI chat responses (fallback service)
- Natural language understanding
- Intelligent conversation

### Step 1: Create OpenAI Account
1. Visit: https://platform.openai.com
2. Click "Sign up" or "Log in"
3. Create account with email or Google/Microsoft
4. Verify your email

### Step 2: Get Your API Key
1. Go to: https://platform.openai.com/account/api-keys
2. Click "Create new secret key"
3. Copy the key immediately (you won't see it again!)
4. It looks like: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 3: Set Up Billing
1. Go to: https://platform.openai.com/account/billing/overview
2. Click "Set up paid account"
3. Add a payment method
4. Set usage limits if desired
5. **Cost**: ~$0.05 per 1000 input tokens (very cheap for testing)

### Step 4: Add to `.env.local`
```bash
OPENAI_API_KEY=sk-proj-your-full-api-key-here
```

✅ **Example** (replace with your real key):
```
OPENAI_API_KEY=sk-proj-Ab1Cd2Ef3Gh4Ij5Kl6Mn7Op8Qr9St0Uv
```

---

## 🟢 ElevenLabs API Key (REQUIRED)

### Why You Need It
ElevenLabs provides:
- High-quality AI voice synthesis
- Natural-sounding voice responses
- Multiple voice options

### Step 1: Create ElevenLabs Account
1. Visit: https://elevenlabs.io
2. Click "Sign up"
3. Create account with email
4. Verify your email

### Step 2: Get Your API Key
1. After login, click your profile icon (top right)
2. Select "Profile" or "Account"
3. Scroll to "API Key" section
4. Copy your API key

### Step 3: Copy Voice ID (Already Set)
Your app uses default voice: **21m00Tcm4TlvDq8ikWAM**
- This is a high-quality professional voice
- No changes needed

### Step 4: Set Up Credits (Optional)
1. Go to: https://elevenlabs.io/pricing
2. Select a plan (Free tier: ~10,000 characters/month)
3. Add payment if needed
4. **Cost**: Free tier included, paid plans start at $5/month

### Step 5: Add to `.env.local`
```bash
ELEVENLABS_API_KEY=your-api-key-here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

✅ **Example** (replace with your real key):
```
ELEVENLABS_API_KEY=abc123def456ghi789jkl000mno111pqr
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

---

## 🟡 Deepgram API Key (OPTIONAL)

### Why You Might Want It
Deepgram provides:
- Professional speech-to-text (STT)
- Better accuracy for voice recording
- Optional - browser Web Speech API is used as fallback

### Step 1: Create Deepgram Account
1. Visit: https://console.deepgram.com
2. Click "Sign up"
3. Create account
4. Verify email

### Step 2: Get Your API Key
1. After login, go to "API Keys" section
2. Click "Create new API key"
3. Copy the key

### Step 3: Add to `.env.local` (Optional)
```bash
DEEPGRAM_API_KEY=your-deepgram-key-here
```

⚠️ **Note**: This is optional. If not provided, the app falls back to browser Web Speech API.

---

## 📝 Local Development Setup

### Complete `.env.local` File

Create or update `d:\Users\pop\Desktop\AI voice AGENT\.env.local`:

```bash
# ============================================
# REQUIRED - AI will not work without these
# ============================================

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-real-openai-key-here

# ElevenLabs Configuration
ELEVENLABS_API_KEY=your-real-elevenlabs-key-here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# ============================================
# OPTIONAL - For enhanced features
# ============================================

# Deepgram Configuration (Optional for speech-to-text)
DEEPGRAM_API_KEY=your-real-deepgram-key-here

# n8n Webhook (Optional - already configured)
AI_WEBHOOK_URL=https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI

# ============================================
# APPLICATION CONFIGURATION
# ============================================

NEXT_PUBLIC_APP_NAME=HUVOICE AI Voice Agent
NEXT_PUBLIC_API_BASE_URL=/api

# ============================================
# FEATURE FLAGS
# ============================================

NEXT_PUBLIC_USE_OPENAI_REALTIME=true
NEXT_PUBLIC_USE_DEEPGRAM=false
NEXT_PUBLIC_USE_ELEVENLABS=true

# ============================================
# LOGGING (Production: false, Development: true)
# ============================================

NEXT_PUBLIC_DEBUG_MODE=false
```

### Verification Steps

**Step 1: Update `.env.local`**
1. Open `.env.local` in VS Code
2. Replace placeholder values with your real API keys
3. Save the file

**Step 2: Restart Development Server**
```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

**Step 3: Test in Browser**
```
http://localhost:3000
```

Try sending a message - if you see an AI response, it's working! ✅

---

## 🚀 Vercel Production Setup

### Why Vercel Needs Environment Variables
Vercel is where your app runs in production. It needs the same API keys as your local machine.

### Step 1: Connect GitHub to Vercel
1. Visit: https://vercel.com
2. Click "New Project"
3. Click "Import Git Repository"
4. Select: `huroorkee2010/VOICE-AI-AGENT-`
5. Click "Import"

### Step 2: Add Environment Variables
In Vercel Dashboard:

**Path**: Project Settings → Environment Variables

Add each variable:

#### Variable 1: OpenAI API Key
```
Name: OPENAI_API_KEY
Value: sk-proj-your-real-key-here
Environments: Production, Preview, Development
```

#### Variable 2: ElevenLabs API Key
```
Name: ELEVENLABS_API_KEY
Value: your-real-elevenlabs-key-here
Environments: Production, Preview, Development
```

#### Variable 3: ElevenLabs Voice ID
```
Name: ELEVENLABS_VOICE_ID
Value: 21m00Tcm4TlvDq8ikWAM
Environments: Production, Preview, Development
```

#### Variable 4: n8n Webhook URL
```
Name: AI_WEBHOOK_URL
Value: your-n8n-webhook-url-here
Environments: Production, Preview, Development
```

#### Variable 5: Debug Mode
```
Name: NEXT_PUBLIC_DEBUG_MODE
Value: false
Environments: Production, Preview, Development
```

#### Variable 6 (Optional): Deepgram API Key
```
Name: DEEPGRAM_API_KEY
Value: your-real-deepgram-key-here
Environments: Production, Preview, Development
```

### Step 3: Deploy to Production
1. Click "Deploy" button in Vercel
2. Wait for build to complete (2-3 minutes)
3. You'll get a production URL like: `https://your-app-name.vercel.app`

---

## ✅ Verification & Testing

### Test 1: Local Development Test

**Test Chat Response:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, how are you?","history":[]}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "I'm doing well! How can I help you today?"
  },
  "service": "n8n-webhook" or "openai",
  "timestamp": 1234567890
}
```

**Test Text-to-Speech:**
```bash
curl -X POST http://localhost:3000/api/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","voiceId":"21m00Tcm4TlvDq8ikWAM"}' \
  -o audio.mp3
```

Expected: Audio file (audio.mp3) is created

### Test 2: Browser UI Test

1. Open http://localhost:3000
2. Look for "Voice Assistant" at the top
3. You should see "READY ON" button
4. Try these:
   - **Type a message** → AI should respond below
   - **Click Microphone** → Record voice → AI should respond
   - **Listen to voice** → Audio should play

### Test 3: Production (Vercel) Test

1. Open your Vercel URL: `https://your-app-name.vercel.app`
2. Repeat browser tests above
3. Should work identically to local

### Test 4: Check Logs

**Local Development:**
- Open browser console (F12)
- Look for API responses
- Check for any error messages

**Vercel Production:**
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click latest deployment
5. Go to "Logs" tab
6. Should show successful API calls

---

## 🔍 Troubleshooting

### AI Not Responding

**Problem**: Message sent but no response

**Solution**:
1. Check if `OPENAI_API_KEY` is set in `.env.local`
2. Verify key is real (starts with `sk-`)
3. Check OpenAI billing is set up
4. Restart dev server: `npm run dev`
5. Check browser console (F12) for errors

### Voice Not Playing

**Problem**: AI responds but no voice

**Solution**:
1. Check if `ELEVENLABS_API_KEY` is set
2. Verify key is real
3. Check browser audio permissions (allow speaker)
4. Try in Chrome/Firefox (best support)
5. Check browser console for errors

### Build Fails on Vercel

**Problem**: Deployment fails

**Solution**:
1. Check environment variables in Vercel Settings
2. Make sure API keys have no extra spaces
3. Run local build test: `npm run build`
4. Check Vercel deployment logs for specific error

### 502 Bad Gateway

**Problem**: Getting 502 error when sending message

**Solution**:
1. n8n webhook might be down
2. App should fallback to OpenAI (should still work)
3. Check if OpenAI API key is valid
4. Restart the app

---

## 📊 Cost Overview

### OpenAI
- **Free tier**: $5 credit (expires after 3 months)
- **Production**: ~$0.005 per message (very cheap)
- **Pricing**: https://openai.com/pricing

### ElevenLabs
- **Free tier**: 10,000 characters/month
- **Starter**: $5/month, 50,000 characters
- **Pricing**: https://elevenlabs.io/pricing

### Deepgram
- **Free tier**: Included in account
- **Production**: Pay-as-you-go after free tier
- **Pricing**: https://deepgram.com/pricing

### Vercel
- **Free tier**: Included for small projects
- **Pro**: $20/month
- **Pricing**: https://vercel.com/pricing

**Total Estimated Cost**: $5-10/month for full setup

---

## ✨ Success Checklist

- [ ] OpenAI API key created and working
- [ ] ElevenLabs API key created and working
- [ ] `.env.local` updated with real keys
- [ ] Local dev server restarted
- [ ] Chat response working locally
- [ ] Voice playback working locally
- [ ] Vercel environment variables added
- [ ] Vercel deployment successful
- [ ] Production chat working
- [ ] Production voice working

---

## 🆘 Need Help?

### Getting API Keys
- **OpenAI Help**: https://help.openai.com/
- **ElevenLabs Docs**: https://elevenlabs.io/docs
- **Deepgram Docs**: https://developers.deepgram.com

### Vercel Deployment
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

### Project Issues
- Check GitHub: https://github.com/huroorkee2010/VOICE-AI-AGENT-
- Review error logs in Vercel dashboard

---

**Status**: Ready for complete setup! Follow steps above to get your AI Voice Agent fully functional. 🚀
