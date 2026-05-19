import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

interface VoiceVisualizerProps {
  isActive?: boolean;
  frequency?: Uint8Array | null;
  style?: 'bars' | 'waveform' | 'dots';
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isActive = false,
  frequency = null,
  style = 'bars',
}) => {
  const [bars, setBars] = useState<number[]>(Array(32).fill(0.2));

  useEffect(() => {
    if (frequency && isActive) {
      const newBars = Array.from(frequency.slice(0, 32)).map(
        (value) => (value / 255) * 0.8 + 0.2
      );
      setBars(newBars);
    }
  }, [frequency, isActive]);

  if (style === 'bars') {
    return (
      <div className="flex items-center justify-center gap-1 h-12">
        {bars.map((height, idx) => (
          <div
            key={idx}
            className={classNames(
              'w-1 rounded-full transition-all duration-100',
              isActive
                ? 'bg-gradient-to-t from-brand-500 to-brand-300'
                : 'bg-dark-600'
            )}
            style={{
              height: `${Math.max(8, height * 100)}%`,
            }}
          />
        ))}
      </div>
    );
  }

  if (style === 'waveform') {
    return (
      <svg
        viewBox="0 0 200 60"
        className="w-full h-16"
        preserveAspectRatio="none"
      >
        <polyline
          points={bars
            .map(
              (height, idx) =>
                `${(idx / bars.length) * 200},${30 - height * 20}`
            )
            .join(' ')}
          fill="none"
          stroke={isActive ? 'rgb(14, 165, 233)' : 'rgb(107, 114, 128)'}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }

  // Dots style
  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((idx) => (
        <div
          key={idx}
          className={classNames(
            'rounded-full transition-all duration-300',
            isActive
              ? 'bg-brand-500 animate-pulse'
              : 'bg-dark-600',
            idx === 0 && 'w-2 h-2',
            idx === 1 && 'w-3 h-3',
            idx === 2 && 'w-2 h-2'
          )}
          style={{
            animationDelay: `${idx * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};
