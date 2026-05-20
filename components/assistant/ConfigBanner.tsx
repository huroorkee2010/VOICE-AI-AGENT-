'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DiagnosticsState } from '@/hooks/useDiagnostics';
import {
  AlertTriangle,
  ExternalLink,
  RefreshCcw,
  Sparkles,
} from 'lucide-react';

interface ConfigBannerProps {
  diagnostics: DiagnosticsState;
  onReload: () => void;
  onTestApis: () => void;
}

const statusColors = {
  ok: 'text-emerald-300',
  warning: 'text-amber-300',
  error: 'text-red-400',
  missing: 'text-yellow-300',
  idle: 'text-slate-400',
};

export const ConfigBanner: React.FC<ConfigBannerProps> = ({
  diagnostics,
  onReload,
  onTestApis,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const warnings = useMemo(() => {
    const items: string[] = [];

    if (!diagnostics.openAIConfigured) {
      items.push('OpenAI API key not configured');
    }
    if (!diagnostics.elevenLabsConfigured) {
      items.push('Voice services unavailable (ElevenLabs key missing)');
    }
    if (!diagnostics.deepgramConfigured) {
      items.push('Speech-to-text disabled (Deepgram or OpenAI audio key missing)');
    }
    if (diagnostics.debugMode) {
      items.push('Running in mock/debug mode');
    }
    return items;
  }, [diagnostics]);

  if (!diagnostics.debugMode && warnings.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-16 z-40 px-4 sm:px-6 lg:px-8 pt-3">
      <Card
        glass
        className="border-brand-500/20 bg-white/10 shadow-2xl shadow-black/30 animate-slide-down-fade overflow-hidden"
      >
        <div className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300 ring-1 ring-amber-300/20">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-white">Configuration notice</h2>
                <p className="mt-1 text-sm text-dark-300 sm:text-base">
                  The assistant is showing configuration and diagnostic warnings.
                  Review the status below and take action if needed.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onReload}
                className="border border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <RefreshCcw className="h-4 w-4" />
                Reload Config
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onTestApis}
                disabled={diagnostics.isTesting}
                className="border border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Sparkles className="h-4 w-4" />
                {diagnostics.isTesting ? 'Testing…' : 'Test APIs'}
              </Button>
              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <ExternalLink className="h-4 w-4" />
                Open Vercel Settings
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {warnings.map((warning) => (
              <div
                key={warning}
                className="rounded-3xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-100"
              >
                {warning}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-dark-300">{diagnostics.apiTestMessage}</p>
            </div>
            <button
              onClick={() => setShowDetails((prev) => !prev)}
              className="text-sm text-white hover:text-brand-300"
            >
              {showDetails ? 'Hide debug panel' : 'Show debug panel'}
            </button>
          </div>

          {showDetails && (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <StatusCard label="OpenAI" status={diagnostics.openAIConfigured ? 'ok' : 'missing'} />
              <StatusCard label="ElevenLabs" status={diagnostics.elevenLabsConfigured ? 'ok' : 'missing'} />
              <StatusCard label="Deepgram" status={diagnostics.deepgramConfigured ? 'ok' : 'missing'} />
              <StatusCard
                label="Speech synth"
                status={diagnostics.speechSynthesisSupported ? 'ok' : 'error'}
              />
              <StatusCard
                label="Speech recog"
                status={diagnostics.speechRecognitionSupported ? 'ok' : 'error'}
              />
              <StatusCard
                label="Microphone"
                status={diagnostics.microphoneStatus === 'granted' ? 'ok' : 'warning'}
                subtitle={diagnostics.microphoneStatus}
              />
              <StatusCard label="HTTPS" status={diagnostics.httpsSecure ? 'ok' : 'warning'} />
              <StatusCard
                label="Chat API"
                status={diagnostics.apiTestStatus.chat}
              />
              <StatusCard
                label="TTS API"
                status={diagnostics.apiTestStatus.textToSpeech}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

interface StatusCardProps {
  label: string;
  status: keyof typeof statusColors;
  subtitle?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ label, status, subtitle }) => (
  <div className="rounded-3xl border border-white/10 bg-dark-900/80 p-4">
    <div className="flex items-center justify-between gap-2">
      <p className="text-sm text-dark-200">{label}</p>
      <span className={`text-xs font-semibold ${statusColors[status]}`}>
        {status.toUpperCase()}
      </span>
    </div>
    {subtitle && <p className="mt-2 text-xs text-dark-400">{subtitle}</p>}
  </div>
);
