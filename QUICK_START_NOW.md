# ⚡ QUICK START - GET WORKING IN 5 MINUTES

Your application is **ready to use right now**. Just add your OpenAI API key!

---

## 🎯 What You'll Do
1. Get free OpenAI API key (2 min)
2. Add to `.env.local` file (1 min)
3. Start server (1 min)
4. Test (1 min)

**Total time: 5 minutes**

---

## ✅ Step 1: Get OpenAI API Key

### Option A: New OpenAI Account
1. Go to: https://platform.openai.com/account/api-keys
2. Click **"Create new secret key"**
3. Click **"Create secret key"**
4. **COPY THE KEY** (you won't see it again)
5. Save it somewhere safe

### Option B: Existing Account
1. Go to: https://platform.openai.com/account/api-keys
2. Click **"Create new secret key"**
3. Name it: `HUVOICE-AI`
4. **COPY THE KEY**

**Key format**: Starts with `sk-proj-`

---

## ✅ Step 2: Add to .env.local

1. Open file: `.env.local`
2. Find this line:
   ```
   OPENAI_API_KEY=sk-your-real-api-key-here
   ```
3. Replace with your actual key:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
   ```
4. Save (Ctrl+S)

### Example
**Before**:
```
OPENAI_API_KEY=sk-your-real-api-key-here
```

**After**:
```
OPENAI_API_KEY=sk-proj-7HbKmZ9xY2nQpR4vL5mN0oP8qS3tU6vW
```

---

## ✅ Step 3: Start Server

### In Terminal/PowerShell:
```bash
npm run dev
```

### Expected Output:
```
✓ Compiling...
✓ Compiled successfully in 2.5s

  ▲ Next.js 16.2.6
  - Local:        http://localhost:3000
  - Environments: .env.local

Ready in 2.5s
```

---

## ✅ Step 4: Test It

### Method A: In Browser
1. Open: http://localhost:3000
2. Click **Microphone** button
3. Say: "Hello, how are you?"
4. Wait for response
5. ✅ You should hear AI response!

### Method B: Check Configuration
```bash
node scripts/check-config.js
```

Should show:
```
✅ OpenAI API Key: VALID
✅ n8n Webhook URL: CONFIGURED
```

---

## 🎉 Success!

If you hear an AI response, you're done! 

Your application is now:
- ✅ Running on http://localhost:3000
- ✅ Connected to OpenAI API
- ✅ Ready to use
- ✅ Has production webhook as fallback (when ready)

---

## 🚀 What Works Now

### Voice Chat
- 🎤 Speak message
- 🤖 AI responds
- 🔊 Hear response
- 💬 See in chat history

### Text Chat
- ⌨️ Type message
- 🤖 AI responds  
- 💬 See in chat history

### Features
- 📝 Chat history
- 🎙️ Microphone input
- 🔊 Voice output
- 💾 Save conversation
- ⚙️ Settings page
- 🌙 Dark mode

---

## 🎯 Next Steps (Optional)

### When You're Ready
1. Set up n8n webhook for custom AI logic
2. Deploy to production
3. Add more features

### But For Now
Just enjoy your working AI voice agent! 🎉

---

## ❓ Common Issues

### "The server is running, but still getting errors"

**Cause**: API key not reloaded

**Fix**:
1. Stop server (Ctrl+C)
2. Make sure `.env.local` saved correctly
3. Run: `npm run dev`
4. Try again

### "Error: OPENAI_API_KEY is invalid"

**Cause**: Key format wrong or placeholder not replaced

**Fix**:
1. Check key starts with `sk-proj-`
2. Check you removed the placeholder text
3. Check no extra spaces

### "Hearing: 'Chat request error: 0'"

**Cause**: API key is placeholder or invalid

**Fix**:
1. Run: `node scripts/check-config.js`
2. Verify OPENAI_API_KEY shows valid
3. Restart server: `npm run dev`

### "Webhook timing out message in logs"

**This is normal!** 
- Application tries n8n webhook
- Webhook isn't set up yet
- Falls back to OpenAI
- User gets response
- Everything works as intended ✅

---

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│   Your Browser (http://localhost:3000)  │
│   Voice Input / Text Output             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     Next.js Application Server          │
│     (running on your computer)          │
└──────────────┬──────────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
      ▼                 ▼
  ┌─────────┐      ┌──────────┐
  │  n8n    │ or   │ OpenAI   │
  │Webhook  │      │ API      │
  │(timeout)│      │✅ Active │
  └─────────┘      └──────────┘
```

**Default**: Uses OpenAI API (works now)  
**Optional**: Set up n8n webhook (later)

---

## 💾 Your Settings

All settings are saved in browser:
- Chat history
- Voice preferences
- UI preferences

No server storage needed (for now)

---

## 🔒 API Key Safety

✅ **Secure**:
- Key in `.env.local` (local file only)
- `.env.local` never committed to git
- Key never exposed to browser
- Used only on server-side

❌ **Unsafe** (don't do):
- Share your API key
- Commit `.env.local` to git
- Expose key in browser code

---

## 📈 API Costs

**Testing**: ~$0.10-$0.50  
**Light use**: ~$1/day  
**Heavy use**: ~$5-10/day  

Estimate: ~$1 per 1000 messages

Monitor at: https://platform.openai.com/account/usage

---

## 🎓 Learn More

### Documentation Files
- [WEBHOOK_SETUP_N8N.md](WEBHOOK_SETUP_N8N.md) - How to set up n8n
- [WEBHOOK_IMPLEMENTATION.md](WEBHOOK_IMPLEMENTATION.md) - Complete setup guide
- [README.md](README.md) - Project overview

### Resources
- OpenAI Docs: https://platform.openai.com/docs
- n8n Docs: https://docs.n8n.io
- Next.js Docs: https://nextjs.org/docs

---

## ✨ Enjoy!

You now have a working AI Voice Agent! 🚀

Say something and get an AI response. It's that simple.

When you want more advanced features, check out the other documentation files.

**Happy chatting!** 🎉

