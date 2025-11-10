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
    const initWebcam = async () => {
      if (!videoRef.current) return;
      
      try {
        setError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width, height, facingMode }
        });
        
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error accessing webcam';
        console.error('Error accessing webcam:', err);
        setError(errorMsg);
        setIsStreaming(false);
      }
    };

    initWebcam();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsStreaming(false);
    };
  }, [videoRef, width, height, facingMode]);

  return {
    isStreaming,
    error
  };
};