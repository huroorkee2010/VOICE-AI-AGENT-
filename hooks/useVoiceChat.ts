import { useCallback, useEffect, useRef, useState } from 'react';
import { useConversationStore } from '@/store/conversation';
import { useAudioRecorder } from './useAudioRecorder';
import { apiClient } from '@/lib/api-client';
import { Message } from '@/lib/types';
import { stringUtils } from '@/lib/audio-utils';
import { CONSTANTS } from '@/lib/constants';
import toast from 'react-hot-toast';

const SpeechRecognitionConstructor =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export const useVoiceChat = () => {
  const store = useConversationStore();
  const audioRecorder = useAudioRecorder();
  const recognitionRef = useRef<any>(null);
  const transcriptProcessedRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);

  useEffect(() => {
    if (!store.currentConversation) {
      store.createConversation();
    }
  }, [store.currentConversation, store.createConversation]);

  const speakText = useCallback(
    async (text: string) => {
      if (typeof window === 'undefined') return;

      const useElevenLabs = process.env.NEXT_PUBLIC_USE_ELEVENLABS === 'true';
      const voiceId = store.userPreferences.voiceSettings.voiceId;
      const language = store.userPreferences.voiceSettings.language || 'en-US';

      const playAudioBlob = async (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        return new Promise<void>((resolve) => {
          const audio = new Audio(url);

          audio.onended = () => {
            URL.revokeObjectURL(url);
            resolve();
          };

          audio.onerror = () => {
            URL.revokeObjectURL(url);
            resolve();
          };

          audio.play().catch(() => {
            URL.revokeObjectURL(url);
            resolve();
          });
        });
      };

      const speakWithBrowser = async () => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
          return;
        }

        return new Promise<void>((resolve) => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = language;
          utterance.rate = 1;
          utterance.pitch = 1;
          utterance.volume = 1;

          const setVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find((voice) =>
              voice.lang.toLowerCase().startsWith(language.toLowerCase())
            );
            if (voice) utterance.voice = voice;
          };

          setVoice();

          if (!utterance.voice) {
            window.speechSynthesis.onvoiceschanged = () => {
              setVoice();
            };
          }

          utterance.onend = () => {
            resolve();
          };

          utterance.onerror = () => {
            resolve();
          };

          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        });
      };

      const stopSpeaking = () => {
        store.setSpeaking(false);
      };

      try {
        store.setSpeaking(true);

        if (useElevenLabs) {
          try {
            const blob = await apiClient.textToSpeech(text, voiceId);
            await playAudioBlob(blob);
            return;
          } catch (error) {
            console.warn('⚠️ ElevenLabs TTS failed, falling back to browser speech:', error);
          }
        }

        await speakWithBrowser();
      } finally {
        stopSpeaking();
      }
    },
    [store, apiClient]
  );

  const handleAIResponse = useCallback(
    async (userText: string) => {
      try {
        setIsWaitingForAI(true);

        console.log('🤖 Requesting AI response for:', userText);

        setIsProcessing(true);

        let aiResponse = '';
        try {
          const response = await Promise.race([
            apiClient.chat(userText, store.currentConversation?.messages),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('timeout')), 35000)
            ),
          ]);
          aiResponse = (response as any).message;
        } catch (timeoutError) {
          if ((timeoutError as Error).message === 'timeout') {
            throw new Error('Request timeout: Webhook taking too long to respond');
          }
          throw timeoutError;
        }

        console.log('✅ AI response received:', aiResponse);

        // Validate response
        if (!aiResponse || typeof aiResponse !== 'string') {
          console.error('❌ Invalid AI response format:', aiResponse);
          throw new Error('Invalid response format from server');
        }

        const aiMessage: Message = {
          id: stringUtils.generateId(),
          role: 'assistant',
          content: aiResponse.trim(),
          timestamp: Date.now(),
          status: 'sent',
        };

        store.addMessage(aiMessage);

        if (store.userPreferences.autoPlay) {
          try {
            await speakText(aiResponse);
          } catch (speechError) {
            console.error('❌ Text-to-speech error:', speechError);
            // Continue even if speech fails
          }
        }

        setIsWaitingForAI(false);
        setIsProcessing(false);
      } catch (error) {
        console.error('❌ AI response error:', error);
        
        // Ensure state is reset even on error
        setIsWaitingForAI(false);
        setIsProcessing(false);
        store.setSpeaking(false);
        
        let errorMessage: string = CONSTANTS.ERRORS.API_ERROR;
        
        if (error instanceof Error) {
          const msg = error.message.toLowerCase();
          if (msg.includes('502')) {
            errorMessage = '⚠️ Webhook error (502): Check if n8n webhook is active and responding';
          } else if (msg.includes('404')) {
            errorMessage = '⚠️ Webhook not found: Check webhook URL configuration';
          } else if (msg.includes('timeout')) {
            errorMessage = '⚠️ Request timeout: Webhook taking too long to respond';
          } else if (msg.includes('cors')) {
            errorMessage = '⚠️ CORS error: Cross-origin request blocked';
          } else if (msg.includes('invalid response')) {
            errorMessage = '⚠️ Server returned invalid data format';
          } else {
            errorMessage = `⚠️ ${error.message}`;
          }
        }
        
        store.setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    },
    [speakText, store]
  );

  const processTranscript = useCallback(
    async (transcript: string) => {
      const userText = transcript.trim();
      if (!userText) return;

      const userMessage: Message = {
        id: stringUtils.generateId(),
        role: 'user',
        content: userText,
        timestamp: Date.now(),
        status: 'sent',
      };

      store.addMessage(userMessage);
      await handleAIResponse(userText);
    },
    [handleAIResponse, store]
  );

  const handleAudioBlobTranscript = useCallback(
    async (audioBlob: Blob | null) => {
      if (!audioBlob) {
        return;
      }

      try {
        setIsWaitingForAI(true);
        const response = await apiClient.speechToText(audioBlob);
        const transcript = response.text?.trim();

        if (!transcript) {
          throw new Error('Speech transcription returned no text');
        }

        await processTranscript(transcript);
      } catch (error) {
        console.error('❌ Speech-to-text error:', error);
        const errorMessage =
          error instanceof Error ? error.message : CONSTANTS.ERRORS.AUDIO_RECORDING_ERROR;
        store.setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsWaitingForAI(false);
      }
    },
    [processTranscript, store]
  );

  const stopListeningInternal = useCallback(async () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore stop errors
      }
    }

    const audioBlob = await audioRecorder.stopRecording().catch(() => null);

    store.setRecording(false);
    store.setListening(false);

    if (!transcriptProcessedRef.current) {
      await handleAudioBlobTranscript(audioBlob);
    }

    transcriptProcessedRef.current = false;
  }, [audioRecorder, handleAudioBlobTranscript, store]);

  const startListening = useCallback(async () => {
    transcriptProcessedRef.current = false;
    store.setError('');
    store.setRecording(true);
    store.setListening(true);
    setIsProcessing(false);

    try {
      await audioRecorder.startRecording();

      if (SpeechRecognitionConstructor) {
        if (!recognitionRef.current) {
          recognitionRef.current = new SpeechRecognitionConstructor();
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = store.userPreferences.voiceSettings.language || 'en-US';
          recognitionRef.current.maxAlternatives = 1;

          recognitionRef.current.onresult = async (event: any) => {
            const lastResult = event.results[event.results.length - 1];
            const transcript = lastResult[0]?.transcript || '';

            if (lastResult.isFinal && transcript.trim()) {
              transcriptProcessedRef.current = true;
              await stopListeningInternal();
              await processTranscript(transcript);
            }
          };

          recognitionRef.current.onerror = (event: any) => {
            const errorMessage =
              event.error === 'not-allowed' || event.error === 'service-not-allowed'
                ? CONSTANTS.ERRORS.MICROPHONE_NOT_AVAILABLE
                : `Speech recognition error: ${event.error || 'unknown'}`;

            store.setError(errorMessage);
            toast.error(errorMessage);
            stopListeningInternal();
          };

          recognitionRef.current.onend = () => {
            if (!transcriptProcessedRef.current) {
              stopListeningInternal();
            }
          };
        }

        recognitionRef.current.start();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : CONSTANTS.ERRORS.AUDIO_RECORDING_ERROR;
      store.setError(errorMessage);
      toast.error(errorMessage);
      store.setRecording(false);
      store.setListening(false);
    }
  }, [audioRecorder, processTranscript, stopListeningInternal, store]);

  const stopListening = useCallback(async () => {
    await stopListeningInternal();
  }, [stopListeningInternal]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMessage: Message = {
        id: stringUtils.generateId(),
        role: 'user',
        content: text,
        timestamp: Date.now(),
        status: 'sent',
      };

      store.addMessage(userMessage);
      await handleAIResponse(text);
    },
    [handleAIResponse, store]
  );

  const interruptAI = useCallback(() => {
    console.log('🛑 Interrupting AI response');
    // Stop speech synthesis immediately
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    // Abort any pending chat request
    // Reset all states
    store.setSpeaking(false);
    setIsWaitingForAI(false);
    setIsProcessing(false);
    // Clear any errors
    store.setError('');
  }, [store]);

  const clearConversation = useCallback(() => {
    store.clearConversations();
    store.createConversation();
    interruptAI();
  }, [interruptAI, store]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      audioRecorder.cleanup();
    };
  }, [audioRecorder]);

  return {
    isProcessing,
    isWaitingForAI,
    currentConversation: store.currentConversation,
    audioState: store.audioState,
    userPreferences: store.userPreferences,
    startListening,
    stopListening,
    sendMessage,
    interruptAI,
    clearConversation,
    audioRecorder,
  };
};
