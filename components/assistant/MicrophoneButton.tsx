import React from 'react';
import { Mic, Square } from 'lucide-react';
import classNames from 'classnames';

interface MicrophoneButtonProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
  recordingTime?: number;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  isRecording,
  onStart,
  onStop,
  disabled = false,
  recordingTime = 0,
}) => {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Animated Microphone Button */}
      <button
        onClick={isRecording ? onStop : onStart}
        disabled={disabled}
        className={classNames(
          'relative w-24 h-24 rounded-full flex items-center justify-center font-bold',
          'transition-all duration-200 transform',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isRecording
            ? 'bg-red-500 hover:bg-red-600 active:scale-95 shadow-lg shadow-red-500/50'
            : 'bg-brand-500 hover:bg-brand-600 active:scale-95 shadow-lg shadow-brand-500/50'
        )}
      >
        {/* Pulse rings */}
        {isRecording && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-500 opacity-25 animate-pulse-ring" />
            <div
              className="absolute inset-0 rounded-full border-2 border-red-400 opacity-30 animate-pulse-ring"
              style={{ animationDelay: '0.3s' }}
            />
          </>
        )}

        {/* Icon */}
        <div className="relative z-10 text-white">
          {isRecording ? (
            <Square className="w-12 h-12 fill-current" />
          ) : (
            <Mic className="w-12 h-12" />
          )}
        </div>
      </button>

      {/* Recording Time Display */}
      {isRecording && (
        <div className="text-center">
          <p className="text-red-500 font-mono text-lg">
            {formatTime(recordingTime)}
          </p>
          <p className="text-xs text-dark-400 mt-1">Recording...</p>
        </div>
      )}
    </div>
  );
};
