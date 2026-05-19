'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useConversationStore } from '@/store/conversation';
import { CONSTANTS, VOICES } from '@/lib/constants';
import { Sun, Volume2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const store = useConversationStore();
  const [savedMessage, setSavedMessage] = useState('');

  const voiceSettings = {
    voiceId:
      store.userPreferences.voiceSettings.voiceId ||
      CONSTANTS.VOICE.DEFAULT_VOICE_ID,
    stability:
      store.userPreferences.voiceSettings.stability ??
      CONSTANTS.VOICE.DEFAULT_STABILITY,
    similarityBoost:
      store.userPreferences.voiceSettings.similarityBoost ??
      CONSTANTS.VOICE.DEFAULT_SIMILARITY,
    language:
      store.userPreferences.voiceSettings.language ||
      CONSTANTS.VOICE.DEFAULT_LANGUAGE,
    model:
      store.userPreferences.voiceSettings.model ||
      CONSTANTS.VOICE.DEFAULT_MODEL,
    temperature:
      store.userPreferences.voiceSettings.temperature ??
      CONSTANTS.VOICE.DEFAULT_TEMPERATURE,
    maxTokens:
      store.userPreferences.voiceSettings.maxTokens ??
      CONSTANTS.VOICE.DEFAULT_MAX_TOKENS,
  };

  const handleSaveSettings = () => {
    setSavedMessage('Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
    toast.success('Settings saved!');
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings?')) {
      store.setUserPreferences({
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
      });
      toast.success('Settings reset to default');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      <Navbar currentPage="settings" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-dark-400">Customize your Jarvis AI experience</p>
        </motion.div>

        {/* Saved Message */}
        {savedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400"
          >
            {savedMessage}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sun className="w-5 h-5 text-brand-400" />
                <h2 className="text-xl font-semibold">Appearance</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <div className="flex gap-4">
                    {(['dark', 'light', 'auto'] as const).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => store.setTheme(theme)}
                        className={`px-4 py-2 rounded-lg border transition-all duration-200 capitalize ${
                          store.userPreferences.theme === theme
                            ? 'bg-brand-500/20 border-brand-500/50 text-white'
                            : 'border-dark-600 hover:border-dark-500'
                        }`}
                      >
                        {theme === 'auto' ? '🔄 Auto' : theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Voice Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Volume2 className="w-5 h-5 text-brand-400" />
                <h2 className="text-xl font-semibold">Voice Settings</h2>
              </div>

              <div className="space-y-4">
                {/* Voice ID */}
                <div>
                  <label className="block text-sm font-medium mb-2">Voice</label>
                  <select
                    value={store.userPreferences.voiceSettings.voiceId}
                    onChange={(e) =>
                      store.setVoiceSettings({ voiceId: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-dark-700 border border-dark-600 focus:border-brand-500 focus:outline-none transition-colors"
                  >
                    {Object.entries(VOICES.ELEVENLABS).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stability */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stability: {voiceSettings.stability.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={voiceSettings.stability}
                    onChange={(e) =>
                      store.setVoiceSettings({ stability: parseFloat(e.target.value) })
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-dark-400 mt-1">
                    Higher values produce more consistent voices
                  </p>
                </div>

                {/* Similarity Boost */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Similarity Boost: {voiceSettings.similarityBoost.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={voiceSettings.similarityBoost}
                    onChange={(e) =>
                      store.setVoiceSettings({
                        similarityBoost: parseFloat(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-dark-400 mt-1">
                    Higher values make the voice match the original better
                  </p>
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Temperature: {voiceSettings.temperature.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={voiceSettings.temperature}
                    onChange={(e) =>
                      store.setVoiceSettings({ temperature: parseFloat(e.target.value) })
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-dark-400 mt-1">
                    Higher values make responses more creative
                  </p>
                </div>

                {/* Max Tokens */}
                <Input
                  type="number"
                  label="Max Tokens"
                  value={voiceSettings.maxTokens}
                  onChange={(e) =>
                    store.setVoiceSettings({
                      maxTokens: parseInt(e.target.value) || 500,
                    })
                  }
                />
              </div>
            </Card>
          </motion.div>

          {/* Behavior Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-brand-400" />
                <h2 className="text-xl font-semibold">Behavior</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer hover:bg-dark-700/50 p-3 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={store.userPreferences.autoPlay}
                    onChange={(e) =>
                      store.setUserPreferences({ autoPlay: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-brand-500"
                  />
                  <div>
                    <p className="font-medium">Auto-play responses</p>
                    <p className="text-sm text-dark-400">
                      Automatically play AI responses when ready
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer hover:bg-dark-700/50 p-3 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={store.userPreferences.autoTranscribe}
                    onChange={(e) =>
                      store.setUserPreferences({ autoTranscribe: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-brand-500"
                  />
                  <div>
                    <p className="font-medium">Auto-transcribe</p>
                    <p className="text-sm text-dark-400">
                      Automatically transcribe audio input
                    </p>
                  </div>
                </label>
              </div>
            </Card>
          </motion.div>

          {/* API Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">API Configuration</h2>

              <div className="space-y-4 p-4 bg-dark-700/50 rounded-lg border border-dark-600">
                <p className="text-sm text-dark-400">
                  📝 API keys are configured via environment variables. Update your{' '}
                  <code className="bg-dark-800 px-2 py-1 rounded">.env.local</code> file with:
                </p>
                <ul className="text-xs text-dark-500 space-y-1 font-mono">
                  <li>OPENAI_API_KEY</li>
                  <li>ELEVENLABS_API_KEY</li>
                  <li>DEEPGRAM_API_KEY</li>
                </ul>
              </div>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button variant="primary" onClick={handleSaveSettings} fullWidth>
              Save Settings
            </Button>
            <Button variant="secondary" onClick={handleResetSettings} fullWidth>
              Reset to Default
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
