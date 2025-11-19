'use client'
import {
  useRef,
  useState,
  useEffect,
} from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
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
  const [highThreshold, setHighThreshold] = useState(0.02);
  const [lowThreshold, setLowThreshold] = useState(0.02);
  const [crosshatchThreshold, setCrosshatchThreshold] = useState(140);
  const [crosshatchSimplification, setCrosshatchSimplification] = useState(3);
  const [cleanEdgeMinPathLength, setCleanEdgeMinPathLength] = useState(5);
  const [cleanEdgeSimplification, setCleanEdgeSimplification] = useState(4);
  const [crosshatchStrokeWidth, setCrosshatchStrokeWidth] = useState(0.12);
  const [cleanEdgesStrokeWidth, setCleanEdgesStrokeWidth] = useState(0.3);
  const [crosshatchOpacity, setCrosshatchOpacity] = useState(1);
  const [cleanEdgesOpacity, setCleanEdgesOpacity] = useState(0.6);
  const [useCrosshatchFill, setUseCrosshatchFill] = useState(false);
  const [useCleanEdgesFill, setUseCleanEdgesFill] = useState(false);
  const [crosshatchFillColor, setCrosshatchFillColor] = useState('#000000');
  const [cleanEdgesFillColor, setCleanEdgesFillColor] = useState('#000000');
  const [useBezierCrosshatch, setUseBezierCrosshatch] = useState(true);
  const [useBezierCleanLines, setUseBezierCleanLines] = useState(true);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [expandEdgeDetection, setExpandEdgeDetection] = useState(true);
  const [expandSVGGeneration, setExpandSVGGeneration] = useState(true);
  const [expandCrosshatchStyling, setExpandCrosshatchStyling] = useState(true);
  const [expandCleanEdgeStyling, setExpandCleanEdgeStyling] = useState(true);
  const [presets, setPresets] = useState<Array<{name: string, settings: any}>>([]);
  const [presetName, setPresetName] = useState('');
  const animationFrameRef = useRef<number | null>(null);
  const blurCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load presets from localStorage on mount
  useEffect(() => {
    const savedPresets = localStorage.getItem('edgeDetectorPresets');
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (e) {
        console.error('Failed to load presets:', e);
      }
    }
  }, []);

  // Save current settings as a preset
  const savePreset = () => {
    if (!presetName.trim()) {
      alert('Please enter a preset name');
      return;
    }

    const settings = {
      blurMode,
      aperture,
      motionBlurAmount,
      motionBlurAngle,
      highThreshold,
      lowThreshold,
      crosshatchThreshold,
      crosshatchSimplification,
      cleanEdgeMinPathLength,
      cleanEdgeSimplification,
      crosshatchStrokeWidth,
      cleanEdgesStrokeWidth,
      crosshatchOpacity,
      cleanEdgesOpacity,
      useCrosshatchFill,
      useCleanEdgesFill,
      crosshatchFillColor,
      cleanEdgesFillColor,
      useBezierCrosshatch,
      useBezierCleanLines,
    };

    const newPresets = [...presets, { name: presetName, settings }];
    setPresets(newPresets);
    localStorage.setItem('edgeDetectorPresets', JSON.stringify(newPresets));
    setPresetName('');
  };

  // Load a preset
  const loadPreset = (settings: any) => {
    setBlurMode(settings.blurMode);
    setAperture(settings.aperture);
    setMotionBlurAmount(settings.motionBlurAmount);
    setMotionBlurAngle(settings.motionBlurAngle);
    setHighThreshold(settings.highThreshold);
    setLowThreshold(settings.lowThreshold);
    setCrosshatchThreshold(settings.crosshatchThreshold);
    setCrosshatchSimplification(settings.crosshatchSimplification);
    setCleanEdgeMinPathLength(settings.cleanEdgeMinPathLength);
    setCleanEdgeSimplification(settings.cleanEdgeSimplification);
    setCrosshatchStrokeWidth(settings.crosshatchStrokeWidth);
    setCleanEdgesStrokeWidth(settings.cleanEdgesStrokeWidth);
    setCrosshatchOpacity(settings.crosshatchOpacity);
    setCleanEdgesOpacity(settings.cleanEdgesOpacity);
    setUseCrosshatchFill(settings.useCrosshatchFill);
    setUseCleanEdgesFill(settings.useCleanEdgesFill);
    setCrosshatchFillColor(settings.crosshatchFillColor);
    setCleanEdgesFillColor(settings.cleanEdgesFillColor);
    setUseBezierCrosshatch(settings.useBezierCrosshatch);
    setUseBezierCleanLines(settings.useBezierCleanLines);
  };

  // Delete a preset
  const deletePreset = (index: number) => {
    const newPresets = presets.filter((_, i) => i !== index);
    setPresets(newPresets);
    localStorage.setItem('edgeDetectorPresets', JSON.stringify(newPresets));
  };
  const connectEdgesCleanLines = false;
  const connectEdgesCrosshatch = true;
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const isPortrait = useMediaQuery('(orientation: portrait)');
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
    highThreshold,
    isStreaming,
    lowThreshold,
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
              threshold: crosshatchThreshold,
              minPathLength: 3,
              simplification: crosshatchSimplification,
              strokeWidth: crosshatchStrokeWidth,
              strokeColor: '#000000',
              opacity: crosshatchOpacity,
              fill: useCrosshatchFill ? crosshatchFillColor : 'none',
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
              threshold: 10,
              minPathLength: cleanEdgeMinPathLength,
              simplification: cleanEdgeSimplification,
              strokeWidth: cleanEdgesStrokeWidth,
              strokeColor: '#000000',
              opacity: cleanEdgesOpacity,
              fill: useCleanEdgesFill ? cleanEdgesFillColor : 'none',
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
  }, [
    isStreaming, 
    crosshatchThreshold, 
    crosshatchSimplification, 
    cleanEdgeMinPathLength, 
    cleanEdgeSimplification,
    crosshatchStrokeWidth,
    cleanEdgesStrokeWidth,
    crosshatchOpacity,
    cleanEdgesOpacity,
    useCrosshatchFill,
    useCleanEdgesFill,
    crosshatchFillColor,
    cleanEdgesFillColor,
    useBezierCrosshatch,
    useBezierCleanLines
  ]);

  const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${innerWidth}" height="${innerHeight}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${innerWidth} ${innerHeight}">
${svgCrosshatch}
${svgCleanEdges}
</svg>`

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      {/* Left Panel Toggle Button */}
      {!showLeftPanel && (
        <IconButton
          onClick={() => setShowLeftPanel(true)}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
          }}
        >
          <span style={{ fontSize: '20px' }}>☰</span>
        </IconButton>
      )}

      {/* Edge Detection Thresholds */}
      {showLeftPanel && (
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: 3,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            minWidth: 280,
            maxWidth: 320,
            maxHeight: 'calc(100vh - 32px)',
            overflowY: 'auto',
          }}
        >
          {/* Hide Panel Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <IconButton
              size="small"
              onClick={() => setShowLeftPanel(false)}
              sx={{ padding: '4px' }}
            >
              <span style={{ fontSize: '16px' }}>✕</span>
            </IconButton>
          </Box>

          {/* Edge Detection Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              Edge Detection
            </Typography>
            <IconButton
              size="small"
              onClick={() => setExpandEdgeDetection(!expandEdgeDetection)}
              sx={{ padding: '4px' }}
            >
              <span style={{ fontSize: '16px' }}>{expandEdgeDetection ? '▼' : '▶'}</span>
            </IconButton>
          </Box>

          <Collapse in={expandEdgeDetection}>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            High Threshold: {highThreshold.toFixed(3)}
          </Typography>
          <Slider
            value={highThreshold}
            onChange={(_, value) => setHighThreshold(value as number)}
            min={0.001}
            max={0.1}
            step={0.001}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value.toFixed(3)}
            sx={{ color: '#1976d2' }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Low Threshold: {lowThreshold.toFixed(3)}
          </Typography>
          <Slider
            value={lowThreshold}
            onChange={(_, value) => setLowThreshold(value as number)}
            min={0.001}
            max={0.1}
            step={0.001}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value.toFixed(3)}
            sx={{ color: '#1976d2' }}
          />
        </Box>

          </Collapse>

          {/* SVG Generation Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
              SVG Generation
            </Typography>
            <IconButton
              size="small"
              onClick={() => setExpandSVGGeneration(!expandSVGGeneration)}
              sx={{ padding: '4px' }}
            >
              <span style={{ fontSize: '16px' }}>{expandSVGGeneration ? '▼' : '▶'}</span>
            </IconButton>
          </Box>

          <Collapse in={expandSVGGeneration}>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Crosshatch Threshold: {crosshatchThreshold}
          </Typography>
          <Slider
            value={crosshatchThreshold}
            onChange={(_, value) => setCrosshatchThreshold(value as number)}
            min={1}
            max={255}
            step={1}
            valueLabelDisplay="auto"
            sx={{ color: '#9c27b0' }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Crosshatch Simplification: {crosshatchSimplification}
          </Typography>
          <Slider
            value={crosshatchSimplification}
            onChange={(_, value) => setCrosshatchSimplification(value as number)}
            min={1}
            max={10}
            step={0.5}
            valueLabelDisplay="auto"
            sx={{ color: '#9c27b0' }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Clean Edge Min Path Length: {cleanEdgeMinPathLength}
          </Typography>
          <Slider
            value={cleanEdgeMinPathLength}
            onChange={(_, value) => setCleanEdgeMinPathLength(value as number)}
            min={1}
            max={20}
            step={1}
            valueLabelDisplay="auto"
            sx={{ color: '#9c27b0' }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Clean Edge Simplification: {cleanEdgeSimplification}
          </Typography>
          <Slider
            value={cleanEdgeSimplification}
            onChange={(_, value) => setCleanEdgeSimplification(value as number)}
            min={1}
            max={10}
            step={0.5}
            valueLabelDisplay="auto"
            sx={{ color: '#9c27b0' }}
          />
        </Box>

          </Collapse>

          {/* Crosshatch Styling Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
              Crosshatch Styling
            </Typography>
            <IconButton
              size="small"
              onClick={() => setExpandCrosshatchStyling(!expandCrosshatchStyling)}
              sx={{ padding: '4px' }}
            >
              <span style={{ fontSize: '16px' }}>{expandCrosshatchStyling ? '▼' : '▶'}</span>
            </IconButton>
          </Box>

          <Collapse in={expandCrosshatchStyling}>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Stroke Width: {crosshatchStrokeWidth.toFixed(2)}
          </Typography>
          <Slider
            value={crosshatchStrokeWidth}
            onChange={(_, value) => setCrosshatchStrokeWidth(value as number)}
            min={0.01}
            max={2}
            step={0.01}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value.toFixed(2)}
            sx={{ color: '#9c27b0' }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Opacity: {crosshatchOpacity.toFixed(2)}
          </Typography>
          <Slider
            value={crosshatchOpacity}
            onChange={(_, value) => setCrosshatchOpacity(value as number)}
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value.toFixed(2)}
            sx={{ color: '#9c27b0' }}
          />
        </Box>

        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <input
            type="checkbox"
            checked={useCrosshatchFill}
            onChange={(e) => setUseCrosshatchFill(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <Typography variant="caption" color="text.secondary">
            Use Fill
          </Typography>
          {useCrosshatchFill && (
            <input
              type="color"
              value={crosshatchFillColor}
              onChange={(e) => setCrosshatchFillColor(e.target.value)}
              style={{ marginLeft: '8px', cursor: 'pointer' }}
            />
          )}
        </Box>

        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <input
            type="checkbox"
            checked={useBezierCrosshatch}
            onChange={(e) => setUseBezierCrosshatch(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <Typography variant="caption" color="text.secondary">
            Use Bezier Curves
          </Typography>
        </Box>

          </Collapse>

          {/* Clean Edge Styling Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
              Clean Edge Styling
            </Typography>
            <IconButton
              size="small"
              onClick={() => setExpandCleanEdgeStyling(!expandCleanEdgeStyling)}
              sx={{ padding: '4px' }}
            >
              <span style={{ fontSize: '16px' }}>{expandCleanEdgeStyling ? '▼' : '▶'}</span>
            </IconButton>
          </Box>

          <Collapse in={expandCleanEdgeStyling}>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Stroke Width: {cleanEdgesStrokeWidth.toFixed(2)}
          </Typography>
          <Slider
            value={cleanEdgesStrokeWidth}
            onChange={(_, value) => setCleanEdgesStrokeWidth(value as number)}
            min={0.01}
            max={2}
            step={0.01}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value.toFixed(2)}
            sx={{ color: '#9c27b0' }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Opacity: {cleanEdgesOpacity.toFixed(2)}
          </Typography>
          <Slider
            value={cleanEdgesOpacity}
            onChange={(_, value) => setCleanEdgesOpacity(value as number)}
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value.toFixed(2)}
            sx={{ color: '#9c27b0' }}
          />
        </Box>

        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <input
            type="checkbox"
            checked={useCleanEdgesFill}
            onChange={(e) => setUseCleanEdgesFill(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <Typography variant="caption" color="text.secondary">
            Use Fill
          </Typography>
          {useCleanEdgesFill && (
            <input
              type="color"
              value={cleanEdgesFillColor}
              onChange={(e) => setCleanEdgesFillColor(e.target.value)}
              style={{ marginLeft: '8px', cursor: 'pointer' }}
            />
          )}
        </Box>

          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <input
              type="checkbox"
              checked={useBezierCleanLines}
              onChange={(e) => setUseBezierCleanLines(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <Typography variant="caption" color="text.secondary">
              Use Bezier Curves
            </Typography>
          </Box>

          {/* Download SVG Button */}
          <button
            onClick={() => downloadSVG(svgString, 'edge-detection.svg')}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              backgroundColor: '#9c27b0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              marginTop: '8px',
            }}
          >
            Download SVG
          </button>
          </Collapse>
        </Box>
      )}

      {/* Right Panel Toggle Button */}
      {!showRightPanel && (
        <IconButton
          onClick={() => setShowRightPanel(true)}
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
          }}
        >
          <span style={{ fontSize: '20px' }}>☰</span>
        </IconButton>
      )}

      {/* Blur Controls */}
      {showRightPanel && (
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
          {/* Hide Panel Button */}
          <IconButton
            size="small"
            onClick={() => setShowRightPanel(false)}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              padding: '8px',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
            }}
          >
            <span style={{ fontSize: '16px' }}>✕</span>
          </IconButton>

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

        {/* Preset Management */}
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: 3,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            minWidth: 280,
            maxWidth: 320,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#673ab7', mb: 2 }}>
            Presets
          </Typography>

          {/* Save Preset */}
          <Box sx={{ mb: 2 }}>
            <input
              type="text"
              placeholder="Preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && savePreset()}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                border: '2px solid #673ab7',
                borderRadius: '4px',
                outline: 'none',
                marginBottom: '8px',
              }}
            />
            <button
              onClick={savePreset}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: '#673ab7',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              Save Current Settings
            </button>
          </Box>

          {/* Preset List */}
          {presets.length > 0 && (
            <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Saved Presets:
              </Typography>
              {presets.map((preset, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                    padding: '8px',
                    backgroundColor: 'rgba(103, 58, 183, 0.05)',
                    borderRadius: '4px',
                    border: '1px solid rgba(103, 58, 183, 0.2)',
                  }}
                >
                  <button
                    onClick={() => loadPreset(preset.settings)}
                    style={{
                      flex: 1,
                      padding: '6px 12px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      backgroundColor: '#673ab7',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      textAlign: 'left',
                    }}
                  >
                    {preset.name}
                  </button>
                  <button
                    onClick={() => deletePreset(index)}
                    style={{
                      padding: '6px 10px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    ✕
                  </button>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        </Box>
      )}

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
