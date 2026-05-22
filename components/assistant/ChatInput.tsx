'use client';

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Square, Loader } from 'lucide-react';
import classNames from 'classnames';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onMicStart: () => void;
  onMicStop: () => void;
  isRecording: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isDisabled: boolean;
  recordingTime?: number;
  detectedLanguage?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onMicStart,
  onMicStop,
  isRecording,
  isProcessing,
  isSpeaking,
  isDisabled,
  recordingTime = 0,
  detectedLanguage = 'en',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMicClick = () => {
    if (isRecording) {
      onMicStop();
    } else {
      onMicStart();
    }
  };

  const handleSend = () => {
    if (value.trim()) {
      onSend();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isDisabled) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim() && !isDisabled && !isRecording && !isSpeaking && !isProcessing;
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      {/* Language Indicator and Recording Time */}
      <div className="flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-mono text-red-300"
            >
              {formatTime(recordingTime)}
            </motion.div>
          )}
        </div>
        {detectedLanguage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs px-3 py-1 rounded-full bg-dark-700/50 border border-dark-600 text-dark-300 tracking-wide"
          >
            {detectedLanguage === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
          </motion.div>
        )}
      </div>

      {/* Input Container */}
      <div className="px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex items-center gap-2 bg-gradient-to-r from-dark-800 to-dark-700 rounded-2xl border border-dark-600 shadow-lg hover:border-dark-500 transition-all duration-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 group"
        >
          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isRecording ? 'Listening...' : 'Type or speak your message...'}
            disabled={isDisabled}
            className={classNames(
              'flex-1 px-6 py-4 bg-transparent border-none outline-none text-white placeholder-dark-400',
              'text-base sm:text-lg',
              'transition-all duration-200',
              isDisabled && 'opacity-60 cursor-not-allowed'
            )}
          />

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 pr-2 sm:pr-3">
            {/* Recording Status Indicator */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-red-500"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Microphone Button */}
            <motion.button
              whileHover={{ scale: isDisabled ? 1 : 1.05 }}
              whileTap={{ scale: isDisabled ? 1 : 0.95 }}
              onClick={handleMicClick}
              disabled={isDisabled}
              className={classNames(
                'relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0',
                'transform active:scale-95',
                isRecording
                  ? 'bg-red-500/20 border-2 border-red-500 text-red-400 hover:bg-red-500/30'
                  : isDisabled
                  ? 'bg-dark-600 border border-dark-600 text-dark-400 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-cyan-500/50 text-cyan-400 hover:border-cyan-400 hover:from-blue-500/30 hover:to-cyan-500/30',
                'shadow-[0_0_20px_rgba(6,182,212,0.15)]'
              )}
              title={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording && (
                <>
                  <motion.div
                    animate={{ r: [20, 30, 20], opacity: [0.8, 0.2, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2 border-red-500/50"
                  />
                </>
              )}
              <motion.div
                key={isRecording ? 'stop' : 'mic'}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative z-10"
              >
                {isRecording ? (
                  <Square className="w-5 h-5 fill-current" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </motion.div>
            </motion.button>

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: canSend ? 1.05 : 1 }}
              whileTap={{ scale: canSend ? 0.95 : 1 }}
              onClick={handleSend}
              disabled={!canSend}
              className={classNames(
                'relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0',
                'transform active:scale-95',
                canSend
                  ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                  : 'bg-dark-600 border border-dark-600 text-dark-400 cursor-not-allowed opacity-50',
                'group-focus-within:shadow-[0_0_30px_rgba(16,185,129,0.4)]'
              )}
              title="Send message"
            >
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="relative z-10"
                >
                  <Loader className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative z-10"
                >
                  <Send className="w-5 h-5" />
                </motion.div>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Status Text */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs text-red-300/70 text-center"
          >
            🎤 Listening... Say something natural
          </motion.div>
        )}
      </div>
    </div>
  );
};
