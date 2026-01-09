'use client'
import {
  useRef,
  useState,
  useEffect,
} from 'react';
import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';
import { useGetCurrentWindowSize } from '@/hooks/useGetCurrentWindowSize';
import { useGetWebcam } from '@/hooks/useGetWebcam';
import { useSVGGeneration } from '@/hooks/useSVGGeneration';
import { useWebGLCanvas } from '@/hooks/useWebGLCanvas';
import type {
  Preset,
  PresetSettings,
  UIState,
  ViewerConfig, 
} from '@/types';
import { 
  createPreset,
  createSVGString,
  downloadSVG,
  loadPresetsFromStorage, 
  savePresetsToStorage, 
} from '@/utils';
import { LeftControlPanel } from './components/LeftPanel';
import { RightControlPanel } from './components/RightPanel';
import MobileControls from './components/MobileControls';
import { 
  DEFAULT_CONFIG, 
  DEFAULT_UI_STATE, 
} from '@/constants';

export default function WebcamSVGViewer() {
  const isPortrait = useMediaQuery('(orientation: portrait)', { noSsr: true });
  const [mounted, setMounted] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 640, height: 480 });
  const [svgOutlinePaths, setSvgOutlinePaths] = useState<string>('');
  const [svgBackground, setSvgBackground] = useState<string>('');
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
  
  const blurCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { width, height } = useGetCurrentWindowSize();
  const connectEdgesOutlinePaths = false;
  const connectEdgesBackground = true;

  const { isStreaming } = useGetWebcam({
    facingMode: config.facingMode,
    height: isPortrait ? 640 : 480,
    videoRef,
    width: isPortrait ? 480 : 640,
    zoom: config.cameraZoom,
  });

  useEffect(() => {
    setMounted(true);
    setPresets(loadPresetsFromStorage());
  }, []);

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

  const loadPreset = (settings: PresetSettings) => {
    setConfig(settings);
  };

  const deletePreset = (index: number) => {
    const newPresets = presets.filter((_, i) => i !== index);
    setPresets(newPresets);
    savePresetsToStorage(newPresets);
  };

  useEffect(() => {
    const newDimensions = isPortrait 
      ? { width: 480, height: 640 }
      : { width: 640, height: 480 };
    setCanvasDimensions(newDimensions);
  }, [isPortrait]);

  useEffect(() => {
    if (canvasRef.current && isStreaming) {
      const gl = canvasRef.current.getContext('webgl2');
      if (gl) {
        glRef.current = gl;
      }
    }
  }, [canvasRef, isStreaming]);

  const { framebuffersRef } = useWebGLCanvas({
    canvasRef,
    highThreshold: config.highThreshold,
    isStreaming,
    lowThreshold: config.lowThreshold,
    videoRef,
    useMotionBlur: config.blurMode,
    aperture: config.aperture,
    motionBlurAmount: config.motionBlurAmount,
    motionBlurAngle: config.motionBlurAngle,
    gaussianBlurAmount: config.gaussianBlurAmount,
  });

  useSVGGeneration({
    isStreaming,
    glRef,
    canvasRef,
    blurCanvasRef,
    framebuffersRef,
    config,
    connectEdgesBackground,
    connectEdgesOutlinePaths,
    setSvgBackground,
    setSvgOutlinePaths,
  });

  const svgString = createSVGString(width, height, svgBackground, svgOutlinePaths, uiState.layerOrder);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.1s ease-in',
      }}
    >
      {
        !isPortrait ? (
          <>
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
          </>
        ) : (
          <MobileControls
              config={config}
              updateConfig={updateConfig}
              uiState={uiState}
              updateUIState={updateUIState}
              svgString={svgString}
              downloadSVG={downloadSVG}
          />
        )
      }

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
          transform: 'translateY(-2dvh)',
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
          }}
          dangerouslySetInnerHTML={{ __html: svgString }}
        />
      </Box>
    </Box>
  );
}
