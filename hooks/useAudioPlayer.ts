import { useEffect, useRef, useState, useCallback } from 'react';
import { CONSTANTS } from '@/lib/constants';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);

  // Initialize audio element
  const initializeAudio = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = 'anonymous';

      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current?.duration || 0);
      };

      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      };

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audioRef.current.onerror = () => {
        setError(CONSTANTS.ERRORS.AUDIO_PLAYBACK_ERROR);
        setIsPlaying(false);
      };
    }

    if (!audioContextRef.current) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();

        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioContextRef.current.destination);
      } catch (err) {
        console.warn('Audio context not available');
      }
    }
  }, []);

  // Play audio from blob or URL
  const play = useCallback(
    async (blobOrUrl: Blob | string) => {
      try {
        initializeAudio();
        setError(null);

        if (!audioRef.current) return;

        if (blobOrUrl instanceof Blob) {
          const url = URL.createObjectURL(blobOrUrl);
          audioRef.current.src = url;
        } else {
          audioRef.current.src = blobOrUrl;
        }

        audioRef.current.volume = volume;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : CONSTANTS.ERRORS.AUDIO_PLAYBACK_ERROR;
        setError(errorMessage);
        setIsPlaying(false);
      }
    },
    [initializeAudio, volume]
  );

  // Pause playback
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Stop playback
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  // Seek to time
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Set volume
  const setAudioVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  // Get frequency data for visualization
  const getFrequencyData = useCallback((): Uint8Array | null => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      setFrequencyData(dataArray);
      return dataArray;
    }
    return null;
  }, []);

  // Cleanup
  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  // Close audio context on cleanup
  useEffect(() => {
    return () => {
      cleanup();
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        audioContextRef.current.close();
      }
    };
  }, [cleanup]);

  return {
    play,
    pause,
    stop,
    seek,
    setVolume: setAudioVolume,
    getFrequencyData,
    isPlaying,
    duration,
    currentTime,
    volume,
    error,
    frequencyData,
    cleanup,
  };
};
