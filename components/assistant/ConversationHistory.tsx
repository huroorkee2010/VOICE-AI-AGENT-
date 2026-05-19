import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Message } from '@/lib/types';
import { ChatBubble } from '@/components/ui/ChatBubble';
import { Button } from '@/components/ui/Button';
import classNames from 'classnames';

interface ConversationHistoryProps {
  messages: Message[];
  isLoading?: boolean;
  onDeleteMessage?: (messageId: string) => void;
  onClear?: () => void;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  messages,
  isLoading = false,
  onDeleteMessage,
  onClear,
}) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = React.useCallback(() => {
    if (messagesEndRef.current) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [messages, isLoading, autoScroll, scrollToBottom]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-dark-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-dark-400">No messages yet. Start a conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={classNames(
              'group relative transition-all duration-200',
              'hover:bg-dark-700/50 rounded-lg p-2'
            )}
          >
            <ChatBubble
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              audioUrl={message.audioUrl}
            />

            {/* Delete button on hover */}
            {onDeleteMessage && message.role === 'user' && (
              <button
                onClick={() => onDeleteMessage(message.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete message"
              >
                <Trash2 className="w-4 h-4 text-dark-400 hover:text-red-400" />
              </button>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center text-sm font-bold">
              AI
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer Actions */}
      <div className="border-t border-dark-700 p-4 flex items-center justify-between bg-dark-800/50">
        <label className="flex items-center gap-2 text-sm text-dark-400 cursor-pointer hover:text-white transition-colors">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="rounded"
          />
          Auto-scroll
        </label>

        {onClear && messages.length > 0 && (
          <Button
            variant="danger"
            size="sm"
            onClick={onClear}
          >
            Clear History
          </Button>
        )}
      </div>
    </div>
  );
};
