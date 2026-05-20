import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

export const runtime = 'nodejs';

interface TTSRequest {
  text: string;
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
}

function formatAudioData(data: unknown): Promise<ArrayBuffer> {
  if (data instanceof ArrayBuffer) {
    return Promise.resolve(data);
  }

  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(data)) {
    return Promise.resolve(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer);
  }

  if (typeof Blob !== 'undefined' && data instanceof Blob) {
    return data.arrayBuffer();
  }

  if (typeof (data as any)?.arrayBuffer === 'function') {
    return (data as any).arrayBuffer();
  }

  return new Response(data as any).arrayBuffer();
}

export async function POST(request: NextRequest) {
  try {
    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
    if (!elevenLabsKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'ElevenLabs API key not configured. Set ELEVENLABS_API_KEY in your environment.',
        },
        { status: 400 }
      );
    }

    const body: TTSRequest = await request.json();
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const voiceId = (body.voiceId || process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM').trim();
    const stability = typeof body.stability === 'number' ? body.stability : 0.5;
    const similarityBoost = typeof body.similarityBoost === 'number' ? body.similarityBoost : 0.75;

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'No text provided for speech synthesis' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Text too long. Maximum 5000 characters allowed.' },
        { status: 400 }
      );
    }

    const client = new ElevenLabsClient({ apiKey: elevenLabsKey });
    const response = await client.textToSpeech.convert(voiceId, {
      text,
      modelId: 'eleven_monolingual_v1',
      voiceSettings: {
        stability,
        similarityBoost,
      },
    });

    const audioBuffer = await formatAudioData(response);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Text to speech error:', error);

    let errorMessage = 'Failed to generate speech';
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        errorMessage = 'Invalid ElevenLabs API key';
      } else if (error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}
