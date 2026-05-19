import { useEffect, useRef, useState, useCallback } from 'react';
import { audioUtils } from '@/lib/audio-utils';
import { CONSTANTS } from '@/lib/constants';

export const useAudioRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize microphone
  const initializeMicrophone = useCallback(async () => {
    try {
      setError(null);
      const stream = await audioUtils.requestMicrophone();
      streamRef.current = stream;
      setHasPermission(true);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      return mediaRecorder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : CONSTANTS.ERRORS.MICROPHONE_NOT_AVAILABLE;
      setError(errorMessage);
      setHasPermission(false);
      throw err;
    }
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      if (!mediaRecorderRef.current) {
        await initializeMicrophone();
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
        setIsRecording(true);
        setRecordingTime(0);

        recordingIntervalRef.current = setInterval(() => {
          setRecordingTime((prev) => {
            if (prev >= CONSTANTS.AUDIO.MAX_RECORDING_DURATION) {
              stopRecording();
              return prev;
            }
            return prev + 100;
          });
        }, 100);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : CONSTANTS.ERRORS.AUDIO_RECORDING_ERROR;
      setError(errorMessage);
    }
  }, [initializeMicrophone]);

  // Stop recording
  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.onstop = () => {
          if (audioChunksRef.current.length === 0) {
            setIsRecording(false);
            setRecordingTime(0);
            resolve(null);
            return;
          }

          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          audioChunksRef.current = [];
          setIsRecording(false);
          setRecordingTime(0);
          resolve(audioBlob);
        };

        mediaRecorderRef.current.stop();
      } else {
        resolve(null);
      }
    });
  }, []);

  // Cleanup
  const cleanup = useCallback(() => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      audioUtils.stopAudioTracks(streamRef.current);
      streamRef.current = null;
    }

    setIsRecording(false);
    setRecordingTime(0);
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    startRecording,
    stopRecording,
    isRecording,
    recordingTime,
    hasPermission,
    error,
    cleanup,
  };
};
