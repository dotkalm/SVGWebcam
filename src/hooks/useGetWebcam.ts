'use client';

import { useState, useEffect } from 'react';
import type { TUseGetWebcam } from '@/types';

export const useGetWebcam: TUseGetWebcam = ({
  videoRef,
  width = 640,
  height = 480,
  facingMode = 'user'
}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const initWebcam = async () => {
      if (!videoRef.current || isCancelled) return;

      try {
        setError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width, height, facingMode }
        });

        if (isCancelled || !videoRef.current) return;

        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
          if (!isCancelled) {
            setIsStreaming(true);
          }
        } catch (playError) {
          console.warn('Play was interrupted, this is usually fine');
        }
      } catch (err) {
        if (!isCancelled) {
          const errorMsg = err instanceof Error ? err.message : 'Error accessing webcam';
          console.error('Error accessing webcam:', err);
          setError(errorMsg);
          setIsStreaming(false);
        }
      }
    };

    initWebcam();

    return () => {
      isCancelled = true;
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsStreaming(false);
    };
  }, [width, height, facingMode]);

  return {
    isStreaming,
    error
  };
};