# 🔧 Troubleshooting Guide - Fix Common Issues

## Quick Diagnosis

Start here if something isn't working:

---

## ❌ "AI is not responding to my messages"

### Symptoms
- Message sent but no response appears
- Browser shows loading spinner then nothing

### Diagnosis Steps

**Step 1: Check API Keys**
```bash
# Open .env.local and verify:
✅ OPENAI_API_KEY starts with "sk-proj-"
✅ ELEVENLABS_API_KEY is not placeholder
✅ ELEVENLABS_VOICE_ID = 21m00Tcm4TlvDq8ikWAM
```

**Step 2: Check Browser Console**
```
Press: F12 → Console tab
Look for errors like:
❌ 401 Unauthorized → API key invalid
❌ 403 Forbidden → API key revoked
❌ 502 Bad Gateway → Service down
```

**Step 3: Verify Dev Server**
```bash
# Stop server (Ctrl+C) and restart:
npm run dev
# Should show: "ready - started server on 0.0.0.0:3000"
```

**Step 4: Test API Directly**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Test","history":[]}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "Hello! How can I help?"
  },
  "service": "n8n-webhook" or "openai"
}
```

### Solutions

| Error | Cause | Fix |
|-------|-------|-----|
| 401/403 | Invalid API key | Get new key from OpenAI |
| 502 Bad Gateway | Service down | n8n fails, OpenAI fallback should work |
| 404 Not Found | Endpoint not found | Restart dev server |
| CORS Error | Browser blocking | Check server logs |
| Empty response | No message in response | Check API response format |

---

## ❌ "Voice is not being played back"

### Symptoms
- AI responds in chat but no audio
- Recording works but no playback

### Diagnosis Steps

**Step 1: Check ElevenLabs Key**
```bash
# In .env.local verify:
✅ ELEVENLABS_API_KEY set (not placeholder)
✅ NEXT_PUBLIC_USE_ELEVENLABS=true
```

**Step 2: Check Browser Audio**
```
1. Open DevTools (F12)
2. Console tab
3. Type: navigator.mediaDevices.getUserMedia
4. Should not show error
```

**Step 3: Check Audio Permissions**
```
Browser → Settings → Privacy → Microphone
Ensure: site has permission to use audio
```

**Step 4: Test TTS Endpoint**
```bash
curl -X POST http://localhost:3000/api/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","voiceId":"21m00Tcm4TlvDq8ikWAM"}' \
  -o test.mp3
```

Expected: `test.mp3` file created and playable

### Solutions

| Issue | Cause | Fix |
|-------|-------|-----|
| No audio file | ElevenLabs key invalid | Verify key in .env.local |
| Audio file 404 | API endpoint error | Restart dev server |
| Audio won't play | Browser blocks autoplay | User must click "play" |
| Low volume | Audio level setting | Check system volume |

---

## ❌ "Voice recording is not working"

### Symptoms
- Microphone button doesn't record
- No visual feedback when clicking mic
- Recording stops immediately

### Diagnosis Steps

**Step 1: Check Permissions**
```
Browser → Microphone permission
Must show: "Allow" or "Ask"
Not: "Block"
```

**Step 2: Test Microphone Access**
```javascript
// Paste in DevTools Console:
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log("✅ Mic works"))
  .catch(e => console.log("❌ Mic error:", e.message))
```

**Step 3: Check Browser Support**
```
✅ Chrome: Full support
✅ Firefox: Full support
✅ Safari: Full support
⚠️ IE: Not supported
```

**Step 4: Check Audio Recorder Hook**
```bash
# In browser DevTools Console:
// Type and send a voice message
// Watch for logs showing recording progress
```

### Solutions

| Error | Cause | Fix |
|-------|-------|-----|
| "Permission denied" | Microphone blocked | Allow in browser settings |
| "No audio input" | No microphone connected | Connect microphone |
| Records but no playback | Recording works, playback fails | Check TTS section |
| Silent recording | Microphone muted | Unmute in system audio |

---

## ❌ "Page shows errors or warnings"

### Symptoms
- Red errors in console (F12)
- Page partially broken
- Console warnings visible

### Common Errors & Fixes

**Error: "Cannot find module 'react'"**
```bash
# Solution:
npm install
npm run dev
```

**Error: "process is not defined"**
```bash
# Solution:
# This is normal, doesn't affect functionality
# Shows in browser console but app still works
```

**Error: "localStorage is not defined"**
```bash
# Solution:
# Normal in dev, doesn't affect app
# Only happens if you open DevTools immediately
```

**Warning: "Missing dependency in useEffect"**
```bash
# Solution:
# Add the dependency or // eslint-disable-next-line
npm run lint -- --fix
```

**Error: "TypeScript compile error"**
```bash
# Check what's wrong:
npm run type-check

# Fix issues:
# - Add type annotations
# - Import missing dependencies
# - Check file paths
```

---

## ❌ "Build fails or won't compile"

### Symptoms
- `npm run build` shows errors
- Deployment fails on Vercel
- TypeScript errors appear

### Diagnosis Steps

**Step 1: Run Local Build**
```bash
npm run build
# Shows all errors
```

**Step 2: Run Type Check**
```bash
npm run type-check
# Shows TypeScript errors
```

**Step 3: Clean and Rebuild**
```bash
rm -r .next node_modules package-lock.json
npm install
npm run build
```

### Common Build Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Module not found" | Missing dependency | npm install [package] |
| "Unexpected token" | Syntax error | Check file syntax |
| "Type error" | TypeScript issue | Add types or fix imports |
| "Memory exceeded" | Out of RAM | Increase Node memory or split build |

---

## ❌ "App works locally but not on Vercel"

### Symptoms
- Works on http://localhost:3000
- Fails on Vercel URL
- 502 errors or blank page

### Diagnosis Steps

**Step 1: Check Vercel Environment Variables**
```
Vercel Dashboard → Settings → Environment Variables
Verify ALL these are set:
✅ OPENAI_API_KEY
✅ ELEVENLABS_API_KEY
✅ ELEVENLABS_VOICE_ID
✅ NEXT_PUBLIC_DEBUG_MODE
```

**Step 2: Check Vercel Logs**
```
Vercel Dashboard → Deployments → Latest → Logs
Look for:
❌ Error messages
❌ Build failures
❌ Runtime errors
```

**Step 3: Rebuild**
```
Vercel Dashboard → Deployments
Click "Redeploy" on latest deployment
Wait for build to complete
```

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "env var not found" | Variable not set in Vercel | Add in Settings |
| "Module not found" | Dependency missing | npm install then push |
| "CORS error" | API being blocked | Check API headers |
| 502 Bad Gateway | API service down | Check API status page |

---

## ❌ "Getting 502 Bad Gateway"

### Symptoms
- Error: "502 Bad Gateway"
- n8n webhook might be down
- But should fallback to OpenAI

### Diagnosis Steps

**Step 1: Check n8n Webhook Status**
```
Try: your-n8n-webhook-url-here
Should get response or auth error (not 502)
```

**Step 2: Check OpenAI Status**
```
Visit: https://status.openai.com
Should show: "All Systems Operational"
```

**Step 3: Check Your API Keys**
```bash
# Verify in .env.local:
✅ OPENAI_API_KEY is valid
✅ Not empty
✅ Not placeholder
```

### Solutions

```
502 = Service Unavailable
This means:
1. n8n webhook is down (temporary)
2. OpenAI should be handling requests
3. If still failing: API key might be invalid
4. Or: Service is having issues

Wait 5 minutes and try again
```

---

## ❌ "Getting CORS Error"

### Symptoms
- Error: "CORS policy: blocked"
- API call fails in browser
- Works with curl

### Diagnosis Steps

**Step 1: Check API Response Headers**
```javascript
// In DevTools Console:
fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'test', history: [] })
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.log('Error:', e))
```

**Step 2: Verify Endpoints**
```
Endpoints should be:
✅ /api/chat
✅ /api/text-to-speech
✅ /api/speech-to-text

Not:
❌ http://different-domain/api/...
❌ https://external-api/...
```

### Solution

CORS errors usually mean:
- Local dev: Add CORS headers to API routes
- Production: Use same domain (Vercel handles this)

---

## ❌ "Production deployment not working"

### Checklist

- [ ] All environment variables set in Vercel
- [ ] Variables selected for all environments (prod/preview/dev)
- [ ] Build completes without errors
- [ ] No 502 errors in logs
- [ ] API keys are real (not test/placeholder)
- [ ] API keys have active billing
- [ ] Domain/URL is accessible
- [ ] Features tested on production URL

### Fix Steps

```bash
1. npm run verify  # Check local setup
2. npm run build   # Test build locally
3. npm run dev     # Test locally
4. git push        # Verify Vercel redeploys
5. Check Vercel logs
6. Test production URL
```

---

## 💡 Debug Mode

### Enable Detailed Logging

**Local Development:**
```bash
# In .env.local:
NEXT_PUBLIC_DEBUG_MODE=true

# Then restart:
npm run dev

# Now console shows detailed logs
```

**What You'll See:**
```
📨 Chat request received
🔗 Webhook URL: ✅ Configured
🤖 OpenAI Key: ✅ Configured
📤 Webhook Request: {...}
📥 Webhook Response: {...}
✅ Chat response: "Hello!"
```

### Disable for Production
```bash
# In Vercel Settings:
NEXT_PUBLIC_DEBUG_MODE=false

# Prevents sensitive info in console
```

---

## 🆘 Still Broken?

### Debugging Checklist

- [ ] Checked `.env.local` has real keys
- [ ] Restarted dev server
- [ ] Ran `npm run verify`
- [ ] Checked browser console (F12)
- [ ] Tested API endpoint with curl
- [ ] Cleared browser cache (Ctrl+Shift+Del)
- [ ] Tried different browser
- [ ] Checked API service status

### Get Help

1. **Check Logs**: `npm run dev` and watch console
2. **Read Docs**: `API_KEYS_SETUP.md`, `QUICK_START_SETUP.md`
3. **GitHub Issues**: Create issue with error message
4. **API Support**: Contact OpenAI/ElevenLabs support

---

## ✅ Verification Script

Run this to diagnose everything:

```bash
npm run verify
```

Output shows:
- ✅ Which keys are configured
- ❌ Which are missing
- ⚠️ Which are optional
- Next steps to fix

---

**Most issues are fixed by:**
1. Adding real API keys
2. Restarting dev server
3. Clearing browser cache
4. Running `npm run verify`

Try these first! 🚀
