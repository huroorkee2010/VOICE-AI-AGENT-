import { MessageSquare, Trash2, Plus, X } from 'lucide-react';
import { Conversation } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import classNames from 'classnames';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
  onCreateNew: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onCreateNew,
  onDeleteConversation,
  isOpen,
  onClose,
}) => {
  return (
    <aside
      className={classNames(
        'fixed inset-y-0 left-0 z-30 w-64 bg-dark-900 border-r border-dark-700',
        'transform transition-transform duration-300',
        'md:fixed md:translate-x-0 md:inset-y-0 md:left-0 md:z-40',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-dark-700">
        <h2 className="text-lg font-bold text-white">Conversations</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCreateNew}
            className="p-2 h-auto w-auto"
            title="New conversation"
          >
            <Plus className="w-5 h-5" />
          </Button>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-lg hover:bg-dark-700 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-dark-600 mx-auto mb-2 opacity-50" />
            <p className="text-dark-500 text-sm">No conversations yet</p>
            <Button
              variant="primary"
              size="sm"
              onClick={onCreateNew}
              className="mt-4 w-full"
            >
              Start One
            </Button>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={classNames(
                'group relative p-3 rounded-lg cursor-pointer transition-all duration-200',
                currentConversationId === conversation.id
                  ? 'bg-brand-500/20 border border-brand-500/30'
                  : 'hover:bg-dark-700 border border-dark-700'
              )}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-brand-400 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {conversation.title}
                  </p>
                  <p className="text-xs text-dark-500">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Delete button on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conversation.id);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete conversation"
              >
                <Trash2 className="w-4 h-4 text-dark-400 hover:text-red-400" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-dark-700 p-4 text-xs text-dark-500">
        <p>© 2024 HUVOICE AI</p>
      </div>
    </aside>
  );
};
