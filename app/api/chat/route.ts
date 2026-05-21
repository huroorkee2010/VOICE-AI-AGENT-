import { NextRequest, NextResponse } from 'next/server';

// Production n8n webhook URL with environment variable override
const PRODUCTION_WEBHOOK_URL = 'https://huassist2010.app.n8n.cloud/webhook/HUVOICE-AI';
const WEBHOOK_URL = process.env.AI_WEBHOOK_URL || PRODUCTION_WEBHOOK_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log('✅ WEBHOOK CONFIGURATION:', {
  production: PRODUCTION_WEBHOOK_URL,
  active: WEBHOOK_URL,
  isCustom: process.env.AI_WEBHOOK_URL ? true : false,
});

interface ChatRequest {
  message: string;
  history?: Array<{ role: string; content: string }>;
}

async function fetchWebhookResponse(message: string, history?: ChatRequest['history']) {
  if (!WEBHOOK_URL) {
    throw new Error('Webhook URL is not configured');
  }

  console.log('🔗 Webhook URL:', WEBHOOK_URL);
  
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const requestBody = {
      message,
      history: history || [],
      timestamp: new Date().toISOString(),
    };

    console.log('📤 Webhook Request:', { 
      url: WEBHOOK_URL, 
      message: message.substring(0, 100),
      historyLength: (history || []).length 
    });

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'HUVOICE-AI-Client/1.0',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const text = await response.text();
    console.log('📥 Webhook Raw Response:', {
      status: response.status,
      statusText: response.statusText,
      contentLength: text.length,
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
        payload?.body ||
        `Webhook returned ${response.status}: ${response.statusText}`;
      
      console.error('❌ Webhook HTTP Error:', {
        status: response.status,
        error: errorMessage,
      });
      
      throw new Error(`Webhook error: ${errorMessage}`);
    }

    // Parse n8n response - try multiple common formats
    const aiMessage =
      payload?.response ||
      payload?.message ||
      payload?.text ||
      payload?.reply ||
      payload?.output ||
      payload?.answer ||
      payload?.result ||
      payload?.content ||
      payload?.body?.message ||
      payload?.body?.response ||
      payload?.body?.text ||
      payload?.data?.message ||
      payload?.data?.text ||
      payload?.data?.response ||
      payload?.body ||
      (typeof payload === 'string' ? payload : '');

    if (!aiMessage) {
      console.warn('⚠️ No message found in webhook response:', JSON.stringify(payload).substring(0, 200));
      throw new Error('No response message in webhook payload');
    }

    const trimmedMessage = String(aiMessage).trim();
    console.log('✅ Webhook response parsed successfully:', {
      messageLength: trimmedMessage.length,
      preview: trimmedMessage.substring(0, 100),
    });
    
    return trimmedMessage;
  } catch (error) {
    clearTimeout(timeout);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Webhook fetch error:', {
      url: WEBHOOK_URL,
      error: errorMessage,
      type: error instanceof Error ? error.constructor.name : typeof error,
    });
    throw error;
  }
}

async function fetchOpenAIResponse(message: string, history?: ChatRequest['history']) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const messages = [
    ...(history || []).map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    })),
    { role: 'user' as const, content: message },
  ];

  console.log('🤖 OpenAI Request:', { model: 'gpt-4o', messagesCount: messages.length });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMessage =
      error?.error?.message ||
      error?.message ||
      `OpenAI API returned ${response.status}: ${response.statusText}`;
    console.error('❌ OpenAI error:', errorMessage);
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const aiMessage = data?.choices?.[0]?.message?.content;

  if (!aiMessage) {
    throw new Error('Invalid response from OpenAI API');
  }

  console.log('✅ OpenAI response received');
  return aiMessage.trim();
}

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history } = body;

    console.log('\n' + '='.repeat(60));
    console.log('📨 Chat request received');
    console.log('Message:', message.substring(0, 100));
    console.log('History length:', history?.length || 0);
    console.log('Webhook URL:', WEBHOOK_URL ? '✅ Configured' : '❌ Not configured');
    console.log('OpenAI Key:', OPENAI_API_KEY ? '✅ Configured' : '❌ Not configured');
    console.log('='.repeat(60));

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid message format' },
        { status: 400 }
      );
    }

    let aiMessage: string | null = null;
    let usedService = 'unknown';

    // Try n8n webhook first (primary service)
    if (WEBHOOK_URL) {
      try {
        console.log('\n🔗 Step 1: Trying n8n webhook...');
        aiMessage = await fetchWebhookResponse(message, history);
        usedService = 'n8n-webhook';
        console.log('✅ n8n webhook SUCCESS');
      } catch (webhookError) {
        const errorMsg = webhookError instanceof Error ? webhookError.message : String(webhookError);
        console.log(`⚠️ n8n webhook FAILED: ${errorMsg}`);
        console.log('💨 Attempting fallback to OpenAI...\n');
      }
    } else {
      console.log('⏭️ Webhook not configured, skipping to OpenAI');
    }

    // Fallback to OpenAI if webhook not available or failed
    if (!aiMessage && OPENAI_API_KEY) {
      try {
        console.log('🤖 Step 2: Trying OpenAI API...');
        aiMessage = await fetchOpenAIResponse(message, history);
        usedService = 'openai';
        console.log('✅ OpenAI SUCCESS');
      } catch (openaiError) {
        const errorMsg = openaiError instanceof Error ? openaiError.message : String(openaiError);
        console.error(`❌ OpenAI FAILED: ${errorMsg}`);
        throw openaiError;
      }
    }

    if (!aiMessage) {
      throw new Error(
        'No AI service available. Please ensure either n8n webhook or OPENAI_API_KEY is configured.'
      );
    }

    console.log('\n✅ Chat response:', {
      service: usedService,
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

