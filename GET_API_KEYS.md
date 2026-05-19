# 🔑 How to Get API Keys for Jarvis AI

## Current Status
✅ **Application Running**: Successfully running on http://localhost:3000  
✅ **Frontend**: Fully functional and responsive  
❌ **Backend APIs**: Currently using placeholder keys (need real keys)

---

## Step-by-Step API Key Setup

### 1️⃣ OpenAI API Key (GPT-4o)
**Purpose**: Powers the AI conversation responses

1. Go to: https://platform.openai.com/account/api-keys
2. Sign in (or create account at https://platform.openai.com/signup)
3. Click "Create new secret key"
4. Copy the key (it starts with `sk-`)
5. **Save it somewhere safe** - you won't see it again!

**Expected Key Format**: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### 2️⃣ ElevenLabs API Key (Voice Synthesis)
**Purpose**: Creates natural-sounding voice responses

1. Go to: https://elevenlabs.io
2. Click "Sign Up" (or log in)
3. Navigate to "API" section (or https://elevenlabs.io/app/account/settings)
4. Copy your API key under "API Key"
5. Note the Voice ID: `21m00Tcm4TlvDq8ikWAM` (pre-configured, no action needed)

**Expected Key Format**: `alphanumeric string (no prefix)`

---

### 3️⃣ Deepgram API Key (Speech-to-Text)
**Purpose**: Converts voice input to text

1. Go to: https://console.deepgram.com
2. Sign up (or log in)
3. Go to "API Keys" section
4. Click "Create a new API Key"
5. Copy the key

**Expected Key Format**: `similar to OpenAI format`

---

## 📝 Update .env.local File

### Option A: Using Windows Notepad
```bash
# Windows PowerShell
notepad "d:\Users\pop\Desktop\AI voice AGENT\.env.local"
```

### Option B: Using VS Code
1. Open the project in VS Code
2. Click on `.env.local` file in the explorer
3. Replace the placeholder values

### Update These Lines:
```
# Replace this:
OPENAI_API_KEY=sk-your-real-api-key-here
# With your actual key:
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Replace this:
ELEVENLABS_API_KEY=your-real-elevenlabs-api-key
# With your actual key:
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here

# Replace this (Optional - for speech-to-text):
DEEPGRAM_API_KEY=your-real-deepgram-api-key
# With your actual key:
DEEPGRAM_API_KEY=your-deepgram-api-key-here
```

---

## 🚀 After Adding API Keys

1. **The dev server will auto-reload** - no need to restart
2. **Test the chat**: Type a message in the text input or click "Hello" button
3. **Try voice input**: Click the microphone button to record
4. **Listen to responses**: The AI will respond with voice using ElevenLabs

---

## ✅ Verification Checklist

After adding API keys:

- [ ] Refreshed the browser page (F5 or Cmd+R)
- [ ] Typed a message and clicked send
- [ ] Received an AI response in the chat
- [ ] Saw the waveform animation from voice synthesis
- [ ] Tested the microphone button (if audio permissions granted)
- [ ] Tried the quick reply buttons (Hello, Time, Joke)
- [ ] Checked conversation history is saving

---

## 🆘 Troubleshooting

### Error: "OpenAI API key not configured"
- Check that `OPENAI_API_KEY` is in `.env.local` with correct format
- Make sure the key starts with `sk-`
- Restart the dev server after changing `.env.local`

### Error: "Request failed with status code 401"
- Your API key is invalid or expired
- Go back to the service dashboard and get a new key
- Check you copied the entire key without extra spaces

### Voice Not Working
- Check browser microphone permissions
- Ensure `ELEVENLABS_API_KEY` is correct
- Test audio playback in browser first

### Missing Speech-to-Text
- Set `DEEPGRAM_API_KEY` or use OpenAI Whisper instead
- Update `NEXT_PUBLIC_USE_DEEPGRAM=true` in `.env.local`

---

## 💡 Tips

- **Keep API keys secret** - Never commit `.env.local` to GitHub
- **Regenerate keys if compromised** - Go back to service dashboards
- **Use different keys for different environments** - Dev, staging, production
- **Monitor API usage** - Most services have free tier limits

---

## 📊 API Free Tier Limits

| Service | Free Tier | Cost |
|---------|-----------|------|
| **OpenAI** | $5-20 credits (limited) | ~$0.0015 per 1K tokens |
| **ElevenLabs** | 10,000 chars/month | ~$0.30 per 1M chars |
| **Deepgram** | $200 credit/month | Included or ~$0.0043 per min |

---

## ⚠️ Security Best Practices

1. **Never share API keys** in code, GitHub, or public places
2. **Use `.env.local`** which is ignored in `.gitignore`
3. **Rotate keys regularly** for production apps
4. **Use environment-specific keys** if possible
5. **Monitor API usage** for unusual activity

---

Once you have the keys in `.env.local`, your Jarvis AI Agent will be **fully functional**! 🎉
