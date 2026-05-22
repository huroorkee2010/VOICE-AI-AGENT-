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
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const transcriptProcessedRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<'en' | 'hi'>('en');
  const currentSpeechLang: 'en-US' | 'hi-IN' = 'en-US';

  useEffect(() => {
    if (!store.currentConversation) {
      store.createConversation();
    }
  }, [store.currentConversation, store.createConversation]);

  // Detect language from text
  const detectLanguage = (text: string): 'en' | 'hi' => {
    // Hindi character ranges
    const hindiRegex = /[\u0900-\u097F]/g;
    const hindiMatches = text.match(hindiRegex) || [];
    
    // English character check
    const englishRegex = /[a-zA-Z]/g;
    const englishMatches = text.match(englishRegex) || [];
    
    // Common Hindi words
    const commonHindiWords = [
      'kya', 'haal', 'hai', 'aap', 'main', 'bilkul', 'theek', 'hoon', 'aur',
      'ke', 'ki', 'ka', 'se', 'mein', 'ek', 'tha', 'the', 'hain', 'nahi',
      'ho', 'kaun', 'kaise', 'kab', 'where', 'kahan', 'kya ho raha hai'
    ];
    
    // Check for Hindi characters first
    if (hindiMatches.length > englishMatches.length * 0.3) {
      return 'hi';
    }
    
    // Check for common Hindi words (transliteration)
    const lowerText = text.toLowerCase();
    const hindiWordsFound = commonHindiWords.filter(word => 
      lowerText.includes(word.toLowerCase())
    ).length;
    
    if (hindiWordsFound > 2) {
      return 'hi';
    }
    
    // Default to English
    return 'en';
  };

  const speakText = useCallback(
    async (text: string) => {
      if (typeof window === 'undefined') return;

      const language = store.userPreferences.voiceSettings.language || 'en-US';

      const stopPlayback = () => {
        if (audioElementRef.current) {
          audioElementRef.current.pause();
          audioElementRef.current.src = '';
          audioElementRef.current = null;
        }
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
        stopPlayback();
        store.setSpeaking(false);
      };

      try {
        stopPlayback();
        store.setSpeaking(true);

        // Use browser-native speech synthesis only
        await speakWithBrowser();
      } finally {
        stopSpeaking();
      }
    },
    [store]
  );

  const handleAIResponse = useCallback(
    async (userText: string, language: 'en' | 'hi' = 'en') => {
      try {
        setIsWaitingForAI(true);
        setDetectedLanguage(language);

        console.log('🤖 Requesting AI response for:', userText, 'Language:', language);

        setIsProcessing(true);

        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        let aiResponse = '';
        try {
          const response = await Promise.race([
            apiClient.chat(userText, store.currentConversation?.messages, abortControllerRef.current.signal, language),
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

        // Update voice settings to use the detected language for TTS
        const ttsLanguage = language === 'hi' ? 'hi-IN' : 'en-US';
        store.setVoiceSettings({ language: ttsLanguage });

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
          } else if (msg.includes('canceled') || msg.includes('aborted')) {
            errorMessage = '⚠️ Request was canceled';
          } else {
            errorMessage = `⚠️ ${error.message}`;
          }
        }
        
        store.setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
        setIsWaitingForAI(false);
        if (abortControllerRef.current) {
          abortControllerRef.current = null;
        }
      }
    },
    [speakText, store]
  );

  const processTranscript = useCallback(
    async (transcript: string) => {
      const userText = transcript.trim();
      if (!userText) return;

      // Detect language
      const detectedLang = detectLanguage(userText);
      setDetectedLanguage(detectedLang);

      const userMessage: Message = {
        id: stringUtils.generateId(),
        role: 'user',
        content: userText,
        timestamp: Date.now(),
        status: 'sent',
      };

      store.addMessage(userMessage);
      await handleAIResponse(userText, detectedLang);
    },
    [handleAIResponse, store, detectLanguage]
  );

  const stopListeningInternal = useCallback(async () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore stop errors
      }
    }

    await audioRecorder.stopRecording().catch(() => null);

    store.setRecording(false);
    store.setListening(false);

    transcriptProcessedRef.current = false;
  }, [audioRecorder, store]);

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
          // Start with English, will detect and potentially switch based on content
          recognitionRef.current.lang = currentSpeechLang;
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
  }, [audioRecorder, processTranscript, stopListeningInternal, store, currentSpeechLang]);

  const stopListening = useCallback(async () => {
    await stopListeningInternal();
  }, [stopListeningInternal]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      // Detect language from the input text
      const detectedLang = detectLanguage(text);
      setDetectedLanguage(detectedLang);

      const userMessage: Message = {
        id: stringUtils.generateId(),
        role: 'user',
        content: text,
        timestamp: Date.now(),
        status: 'sent',
      };

      store.addMessage(userMessage);
      await handleAIResponse(text, detectedLang);
    },
    [handleAIResponse, store, detectLanguage]
  );

  const interruptAI = useCallback(() => {
    console.log('🛑 Interrupting AI response');
    // Stop any active playback or browser speech
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
      audioElementRef.current = null;
    }
    // Abort any pending chat request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
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
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
        audioElementRef.current = null;
      }
      audioRecorder.cleanup();
    };
  }, [audioRecorder]);

  return {
    isProcessing,
    isWaitingForAI,
    detectedLanguage,
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
