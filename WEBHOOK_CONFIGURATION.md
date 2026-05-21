# Production Webhook Configuration Guide

## Active Production Webhook URL
```
https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI
```

## Configuration

### Default Behavior
- The webhook URL is **built into the application** as the default
- The application will automatically use this URL when `AI_WEBHOOK_URL` environment variable is not set
- No configuration needed for production deployment

### Override Configuration
To use a different webhook URL, set the environment variable:
```bash
export AI_WEBHOOK_URL="https://your-custom-webhook-url.com/webhook"
```

### Environment Setup

#### Development (.env.local)
```env
# Optional - will use production default if not set
AI_WEBHOOK_URL=https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI

# Required
OPENAI_API_KEY=sk-...
```

#### Production (Vercel/Environment Variables)
```
AI_WEBHOOK_URL = https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI
OPENAI_API_KEY = sk-...
```

## Testing Webhook Connectivity

### Method 1: Automated Test Script
```bash
node scripts/test-webhook.js
```

This will:
- Test simple message
- Test message with history
- Test complex queries
- Show response times and success rates

### Method 2: Manual cURL Test
```bash
curl -X POST https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, how are you?","history":[]}'
```

Expected response (200 OK):
```json
{
  "message": "Hello! I'm doing well, thank you for asking...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Method 3: Application Test
```bash
npm run dev
# Visit http://localhost:3000
# Click microphone and test voice input
```

## Webhook Endpoint Details

**URL**: `https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI`

**Method**: `POST`

**Headers**:
```
Content-Type: application/json
User-Agent: HUVOICE-AI-Client/1.0
```

**Request Body**:
```json
{
  "message": "User message here",
  "history": [
    {
      "role": "user",
      "content": "Previous user message"
    },
    {
      "role": "assistant",
      "content": "Previous assistant response"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response Formats Supported**:
```json
{
  "message": "Response text",
  "text": "Response text",
  "response": "Response text",
  "reply": "Response text",
  "output": "Response text",
  "content": "Response text"
}
```

## Monitoring & Logging

### Server-side Logs
The application logs detailed webhook activity:
- `✅ WEBHOOK CONFIGURATION:` - Initial config on startup
- `🔗 Webhook URL:` - Webhook URL being used
- `📤 Webhook Request:` - Request details being sent
- `📥 Webhook Raw Response:` - Response received
- `✅ Webhook response parsed successfully:` - Successful parse
- `❌ Webhook fetch error:` - Any errors encountered

### Client-side Logs
Check browser console for:
- `📤 Sending chat message` - Request initiated
- `❌ Chat request error` - API errors
- `✅ AI response received` - Success

## Health Checks

### Is the webhook reachable?
```bash
curl -i https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI
```

### Is the webhook responding correctly?
```bash
curl -X POST https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI \
  -H "Content-Type: application/json" \
  -d '{"message":"test","history":[]}'
```

### Check application configuration
```bash
# On server startup, look for:
✅ WEBHOOK CONFIGURATION: {
  production: 'https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI',
  active: 'https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI',
  isCustom: false
}
```

## Troubleshooting

### Webhook not responding
1. Check webhook URL is correct
2. Verify n8n workflow is active and running
3. Check n8n workflow triggers and settings
4. Review n8n execution logs
5. Test with cURL command above

### Wrong response format
1. Verify n8n workflow output matches expected format
2. Check webhook response parsing in `app/api/chat/route.ts`
3. Add custom response extraction for your format

### Timeouts
- Default timeout: 30 seconds
- If webhook takes longer, increase timeout in `app/api/chat/route.ts`
- Consider optimizing n8n workflow

### Fallback to OpenAI
- If webhook fails, app automatically uses OpenAI API
- Ensure `OPENAI_API_KEY` is set for fallback
- Check logs for webhook failure reason

## Deployment Checklist

- [x] Production webhook URL configured
- [ ] Webhook accessible from production server
- [ ] n8n workflow is active
- [ ] Test webhook with automated script
- [ ] Monitor webhook response times
- [ ] Set up error logging and alerts

## Support

For webhook issues, check:
1. **n8n Dashboard**: `https://app.n8n.cloud`
2. **Workflow Status**: Ensure workflow is active
3. **Execution Logs**: Check recent executions
4. **Server Logs**: See console output from app startup

---

**Last Updated**: May 21, 2024
**Webhook Status**: ✅ Active and Configured
**Version**: 1.0
