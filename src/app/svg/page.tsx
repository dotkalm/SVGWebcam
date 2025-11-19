'use client'
import {
  useRef,
  useState,
  useEffect,
} from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';
import { useGetWebcam } from '@/hooks/useGetWebcam';
import { useWebGLCanvas } from '@/hooks/useWebGLCanvas';
import { useGetCurrentWindowSize } from '@/hooks/useGetCurrentWindowSize';
import { readFramebufferToSVG, downloadSVG } from '@/utils';

export default function SVGEdgeDetector() {
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 640, height: 480 });
  const [svgCleanEdges, setSvgCleanEdges] = useState<string>('');
  const [svgCrosshatch, setSvgCrosshatch] = useState<string>('');
  const [blurMode, setBlurMode] = useState<'gaussian' | 'motion' | 'bokeh'>('gaussian');
  const [aperture, setAperture] = useState(0.15); // Controls depth of field (lower = shallower)
  const [motionBlurAmount, setMotionBlurAmount] = useState(60); // Motion blur strength
  const [motionBlurAngle, setMotionBlurAngle] = useState(0); // Motion blur direction in degrees
  const animationFrameRef = useRef<number | null>(null);
  const blurCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanEdgesFill = 'dodgerblue';
  const cleanEdgesOpacity = .6;
  const cleanEdgesStrokeWidth = .3;
  const connectEdgesCleanLines = false;
  const connectEdgesCrosshatch = true;
  const crosshatchFill = 'none';
  const crosshatchOpacity = 1;
  const crosshatchStrokeWidth = 0.12;
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const useBezierCleanLines = true;
  const useBezierCrosshatch = false;
  const videoRef = useRef<HTMLVideoElement>(null);
  const { width, height } = useGetCurrentWindowSize();

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
    useMotionBlur: blurMode,
    aperture,
    motionBlurAmount,
    motionBlurAngle,
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
      {/* Blur Controls */}
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'flex-end',
        }}
      >
        <button
          onClick={() => {
            const modes: Array<'gaussian' | 'motion' | 'bokeh'> = ['gaussian', 'motion', 'bokeh'];
            const currentIndex = modes.indexOf(blurMode);
            const nextIndex = (currentIndex + 1) % modes.length;
            setBlurMode(modes[nextIndex]);
          }}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            backgroundColor: blurMode === 'gaussian' ? '#2196F3' : blurMode === 'motion' ? '#4CAF50' : '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          {blurMode === 'gaussian' ? 'Gaussian Blur' : blurMode === 'motion' ? 'Motion Blur' : 'Bokeh (Shallow DOF)'}
        </button>

        {/* Motion Blur Controls */}
        {blurMode === 'motion' && (
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: 3,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              minWidth: 280,
            }}
          >
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
              Motion Blur Amount
            </Typography>
            <Slider
              value={motionBlurAmount}
              onChange={(_, value) => setMotionBlurAmount(value as number)}
              min={10}
              max={150}
              step={5}
              valueLabelDisplay="auto"
              sx={{
                color: '#4CAF50',
                mb: 3,
                '& .MuiSlider-thumb': {
                  width: 20,
                  height: 20,
                },
              }}
            />
            
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: '#4CAF50', mt: 2 }}>
              Direction
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  border: '3px solid #4CAF50',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const centerX = rect.left + rect.width / 2;
                  const centerY = rect.top + rect.height / 2;
                  const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                  setMotionBlurAngle((angle * 180) / Math.PI);
                }}
              >
                {/* Direction indicator line */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '50%',
                    height: 3,
                    backgroundColor: '#4CAF50',
                    transformOrigin: 'left center',
                    transform: `translateY(-50%) rotate(${motionBlurAngle}deg)`,
                    borderRadius: 1,
                  }}
                />
                {/* Center dot */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 8,
                    height: 8,
                    backgroundColor: '#4CAF50',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  {motionBlurAngle.toFixed(0)}°
                </Typography>
                <Slider
                  value={motionBlurAngle}
                  onChange={(_, value) => setMotionBlurAngle(value as number)}
                  min={0}
                  max={360}
                  step={1}
                  orientation="vertical"
                  sx={{
                    color: '#4CAF50',
                    height: 100,
                    '& .MuiSlider-thumb': {
                      width: 16,
                      height: 16,
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}

        {/* Aperture Slider for Bokeh */}
        {blurMode === 'bokeh' && (
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: 3,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              minWidth: 250,
            }}
          >
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: '#FF9800' }}>
              Aperture (f-stop)
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              Lower = Shallower Depth of Field
            </Typography>
            <Slider
              value={aperture}
              onChange={(_, value) => setAperture(value as number)}
              min={0.01}
              max={1.0}
              step={0.01}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `f/${(1/value).toFixed(1)}`}
              sx={{
                color: '#FF9800',
                '& .MuiSlider-thumb': {
                  width: 20,
                  height: 20,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">f/1.0</Typography>
              <Typography variant="caption" color="text.secondary">f/100</Typography>
            </Box>
          </Box>
        )}
      </Box>

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
