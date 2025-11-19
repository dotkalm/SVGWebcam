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
import { 
  loadPresetsFromStorage, 
  savePresetsToStorage, 
  createPreset,
  type Preset,
  type PresetSettings 
} from './presetManager';
import { 
  extractBlurTexture, 
  generateSVGFromFramebuffer, 
  createSVGString 
} from './svgGenerator';
import { LeftControlPanel } from './LeftControlPanel';
import { RightControlPanel } from './RightControlPanel';
import { DEFAULT_CONFIG, DEFAULT_UI_STATE, type ViewerConfig, type UIState } from './config';

export default function WebcamSVGViewer() {
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 640, height: 480 });
  const [svgCleanEdges, setSvgCleanEdges] = useState<string>('');
  const [svgCrosshatch, setSvgCrosshatch] = useState<string>('');
  const [config, setConfig] = useState<ViewerConfig>(DEFAULT_CONFIG);
  const [uiState, setUIState] = useState<UIState>(DEFAULT_UI_STATE);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState('');
  
  // Helper to update config
  const updateConfig = (updates: Partial<ViewerConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };
  
  // Helper to update UI state
  const updateUIState = (updates: Partial<UIState>) => {
    setUIState(prev => ({ ...prev, ...updates }));
  };
  
  const animationFrameRef = useRef<number | null>(null);
  const blurCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const { width, height } = useGetCurrentWindowSize();
  const connectEdgesCleanLines = false;
  const connectEdgesCrosshatch = true;

  const { isStreaming } = useGetWebcam({
    facingMode: 'user',
    height: isPortrait ? 640 : 480,
    videoRef,
    width: isPortrait ? 480 : 640,
  });

  // Load presets from localStorage on mount
  useEffect(() => {
    setPresets(loadPresetsFromStorage());
  }, []);

  // Save current settings as a preset
  const savePreset = () => {
    if (!presetName.trim()) {
      alert('Please enter a preset name');
      return;
    }

    const newPresets = [...presets, createPreset(presetName, config)];
    setPresets(newPresets);
    savePresetsToStorage(newPresets);
    setPresetName('');
  };

  // Load a preset
  const loadPreset = (settings: PresetSettings) => {
    setConfig(settings);
  };

  // Delete a preset
  const deletePreset = (index: number) => {
    const newPresets = presets.filter((_, i) => i !== index);
    setPresets(newPresets);
    savePresetsToStorage(newPresets);
  };

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
    highThreshold: config.highThreshold,
    isStreaming,
    lowThreshold: config.lowThreshold,
    videoRef,
    useMotionBlur: config.blurMode,
    aperture: config.aperture,
    motionBlurAmount: config.motionBlurAmount,
    motionBlurAngle: config.motionBlurAngle,
  });

  // Update SVG every frame
  useEffect(() => {
    if (!isStreaming || !glRef.current || !canvasRef.current) {
      return;
    }

    const updateSVG = () => {
      try {
        const { width: canvasWidth, height: canvasHeight } = canvasRef.current!;

        // Extract Gaussian blurred texture from WebGL framebuffer
        if (blurCanvasRef.current && glRef.current && framebuffersRef?.current?.blur) {
          const gl = glRef.current;
          const blurCtx = blurCanvasRef.current.getContext('2d')!;
          extractBlurTexture(gl, blurCtx, framebuffersRef.current.blur, canvasWidth, canvasHeight);
        }

        // Generate crosshatch SVG from blur framebuffer
        if (glRef.current && framebuffersRef?.current?.blur) {
          const svgCross = generateSVGFromFramebuffer(
            glRef.current,
            framebuffersRef.current.blur,
            canvasWidth,
            canvasHeight,
            readFramebufferToSVG,
            {
              threshold: config.crosshatchThreshold,
              minPathLength: 3,
              simplification: config.crosshatchSimplification,
              strokeWidth: config.crosshatchStrokeWidth,
              strokeColor: '#000000',
              opacity: config.crosshatchOpacity,
              fill: config.useCrosshatchFill ? config.crosshatchFillColor : 'none',
              connectEdges: connectEdgesCrosshatch,
              useBezier: config.useBezierCrosshatch,
              groupId: 'crosshatch'
            }
          );
          setSvgCrosshatch(svgCross);
        }

        // Generate clean edges SVG from canvas
        if (glRef.current) {
          const svgClean = generateSVGFromFramebuffer(
            glRef.current,
            null,
            canvasWidth,
            canvasHeight,
            readFramebufferToSVG,
            {
              threshold: 10,
              minPathLength: config.cleanEdgeMinPathLength,
              simplification: config.cleanEdgeSimplification,
              strokeWidth: config.cleanEdgesStrokeWidth,
              strokeColor: '#000000',
              opacity: config.cleanEdgesOpacity,
              fill: config.useCleanEdgesFill ? config.cleanEdgesFillColor : 'none',
              connectEdges: connectEdgesCleanLines,
              useBezier: config.useBezierCleanLines,
              groupId: 'cleanLines'
            }
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
  }, [isStreaming, config]);

  const svgString = createSVGString(width, height, svgCrosshatch, svgCleanEdges);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <LeftControlPanel
        config={config}
        updateConfig={updateConfig}
        uiState={uiState}
        updateUIState={updateUIState}
        svgString={svgString}
        downloadSVG={downloadSVG}
      />

      <RightControlPanel
        config={config}
        updateConfig={updateConfig}
        uiState={uiState}
        updateUIState={updateUIState}
        presets={presets}
        presetName={presetName}
        setPresetName={setPresetName}
        savePreset={savePreset}
        loadPreset={loadPreset}
        deletePreset={deletePreset}
      />

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

      {/* Live SVG Output */}
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
            opacity: config.crosshatchOpacity,
          }}
          dangerouslySetInnerHTML={{ __html: svgString }}
        />
      </Box>
    </Box>
  );
}
