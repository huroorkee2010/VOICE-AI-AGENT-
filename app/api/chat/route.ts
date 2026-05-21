import { NextRequest, NextResponse } from 'next/server';

// Production n8n webhook URL with environment variable override
const PRODUCTION_WEBHOOK_URL = 'https://huassist2010.app.n8n.cloud/webhook/YOUR_PRODUCTION_WEBHOOK_ID';
const WEBHOOK_URL = process.env.AI_WEBHOOK_URL || PRODUCTION_WEBHOOK_URL;

console.log('✅ N8N WEBHOOK CONFIGURATION:', {
  production: PRODUCTION_WEBHOOK_URL,
  active: WEBHOOK_URL,
  isCustom: process.env.AI_WEBHOOK_URL ? true : false,
});

interface ChatRequest {
  message: string;
  history?: Array<{ role: string; content: string }>;
}

async function fetchWebhookResponse(message: string) {
  if (!WEBHOOK_URL) {
    throw new Error('Webhook URL is not configured');
  }

  console.log('🔗 N8N Webhook URL:', WEBHOOK_URL);
  
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout

  try {
    // Simple request body as specified - just send message
    const requestBody = {
      message,
    };

    console.log('📤 N8N Webhook Request:', { 
      url: WEBHOOK_URL, 
      message: message.substring(0, 100),
    });

    const startTime = Date.now();
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    const duration = Date.now() - startTime;
    clearTimeout(timeout);

    const text = await response.text();
    console.log('📥 N8N Raw Response:', {
      status: response.status,
      statusText: response.statusText,
      contentLength: text.length,
      duration: duration + 'ms',
      preview: text.substring(0, 300),
    });

    let payload: any;

    try {
      payload = JSON.parse(text);
    } catch {
      payload = { body: text };
    }

    if (!response.ok) {
      const errorMessage =
        payload?.error ||
        payload?.message ||
        `N8N returned ${response.status}: ${response.statusText}`;
      
      console.error('❌ N8N HTTP Error:', {
        status: response.status,
        error: errorMessage,
      });
      
      throw new Error(`N8N error (${response.status}): ${errorMessage}`);
    }

    // Parse n8n response - supports multiple Gemini response formats
    const aiMessage =
      payload?.response ||
      payload?.message ||
      payload?.text ||
      payload?.output ||
      payload?.result ||
      payload?.content ||
      payload?.data?.message ||
      payload?.data?.text ||
      payload?.body ||
      (typeof payload === 'string' ? payload : '');

    if (!aiMessage) {
      console.warn('⚠️ No message found in N8N response:', JSON.stringify(payload).substring(0, 200));
      throw new Error('No response message in N8N webhook payload');
    }

    const trimmedMessage = String(aiMessage).trim();
    console.log('✅ N8N response parsed successfully:', {
      messageLength: trimmedMessage.length,
      duration: duration + 'ms',
      preview: trimmedMessage.substring(0, 100),
    });
    
    return trimmedMessage;
  } catch (error) {
    clearTimeout(timeout);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isTimeout = errorMessage.includes('timeout') || errorMessage.includes('The user aborted a request');
    
    console.error('❌ N8N fetch error:', {
      url: WEBHOOK_URL,
      error: errorMessage,
      type: error instanceof Error ? error.constructor.name : typeof error,
      isTimeout: isTimeout,
    });
    
    throw error;
  }
}

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history } = body;

    console.log('\n' + '='.repeat(60));
    console.log('📨 Chat request received');
    console.log('Message:', message.substring(0, 100));
    console.log('N8N Webhook URL:', WEBHOOK_URL ? '✅ Configured' : '❌ Not configured');
    console.log('='.repeat(60));

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // Check if webhook is configured
    if (!WEBHOOK_URL) {
      const errorMsg = 'N8N webhook not configured. Please set AI_WEBHOOK_URL in .env.local';
      console.error('❌ Configuration error:', errorMsg);
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 503 }
      );
    }

    let aiMessage: string | null = null;
    let usedService = 'n8n-webhook';

    // Call n8n webhook (primary and only service)
    try {
      console.log('\n🔗 Calling N8N webhook...');
      aiMessage = await fetchWebhookResponse(message);
      console.log('✅ N8N webhook SUCCESS');
    } catch (webhookError) {
      const errorMsg = webhookError instanceof Error ? webhookError.message : String(webhookError);
      console.error(`❌ N8N webhook FAILED: ${errorMsg}`);
      console.error('Webhook URL being used:', WEBHOOK_URL);
      console.error('Full error:', webhookError);
      throw new Error(`N8N webhook failed: ${errorMsg}`);
    }

    if (!aiMessage) {
      throw new Error('No response from N8N webhook');
    }

    console.log('\n✅ Chat response from N8N:', {
      messageLength: aiMessage.length,
      preview: aiMessage.substring(0, 100),
    });
    console.log('='.repeat(60) + '\n');

    return NextResponse.json(
      {
        success: true,
        data: {
          message: aiMessage,
        },
        timestamp: Date.now(),
        service: usedService,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('\n' + '❌'.repeat(30));
    console.error('Chat route error:', error);
    console.error('❌'.repeat(30) + '\n');

    const isBadRequest =
      error instanceof Error && error.message === 'Invalid message format';

    const errorMessage = isBadRequest
      ? error instanceof Error
        ? error.message
        : 'Invalid request'
      : error instanceof Error
      ? error.message
      : 'AI service is currently unavailable';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: Date.now(),
      },
      { status: isBadRequest ? 400 : 503 }
    );
  }
}

