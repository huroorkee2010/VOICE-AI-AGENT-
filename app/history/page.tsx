'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useConversationStore } from '@/store/conversation';
import { Download, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const store = useConversationStore();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  const currentConversation = store.conversations.find(
    (c) => c.id === selectedConversation
  );

  const handleExport = (conversationId: string) => {
    const conversation = store.conversations.find((c) => c.id === conversationId);
    if (!conversation) return;

    const data = JSON.stringify(conversation, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${conversation.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Conversation exported');
  };

  const handleDelete = (conversationId: string) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      store.deleteConversation(conversationId);
      setSelectedConversation(null);
      toast.success('Conversation deleted');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      <Navbar currentPage="history" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Conversation History</h1>
          <p className="text-dark-400">
            View and manage all your previous conversations
          </p>
        </motion.div>

        {store.conversations.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-dark-400 mb-4">No conversations yet</p>
            <Link
              href="/assistant"
              className="inline-flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-white transition hover:bg-brand-600"
            >
              Start a Conversation
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card className="p-4 h-full overflow-y-auto max-h-96 lg:max-h-none">
                <h2 className="font-semibold mb-4">Conversations</h2>
                <div className="space-y-2">
                  {store.conversations.map((conversation) => (
                    <motion.button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      whileHover={{ scale: 1.02 }}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        selectedConversation === conversation.id
                          ? 'bg-brand-500/20 border border-brand-500/30'
                          : 'hover:bg-dark-700 border border-transparent'
                      }`}
                    >
                      <p className="font-medium truncate">{conversation.title}</p>
                      <p className="text-xs text-dark-500">
                        {conversation.messages.length} messages
                      </p>
                      <p className="text-xs text-dark-600 mt-1">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Conversation Details */}
            <div className="lg:col-span-2">
              {currentConversation ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {/* Header */}
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">{currentConversation.title}</h2>
                        <p className="text-dark-400 text-sm mt-1">
                          {currentConversation.messages.length} messages
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExport(currentConversation.id)}
                          title="Export"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(currentConversation.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="bg-dark-700/50 p-3 rounded-lg">
                        <p className="text-dark-400">Created</p>
                        <p className="font-semibold">
                          {new Date(currentConversation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-dark-700/50 p-3 rounded-lg">
                        <p className="text-dark-400">Updated</p>
                        <p className="font-semibold">
                          {new Date(currentConversation.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-dark-700/50 p-3 rounded-lg">
                        <p className="text-dark-400">Model</p>
                        <p className="font-semibold">{currentConversation.model || 'GPT-4o'}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Messages */}
                  <Card className="p-6 max-h-96 overflow-y-auto space-y-4">
                    {currentConversation.messages.map((message, idx) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-4 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-brand-600 text-white'
                            : 'bg-dark-700 text-dark-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold capitalize">{message.role}</p>
                          <p className="text-xs opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </motion.div>
                    ))}
                  </Card>
                </motion.div>
              ) : (
                <Card className="p-12 text-center h-96 flex items-center justify-center">
                  <p className="text-dark-400">Select a conversation to view details</p>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
