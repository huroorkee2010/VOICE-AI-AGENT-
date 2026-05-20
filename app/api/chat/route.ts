import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_URL = process.env.AI_WEBHOOK_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface ChatRequest {
  message: string;
  history?: Array<{ role: string; content: string }>;
}

async function fetchWebhookResponse(message: string, history?: ChatRequest['history']) {
  if (!WEBHOOK_URL) {
    throw new Error('Webhook URL is not configured');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  const text = await response.text();
  let payload: any;

  try {
    payload = JSON.parse(text);
  } catch {
    payload = text;
  }

  if (!response.ok) {
    const errorMessage =
      payload?.error || payload?.message || payload?.text || `Webhook returned ${response.status}`;
    throw new Error(errorMessage);
  }

  const aiMessage =
    payload?.message ||
    payload?.text ||
    payload?.reply ||
    payload?.response ||
    payload?.output ||
    payload?.answer ||
    payload?.result ||
    payload?.content ||
    payload?.data?.message ||
    payload?.data?.text ||
    payload?.data?.output ||
    payload?.body?.message ||
    payload?.body?.text ||
    payload?.body ||
    (typeof payload === 'string' ? payload : '');

  return String(aiMessage || '').trim();
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
    throw new Error(
      error?.error?.message || `OpenAI API returned ${response.status}: ${response.statusText}`
    );
  }

  const data = await response.json();
  const aiMessage = data?.choices?.[0]?.message?.content;

  if (!aiMessage) {
    throw new Error('Invalid response from OpenAI API');
  }

  return aiMessage.trim();
}

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history } = body;

    console.log('📨 Chat request received:', { message, historyLength: history?.length || 0 });

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid message format' },
        { status: 400 }
      );
    }

    let aiMessage: string | null = null;
    let usedService = 'unknown';

    // Try webhook first (if configured)
    if (WEBHOOK_URL) {
      try {
        console.log('🔗 Attempting webhook request...');
        aiMessage = await fetchWebhookResponse(message, history);
        usedService = 'webhook';
        console.log('✅ Webhook response successful');
      } catch (webhookError) {
        console.warn('⚠️ Webhook failed, falling back to OpenAI:', webhookError);
        // Continue to OpenAI fallback
      }
    }

    // Fallback to OpenAI if webhook failed or not configured
    if (!aiMessage) {
      if (!OPENAI_API_KEY) {
        throw new Error(
          'No AI service available. Please configure OPENAI_API_KEY or AI_WEBHOOK_URL in environment variables.'
        );
      }
      console.log('🤖 Attempting OpenAI request...');
      aiMessage = await fetchOpenAIResponse(message, history);
      usedService = 'openai';
      console.log('✅ OpenAI response successful');
    }

    if (!aiMessage) {
      throw new Error('Invalid response received from AI service');
    }

    console.log('✅ Chat response:', { aiMessage: aiMessage.substring(0, 120), usedService });

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
    console.error('❌ Chat route error:', error);

    const isBadRequest =
      error instanceof Error && error.message === 'Invalid message format';

    const message = isBadRequest
      ? error instanceof Error
        ? error.message
        : 'Invalid request'
      : 'AI service is currently unavailable. Please ensure OPENAI_API_KEY is configured in Vercel environment variables.';

    return NextResponse.json(
      {
        success: false,
        error: message,
        timestamp: Date.now(),
      },
      { status: isBadRequest ? 400 : 503 }
    );
  }
}

