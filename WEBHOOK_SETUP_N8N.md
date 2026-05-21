# 🚀 Production Webhook Setup Guide

## Webhook URL
```
https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI
```

---

## Current Status

✅ **Webhook URL**: Configured as production default  
✅ **Fallback**: OpenAI API (automatic if webhook fails)  
⚠️ **Webhook Instance**: Needs to be set up in n8n  

---

## How It Works

### With Webhook (Primary)
```
User Message → n8n Webhook → Custom AI Logic → Response
```

### Without Webhook (Fallback)
```
User Message → OpenAI API → GPT-3.5 Turbo → Response
```

---

## 🔧 Option 1: Use Without Webhook (Recommended for Quick Start)

This is the simplest option and works immediately:

1. **Get OpenAI API Key**
   - Go to: https://platform.openai.com/account/api-keys
   - Create new secret key
   - Copy it

2. **Add to .env.local**
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
   ```

3. **Save and restart**
   ```bash
   npm run dev
   ```

4. **Test**
   - Open http://localhost:3000
   - Click microphone or type
   - AI responds using OpenAI

**Cost**: ~$0.10-$0.50 for testing  
**Setup Time**: 5 minutes  
**Works**: ✅ Immediately

---

## ⚙️ Option 2: Set Up n8n Webhook (Advanced)

If you want to use custom AI logic with n8n:

### Step 1: Create n8n Account

1. Go to: https://app.n8n.io
2. Sign up or log in
3. Create new workflow

### Step 2: Create n8n Workflow

**Workflow Setup**:
```
Webhook Trigger
    ↓
Parse Input (message, history)
    ↓
Call OpenAI / Custom Logic
    ↓
Format Response
    ↓
Return Response
```

### Step 3: Add Webhook Trigger

1. In n8n, click **"+"** to add node
2. Search for **"Webhook"**
3. Select **"Webhook" trigger**
4. Configure:
   - **HTTP Method**: POST
   - **Path**: `/webhook/HUVOICE-AI`
   - **Response Code**: 200

### Step 4: Process Message

Add an **HTTP Request** node to call OpenAI:

```json
{
  "method": "POST",
  "url": "https://api.openai.com/v1/chat/completions",
  "headers": {
    "Authorization": "Bearer YOUR_OPENAI_KEY",
    "Content-Type": "application/json"
  },
  "body": {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "{{ $json.message }}"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 500
  }
}
```

### Step 5: Format Response

Add a **Set** node to format output:

```json
{
  "message": "{{ $json.choices[0].message.content }}",
  "timestamp": "{{ now.toISOString() }}"
}
```

### Step 6: Return Response

Add a **Respond to Webhook** node:
- **Status Code**: 200
- **Response**: Body (from Set node)

### Step 7: Activate & Test

1. Click **"Activate"** (blue toggle)
2. Copy webhook URL from trigger node
3. Test with cURL:
   ```bash
   curl -X POST https://app.n8n.io/webhook/xxxxx \
     -H "Content-Type: application/json" \
     -d '{"message":"Hello","history":[]}'
   ```

### Step 8: Use in Application

If your webhook URL is different:
```bash
export AI_WEBHOOK_URL="https://your-n8n-instance.com/webhook/your-path"
npm run dev
```

---

## 📊 Workflow Diagram

### Simple n8n Setup
```
┌─────────────┐
│   Webhook   │  (receives POST request)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│Parse Input  │  (extract message)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Call APIs  │  (OpenAI, custom logic)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Format    │  (prepare response)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Respond    │  (send back JSON)
└─────────────┘
```

---

## 🧪 Testing Webhook

### Test 1: Configuration
```bash
node scripts/check-config.js
```

### Test 2: Webhook Diagnostics
```bash
node scripts/webhook-diagnostic.js
```

### Test 3: Manual cURL
```bash
curl -X POST https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, world!",
    "history": [],
    "timestamp": "2024-01-15T10:00:00Z"
  }'
```

### Test 4: In-App Test
```bash
npm run dev
# Open http://localhost:3000
# Click microphone and test
```

---

## 🎯 Expected Response Format

The webhook should return one of these formats:

**Format 1: Message Field**
```json
{
  "message": "Hello! How can I help?"
}
```

**Format 2: Text Field**
```json
{
  "text": "Hello! How can I help?"
}
```

**Format 3: Response Field**
```json
{
  "response": "Hello! How can I help?"
}
```

**Format 4: Nested**
```json
{
  "body": {
    "message": "Hello! How can I help?"
  }
}
```

The application will automatically detect and use any of these formats.

---

## ⚠️ Troubleshooting

### Webhook Timeout
```
Error: Webhook taking too long to respond
```
**Solution**:
- Check n8n workflow is deployed and active
- Review n8n workflow execution logs
- Optimize workflow for faster response
- App will use OpenAI fallback

### Webhook Not Reachable
```
Error: Cannot reach webhook URL
```
**Solution**:
- Verify webhook URL is correct
- Check n8n instance is running
- Confirm webhook is activated
- Test URL with cURL first

### Response Parse Error
```
Error: No response message in webhook payload
```
**Solution**:
- Ensure webhook returns JSON with "message" field
- Check response format matches expected formats
- Test webhook response with n8n tools

### Authentication Error
```
Error: 401 Unauthorized
```
**Solution**:
- Verify OpenAI API key in n8n workflow is correct
- Check API key has proper permissions
- Verify API key has credits/billing

---

## 📈 Performance Tips

1. **Webhook Timeout**: Set to 10 seconds (application default)
   - Too long: User waits too long for response
   - Too short: Legitimate requests fail
   - Sweet spot: 10 seconds

2. **Response Time**
   - Target: < 3 seconds
   - Acceptable: < 10 seconds
   - Too slow: Falls back to OpenAI

3. **Caching** (optional)
   - Cache common questions in n8n
   - Use workflows to optimize response time

4. **Fallback Strategy**
   - Always ensure OpenAI key is set
   - Webhooktimeout auto-triggers fallback
   - Users get response either way

---

## 🔐 Security

### Webhook Security
- Keep webhook URL private if possible
- Don't expose in client code (it's in env var)
- Monitor webhook usage
- Rate-limit if needed

### API Keys Security
- Store API keys in `.env.local` (not committed)
- Use different keys for dev/prod
- Rotate keys periodically
- Never log API keys

---

## 📋 Setup Checklist

### Quick Start (OpenAI Only)
- [ ] Get OpenAI API key
- [ ] Add to `.env.local`
- [ ] Run `npm run dev`
- [ ] Test at http://localhost:3000

### With n8n Webhook
- [ ] Create n8n account
- [ ] Create webhook trigger
- [ ] Add OpenAI call node
- [ ] Format response node
- [ ] Activate workflow
- [ ] Test with cURL
- [ ] Verify in application
- [ ] Monitor logs

---

## 🚀 Next Steps

### Immediate
```bash
npm run dev
# Application works with OpenAI fallback
```

### Later (Optional)
```bash
# Set up n8n webhook when ready
# Configure custom AI logic
# Deploy to production
```

---

## 📞 Support

### Webhook Not Working?
1. Check it's actually deployed in n8n
2. Test with curl command above
3. Review n8n execution logs
4. Check application console logs

### Still Having Issues?
1. Run diagnostic: `node scripts/webhook-diagnostic.js`
2. Check `.env.local` has OPENAI_API_KEY
3. Restart server: `npm run dev`
4. Check browser console for errors

---

## ✨ Summary

| Feature | Status | Setup Time |
|---------|--------|-----------|
| OpenAI Fallback | ✅ Works | 5 min |
| n8n Webhook | ⚙️ Optional | 20+ min |
| Production Ready | ✅ Yes | Now |

Your application works **right now** with OpenAI!

---

**Start Simple**: Use OpenAI fallback, add webhook later if needed.

