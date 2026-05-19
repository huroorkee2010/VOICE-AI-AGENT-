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
    // Validate API key
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    const body: TTSRequest = await request.json();
    const {
      text,
      voiceId = '21m00Tcm4TlvDq8ikWAM', // Default to Bella voice
      stability = 0.5,
      similarityBoost = 0.75,
    } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
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

    // Use ElevenLabs API directly via fetch
    const elevenlabsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
          },
        }),
      }
    );

    if (!elevenlabsResponse.ok) {
      const errorData = await elevenlabsResponse.text();
      console.error('ElevenLabs error:', elevenlabsResponse.status, errorData);

      let errorMessage = 'Failed to generate speech';
      if (elevenlabsResponse.status === 401) {
        errorMessage = 'Invalid ElevenLabs API key';
      } else if (elevenlabsResponse.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (elevenlabsResponse.status === 400) {
        errorMessage = 'Invalid request. Please check your input.';
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: elevenlabsResponse.status }
      );
    }

    // Get audio buffer
    const audioBuffer = await elevenlabsResponse.arrayBuffer();

    // Return audio as binary
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="speech.mp3"',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Text to speech error:', error);

    let errorMessage = 'Failed to generate speech';
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection.';
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
