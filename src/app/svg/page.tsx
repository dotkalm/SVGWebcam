'use client'
import {
  useRef,
  useState,
  useEffect,
} from 'react';
import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';
import { useGetWebcam } from '@/hooks/useGetWebcam';
import { useWebGLCanvas } from '@/hooks/useWebGLCanvas';
import { useGetCurrentWindowSize } from '@/hooks/useGetCurrentWindowSize';
import { readFramebufferToSVG, downloadSVG } from '@/utils';

export default function SVGEdgeDetector() {
  const { width, height } = useGetCurrentWindowSize();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blurCanvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 640, height: 480 });
  const [svgCrosshatch, setSvgCrosshatch] = useState<string>('');
  const [svgCleanEdges, setSvgCleanEdges] = useState<string>('');
  const [blurredBackground, setBlurredBackground] = useState<string>('');
  const crosshatchStrokeWidth = 0.12;
  const cleanEdgesStrokeWidth = .3;
  const crosshatchOpacity = 1;
  const cleanEdgesOpacity = .6;
  const crosshatchFill = 'none';
  const cleanEdgesFill = 'dodgerblue';
  const backgroundOpacity = 0;
  const connectEdgesCrosshatch = true;
  const connectEdgesCleanLines = false;
  const useBezierCrosshatch = false;
  const useBezierCleanLines = true;

  const { isStreaming } = useGetWebcam({
    facingMode: 'user',
    height: isPortrait ? 640 : 480,
    videoRef,
    width: isPortrait ? 480 : 640,
  });

  // Update canvas dimensions when orientation changes
  useEffect(() => {
    const newDimensions = isPortrait 
      ? { width: 480, height: 640 }
      : { width: 640, height: 480 };
    setCanvasDimensions(newDimensions);
  }, [isPortrait]);

  // Store GL context reference
  useEffect(() => {
    if (canvasRef.current && isStreaming) {
      const gl = canvasRef.current.getContext('webgl2');
      if (gl) {
        glRef.current = gl;
      }
    }
  }, [canvasRef, isStreaming]);

  const { texturesRef, framebuffersRef } = useWebGLCanvas({
    canvasRef,
    highThreshold: 1.85,
    isStreaming,
    lowThreshold: 0.02,
    videoRef,
  });

  // Update SVG every frame
  useEffect(() => {
    if (!isStreaming || !glRef.current || !canvasRef.current) {
      return;
    }

    const updateSVG = () => {
      try {
        const {
          width: canvasWidth,
          height: canvasHeight
        } = canvasRef.current!;

        // Extract Gaussian blurred texture from WebGL framebuffer
        if (blurCanvasRef.current && glRef.current && framebuffersRef?.current?.blur && texturesRef?.current?.blur) {
          const gl = glRef.current;
          const blurCtx = blurCanvasRef.current.getContext('2d')!;

          // Bind the blur framebuffer and read its pixels
          gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffersRef.current.blur);
          const pixels = new Uint8Array(canvasWidth * canvasHeight * 4);
          gl.readPixels(0, 0, canvasWidth, canvasHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

          // Flip vertically (WebGL origin is bottom-left, Canvas 2D is top-left)
          const flippedPixels = new Uint8ClampedArray(canvasWidth * canvasHeight * 4);
          for (let y = 0; y < canvasHeight; y++) {
            const sourceRow = (canvasHeight - 1 - y) * canvasWidth * 4;
            const destRow = y * canvasWidth * 4;
            for (let x = 0; x < canvasWidth * 4; x++) {
              flippedPixels[destRow + x] = pixels[sourceRow + x];
            }
          }

          // Put the flipped pixels at original video resolution
          const imageData = new ImageData(flippedPixels, canvasWidth, canvasHeight);
          blurCtx.putImageData(imageData, 0, 0);

          setBlurredBackground(blurCanvasRef.current.toDataURL());
        }

        // Generate crosshatch SVG from blur framebuffer
        if (glRef.current && framebuffersRef?.current?.blur) {
          glRef.current.bindFramebuffer(glRef.current.FRAMEBUFFER, framebuffersRef.current.blur);
          const svgCross = readFramebufferToSVG(
            glRef.current!,
            canvasWidth,
            canvasHeight,
            {
              threshold: 190,
              minPathLength: 6,
              simplification: 10,
              strokeWidth: crosshatchStrokeWidth,
              strokeColor: '#000000',
              opacity: crosshatchOpacity,
              fill: crosshatchFill,
              connectEdges: connectEdgesCrosshatch,
              useBezier: useBezierCrosshatch,
              groupId: 'crosshatch'
            },
          );
          setSvgCrosshatch(svgCross);
        }

        // Generate clean edges SVG from canvas
        if (glRef.current) {
          glRef.current.bindFramebuffer(glRef.current.FRAMEBUFFER, null);
          const svgClean = readFramebufferToSVG(
            glRef.current!,
            canvasWidth,
            canvasHeight,
            {
              threshold: 100,
              minPathLength: 5,
              simplification: 2,
              strokeWidth: cleanEdgesStrokeWidth,
              strokeColor: '#000000',
              opacity: cleanEdgesOpacity,
              fill: cleanEdgesFill,
              connectEdges: connectEdgesCleanLines,
              useBezier: useBezierCleanLines,
              groupId: 'cleanLines'
            },
          );
          setSvgCleanEdges(svgClean);
        }
      } catch (error) {
        console.error('Error generating SVG:', error);
      }

      animationFrameRef.current = requestAnimationFrame(updateSVG);
    };

    updateSVG();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isStreaming]);

  const svgString = `
    <?xml version="1.0" encoding="UTF-8"?>
    <svg width="${innerWidth}" height="${innerHeight}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${innerWidth} ${innerHeight}">
      ${svgCrosshatch}
      ${svgCleanEdges}
    </svg>
  `
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      {/* Hidden video and canvas */}
      <Box sx={{ display: 'none' }}>
        <video
          ref={videoRef}
          width={isPortrait ? 480 : 640}
          height={isPortrait ? 640 : 480}
          playsInline
          muted
          autoPlay
        />
        <canvas
          ref={canvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          key={`${canvasDimensions.width}x${canvasDimensions.height}`}
        />
        <canvas
          ref={blurCanvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
        />
      </Box>

      {/* Live SVG Output - Both Overlaid */}
      <Box
        sx={{
          bgcolor: '#fff',
          border: '2px solid #333',
          borderRadius: 1,
          minHeight: height,
          minWidth: width,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          mx: 'auto',
          maxWidth: '100%',
          position: 'relative',
        }}
      >
        {/* Blurred background layer */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: blurredBackground ? `url(${blurredBackground})` : 'none',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(10px)',
            opacity: backgroundOpacity,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            width: '100%',
            height: '100%',
            opacity: crosshatchOpacity,
          }}
          dangerouslySetInnerHTML={{ __html: svgString }}
        />
      </Box>
    </Box>
  );
}
