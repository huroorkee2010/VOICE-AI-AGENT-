import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Transcribe using Deepgram API
async function transcribeWithDeepgram(audioBuffer: Buffer, _mimeType: string): Promise<string> {
  try {
    // Use Deepgram API directly via fetch
    const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&language=en', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.DEEPGRAM_API_KEY || ''}`,
        'Content-Type': 'audio/webm',
      },
      body: new Uint8Array(audioBuffer),
    });

    if (!response.ok) {
      throw new Error(`Deepgram API error: ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    const transcript = data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
    return transcript;
  } catch (error) {
    console.error('Deepgram error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get audio data from request
    const formData = await request.formData();
    const audioBlob = formData.get('audio') as Blob;

    if (!audioBlob) {
      return NextResponse.json(
        { success: false, error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert blob to buffer
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    // Minimum audio length check (at least 100ms)
    if (audioBuffer.length < 1600) {
      return NextResponse.json(
        { success: false, error: 'Audio too short. Please record at least 1 second.' },
        { status: 400 }
      );
    }

    let transcript = '';

    const deepgramKey = process.env.DEEPGRAM_API_KEY || process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
    const hasDeepgramKey = !!deepgramKey && !deepgramKey.includes('your-real');

    // Use Deepgram if key is available, otherwise inform user to use browser speech API
    if (hasDeepgramKey) {
      try {
        console.log('🎤 Transcribing with Deepgram...');
        transcript = await transcribeWithDeepgram(audioBuffer, audioBlob.type || 'audio/webm');
        console.log('✅ Deepgram transcription successful');
      } catch (deepgramError) {
        console.error('❌ Deepgram transcription failed:', deepgramError);
        return NextResponse.json(
          {
            success: false,
            error: 'Speech-to-text service failed. Please try again or check your Deepgram API key.',
          },
          { status: 503 }
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Deepgram API key not configured. Please set DEEPGRAM_API_KEY in .env.local. Alternatively, browser speech recognition is available for testing.',
        },
        { status: 400 }
      );
    }

    if (!transcript) {
      return NextResponse.json(
        { success: false, error: 'Could not transcribe audio. Please try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { text: transcript },
        timestamp: Date.now(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Speech to text error:', error);

    let errorMessage = 'Failed to transcribe audio';
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes('invalid_api_key')) {
        errorMessage = 'Invalid Deepgram API key';
      } else if (error.message.includes('rate_limit')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (error.message.includes('audio')) {
        errorMessage = 'Audio format or quality issue. Please try again.';
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
