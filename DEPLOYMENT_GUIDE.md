# 🚀 Deployment Guide - Vercel

## Overview
Your AI Voice Assistant is ready to deploy to Vercel! This guide walks you through the entire process.

---

## Step 1: Create GitHub Repository

### Option A: Using GitHub CLI (Fastest)
```bash
# Install GitHub CLI from https://cli.github.com/ first, then:
gh auth login
gh repo create jarvis-ai-voice-assistant --source=. --remote=origin --push
```

### Option B: Manual GitHub Setup
1. Go to [GitHub.com](https://github.com) and sign in
2. Click **New** (top left) → **New repository**
3. Repository name: `jarvis-ai-voice-assistant`
4. Description: `AI Voice Assistant with Jarvis AI`
5. Choose: **Public** or **Private**
6. Click **Create repository**

Then run these commands:
```bash
cd "d:\Users\pop\Desktop\AI voice AGENT"
git remote add origin https://github.com/YOUR_USERNAME/jarvis-ai-voice-assistant.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2: Environment Variables Setup

### On Vercel Dashboard:
1. Go to your project settings
2. Navigate to **Settings → Environment Variables**
3. Add these variables:

```
NEXT_PUBLIC_DEBUG_MODE=false
DEBUG_MOCK_RESPONSES=true
NEXT_PUBLIC_API_BASE_URL=/api

OPENAI_API_KEY=sk-... (your key)
ELEVENLABS_API_KEY=... (your key)
DEEPGRAM_API_KEY=... (your key)
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

**Important:** 
- `NEXT_PUBLIC_*` variables are visible in browser (OK for app URLs)
- Other variables are private (server-side only)
- Keep API keys secure - use your own keys from each service

---

## Step 3: Deploy to Vercel

### Option A: Vercel CLI (Fastest)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (from project directory)
cd "d:\Users\pop\Desktop\AI voice AGENT"
vercel
```

Follow the prompts:
- Link to GitHub repo? **Yes**
- Continue with GitHub account? **Yes**
- Deploy to existing project? **No** (first time)
- Project name: `jarvis-ai-voice-assistant`
- Framework: **Next.js**
- Root directory: `./`

### Option B: GitHub Auto-Deploy (Recommended)
1. Go to [Vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **Add New...** → **Project**
4. Search for `jarvis-ai-voice-assistant`
5. Click **Import**
6. Configure project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** ./
   - **Environment Variables:** Add from Step 2
7. Click **Deploy**

---

## Step 4: Configure Environment Variables

After deployment starts:

1. In Vercel dashboard, go to **Settings → Environment Variables**
2. Add all variables from Step 2
3. Redeploy: Click **Redeploy** in **Deployments**

---

## Step 5: Verify Deployment

Once deployment is complete:

1. **View Live Site:**
   - Click **Visit** in deployment success message
   - Or go to `https://jarvis-ai-voice-assistant-{username}.vercel.app`

2. **Test Chat:**
   - Open the assistant page
   - Send a test message
   - Verify response appears

3. **Check Logs:**
   - In Vercel dashboard: **Logs → Function Logs**
   - Look for chat API logs

---

## Step 6: Configure n8n Webhook (Optional)

If using real n8n webhook instead of mock responses:

1. Update `.env.production`:
   ```
   DEBUG_MOCK_RESPONSES=false
   ```

2. In Vercel, set environment variable:
   ```
   DEBUG_MOCK_RESPONSES=false
   ```

3. Deploy again

4. Verify n8n webhook returns proper response format

---

## Troubleshooting

### Deployment Failed?
- Check build logs in Vercel dashboard
- Verify environment variables are set
- Ensure all dependencies are in package.json

### Chat Not Working?
- Check browser console (F12)
- Check Vercel function logs
- Verify environment variables are correct

### Microphone Permissions?
- Browser may ask for permission first time
- Allow microphone access in browser settings
- HTTPS required for microphone (Vercel uses HTTPS by default)

### 502 Bad Gateway?
- Check n8n webhook is responding
- Verify webhook URL in code is correct
- Check API keys are valid

---

## Production Settings

### Recommended Configuration
```env
# Production
NEXT_PUBLIC_DEBUG_MODE=false
DEBUG_MOCK_RESPONSES=false
NEXT_PUBLIC_API_BASE_URL=/api

# Services
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
DEEPGRAM_API_KEY=...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

### Monitoring
- Enable Vercel Web Analytics
- Monitor function execution logs
- Set up error alerts

---

## Deployment Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel project created and linked
- [ ] Environment variables added
- [ ] Build succeeds (✅ No errors)
- [ ] Chat functionality works
- [ ] Response times acceptable
- [ ] Error messages display properly
- [ ] Sidebar responsive on mobile
- [ ] Microphone permissions requested

---

## Post-Deployment Steps

### 1. Custom Domain (Optional)
```
In Vercel Dashboard:
Settings → Domains → Add custom domain
```

### 2. Enable Analytics
```
In Vercel Dashboard:
Settings → Web Analytics → Enable
```

### 3. Set Up Monitoring
```
In Vercel Dashboard:
Integrations → Add monitoring tools
```

### 4. Backup & Versioning
```bash
# Keep local git repo up to date
git push origin main

# Tag releases
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

---

## Support

### Deployment Issues?
- Check [Vercel Docs](https://vercel.com/docs)
- Review build logs in dashboard
- Check environment variables

### Next.js Issues?
- Check [Next.js Docs](https://nextjs.org/docs)
- Verify API routes working
- Check React/TypeScript errors

---

## Your Project Is Ready! 🎉

**Current Status:**
- ✅ Code compiled successfully
- ✅ All fixes applied and tested
- ✅ Git repository initialized
- ✅ Ready for Vercel deployment

**Next Action:**
Follow Steps 1-3 above to deploy to Vercel!

---

**Estimated Deployment Time:** 2-5 minutes  
**Costs:** Free tier available (generous limits)  
**Auto-Scaling:** Automatic with Vercel  
**SSL/HTTPS:** Automatic certificate  
**CDN:** Automatic global distribution  

Good luck! 🚀
