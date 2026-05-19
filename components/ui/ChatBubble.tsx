import React from 'react';
import classNames from 'classnames';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
  audioUrl?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  role,
  content,
  timestamp,
  audioUrl,
}) => {
  const isUser = role === 'user';

  return (
    <div className={classNames('flex gap-3 mb-4', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={classNames(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
          isUser
            ? 'bg-brand-500 text-white'
            : 'bg-gradient-to-br from-brand-500 to-brand-600 text-white'
        )}
      >
        {isUser ? 'U' : 'AI'}
      </div>

      {/* Message Content */}
      <div className={classNames('flex flex-col gap-1 max-w-md', isUser && 'items-end')}>
        <div
          className={classNames(
            'px-4 py-3 rounded-lg break-words',
            isUser
              ? 'bg-brand-600 text-white rounded-br-none'
              : 'bg-dark-700 text-dark-50 rounded-bl-none border border-dark-600'
          )}
        >
          <p className="text-sm leading-relaxed">{content}</p>
          {audioUrl && (
            <div className="mt-3 pt-3 border-t border-current border-opacity-20">
              <audio
                controls
                src={audioUrl}
                className="w-full max-w-xs h-8"
                controlsList="nodownload"
              />
            </div>
          )}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span className="text-xs text-dark-500">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </div>
  );
};
