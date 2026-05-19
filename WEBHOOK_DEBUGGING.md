# Webhook Debugging Guide - Jarvis AI Voice Assistant

## Current Status
- ✅ **Webhook URL is reachable**: `https://huassist2010.app.n8n.cloud/webhook/jarvis-ai` (HTTP 200)
- ❌ **Webhook returns empty response body** (0 bytes)
- ❌ **AI responses not returned** to the chatbox

## The Problem
The n8n workflow is configured to accept requests, but it's not returning any data in the response. This causes a 502 error in the frontend.

### Server Logs Show:
```
📨 Chat request received: { message: 'Hello, how are you?', historyLength: 0 }
🔗 Forwarding to webhook: https://huassist2010.app.n8n.cloud/webhook/jarvis-ai
📦 Webhook response status: 200
📦 Webhook response length: 0
📦 Webhook response preview: 
⚠️  Webhook returned empty response (200 OK but no body)
```

## Solution: Configure n8n Workflow to Return Data

### Step 1: Check Your n8n Webhook Trigger
1. Open n8n dashboard: https://huassist2010.app.n8n.cloud
2. Open the "jarvis-ai" workflow
3. Check the **Webhook trigger node** settings
4. Ensure "Respond with" is set to **"Last node output"** or **"Expression"**

### Step 2: Ensure Workflow Returns AI Response

Your n8n workflow should look like:
```
[Webhook Trigger] 
    ↓
[Chat message input from webhook]
    ↓
[OpenAI node / LLM node] 
    ↓
[Return Response node OR Response mapping]
    ↓
[Back to client]
```

### Step 3: Expected Response Format

The webhook should return **one of these** formats:
```json
// Option 1 - Explicit message field
{ "message": "Hello! I'm doing well, thank you for asking." }

// Option 2 - Text field
{ "text": "Hello! I'm doing well, thank you for asking." }

// Option 3 - Response field
{ "response": "Hello! I'm doing well, thank you for asking." }

// Option 4 - Output field
{ "output": "Hello! I'm doing well, thank you for asking." }

// Option 5 - Data object with message
{ "data": { "message": "Hello! I'm doing well, thank you for asking." } }

// Option 6 - Plain string (will be wrapped as text)
"Hello! I'm doing well, thank you for asking."
```

### Step 4: Fix n8n Workflow

In the last node of your workflow (before responding to webhook):

**If using a response node:**
- Set response to map the AI output to one of the fields above

**If using expressions:**
- Add: `{ "message": "{{$json.output}}" }` where `$json.output` is the AI response field

**If using a Function node:**
- Return: `return { message: data[0].message }` where `message` contains the AI response

### Step 5: Test the Webhook

1. Open terminal
2. Run this command (replace with your message):
```bash
curl -X POST https://huassist2010.app.n8n.cloud/webhook/jarvis-ai \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, how are you?"}'
```

Expected response:
```json
{
  "message": "Hello! I am doing well. How can I assist you today?"
}
```

### Step 6: Test in Jarvis AI

Once the webhook returns proper data:
1. Return to http://localhost:3003/assistant
2. Click "Hello" button
3. AI should respond in the chatbox

## Debugging Information

### Files Changed in Frontend:
- `app/api/chat/route.ts` - Added detailed logging
- `lib/api-client.ts` - Added error logging
- `hooks/useVoiceChat.ts` - Added better error messages

### Server Console Logs:
- 📨 `Chat request received` - Frontend sent a message
- 🔗 `Forwarding to webhook` - Server proxying to n8n
- 📦 `Webhook response status` - n8n returned this status
- 📦 `Webhook response length` - How many bytes in response
- 🎯 `Extracted AI message` - Message found in response
- ✅ `Chat response successful` - Response sent to frontend
- ❌ Error messages with details about what failed

### Frontend Console Logs:
- 📤 `Sending chat message` - Frontend initiated request
- ❌ `Chat request error` - API returned error
- ❌ `AI response error` - Complete error stack trace

## Manual Testing Commands

### Test webhook directly:
```bash
# Send test message
curl -X POST https://huassist2010.app.n8n.cloud/webhook/jarvis-ai \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'

# Check if webhook exists
curl -i https://huassist2010.app.n8n.cloud/webhook/jarvis-ai
```

### Test frontend API:
```bash
# Send test to Next.js API
curl -X POST http://localhost:3003/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'

# Expected response if working:
# {"success":true,"data":{"message":"Your AI response here"},"timestamp":1234567890}
```

## Common Issues & Fixes

| Issue | Cause | Solution |
|-------|-------|----------|
| Empty response body | n8n workflow not configured to return data | See Step 2-4 above |
| 404 Not Found | Webhook URL is wrong or n8n workflow not published | Check webhook URL and publish workflow |
| 500 Server Error | n8n workflow has an error | Check n8n workflow logs |
| CORS error | Cross-origin issue | Server proxy handles this - should not occur |
| Timeout (>30s) | n8n workflow is slow or OpenAI timeout | Optimize workflow or increase timeout |

## Quick Fix Checklist

- [ ] Webhook is published in n8n (yellow/active)
- [ ] Last node in workflow outputs data
- [ ] Response contains `message` or `text` field
- [ ] n8n is not rate-limited (check account quota)
- [ ] OpenAI/LLM API key is valid in n8n
- [ ] Test with curl command (see above)
- [ ] Frontend dev server is running on correct port
- [ ] Browser console shows detailed error logs

## Need Help?

1. Check n8n workflow execution history for errors
2. Look at browser DevTools Console tab for errors
3. Check Next.js terminal for server logs
4. Test webhook with curl command
5. Verify n8n workflow is "Active" (published)

---

**Status**: Waiting for n8n workflow configuration  
**Last Updated**: 2026-05-19  
**Next Step**: Configure n8n to return response data in one of the formats above
