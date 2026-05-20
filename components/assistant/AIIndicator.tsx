import React from 'react';
import { Loader } from 'lucide-react';
import classNames from 'classnames';

interface AIIndicatorProps {
  status: 'idle' | 'listening' | 'processing' | 'speaking';
  isReady?: boolean;
  message?: string;
}

export const AIIndicator: React.FC<AIIndicatorProps> = ({ status, isReady = true, message }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'listening':
        return {
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          label: 'Listening...',
          icon: (
            <svg className="w-4 h-4 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1C6.48 1 2 5.48 2 11v10h4v-4h2v4h4v-4h2v4h4V11c0-5.52-4.48-10-10-10zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm12 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
          ),
        };
      case 'processing':
        return {
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          label: 'Processing...',
          icon: <Loader className="w-4 h-4 animate-spin" />,
        };
      case 'speaking':
        return {
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          label: 'Speaking...',
          icon: (
            <svg className="w-4 h-4 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          ),
        };
      default:
        return {
          color: isReady ? 'text-emerald-300' : 'text-dark-300',
          bgColor: isReady ? 'bg-emerald-500/10' : 'bg-dark-700/70',
          label: isReady ? 'Ready' : 'Inactive',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" opacity="0.2" />
              <circle cx="12" cy="12" r="6" opacity="0.4" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          ),
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={classNames(
        'flex items-center gap-2 px-4 py-2 rounded-lg',
        'transition-all duration-300',
        config.bgColor
      )}
    >
      <div className={config.color}>
        {config.icon}
      </div>
      <span className={classNames('text-sm font-medium', config.color)}>
        {message || config.label}
      </span>
    </div>
  );
};
