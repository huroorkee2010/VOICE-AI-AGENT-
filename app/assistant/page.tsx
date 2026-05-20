'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { MicrophoneButton } from '@/components/assistant/MicrophoneButton';
import { AIIndicator } from '@/components/assistant/AIIndicator';
import { WaveformAnimation } from '@/components/assistant/WaveformAnimation';
import { ConversationHistory } from '@/components/assistant/ConversationHistory';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { useConversationStore } from '@/store/conversation';
import { Send, Menu, X, Maximize2, Minimize2 } from 'lucide-react';

export default function AssistantPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const [isReady, setIsReady] = useState(true);
  const store = useConversationStore();
  const voiceChat = useVoiceChat();

  const {
    startListening,
    stopListening,
    sendMessage,
    interruptAI,
    clearConversation,
    isProcessing,
  } = voiceChat;

  const handleToggleReady = () => {
    if (isReady) {
      interruptAI();
      stopListening();
    }
    setIsReady(!isReady);
  };

  const { isRecording, isSpeaking, isListening } = store.audioState;

  // Get status for indicator
  const getStatus = (): 'idle' | 'listening' | 'processing' | 'speaking' => {
    if (!isReady) return 'idle';
    if (isSpeaking) return 'speaking';
    if (voiceChat.isWaitingForAI || isProcessing) return 'processing';
    if (isListening) return 'listening';
    if (isRecording) return 'listening';
    return 'idle';
  };

  // Handle text message submission
  const handleSendMessage = () => {
    if (!textInput.trim()) return;
    sendMessage(textInput);
    setTextInput('');
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle microphone button press (push to talk)
  const handleMicStart = () => {
    startListening();
  };

  const handleMicStop = () => {
    stopListening();
  };

  return (
    <div className={`min-h-screen flex flex-col bg-dark-950 ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Navbar */}
      <Navbar currentPage="assistant" />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar - Fixed positioning for all screen sizes */}
        <Sidebar
          conversations={store.conversations}
          currentConversationId={store.currentConversation?.id}
          onSelectConversation={(conv) => store.setCurrentConversation(conv)}
          onCreateNew={() => store.createConversation()}
          onDeleteConversation={(id) => store.deleteConversation(id)}
          isOpen={sidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden md:ml-64">
          {/* Header */}
          <header className="border-b border-dark-700 bg-dark-900/50 backdrop-blur-sm px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-dark-700 rounded-lg transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              <div>
                <h1 className="text-xl font-bold">Voice Assistant</h1>
                <p className="text-sm text-dark-400">
                  {store.currentConversation?.title || 'No conversation'}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant={isReady ? 'secondary' : 'ghost'}
                size="sm"
                onClick={handleToggleReady}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${isReady ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25' : 'bg-dark-700/80 text-dark-200 border border-dark-600 hover:bg-dark-600'}`}
              >
                {isReady ? 'READY ON' : 'READY OFF'}
              </Button>
              <AIIndicator
                status={getStatus()}
                isReady={isReady}
                message={!isReady ? 'Inactive' : undefined}
              />
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {fullscreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </header>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-dark-950">
            <ConversationHistory
              messages={store.currentConversation?.messages || []}
              isLoading={voiceChat.isWaitingForAI}
              onClear={clearConversation}
            />
          </div>

          {/* Voice Visualizer and Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-dark-700 bg-dark-900/50 backdrop-blur-sm"
          >
            {/* Waveform */}
            <div className="px-4 sm:px-6 py-4 border-b border-dark-700">
              <WaveformAnimation
                isActive={isRecording || isSpeaking}
                color={isSpeaking ? 'rgb(74, 222, 128)' : 'rgb(14, 165, 233)'}
              />
            </div>

            {/* Controls */}
            <div className="px-4 sm:px-6 py-6 space-y-4">
              {/* Voice Input Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center gap-3">
                  <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${isRecording ? 'bg-red-500/15 text-red-300 border border-red-500/30 animate-glow-pulse' : isReady ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-dark-700/70 text-dark-300 border border-dark-700'}`}>
                    <span className="w-2 h-2 rounded-full bg-current block" />
                    {isRecording ? 'Recording...' : isReady ? 'Ready to record' : 'Assistant paused'}
                  </div>
                  <div className="text-xs text-dark-400 tracking-wide">
                    {isRecording
                      ? 'Live voice capture is active'
                      : isListening
                      ? 'Listening for speech input…'
                      : isSpeaking
                      ? 'Playing AI response…'
                      : isReady
                      ? 'Tap the mic and speak naturally'
                      : 'Turn READY ON to enable voice input'}
                  </div>
                </div>

                <MicrophoneButton
                  isRecording={isRecording}
                  onStart={handleMicStart}
                  onStop={handleMicStop}
                  disabled={!isReady || isSpeaking || voiceChat.isProcessing}
                  recordingTime={voiceChat.audioRecorder.recordingTime}
                />

                {(voiceChat.isWaitingForAI || isSpeaking || isProcessing) && (
                  <Button
                    variant="danger"
                    onClick={interruptAI}
                  >
                    Interrupt
                  </Button>
                )}
              </div>

              {/* Text Input Section */}
              <Card glass className="p-4">
                <div className="flex gap-2">
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Or type a message..."
                    disabled={!isReady || isRecording || isSpeaking || voiceChat.isProcessing}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSendMessage}
                    disabled={!isReady || !textInput.trim() || isRecording || isSpeaking || voiceChat.isProcessing}
                    size="md"
                    className="flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </Card>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => sendMessage('Hello, how are you?')}
                  disabled={!isReady || isRecording || isSpeaking || voiceChat.isProcessing}
                >
                  Hello
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => sendMessage('What time is it?')}
                  disabled={!isReady || isRecording || isSpeaking || voiceChat.isProcessing}
                >
                  Time
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => sendMessage('Tell me a joke')}
                  disabled={!isReady || isRecording || isSpeaking || voiceChat.isProcessing}
                >
                  Joke
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearConversation}
                >
                  Clear
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
