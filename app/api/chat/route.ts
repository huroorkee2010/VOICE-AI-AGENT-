import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_URL =
  process.env.AI_WEBHOOK_URL ||
  process.env.NEXT_PUBLIC_AI_WEBHOOK_URL ||
  'https://huassist2010.app.n8n.cloud/webhook/huvoice-ai';
// DEBUG MODE: Set to true to use mock responses instead of real webhook
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
const USE_MOCK_RESPONSES = process.env.DEBUG_MOCK_RESPONSES === 'true';

interface ChatRequest {
  message: string;
  history?: any[];
}

// Mock AI responses for testing
const mockResponses: { [key: string]: string } = {
  'hello': 'Hello! I\'m doing great, thank you for asking! How can I help you today?',
  'how are you': 'I\'m doing wonderful! Thanks for asking. What can I assist you with?',
  'time': 'I don\'t have real-time capabilities, but you can check your system clock for the current time.',
  'joke': 'Why did the AI go to school? To improve its learning algorithms! 😄',
  'test': 'This is a test response from the mock AI. The webhook integration is working!',
  'hi': 'Hi there! Welcome to HUVOICE AI. How can I help you?',
};

function getMockResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Check for exact matches first
  if (mockResponses[lowerMessage]) {
    return mockResponses[lowerMessage];
  }
  
  // Check for keyword matches
  for (const [key, response] of Object.entries(mockResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  // Default response
  return `I received your message: "${message}". Please configure the n8n webhook to return AI responses. See WEBHOOK_DEBUGGING.md for setup instructions.`;
}

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history } = body;

    console.log('📨 Chat request received:', { message, historyLength: history?.length || 0 });

    if (!message || typeof message !== 'string') {
      console.error('❌ Invalid message format:', { message, type: typeof message });
      return NextResponse.json(
        { success: false, error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // DEBUG MODE: Return mock response
    if (DEBUG_MODE && USE_MOCK_RESPONSES) {
      console.log('🔧 DEBUG MODE ENABLED: Using mock response');
      const mockResponse = getMockResponse(message);
      return NextResponse.json(
        {
          success: true,
          data: {
            message: mockResponse,
            debug: true,
            note: 'This is a mock response. Configure real webhook in n8n.'
          },
          timestamp: Date.now(),
        },
        { status: 200 }
      );
    }

    if (!WEBHOOK_URL) {
      console.error('❌ Webhook URL not configured');
      return NextResponse.json(
        {
          success: false,
          error:
            'Webhook URL is not configured. Set AI_WEBHOOK_URL or hardcode the production webhook URL in the server proxy.',
        },
        { status: 500 }
      );
    }

    console.log('🔗 Forwarding to webhook:', WEBHOOK_URL);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const responseText = await response.text();
    console.log('📦 Webhook response status:', response.status);
    console.log('📦 Webhook response length:', responseText.length);
    console.log('📦 Webhook response preview:', responseText.substring(0, 200));

    let payload: any = {};

    // Handle empty response
    if (!responseText || responseText.trim() === '') {
      console.warn('⚠️  Webhook returned empty response (200 OK but no body)');
      // Return a diagnostic error to help user debug n8n workflow
      return NextResponse.json(
        {
          success: false,
          error: `Webhook returned empty response. The n8n workflow needs to return data. Ensure the workflow has an output node that returns the AI response in JSON format like: {"message": "your response", "text": "your response"} or {"output": "your response"}`,
        },
        { status: 502 }
      );
    }

    try {
      payload = JSON.parse(responseText);
    } catch (error) {
      console.warn('⚠️  Failed to parse webhook response as JSON:', error);
      // If it's plain text, wrap it as a message
      payload = { text: responseText };
    }


    if (!response.ok) {
      const baseMessage =
        payload?.error || payload?.message || payload?.text || `Webhook returned ${response.status}`;
      const runtimeHint =
        response.status === 404
          ? `Webhook not found at ${WEBHOOK_URL}. Confirm the n8n webhook is registered and active.`
          : response.status === 400
          ? `Webhook received invalid request. Check payload format: ${JSON.stringify({ message, history })}`
          : response.status >= 500
          ? `Webhook host returned ${response.status}. Check if the external webhook service is available.`
          : `Webhook returned error ${response.status}.`;

      console.error('❌ Webhook error:', { baseMessage, runtimeHint, status: response.status });

      return NextResponse.json(
        {
          success: false,
          error: `${baseMessage} | ${runtimeHint}`,
        },
        { status: response.status }
      );
    }

    // Extract AI message from various possible response formats
    // n8n workflows can return responses in different formats
    let aiMessage: any =
      payload?.message || 
      payload?.text || 
      payload?.reply || 
      payload?.response ||
      payload?.answer ||
      payload?.output ||
      payload?.result ||
      payload?.content ||
      payload?.data?.message ||
      payload?.data?.text ||
      payload?.data?.output ||
      payload?.body ||
      payload?.body?.message ||
      payload?.body?.text ||
      '';

    // If payload is a string, use it directly
    if (typeof payload === 'string' && payload.trim()) {
      aiMessage = payload;
    }

    // Handle cases where payload might be wrapped in unexpected structures
    if (!aiMessage && typeof payload === 'object' && Object.keys(payload).length > 0) {
      // Try to find any field with substantial content
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'string' && value.trim().length > 10) {
          aiMessage = value;
          console.log(`🔍 Found message in unexpected field "${key}":`, value.substring(0, 100));
          break;
        }
        // Check nested objects
        if (typeof value === 'object' && value !== null) {
          for (const [nestedKey, nestedValue] of Object.entries(value as any)) {
            if (typeof nestedValue === 'string' && nestedValue.trim().length > 10) {
              aiMessage = nestedValue;
              console.log(`🔍 Found message in nested field "${key}.${nestedKey}":`, nestedValue.substring(0, 100));
              break;
            }
          }
          if (aiMessage) break;
        }
      }
    }

    // Convert to string and trim
    aiMessage = String(aiMessage).trim();

    console.log('🎯 Extracted AI message:', { 
      aiMessage: aiMessage.substring(0, 100), 
      payloadKeys: Object.keys(payload),
      payloadType: typeof payload,
      responseLength: responseText.length
    });

    if (!aiMessage) {
      console.error('❌ No AI message in webhook response:', { payload, responseText, payloadKeys: Object.keys(payload) });
      return NextResponse.json(
        {
          success: false,
          error: `Webhook returned empty message. Response fields found: ${Object.keys(payload).join(', ')} | Full response: ${JSON.stringify(payload).substring(0, 300)}. Ensure the n8n workflow returns a message field with content.`,
        },
        { status: 502 }
      );
    }


    console.log('✅ Chat response successful');
    return NextResponse.json(
      {
        success: true,
        data: {
          message: String(aiMessage),
          tokens: payload?.tokens,
        },
        timestamp: Date.now(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Chat proxy error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? `Server error: ${error.message}`
            : 'Failed to forward chat request to the webhook.',
      },
      { status: 500 }
    );
  }
}

