# 🚀 HUVOICE AI - Setup & Configuration Guide

## Current Status: ❌ Configuration Required

The application is installed but **not yet configured** with API keys. You need to set up your credentials before the application can work.

---

## 🔧 Quick Setup (5 Minutes)

### Step 1: Get OpenAI API Key
1. Go to: **https://platform.openai.com/account/api-keys**
2. Sign in with your OpenAI account (or create one)
3. Click **"Create new secret key"**
4. Copy the key (it starts with `sk-proj-`)

### Step 2: Update .env.local File
1. Open: `d:\Users\pop\Desktop\AI voice AGENT\.env.local`
2. Find this line:
   ```
   OPENAI_API_KEY=sk-your-real-api-key-here
   ```
3. Replace with your actual key:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
   ```
4. **Save the file** (Ctrl+S)

### Step 3: Restart the Server
```bash
# Press Ctrl+C to stop the current server
# Then run:
npm run dev
```

### Step 4: Test the Application
1. Open: http://localhost:3000
2. Click the microphone button
3. Say something (e.g., "Hello")
4. The AI should respond!

---

## ✅ Verification

Run this command to verify your configuration:
```bash
node scripts/check-config.js
```

You should see:
```
✅ OpenAI API Key: VALID - Real API key configured
✅ Application is READY to use!
```

---

## 🎤 Optional: Add Voice Capabilities

To enable voice responses (not just text), get an ElevenLabs API key:

### Get ElevenLabs Key
1. Go to: **https://elevenlabs.io**
2. Sign up for free
3. Go to **Account > API keys**
4. Copy your API key

### Update .env.local
```
ELEVENLABS_API_KEY=your-actual-api-key-here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

---

## 🌐 Webhook Configuration

The application is pre-configured to use:
```
https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI
```

**This requires your own n8n account setup.** If you don't have n8n set up, the application will automatically fall back to OpenAI API, which is fine for testing and regular use.

---

## 🆘 Troubleshooting

### "Chat request error: 0"
**Cause**: API keys are not configured (still showing placeholder values)

**Solution**:
1. Run: `node scripts/check-config.js`
2. If you see `❌ PLACEHOLDER VALUE`, your API keys are not set up
3. Follow **Step 1-3** above to add real keys
4. Restart the server

### "Webhook error" or "OpenAI API error"
**Cause**: API key is invalid or rate-limited

**Solution**:
1. Verify your API key is correct (copy-paste carefully)
2. Check your OpenAI account has credits/billing enabled
3. Wait a few minutes if you see rate-limit errors

### "Speech-to-text not working"
**Cause**: Deepgram not configured (optional service)

**Solution**: Either:
- Get a Deepgram API key from https://console.deepgram.com
- OR use the browser's built-in Web Speech API (default, works fine)

---

## 📚 API Key Sources

| Service | Cost | Link | Time to Setup |
|---------|------|------|---|
| OpenAI (GPT-4) | $0.10 per 1M input tokens | [Get Key](https://platform.openai.com/account/api-keys) | 2 min |
| ElevenLabs (Voice) | Free tier available | [Get Key](https://elevenlabs.io/app/account/settings) | 2 min |
| Deepgram (STT) | Free tier available | [Get Key](https://console.deepgram.com) | 2 min |
| n8n (Webhook) | Self-hosted or cloud | [n8n.io](https://n8n.io) | 10+ min |

---

## 🎯 Free Testing Options

If you don't have API keys yet, you can:

1. **Try OpenAI's free trial** ($5 credit)
   - Enough to test the application thoroughly
   - Sign up at: https://platform.openai.com/signup

2. **Use ElevenLabs free tier**
   - 10,000 characters/month free
   - Perfect for testing voice

3. **Use Deepgram free tier** (optional)
   - 50,000 requests/month free

---

## ✨ What Works After Setup

After adding your OpenAI API key, you'll have:

✅ **Text Chat** - Type or speak, get AI responses  
✅ **Speech Recognition** - Speak naturally, AI understands  
✅ **Conversation History** - All chats are saved  
✅ **Voice Settings** - Customize AI voice (with ElevenLabs)  
✅ **Export Conversations** - Download chat history  

---

## 🚀 Next Steps

1. **Get OpenAI API key** (2 minutes)
2. **Update .env.local** (1 minute)
3. **Restart server** (`npm run dev`)
4. **Test the app** (1 minute)

**Total setup time: ~5 minutes**

---

## 📞 Support

If you're stuck:
1. Run: `node scripts/check-config.js`
2. Read the error message carefully
3. Check the troubleshooting section above
4. Verify your API key is correct (no extra spaces)

---

## 📖 Additional Resources

- **OpenAI Docs**: https://platform.openai.com/docs
- **ElevenLabs Docs**: https://elevenlabs.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **n8n Docs**: https://docs.n8n.io

---

**You're almost there! Just add your API keys and you'll be ready to go.** 🎉

