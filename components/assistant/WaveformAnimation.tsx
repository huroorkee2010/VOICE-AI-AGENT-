import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

interface WaveformAnimationProps {
  isActive: boolean;
  color?: string;
  intensity?: number;
}

export const WaveformAnimation: React.FC<WaveformAnimationProps> = ({
  isActive,
  color = 'rgb(14, 165, 233)',
  intensity = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const waves = [
      { frequency: 0.02, amplitude: 15, phase: 0 },
      { frequency: 0.015, amplitude: 10, phase: Math.PI / 3 },
      { frequency: 0.025, amplitude: 8, phase: (Math.PI * 2) / 3 },
    ];

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
      ctx.fillRect(0, 0, width, height);

      // Draw waves
      waves.forEach((wave, index) => {
        ctx.strokeStyle = color;
        ctx.globalAlpha = isActive ? 0.6 - index * 0.15 : 0.2 - index * 0.05;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 0; x < width; x += 1) {
          const y =
            height / 2 +
            Math.sin((x * wave.frequency + time + wave.phase) * intensity) *
              wave.amplitude *
              (isActive ? 1 : 0.5);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      });

      time += isActive ? 0.5 : 0.1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, color, intensity]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={120}
      className={classNames(
        'w-full rounded-lg',
        isActive ? 'opacity-100' : 'opacity-50'
      )}
    />
  );
};
