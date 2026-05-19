import { CONSTANTS } from './constants';

/**
 * Audio utility functions
 */
export const audioUtils = {
  /**
   * Get browser's audio context
   */
  getAudioContext: (): AudioContext => {
    if (typeof window === 'undefined') throw new Error('AudioContext not available');
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    return new AudioContext();
  },

  /**
   * Request microphone permission
   */
  requestMicrophone: async (): Promise<MediaStream> => {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: CONSTANTS.AUDIO.SAMPLE_RATE,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (error) {
      throw new Error(CONSTANTS.ERRORS.MICROPHONE_NOT_AVAILABLE);
    }
  },

  /**
   * Stop all audio tracks
   */
  stopAudioTracks: (stream: MediaStream): void => {
    stream.getTracks().forEach(track => track.stop());
  },

  /**
   * Convert audio blob to base64
   */
  blobToBase64: (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  /**
   * Convert base64 to blob
   */
  base64ToBlob: (base64: string, mimeType = 'audio/mpeg'): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  },

  /**
   * Create blob URL for audio
   */
  createBlobUrl: (blob: Blob): string => {
    return URL.createObjectURL(blob);
  },

  /**
   * Revoke blob URL
   */
  revokeBlobUrl: (url: string): void => {
    URL.revokeObjectURL(url);
  },

  /**
   * Get audio duration
   */
  getAudioDuration: (blob: Blob): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(blob);
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(audio.duration);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get audio duration'));
      };
      audio.src = url;
    });
  },

  /**
   * Resample audio
   */
  resampleAudio: async (
    audioBuffer: AudioBuffer,
    targetSampleRate: number
  ): Promise<AudioBuffer> => {
    const audioContext = audioUtils.getAudioContext();
    
    if (audioBuffer.sampleRate === targetSampleRate) {
      return audioBuffer;
    }

    const rawData = audioBuffer.getChannelData(0);
    const length = Math.round(rawData.length * targetSampleRate / audioBuffer.sampleRate);
    const resampled = new Float32Array(length);
    let j = 0;

    for (let i = 0; i < length; i++) {
      const fi = i * audioBuffer.sampleRate / targetSampleRate;
      const x = fi - Math.floor(fi);
      const n0 = Math.floor(fi);
      const n1 = n0 + 1;

      resampled[i] = rawData[n0] * (1 - x) + rawData[n1] * x;
      j++;
    }

    const resampledBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      length,
      targetSampleRate
    );
    resampledBuffer.getChannelData(0).set(resampled);

    return resampledBuffer;
  },
};

/**
 * String utility functions
 */
export const stringUtils = {
  /**
   * Generate unique ID
   */
  generateId: (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Truncate string with ellipsis
   */
  truncate: (str: string, length: number): string => {
    return str.length > length ? str.substring(0, length) + '...' : str;
  },

  /**
   * Capitalize first letter
   */
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Format timestamp to readable time
   */
  formatTime: (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  },

  /**
   * Validate API key format
   */
  isValidApiKey: (key: string): boolean => {
    return CONSTANTS.PATTERNS.API_KEY.test(key);
  },
};

/**
 * Storage utility functions
 */
export const storageUtils = {
  /**
   * Get from local storage
   */
  get: <T = any>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
      console.error(`Failed to get ${key} from storage:`, error);
      return defaultValue ?? null;
    }
  },

  /**
   * Set to local storage
   */
  set: (key: string, value: any): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to set ${key} in storage:`, error);
      return false;
    }
  },

  /**
   * Remove from local storage
   */
  remove: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove ${key} from storage:`, error);
      return false;
    }
  },

  /**
   * Clear all local storage
   */
  clear: (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  },
};

/**
 * Error handling utility
 */
export const errorUtils = {
  /**
   * Handle API errors
   */
  handleApiError: (error: any): string => {
    if (error?.response?.data?.error) {
      return error.response.data.error;
    }
    if (error?.message) {
      return error.message;
    }
    return CONSTANTS.ERRORS.API_ERROR;
  },

  /**
   * Format error message
   */
  formatError: (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    return 'An unexpected error occurred';
  },
};

/**
 * Debounce utility
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle utility
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
};
