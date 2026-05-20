# 🔧 Fix 503 Error - Service Unavailable

## ❌ What's Happening

Your app is getting a **503 Service Unavailable** error. This means:
- ❌ The API service can't process your request
- ❌ Either OpenAI, n8n webhook, or ElevenLabs is not responding

---

## 🔍 Quick Diagnosis

### Step 1: Check Your API Keys

Open `.env.local` and verify:

```bash
✅ OPENAI_API_KEY starts with "sk-proj-"
✅ Not "sk-your-real-api-key-here" (placeholder)
✅ ELEVENLABS_API_KEY is not "your-real-elevenlabs-api-key"
```

**If they're still placeholders:**
```
❌ OPENAI_API_KEY=sk-your-real-api-key-here
❌ ELEVENLABS_API_KEY=your-real-elevenlabs-api-key
```

**Solution**: Replace with real keys (see GETTING_STARTED.md)

### Step 2: Check Browser Console

Press **F12** → **Console** tab

Look for:
```
❌ 401 Unauthorized → Invalid API key
❌ 403 Forbidden → API key revoked  
❌ 502 Bad Gateway → Service temporarily down
❌ 503 Service Unavailable → Service overloaded
```

### Step 3: Check API Status

**OpenAI Status**: https://status.openai.com
- Should show: "All Systems Operational"

**ElevenLabs Status**: https://elevenlabs.io/status
- Should show: "Operational"

---

## 🛠️ Solutions by Cause

### Cause 1: Invalid/Placeholder API Key

**Symptoms:**
- Using "sk-your-real-api-key-here"
- Using "your-real-elevenlabs-api-key"

**Fix:**
1. Get real API keys:
   - OpenAI: https://platform.openai.com/account/api-keys
   - ElevenLabs: https://elevenlabs.io/settings/api-keys
2. Update `.env.local` with REAL keys
3. Restart server: `npm run dev`
4. Test again

### Cause 2: Service Temporarily Down

**Symptoms:**
- 503 error appears sometimes, then works
- Service status shows issues

**Fix:**
1. Wait 5-10 minutes
2. Try again
3. Check service status pages
4. Monitor OpenAI/ElevenLabs status

### Cause 3: API Billing Issue

**Symptoms:**
- 503 or 429 (rate limit) errors
- Billing not set up

**Fix - OpenAI:**
1. Go: https://platform.openai.com/account/billing/overview
2. Ensure "Paid account" is set up
3. Add payment method
4. Check usage/limits

**Fix - ElevenLabs:**
1. Go: https://elevenlabs.io/account/billing
2. Ensure plan is active
3. Check character usage

### Cause 4: Rate Limiting

**Symptoms:**
- 429 or 503 errors after many requests
- Too many API calls too fast

**Fix:**
1. Wait a few minutes
2. Reduce request frequency
3. Check rate limits in API dashboard
4. Upgrade plan if needed

### Cause 5: Network/Firewall Issue

**Symptoms:**
- 503 only from production (Vercel)
- Works locally
- Timeout errors

**Fix:**
1. Check if corporate firewall blocks APIs
2. Use VPN if needed
3. Check Vercel logs for specific error
4. Verify CORS headers

---

## ✅ Step-by-Step Debug Process

### Step 1: Verify Environment Variables

```bash
# Check if variables are loaded correctly
node -e "console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET')"

# Should print: OPENAI_API_KEY: SET
```

### Step 2: Test API with curl

```bash
# Test OpenAI endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","history":[]}'
```

**Expected:**
- ✅ `"success": true` with response
- ❌ `"success": false` with error message
- ❌ `503 Service Unavailable` → API down

### Step 3: Check Server Logs

When dev server runs:
```bash
npm run dev
```

Look for:
```
📨 Chat request received
🔗 Webhook URL: ✅ Configured
🤖 OpenAI Key: ✅ Configured
📤 Webhook Request: {...}
❌ Webhook error: 503
💨 Attempting fallback to OpenAI...
```

### Step 4: Enable Debug Mode

```bash
# In .env.local:
NEXT_PUBLIC_DEBUG_MODE=true

# Restart:
npm run dev

# Now browser console shows detailed logs
```

---

## 🎯 Most Common Fix

**99% of the time, 503 is because:**

```
❌ You have placeholder API keys (not real ones)
❌ API key format is wrong
❌ API key is revoked
```

**The fix:**

```bash
1. Get real API keys from OpenAI and ElevenLabs
2. Update .env.local with real keys
3. Restart: npm run dev
4. Test: Should work!
```

---

## 📋 Quick Checklist

- [ ] `.env.local` has REAL API keys (not placeholder)
- [ ] Keys start with correct format:
  - [ ] OpenAI: `sk-proj-...`
  - [ ] ElevenLabs: 40+ characters
- [ ] API services have active billing
- [ ] Server restarted after updating keys
- [ ] Browser cache cleared (Ctrl+Shift+Del)
- [ ] Checked browser console (F12)
- [ ] Checked server logs

---

## 🆘 If Still Not Working

### Option 1: Run Verification
```bash
npm run verify
```

Output shows which API keys are configured correctly.

### Option 2: Check Detailed Logs

**Browser Console (F12):**
```javascript
// Shows API response details
// Look for error messages
// Check for auth errors
```

**Server Logs:**
```bash
# Terminal running npm run dev shows:
❌ OPENAI error: 401 Unauthorized
💨 Using fallback...
```

### Option 3: Test Manually

```bash
# Replace with YOUR real OpenAI key
curl -X POST https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer sk-proj-YOUR-KEY-HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello"}],
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

If this works, your OpenAI key is valid.

---

## 📞 Getting More Help

**Check Documentation:**
1. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Fix common issues
2. [API_KEYS_SETUP.md](API_KEYS_SETUP.md) - API key setup
3. [GETTING_STARTED.md](GETTING_STARTED.md) - Complete setup

**External Resources:**
- OpenAI Status: https://status.openai.com
- OpenAI Docs: https://platform.openai.com/docs
- ElevenLabs Docs: https://elevenlabs.io/docs

---

## ✨ Expected After Fix

Once you add real API keys:

```
Local: http://localhost:3000
→ Type message
→ ✅ AI responds (no more 503!)

Production: https://your-app.vercel.app
→ Same as local
→ Works from anywhere
```

---

**Most likely fix**: You still have placeholder API keys.

**Solution**: Follow [GETTING_STARTED.md](GETTING_STARTED.md) to get real keys! 🚀
