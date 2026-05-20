# ⚡ QUICK START - Get AI Voice Agent Working in 10 Minutes

## 🎯 Your Mission
Get real API keys and activate your AI Voice Agent

---

## ⏱️ 10-Minute Setup

### Minute 1-2: Get OpenAI Key
1. Go: https://platform.openai.com/account/api-keys
2. Click "Create new secret key"
3. Copy key (looks like: `sk-proj-abc123...`)
4. ✅ Done!

### Minute 3-4: Get ElevenLabs Key
1. Go: https://elevenlabs.io
2. Sign in
3. Settings → API Keys
4. Copy the key
5. ✅ Done!

### Minute 5-6: Update `.env.local`
1. Open: `.env.local` in your code editor
2. Find: `OPENAI_API_KEY=sk-your-real-api-key-here`
3. Replace with your **real OpenAI key**
4. Find: `ELEVENLABS_API_KEY=your-real-elevenlabs-api-key`
5. Replace with your **real ElevenLabs key**
6. Save file
7. ✅ Done!

### Minute 7-8: Restart Dev Server
```bash
# Stop current server (press Ctrl+C)
# Restart:
npm run dev
```

### Minute 9-10: Test It!
1. Open: http://localhost:3000
2. Type: "Hello!"
3. ✅ AI responds!
4. Click Microphone: Record voice
5. ✅ AI responds to voice!

---

## 🔧 Getting API Keys - Step by Step

### OpenAI Setup (2 minutes)

**Step 1: Create Account**
- Go: https://platform.openai.com
- Sign up with email or Google
- Verify your email

**Step 2: Add Payment Method**
- Go: https://platform.openai.com/account/billing/overview
- Click "Set up paid account"
- Add credit card
- *(Cost: ~$0.01 per test message)*

**Step 3: Get API Key**
- Go: https://platform.openai.com/account/api-keys
- Click "Create new secret key"
- Copy immediately (you won't see it again!)
- Example: `sk-proj-Ab1Cd2Ef3Gh4Ij5Kl6Mn7Op`

### ElevenLabs Setup (1 minute)

**Step 1: Create Account**
- Go: https://elevenlabs.io
- Click "Sign up"
- Create with email
- Verify email

**Step 2: Get API Key**
- After login, click profile icon (top right)
- Select "Settings" or "Account"
- Scroll to "API Key"
- Copy the key
- Example: `abc123def456ghi789jkl000`

---

## 📝 Update `.env.local`

**Your file should look like this:**

```bash
# Replace sk-your-real-api-key-here with your actual OpenAI key
OPENAI_API_KEY=sk-proj-your-real-key-here

# Replace your-real-elevenlabs-api-key with your actual ElevenLabs key
ELEVENLABS_API_KEY=your-real-elevenlabs-key-here

# Keep this as-is (default voice)
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Keep these as-is
AI_WEBHOOK_URL=https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI
NEXT_PUBLIC_APP_NAME=HUVOICE AI Voice Agent
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_USE_OPENAI_REALTIME=true
NEXT_PUBLIC_USE_DEEPGRAM=false
NEXT_PUBLIC_USE_ELEVENLABS=true
NEXT_PUBLIC_DEBUG_MODE=false
```

---

## ✅ Verify Setup

Run this command to check if everything is set up:

```bash
npm run verify
```

**Expected output:**
```
✅ OPENAI_API_KEY - SET
✅ ELEVENLABS_API_KEY - SET
✅ ELEVENLABS_VOICE_ID - SET
✅ SETUP COMPLETE!
```

---

## 🚀 Deploy to Production

### Add to Vercel

After local testing works:

1. Go: https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add:
   ```
   OPENAI_API_KEY = sk-proj-your-key
   ELEVENLABS_API_KEY = your-key
   ELEVENLABS_VOICE_ID = 21m00Tcm4TlvDq8ikWAM
   AI_WEBHOOK_URL = https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI
   NEXT_PUBLIC_DEBUG_MODE = false
   ```
5. Redeploy
6. Test at your Vercel URL

---

## 🧪 Test Checklist

- [ ] API keys in `.env.local`
- [ ] Dev server restarted: `npm run dev`
- [ ] Opened http://localhost:3000
- [ ] Sent text message → Got AI response
- [ ] Recorded voice → AI responded
- [ ] Voice playback worked
- [ ] Environment variables in Vercel
- [ ] Vercel redeployed
- [ ] Production URL works

---

## 🎉 You're Done!

Your AI Voice Agent is now:
- ✅ Responding to text messages
- ✅ Recording voice input
- ✅ Converting speech to text
- ✅ Generating AI responses
- ✅ Playing voice responses
- ✅ Ready for production

---

## 🆘 Troubleshooting

### "AI not responding"
→ Check if `OPENAI_API_KEY` is real (not placeholder)

### "Voice not playing"
→ Check if `ELEVENLABS_API_KEY` is real (not placeholder)

### "Build fails"
→ Run `npm run build` locally to see errors

### More Help
→ See `API_KEYS_SETUP.md` for complete guide

---

**Next Step**: Get your API keys and follow the 10-minute setup above! 🚀
