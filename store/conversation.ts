import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, Conversation, AudioState, UserPreferences, VoiceSettings } from '@/lib/types';
import { CONSTANTS } from '@/lib/constants';
import { stringUtils } from '@/lib/audio-utils';

interface ConversationStore {
  // State
  conversations: Conversation[];
  currentConversation: Conversation | null;
  audioState: AudioState;
  userPreferences: UserPreferences;
  isConnected: boolean;
  isLoading: boolean;

  // Conversation actions
  createConversation: (title?: string) => Conversation;
  setCurrentConversation: (conversation: Conversation | null) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, message: Partial<Message>) => void;
  deleteConversation: (id: string) => void;
  clearConversations: () => void;
  saveConversation: (conversation: Conversation) => void;

  // Audio state actions
  setAudioState: (state: Partial<AudioState>) => void;
  setRecording: (isRecording: boolean) => void;
  setPlaying: (isPlaying: boolean) => void;
  setSpeaking: (isSpeaking: boolean) => void;
  setListening: (isListening: boolean) => void;
  setError: (error: string | null) => void;

  // Preferences actions
  setUserPreferences: (preferences: Partial<UserPreferences>) => void;
  setVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;

  // Connection actions
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const defaultAudioState: AudioState = {
  isRecording: false,
  isPlaying: false,
  isSpeaking: false,
  isListening: false,
  hasError: false,
};

const defaultUserPreferences: UserPreferences = {
  theme: 'dark',
  autoPlay: true,
  autoTranscribe: true,
  voiceSettings: {
    voiceId: CONSTANTS.VOICE.DEFAULT_VOICE_ID,
    stability: CONSTANTS.VOICE.DEFAULT_STABILITY,
    similarityBoost: CONSTANTS.VOICE.DEFAULT_SIMILARITY,
    language: CONSTANTS.VOICE.DEFAULT_LANGUAGE,
    model: CONSTANTS.VOICE.DEFAULT_MODEL,
    temperature: CONSTANTS.VOICE.DEFAULT_TEMPERATURE,
    maxTokens: CONSTANTS.VOICE.DEFAULT_MAX_TOKENS,
  },
  apiProvider: 'openai',
};

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      conversations: [],
      currentConversation: null,
      audioState: defaultAudioState,
      userPreferences: defaultUserPreferences,
      isConnected: false,
      isLoading: false,

      // Conversation actions
      createConversation: (title = 'New Conversation') => {
        const conversation: Conversation = {
          id: stringUtils.generateId(),
          title,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          model: get().userPreferences.voiceSettings.model,
        };

        set((state) => ({
          conversations: [conversation, ...state.conversations],
          currentConversation: conversation,
        }));

        return conversation;
      },

      setCurrentConversation: (conversation) => {
        set({ currentConversation: conversation });
      },

      addMessage: (message) => {
        set((state) => {
          if (!state.currentConversation) return state;

          const updatedConversation: Conversation = {
            ...state.currentConversation,
            messages: [...state.currentConversation.messages, message],
            updatedAt: Date.now(),
          };

          return {
            currentConversation: updatedConversation,
            conversations: state.conversations.map((conv) =>
              conv.id === updatedConversation.id ? updatedConversation : conv
            ),
          };
        });
      },

      updateMessage: (id, updates) => {
        set((state) => {
          if (!state.currentConversation) return state;

          const updatedMessages = state.currentConversation.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          );

          const updatedConversation: Conversation = {
            ...state.currentConversation,
            messages: updatedMessages,
            updatedAt: Date.now(),
          };

          return {
            currentConversation: updatedConversation,
            conversations: state.conversations.map((conv) =>
              conv.id === updatedConversation.id ? updatedConversation : conv
            ),
          };
        });
      },

      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
          currentConversation:
            state.currentConversation?.id === id ? null : state.currentConversation,
        }));
      },

      clearConversations: () => {
        set({ conversations: [], currentConversation: null });
      },

      saveConversation: (conversation) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversation.id ? conversation : conv
          ),
          currentConversation:
            state.currentConversation?.id === conversation.id
              ? conversation
              : state.currentConversation,
        }));
      },

      // Audio state actions
      setAudioState: (audioState) => {
        set((state) => ({
          audioState: { ...state.audioState, ...audioState },
        }));
      },

      setRecording: (isRecording) => {
        set((state) => ({
          audioState: { ...state.audioState, isRecording },
        }));
      },

      setPlaying: (isPlaying) => {
        set((state) => ({
          audioState: { ...state.audioState, isPlaying },
        }));
      },

      setSpeaking: (isSpeaking) => {
        set((state) => ({
          audioState: { ...state.audioState, isSpeaking },
        }));
      },

      setListening: (isListening) => {
        set((state) => ({
          audioState: { ...state.audioState, isListening },
        }));
      },

      setError: (errorMessage) => {
        set((state) => ({
          audioState: {
            ...state.audioState,
            hasError: !!errorMessage,
            errorMessage,
          },
        }));
      },

      // Preferences actions
      setUserPreferences: (preferences) => {
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences },
        }));
      },

      setVoiceSettings: (settings) => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            voiceSettings: {
              ...state.userPreferences.voiceSettings,
              ...settings,
            },
          },
        }));
      },

      setTheme: (theme) => {
        set((state) => ({
          userPreferences: { ...state.userPreferences, theme },
        }));
      },

      // Connection actions
      setConnected: (isConnected) => {
        set({ isConnected });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },
    }),
    {
      name: CONSTANTS.STORAGE.CONVERSATIONS,
      version: 1,
    }
  )
);

export default useConversationStore;
