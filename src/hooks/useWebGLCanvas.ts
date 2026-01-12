'use client';

import { useEffect, useRef } from 'react';
import {
  cleanupWebGL,
  initWebGL,
  processFrame,
} from '@/utils';

import {
  type TWebGLBuffers,
  type TWebGLFramebuffers,
  type TWebGLPrograms,
  type TWebGLTextures,
  type TUseWebGLCanvas,
  SubMenuItemBlur
} from '@/types';

export const useWebGLCanvas: TUseWebGLCanvas = ({
  aperture = 0.15,
  blurMode = SubMenuItemBlur.GAUSSIAN,
  canvasRef,
  gaussianBlurAmount = 1.0,
  highThreshold,
  isStreaming,
  lowThreshold,
  motionBlurAmount = 60,
  motionBlurAngle = 0,
  useBlur,
  videoRef,
}) => {
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programsRef = useRef<TWebGLPrograms>({});
  const framebuffersRef = useRef<TWebGLFramebuffers>({});
  const texturesRef = useRef<TWebGLTextures>({ input: null });
  const buffersRef = useRef<TWebGLBuffers>({ position: null, texCoord: null });

  useEffect(() => {
    if (!canvasRef.current || !isStreaming) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    glRef.current = gl;

    // Initialize WebGL programs and resources
    initWebGL(gl, programsRef, framebuffersRef, texturesRef, buffersRef);

    // Animation loop
    let animationId: number;
    const render = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        processFrame(
          gl,
          videoRef.current,
          programsRef.current,
          framebuffersRef.current,
          texturesRef.current,
          buffersRef.current,
          lowThreshold,
          highThreshold,
          blurMode,
          aperture,
          motionBlurAmount,
          motionBlurAngle,
          gaussianBlurAmount,
          useBlur,
        );
      }
      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationId);
      cleanupWebGL(gl, programsRef.current, framebuffersRef.current, texturesRef.current);
      glRef.current = null;
    };
  }, [
    aperture, 
    blurMode, 
    canvasRef, 
    gaussianBlurAmount, 
    highThreshold, 
    isStreaming, 
    lowThreshold, 
    motionBlurAmount, 
    motionBlurAngle, 
    useBlur,
    videoRef, 
  ]);

  return {
    texturesRef,
    framebuffersRef
  };
}