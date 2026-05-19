import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Try to use Deepgram, fallback to OpenAI Whisper
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

async function transcribeWithOpenAI(audioBuffer: Buffer, fileName: string): Promise<string> {
  try {
    // Create FormData for Whisper API
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(audioBuffer)], { type: 'audio/webm' });
    formData.append('file', blob, fileName);
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    // Use fetch directly for Whisper endpoint
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = (await response.json()) as { text: string };
    return data.text || '';
  } catch (error) {
    console.error('OpenAI Whisper error:', error);
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

    // Try Deepgram first if key is available
    if (process.env.DEEPGRAM_API_KEY) {
      try {
        transcript = await transcribeWithDeepgram(audioBuffer, audioBlob.type || 'audio/webm');
      } catch (deepgramError) {
        console.warn('Deepgram failed, trying OpenAI Whisper:', deepgramError);
        // Fallback to OpenAI
        if (process.env.OPENAI_API_KEY) {
          transcript = await transcribeWithOpenAI(audioBuffer, `audio-${Date.now()}.webm`);
        } else {
          throw new Error('No speech-to-text API configured');
        }
      }
    } else if (process.env.OPENAI_API_KEY) {
      // Use OpenAI if Deepgram not available
      transcript = await transcribeWithOpenAI(audioBuffer, `audio-${Date.now()}.webm`);
    } else {
      return NextResponse.json(
        { success: false, error: 'No speech-to-text API configured. Please set DEEPGRAM_API_KEY or OPENAI_API_KEY.' },
        { status: 500 }
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
        errorMessage = 'Invalid API key for speech-to-text service';
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
