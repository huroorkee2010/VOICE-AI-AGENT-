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
      <button
        onClick={isRecording ? onStop : onStart}
        disabled={disabled}
        className={classNames(
          'relative w-28 h-28 rounded-full flex items-center justify-center text-white',
          'transition-all duration-300 transform',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          isRecording
            ? 'bg-red-500 hover:bg-red-600 active:scale-95 shadow-[0_0_40px_rgba(239,68,68,0.30)]'
            : 'bg-gradient-to-br from-brand-500 to-cyan-500 hover:scale-[1.02] active:scale-95 shadow-[0_20px_60px_rgba(56,189,248,0.25)]'
        )}
      >
        {isRecording && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full border-2 border-red-400/30 animate-pulse-ring" />
          </>
        )}

        <div className="relative z-10">
          {isRecording ? (
            <Square className="w-14 h-14 fill-current" />
          ) : (
            <Mic className="w-14 h-14" />
          )}
        </div>
      </button>

      <div className="flex flex-col items-center gap-1">
        <span className={classNames(
          'text-sm font-semibold tracking-wide transition-colors',
          isRecording ? 'text-red-300' : disabled ? 'text-dark-400' : 'text-emerald-300'
        )}>
          {isRecording ? 'Recording Live' : disabled ? 'Microphone inactive' : 'Tap to speak'}
        </span>
        <span className={classNames(
          'font-mono text-base transition-colors',
          isRecording ? 'text-red-200' : 'text-dark-300'
        )}>
          {formatTime(recordingTime)}
        </span>
      </div>
    </div>
  );
};
