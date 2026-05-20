import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { CONSTANTS, SYSTEM_PROMPTS } from '@/lib/constants';

const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
const USE_MOCK_RESPONSES = process.env.DEBUG_MOCK_RESPONSES === 'true';
const WEBHOOK_URL = process.env.AI_WEBHOOK_URL || process.env.NEXT_PUBLIC_AI_WEBHOOK_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = OPENAI_API_KEY
  ? new OpenAI({ apiKey: OPENAI_API_KEY, baseURL: process.env.OPENAI_API_BASE_URL })
  : null;

interface ChatRequest {
  message: string;
  history?: Array<{ role: string; content: string }>;
}

const defaultOpenAIModel = process.env.OPENAI_MODEL || CONSTANTS.VOICE.DEFAULT_MODEL || 'gpt-4o';
const defaultOpenAITemperature = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');
const defaultOpenAIMaxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '800', 10);

const mockResponses: Record<string, string> = {
  hello: 'Hello! I’m doing great, thank you for asking! How can I help you today?',
  'how are you': 'I’m doing wonderful! Thanks for asking. What can I assist you with?',
  time: 'I don’t have real-time capabilities, but you can check your system clock for the current time.',
  joke: 'Why did the AI go to school? To improve its learning algorithms! 😄',
  test: 'This is a test response from the mock AI. The webhook integration is working!',
  hi: 'Hi there! Welcome to HUVOICE AI. How can I help you?',
};

function getMockResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  if (mockResponses[lowerMessage]) {
    return mockResponses[lowerMessage];
  }

  for (const [key, response] of Object.entries(mockResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  return `I received your message: "${message}". Please configure the OpenAI API key or the fallback webhook.`;
}

function buildOpenAIMessages(history: ChatRequest['history'], message: string) {
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    {
      role: 'system',
      content: SYSTEM_PROMPTS.ASSISTANT,
    },
  ];

  if (Array.isArray(history)) {
    history.forEach((item) => {
      if (item && item.role && item.content) {
        const role: 'assistant' | 'user' = item.role === 'assistant' ? 'assistant' : 'user';
        messages.push({ role, content: String(item.content) });
      }
    });
  }

  messages.push({ role: 'user', content: String(message) });
  return messages;
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
    payload = { text };
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
    '';

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

    if (DEBUG_MODE && USE_MOCK_RESPONSES) {
      console.log('🔧 DEBUG MODE: using mock response');
      return NextResponse.json(
        {
          success: true,
          data: {
            message: getMockResponse(message),
            debug: true,
          },
          timestamp: Date.now(),
        },
        { status: 200 }
      );
    }

    let aiMessage = '';
    let tokens: number | undefined;

    if (openai) {
      console.log('🔗 Using OpenAI API');
      const messages = buildOpenAIMessages(history, message);

      const response = await openai.chat.completions.create({
        model: defaultOpenAIModel,
        messages,
        temperature: defaultOpenAITemperature,
        max_tokens: defaultOpenAIMaxTokens,
      });

      aiMessage = String(response.choices?.[0]?.message?.content || '').trim();
      tokens = response.usage?.total_tokens;

      if (!aiMessage) {
        throw new Error('OpenAI returned an empty message');
      }
    } else if (WEBHOOK_URL) {
      console.log('🔗 No OpenAI key found, falling back to webhook');
      aiMessage = await fetchWebhookResponse(message, history);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'No OpenAI API key configured and no fallback webhook available. Set OPENAI_API_KEY or AI_WEBHOOK_URL.',
        },
        { status: 500 }
      );
    }

    console.log('✅ Chat response successful:', { aiMessage: aiMessage.substring(0, 120), tokens });

    return NextResponse.json(
      {
        success: true,
        data: {
          message: aiMessage,
          tokens,
        },
        timestamp: Date.now(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Chat route error:', error);

    const message = error instanceof Error ? error.message : 'Unexpected chat server error';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

