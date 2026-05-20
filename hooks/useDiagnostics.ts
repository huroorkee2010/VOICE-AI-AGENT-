import { useCallback, useEffect, useState } from 'react';

export type MicrophoneStatus = 'granted' | 'denied' | 'prompt' | 'unsupported' | 'unknown';
export type ApiHealthStatus = 'idle' | 'ok' | 'warning' | 'error' | 'missing';

export interface DiagnosticsState {
  debugMode: boolean;
  openAIConfigured: boolean;
  elevenLabsConfigured: boolean;
  deepgramConfigured: boolean;
  speechSynthesisSupported: boolean;
  speechRecognitionSupported: boolean;
  microphoneStatus: MicrophoneStatus;
  httpsSecure: boolean;
  apiTestStatus: {
    chat: ApiHealthStatus;
    textToSpeech: ApiHealthStatus;
  };
  apiTestMessage: string;
  isTesting: boolean;
}

const hasValidKey = (key?: string) => !!key && !key.includes('your-real') && key !== '';

export const useDiagnostics = () => {
  const debugMode =
    process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' || process.env.NODE_ENV !== 'production';

  const openAIKey =
    process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.NEXT_PUBLIC_OPENAI_KEY;
  const elevenLabsKey =
    process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ||
    process.env.ELEVENLABS_API_KEY ||
    process.env.NEXT_PUBLIC_ELEVENLABS_KEY;
  const deepgramKey =
    process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || process.env.DEEPGRAM_API_KEY;

  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  const [microphoneStatus, setMicrophoneStatus] = useState<MicrophoneStatus>('unknown');
  const [httpsSecure, setHttpsSecure] = useState(false);
  const [apiTestStatus, setApiTestStatus] = useState<DiagnosticsState['apiTestStatus']>({
    chat: 'idle',
    textToSpeech: 'idle',
  });
  const [apiTestMessage, setApiTestMessage] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const openAIConfigured = hasValidKey(openAIKey);
  const elevenLabsConfigured = hasValidKey(elevenLabsKey);
  const deepgramConfigured = hasValidKey(deepgramKey);

  useEffect(() => {
    setSpeechSynthesisSupported(
      typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined'
    );
    setSpeechRecognitionSupported(
      typeof window !== 'undefined' &&
        (typeof (window as any).SpeechRecognition !== 'undefined' ||
          typeof (window as any).webkitSpeechRecognition !== 'undefined')
    );
    setHttpsSecure(
      typeof window !== 'undefined' &&
        (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
    );

    if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
      (navigator as any)
        .permissions.query({ name: 'microphone' })
        .then((status: any) => {
          setMicrophoneStatus(status.state as MicrophoneStatus);
          status.onchange = () => {
            setMicrophoneStatus(status.state as MicrophoneStatus);
          };
        })
        .catch(() => {
          setMicrophoneStatus('prompt');
        });
    } else if (typeof navigator !== 'undefined' && 'mediaDevices' in navigator) {
      setMicrophoneStatus('prompt');
    } else {
      setMicrophoneStatus('unsupported');
    }
  }, []);

  const testApis = useCallback(async () => {
    setIsTesting(true);
    setApiTestMessage('Testing API connectivity...');

    const nextStatus = {
      chat: openAIConfigured ? 'warning' as ApiHealthStatus : 'missing' as ApiHealthStatus,
      textToSpeech: elevenLabsConfigured ? 'warning' as ApiHealthStatus : 'missing' as ApiHealthStatus,
    };

    try {
      if (openAIConfigured) {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Health check', history: [] }),
        });
        nextStatus.chat = response.ok ? 'ok' : 'error';
      }
    } catch {
      nextStatus.chat = 'error';
    }

    try {
      if (elevenLabsConfigured) {
        const response = await fetch('/api/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: 'Health check', voiceId: '21m00Tcm4TlvDq8ikWAM' }),
        });
        nextStatus.textToSpeech = response.ok ? 'ok' : 'error';
      }
    } catch {
      nextStatus.textToSpeech = 'error';
    }

    setApiTestStatus(nextStatus);
    setApiTestMessage('API connectivity check complete.');
    setIsTesting(false);
  }, [openAIConfigured, elevenLabsConfigured]);

  useEffect(() => {
    if (debugMode) {
      testApis();
    }
  }, [debugMode, testApis]);

  const diagnostics: DiagnosticsState = {
    debugMode,
    openAIConfigured,
    elevenLabsConfigured,
    deepgramConfigured,
    speechSynthesisSupported,
    speechRecognitionSupported,
    microphoneStatus,
    httpsSecure,
    apiTestStatus,
    apiTestMessage,
    isTesting,
  };

  return {
    diagnostics,
    testApis,
  };
};
