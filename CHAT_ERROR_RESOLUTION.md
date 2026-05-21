# 🔧 Chat Error Resolution Guide

## Problem: "Chat request error: 0"

You're seeing this error because the application doesn't have valid API keys configured.

---

## ✅ Root Cause Analysis

The error occurs because:

1. **OpenAI API Key is a placeholder** (`sk-your-real-api-key-here`)
   - The system tries to use it to call OpenAI
   - OpenAI rejects the placeholder key
   - Error code "0" = No valid response from API

2. **Webhook also requires valid credentials**
   - The production webhook needs proper n8n setup
   - If it fails, app should fall back to OpenAI
   - But OpenAI is also failing due to placeholder key

3. **Result**: No working AI service available

---

## 🚀 Solution: 3 Options

### **Option 1: Quick Start (Recommended)**
Set up a real OpenAI API key in 5 minutes

**Steps:**
1. Go to: https://platform.openai.com/account/api-keys
2. Create a new API key
3. Copy it (looks like: `sk-proj-xxxxxxxxxxxxx`)
4. Open `.env.local` file
5. Replace:
   ```
   OPENAI_API_KEY=sk-your-real-api-key-here
   ```
   With:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
   ```
6. Save file (Ctrl+S)
7. Restart server: `npm run dev`

**Cost**: $0.10-$0.50 for testing (very cheap)  
**Time**: 5 minutes  
**Works**: ✅ Immediately

---

### **Option 2: Use Free Trial**
OpenAI gives $5 free credits for new accounts

**Steps:**
1. Go to: https://platform.openai.com/signup
2. Create a new account
3. Get your API key
4. Follow Option 1 steps 4-7

**Cost**: Free ($5 trial)  
**Time**: 10 minutes  
**Works**: ✅ For testing

---

### **Option 3: Set Up n8n Webhook**
If you have your own n8n instance

**Steps:**
1. Set up your n8n workflow at: https://n8n.io
2. Create a webhook endpoint
3. Update `.env.local`:
   ```
   AI_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-workflow
   ```
4. Still set up OpenAI key as fallback
5. Restart server

**Cost**: Free to $30/month depending on usage  
**Time**: 15+ minutes  
**Works**: ✅ If n8n is properly configured

---

## 🎯 Recommended Path

### For Testing & Learning:
```
1. Get OpenAI free trial ($5)
2. Copy API key to .env.local
3. Start using immediately
```

### For Production:
```
1. Set up both OpenAI and n8n
2. Use n8n as primary (custom AI logic)
3. Use OpenAI as fallback (reliability)
```

---

## 🔍 Verify Your Setup

After adding your API key, run this command:
```bash
node scripts/check-config.js
```

You should see:
```
✅ OpenAI API Key: VALID
✅ Application is READY to use!
```

---

## 📝 Complete .env.local Example

After setup, your `.env.local` should look like:

```env
# ============================================
# REQUIRED API KEYS
# ============================================

# OpenAI GPT-4 (REQUIRED)
OPENAI_API_KEY=sk-proj-1234567890abcdefghijklmnop

# ElevenLabs (Optional - for voice)
ELEVENLABS_API_KEY=your-actual-key-here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# ============================================
# OPTIONAL
# ============================================

# Deepgram (Optional - for STT)
DEEPGRAM_API_KEY=your-actual-key-here

# n8n Webhook (Optional - for custom AI logic)
AI_WEBHOOK_URL=https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI

# ============================================
# APPLICATION CONFIGURATION
# ============================================

NEXT_PUBLIC_APP_NAME=HUVOICE AI Voice Agent
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_USE_ELEVENLABS=true
NEXT_PUBLIC_USE_OPENAI_REALTIME=true
NEXT_PUBLIC_USE_DEEPGRAM=false
```

---

## 🧪 Test After Setup

### Method 1: Configuration Check
```bash
node scripts/check-config.js
```

### Method 2: Browser Test
1. Open: http://localhost:3000
2. Click microphone
3. Say something
4. AI should respond

### Method 3: Manual API Test
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","history":[]}'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "message": "Hello! How can I help you today?"
  }
}
```

---

## 🆘 Still Getting Error?

### Check 1: API Key Format
Your key should start with `sk-proj-` or `sk-`
- ❌ Wrong: `sk-your-real-api-key-here`
- ✅ Correct: `sk-proj-abc123xyz789`

### Check 2: File Saved
Make sure you saved `.env.local` after editing
- Press: Ctrl+S
- Look for check mark in editor tab

### Check 3: Server Restarted
After updating `.env.local`, restart the server:
```bash
# Press Ctrl+C to stop
# Then run:
npm run dev
```

### Check 4: Billing Enabled
In OpenAI account:
1. Go to: https://platform.openai.com/account/billing/overview
2. Check if you have:
   - Credits (from trial) OR
   - Valid payment method

---

## 💡 Pro Tips

### Protect Your API Key
- ❌ Never commit `.env.local` to Git
- ✅ Use `.env.local` for local secrets
- ✅ Use environment variables for production

### Monitor API Usage
- Check OpenAI dashboard: https://platform.openai.com/account/usage
- Set usage limits to avoid surprises
- Start with small amount of testing

### Save Money
- Use `gpt-3.5-turbo` instead of `gpt-4` (10x cheaper)
- To use: Change model in `app/api/chat/route.ts`
- From: `model: 'gpt-4o'`
- To: `model: 'gpt-3.5-turbo'`

---

## ✨ After Setup Works, You Can:

✅ Chat with AI using text  
✅ Speak to AI using microphone  
✅ Get spoken responses (with ElevenLabs)  
✅ Save conversation history  
✅ Export chats  
✅ Customize AI behavior  
✅ Use n8n for custom workflows  

---

## 📊 Status Summary

| Component | Status | Action |
|-----------|--------|--------|
| Application | ✅ Installed | None |
| Configuration | ❌ Missing API Keys | Add OpenAI key |
| Server | ✅ Running | Continue |
| Webhook | ⚠️ Unconfigured | Optional |
| Voice | ⚠️ Unconfigured | Optional |

---

## 🎯 Next Steps

1. **Right Now**:
   - Get OpenAI API key (5 min)
   - Add to `.env.local`
   - Restart server

2. **Later (Optional)**:
   - Add ElevenLabs for voice
   - Set up n8n webhook
   - Configure Deepgram

3. **Never**:
   - Keep placeholder keys
   - Commit `.env.local` to Git
   - Share your API keys

---

## 📚 More Information

- [SETUP_API_KEYS.md](SETUP_API_KEYS.md) - Detailed setup guide
- [WEBHOOK_CONFIGURATION.md](WEBHOOK_CONFIGURATION.md) - Webhook setup
- [WEBHOOK_QUICK_REFERENCE.md](WEBHOOK_QUICK_REFERENCE.md) - Quick reference
- [README.md](README.md) - Full documentation

---

**You're almost there!** Just add your API key and everything will work. 🎉

