# 🚀 DEPLOYMENT CHECKLIST - AI Voice Agent

## Pre-Deployment Verification

### ✅ Code Quality Checks
- [x] Build test: `npm run build` ✅ PASSED
- [x] TypeScript check: `npm run type-check` ✅ PASSED
- [x] Security audit: `npm audit` ✅ 0 vulnerabilities
- [x] Linting: ESLint configured
- [x] All dependencies resolved
- [x] No unused code or imports

### ✅ Environment Configuration
- [x] `.env.local` properly configured with test/development keys
- [x] `.env.example` has complete documentation
- [x] All secrets using `process.env.*` (server-side only)
- [x] Feature flags set for production
- [x] Debug mode disabled for production
- [x] Mock responses disabled

### ✅ API Integration
- [x] Chat endpoint: n8n webhook + OpenAI fallback
- [x] TTS: ElevenLabs (server-side) + Web Speech API fallback
- [x] STT: Deepgram + Web Speech API fallback
- [x] Webhook URL properly configured
- [x] API timeout: 30 seconds
- [x] Error handling: Comprehensive across all routes

### ✅ Frontend Implementation
- [x] Voice recording component
- [x] Chat interface
- [x] Recording timer
- [x] Voice visualizer
- [x] Microphone button with states
- [x] Message history display
- [x] Settings page
- [x] Sidebar navigation
- [x] Mobile responsive design
- [x] All animations working

### ✅ Backend Routes
- [x] `/api/chat` - AI chat endpoint
- [x] `/api/speech-to-text` - STT processing
- [x] `/api/text-to-speech` - TTS generation
- [x] `/api/history` - Conversation history
- [x] `/api/session` - Session management
- [x] `/api/realtime` - WebSocket ready

---

## Vercel Deployment Steps

### Step 1: Prepare Vercel Account
```
1. Go to https://vercel.com
2. Sign up or login with GitHub
3. Create a new project
```

### Step 2: Connect GitHub Repository
```
1. Click "New Project"
2. Select "Import Git Repository"
3. Authorize GitHub access
4. Select the "AI voice AGENT" repository
5. Click "Import"
```

### Step 3: Set Environment Variables
**In Vercel Dashboard → Project Settings → Environment Variables:**

Add these production environment variables:

```
Name: OPENAI_API_KEY
Value: [Your OpenAI API Key]
Environments: Production

Name: ELEVENLABS_API_KEY
Value: [Your ElevenLabs API Key]
Environments: Production

Name: ELEVENLABS_VOICE_ID
Value: 21m00Tcm4TlvDq8ikWAM
Environments: Production

Name: AI_WEBHOOK_URL
Value: your-n8n-webhook-url-here
Environments: Production

Name: NEXT_PUBLIC_DEBUG_MODE
Value: false
Environments: Production
```

### Step 4: Configure Build Settings
**Vercel should auto-detect these:**
- Framework: Next.js ✅
- Build Command: `npm run build` ✅
- Output Directory: `.next` ✅
- Install Command: `npm install` ✅

### Step 5: Deploy
```
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Deployment complete! You'll get a URL like:
   https://your-project-name.vercel.app
```

---

## API Key Setup

### Get OpenAI API Key
1. Visit https://platform.openai.com
2. Sign up or login
3. Go to API Keys section
4. Create new API key
5. Copy the key (starts with `sk-`)
6. Add to Vercel as `OPENAI_API_KEY`

### Get ElevenLabs API Key
1. Visit https://elevenlabs.io
2. Sign up or login
3. Go to API section
4. Copy your API key
5. Add to Vercel as `ELEVENLABS_API_KEY`

### Verify n8n Webhook (Optional)
1. n8n URL: https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI (production)
2. This should be in `AI_WEBHOOK_URL` environment variable
3. If webhook is down, OpenAI fallback will handle it

---

## Post-Deployment Testing

### Verify Deployment
```
1. Open https://your-app-name.vercel.app
2. Browser should load without errors
3. Check console for any runtime errors
```

### Test Voice Features
```
1. Click "READY" button to arm recording
2. Click microphone to start recording
3. Speak a question (e.g., "What's the weather?")
4. Wait for AI response
5. Should hear voice response played back
6. Message should appear in conversation
```

### Test API Endpoints
```
# Test chat endpoint
curl -X POST https://your-app-name.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","history":[]}'

# Expected response:
# {"success":true,"data":{"message":"AI response here","service":"n8n-webhook"},"timestamp":"..."}
```

### Check Logs
```
1. In Vercel dashboard
2. Click your project
3. Go to "Deployments"
4. Click latest deployment
5. Go to "Logs" tab
6. Check for any errors
7. Should see successful API calls
```

---

## Troubleshooting

### If deployment fails:

**Build Error**
- Check build logs in Vercel
- Verify `npm run build` works locally
- Ensure all dependencies are in package.json
- Check TypeScript errors: `npm run type-check`

**Runtime Error**
- Check Vercel logs for error messages
- Verify environment variables are set
- Test API endpoints manually with curl
- Check if third-party APIs are accessible

**Voice Not Working**
- Verify OPENAI_API_KEY is set
- Verify ELEVENLABS_API_KEY is set
- Check if n8n webhook is accessible
- Browser console might have more details

### Common Issues

**502 Bad Gateway**
- Usually means AI service is down
- Check if n8n webhook is accessible
- OpenAI fallback should kick in
- Check API status pages

**Timeout**
- API call taking too long (>30s)
- Check if third-party services are responding
- Verify network connectivity
- Check rate limits

**No Voice Output**
- ElevenLabs API key might be invalid
- Voice ID might not exist
- Browser might not support Web Audio API
- Check browser console for errors

---

## Monitoring & Maintenance

### Weekly Checks
- [ ] Visit deployed app
- [ ] Test voice recording
- [ ] Check Vercel analytics
- [ ] Review error logs

### Monthly Updates
- [ ] Check for dependency updates: `npm outdated`
- [ ] Review security advisories: `npm audit`
- [ ] Update API keys if needed
- [ ] Monitor usage/costs

### Performance Optimization
- [ ] Enable caching where possible
- [ ] Monitor deployment times
- [ ] Check Core Web Vitals
- [ ] Optimize image assets

---

## Rollback Procedure

If deployment has issues:

```
1. In Vercel dashboard
2. Go to Deployments
3. Click on a previous successful deployment
4. Click "Promote to Production"
5. Or: git revert to previous commit and redeploy
```

---

## Success Criteria

✅ **Deployment is successful when:**
- [ ] App loads without errors
- [ ] Voice recording works
- [ ] AI responds to questions
- [ ] Voice playback works
- [ ] Chat history displays
- [ ] Settings page accessible
- [ ] Mobile layout responsive
- [ ] No console errors
- [ ] API endpoints respond correctly
- [ ] Third-party services connected

---

## Support Resources

**Documentation**
- README.md - Full project guide
- DEPLOYMENT_GUIDE.md - Detailed setup
- .env.example - Environment template
- QUICK_REFERENCE.md - Quick commands

**APIs**
- OpenAI Docs: https://platform.openai.com/docs
- ElevenLabs Docs: https://elevenlabs.io/docs
- Deepgram Docs: https://developers.deepgram.com
- n8n Webhook Docs: https://docs.n8n.io

**Help & Issues**
- GitHub Issues - Report bugs
- Vercel Support - Deployment help
- Community Discord - Get help

---

**Status**: 🟢 READY FOR PRODUCTION DEPLOYMENT

Last Updated: $(date)
