// Core Types for the Voice AI Agent

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model?: string;
}

export interface AudioState {
  isRecording: boolean;
  isPlaying: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  hasError: boolean;
  errorMessage?: string | null;
}

export interface VoiceSettings {
  voiceId: string;
  stability: number;
  similarityBoost: number;
  language: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface SpeechToTextResponse {
  text: string;
  confidence?: number;
  language?: string;
}

export interface TextToSpeechResponse {
  audioUrl: string;
  audioData?: ArrayBuffer;
  duration?: number;
}

export interface ChatResponse {
  message: string;
  tokens?: number;
}

export interface RealtimeConfig {
  model: string;
  language: string;
  voiceId: string;
  modalities?: ('text' | 'audio')[];
  instructions?: string;
}

export interface WaveformData {
  frequency: number[];
  amplitude: number[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  autoPlay: boolean;
  autoTranscribe: boolean;
  voiceSettings: Partial<VoiceSettings>;
  apiProvider: 'openai' | 'deepgram' | 'elevenlabs';
}
