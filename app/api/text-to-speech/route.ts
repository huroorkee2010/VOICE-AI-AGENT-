import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface TTSRequest {
  text: string;
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: TTSRequest = await request.json();
    const text = typeof body.text === 'string' ? body.text.trim() : '';

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'No text provided for speech synthesis' },
        { status: 400 }
      );
    }

    // Use browser-native Web Speech Synthesis API instead
    return NextResponse.json(
      {
        success: true,
        message: 'Use browser-native Web Speech Synthesis API for TTS',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Text to speech error:', error);

    let errorMessage = 'Failed to generate speech';
    if (error instanceof Error) {
      errorMessage = error.message;
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
