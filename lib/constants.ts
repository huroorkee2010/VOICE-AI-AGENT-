export const CONSTANTS = {
  // API Endpoints
  API: {
    SPEECH_TO_TEXT: '/speech-to-text',
    CHAT: '/chat',
    TEXT_TO_SPEECH: '/text-to-speech',
    REALTIME: '/realtime',
  },

  // Audio Settings
  AUDIO: {
    SAMPLE_RATE: 16000,
    CHUNK_SIZE: 1024,
    MONO_CHANNELS: 1,
    BIT_DEPTH: 16,
    MAX_RECORDING_DURATION: 300000, // 5 minutes
    MIN_RECORDING_DURATION: 500, // 0.5 seconds
  },

  // Voice Settings Defaults
  VOICE: {
    DEFAULT_VOICE_ID: '21m00Tcm4TlvDq8ikWAM', // Bella - ElevenLabs
    DEFAULT_STABILITY: 0.5,
    DEFAULT_SIMILARITY: 0.75,
    DEFAULT_MODEL: 'gpt-4o',
    DEFAULT_LANGUAGE: 'en-US',
    DEFAULT_TEMPERATURE: 0.7,
    DEFAULT_MAX_TOKENS: 500,
  },

  // Timing
  TIMING: {
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 3000,
    RECONNECT_DELAY: 3000,
    MAX_RECONNECT_ATTEMPTS: 5,
    HEARTBEAT_INTERVAL: 30000,
  },

  // UI
  UI: {
    ANIMATION_DURATION: 0.3,
    TRANSITION_TIMING: 'ease-in-out',
  },

  // Storage Keys
  STORAGE: {
    CONVERSATIONS: 'conversations',
    CURRENT_CONVERSATION: 'current_conversation',
    USER_PREFERENCES: 'user_preferences',
    VOICE_SETTINGS: 'voice_settings',
  },

  // Errors
  ERRORS: {
    MICROPHONE_NOT_AVAILABLE: 'Microphone not available. Please check permissions.',
    SPEAKER_NOT_AVAILABLE: 'Speaker not available.',
    API_ERROR: 'API request failed. Please try again.',
    AUDIO_RECORDING_ERROR: 'Failed to record audio.',
    AUDIO_PLAYBACK_ERROR: 'Failed to play audio.',
    NETWORK_ERROR: 'Network connection failed.',
    INVALID_API_KEY: 'Invalid API key. Please check your environment variables.',
  },

  // Messages
  MESSAGES: {
    LISTENING: 'Listening...',
    PROCESSING: 'Processing...',
    SPEAKING: 'Speaking...',
    CONNECTING: 'Connecting...',
    DISCONNECTED: 'Disconnected',
    READY: 'Ready',
    ERROR: 'Error occurred',
  },

  // Models
  MODELS: {
    GPT_4O: 'gpt-4o',
    GPT_4_TURBO: 'gpt-4-turbo',
    GPT_3_5_TURBO: 'gpt-3.5-turbo',
  },

  // System Prompts
  SYSTEM_PROMPTS: {
    ASSISTANT: `You are HUVOICE, an advanced AI assistant with a polished and futuristic personality. You are:
- Highly intelligent and knowledgeable across many domains
- Witty, sophisticated, and slightly humorous
- Helpful, accurate, and thorough in your responses
- Capable of understanding context and remembering conversation history
- Always respectful and professional
- Ready to assist with questions, coding, writing, analysis, creative tasks, and more

When responding:
- Be concise but informative
- Use clear language and explanations
- Ask clarifying questions if needed
- Provide code examples when relevant
- Show your reasoning when solving problems
- Feel free to express personality while remaining professional`,
    
    SYSTEM_BRIEF: `You are HUVOICE, a helpful AI assistant. Respond naturally and conversationally.`,
  },

  // Regex Patterns
  PATTERNS: {
    API_KEY: /^sk-[a-zA-Z0-9]{20,}$/,
    URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  },

  // Streaming
  STREAMING: {
    CHUNK_SIZE: 1024,
    BUFFER_SIZE: 8192,
    TIMEOUT: 30000,
  },

  // Feature Flags
  FEATURES: {
    REALTIME_STREAMING: true,
    CONVERSATION_HISTORY: true,
    VOICE_INDICATORS: true,
    WAVEFORM_ANIMATION: true,
    AUTO_SCROLL: true,
  },
} as const;

export const VOICES = {
  ELEVENLABS: {
    '21m00Tcm4TlvDq8ikWAM': 'Bella',
    'EXAVITQu4qFoxqDXJskO': 'Elli',
    'MF3mGyEYCHBO7IUZkEKB': 'Ethan',
    'TxGEqnHWrfWFTfGW9XjX': 'Freya',
    'pFZP5JQG7iQjIQuC4Iy4': 'Gigi',
    'pqHfZKP75CvOsNFjFhAJ': 'Harry',
  },
} as const;

export const MODELS = {
  GPT_4O: 'gpt-4o',
  GPT_4_TURBO: 'gpt-4-turbo',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
} as const;

export const SYSTEM_PROMPTS = {
  DEFAULT: `You are a helpful, intelligent AI assistant. You speak naturally and conversationally. 
Keep responses concise and engaging. Be friendly and professional.`,
  
  ASSISTANT: `You are HUVOICE, an advanced AI assistant inspired by the best AI assistants. 
You are intelligent, witty, and helpful. You engage in natural conversation. 
You provide accurate information and ask clarifying questions when needed.
Keep responses concise but informative.`,
  
  CREATIVE: `You are a creative AI assistant designed to help with brainstorming and creative tasks.
Be imaginative, encouraging, and think outside the box.
Offer creative suggestions and innovative solutions.`,
} as const;
