# 🚀 Vercel Production Deployment Guide

## Overview
Once your app works locally, deploying to Vercel takes 5 minutes.

---

## Prerequisites
- [ ] App working locally: http://localhost:3000
- [ ] Chat responds to messages
- [ ] Voice recording works
- [ ] Voice playback works
- [ ] `npm run build` passes without errors
- [ ] GitHub repository: https://github.com/huroorkee2010/VOICE-AI-AGENT-

---

## Step 1: Connect to Vercel (If Not Done)

### Option A: First Time Setup
1. Go: https://vercel.com
2. Click "Sign up" or "Log in with GitHub"
3. Click "New Project"
4. Click "Import Git Repository"
5. Find and select: `huroorkee2010/VOICE-AI-AGENT-`
6. Click "Import"

### Option B: Already Connected
1. Go: https://vercel.com/dashboard
2. Find your project
3. Continue to Step 2

---

## Step 2: Add Environment Variables

1. In Vercel Dashboard:
   - Click your project
   - Go to "Settings"
   - Click "Environment Variables" (left sidebar)

2. Add each variable:

### Variable 1: OpenAI API Key
```
Name: OPENAI_API_KEY
Value: sk-proj-your-real-key
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### Variable 2: ElevenLabs API Key
```
Name: ELEVENLABS_API_KEY
Value: your-real-elevenlabs-key
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### Variable 3: ElevenLabs Voice ID
```
Name: ELEVENLABS_VOICE_ID
Value: 21m00Tcm4TlvDq8ikWAM
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### Variable 4: n8n Webhook URL
```
Name: AI_WEBHOOK_URL
Value: https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### Variable 5: Debug Mode (Production = false)
```
Name: NEXT_PUBLIC_DEBUG_MODE
Value: false
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### Optional - Variable 6: Deepgram
```
Name: DEEPGRAM_API_KEY
Value: your-deepgram-key (if you have it)
Environments: ✅ Production, ✅ Preview, ✅ Development
```

**Important**: 
- Make sure to select ALL three environments
- Click "Save" for each variable

---

## Step 3: Verify Build Configuration

Vercel should auto-detect these. Verify in "Settings" → "Build & Development Settings":

```
Framework: Next.js ✅
Build Command: npm run build ✅
Output Directory: .next ✅
Install Command: npm install ✅
```

If different, update them.

---

## Step 4: Deploy

### Method 1: Auto-Deploy (Recommended)
1. Go to "Deployments" tab
2. Click "Redeploy" on latest deployment
3. Or: Push a commit to GitHub → auto-redeploys

### Method 2: Manual Deploy
1. Go to "Deployments" tab
2. Click "Import Git Repository"
3. Choose branch: `main`
4. Click "Deploy"

### Wait for Build
- Build takes 2-3 minutes
- You'll see build logs
- Success: Green checkmark ✅

---

## Step 5: Get Your Production URL

After successful deployment:
- URL appears at top: `https://your-project-name.vercel.app`
- Copy this URL

---

## Step 6: Test Production

1. Open your Vercel URL: `https://your-project-name.vercel.app`
2. Try same tests as local:
   - [ ] Page loads without errors
   - [ ] Send text message → AI responds
   - [ ] Record voice → AI responds
   - [ ] Voice plays back
   - [ ] All features work

---

## Step 7: Check Production Logs

If something doesn't work:

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments" tab
4. Click latest deployment
5. Go to "Logs" tab
6. Look for errors

**Common Log Patterns:**
```
✅ Good: "Chat response" and "success: true"
❌ Bad: "ENOENT" or "Cannot find module"
❌ Bad: "API_KEY not configured"
```

---

## Production URL Customization

### Use a Custom Domain
1. In Vercel Settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS setup instructions

### Example Domains
- `voiceagent.yourdomain.com`
- `ai-voice.your-company.com`

---

## Monitoring & Maintenance

### Daily Checks
- [ ] App is accessible
- [ ] Features respond quickly
- [ ] No error logs

### Weekly Checks
- [ ] Test voice recording
- [ ] Test AI responses
- [ ] Check Vercel analytics

### Monitor Usage
1. In Vercel Dashboard
2. Go to "Usage" tab
3. Check function invocations and bandwidth
4. Set alerts if needed

---

## Troubleshooting Production Issues

### Problem: "502 Bad Gateway"
**Cause**: Service unavailable
**Solution**:
1. Check if n8n webhook is up
2. Check if OpenAI API is responding
3. Check Vercel logs for details

### Problem: "Environment variable not found"
**Cause**: Variable not set in Vercel
**Solution**:
1. Go to Vercel Settings → Environment Variables
2. Verify all required variables are set
3. Redeploy: Deployments → Redeploy

### Problem: "API key invalid"
**Cause**: Wrong API key format or key revoked
**Solution**:
1. Get a fresh API key from OpenAI/ElevenLabs
2. Update in Vercel Settings
3. Redeploy

### Problem: "Build failed"
**Cause**: TypeScript or dependency error
**Solution**:
1. Run local build: `npm run build`
2. Fix errors locally first
3. Push to GitHub
4. Vercel will redeploy automatically

---

## Performance Optimization

### Enable Caching
In Vercel Settings → "Build & Development Settings":
- Node.js version: Latest (18 or higher)
- Enable "Skew Protection" for instant deployment

### Monitor Performance
1. Vercel Analytics (automatic)
2. Check Core Web Vitals
3. Optimize images if needed

---

## Rollback to Previous Deployment

If new deployment has issues:

1. Go to "Deployments" tab
2. Find previous successful deployment
3. Click "Promote to Production"
4. Or: Go back in Git: `git revert` and push

---

## SSL/HTTPS (Automatic)

- ✅ Vercel provides free SSL certificate
- ✅ HTTPS automatically enabled
- ✅ Auto-renews every 30 days
- ✅ No action needed

---

## CI/CD Pipeline

Vercel automatically:
1. Watches GitHub repository
2. Builds on every push to `main`
3. Deploys on successful build
4. Rolls back on failed build

---

## Scaling & Limits

### Free Tier Includes:
- ✅ Up to 3 projects
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Serverless functions
- ✅ Edge middleware

### If You Need More:
- Upgrade to Pro: $20/month
- Auto-scaling included
- Priority support

---

## Success Checklist

- [ ] All environment variables set in Vercel
- [ ] Build successful (green checkmark)
- [ ] Production URL accessible
- [ ] Chat responds to messages
- [ ] Voice recording works
- [ ] Voice playback works
- [ ] No errors in Vercel logs
- [ ] All features tested

---

## Live Monitoring

### Vercel Dashboard
- Real-time deployment status
- Function invocation counts
- Edge function performance
- Error tracking

### GitHub Integration
- Auto-deploy on push
- PR previews (optional)
- Commit history linked

---

## Support & Debugging

### Vercel Docs
- https://vercel.com/docs

### Next.js Docs
- https://nextjs.org/docs/deployment/vercel

### API Services
- OpenAI Status: https://status.openai.com
- ElevenLabs Status: Check dashboard

---

**Your app is now live on the internet! 🎉**

Share your Vercel URL with others and they can use your AI Voice Agent.

---

## Next Steps

1. Monitor production for 24 hours
2. Collect feedback from users
3. Implement improvements
4. Update and redeploy as needed
5. Set up custom domain (optional)
6. Scale if needed (upgrade plan)

---

**Status**: 🟢 PRODUCTION DEPLOYED

Congratulations! Your AI Voice Agent is live! 🚀
