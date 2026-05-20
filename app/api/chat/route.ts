import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_WEBHOOK_URL = 'https://huassist2010.app.n8n.cloud/webhook/jarvis-ai';
const WEBHOOK_URL =
  process.env.AI_WEBHOOK_URL ||
  process.env.NEXT_PUBLIC_AI_WEBHOOK_URL ||
  process.env.NEXT_PUBLIC_WEBHOOK_URL ||
  DEFAULT_WEBHOOK_URL;

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

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history } = body;

    console.log('📨 Chat request received:', { message, historyLength: history?.length || 0 });

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid message format' }, { status: 400 });
    }

    const aiMessage = await fetchWebhookResponse(message, history);

    if (!aiMessage) {
      throw new Error('Invalid response received from webhook');
    }

    console.log('✅ Chat response successful:', { aiMessage: aiMessage.substring(0, 120) });

    return NextResponse.json(
      {
        success: true,
        data: {
          message: aiMessage,
        },
        timestamp: Date.now(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Chat route error:', error);

    const isBadRequest =
      error instanceof Error && error.message === 'Invalid message format';

    const message = isBadRequest
      ? error.message
      : 'AI service is currently unavailable. Please try again later.';

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: isBadRequest ? 400 : 500 }
    );
  }
}

