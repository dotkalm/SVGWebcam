'use client'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import type { ViewerConfig, UIState } from './config';

interface LeftControlPanelProps {
  config: ViewerConfig;
  updateConfig: (updates: Partial<ViewerConfig>) => void;
  uiState: UIState;
  updateUIState: (updates: Partial<UIState>) => void;
  svgString: string;
  downloadSVG: (svg: string, filename: string) => void;
}

export function LeftControlPanel(props: LeftControlPanelProps) {
  const {
    config,
    updateConfig,
    uiState,
    updateUIState,
    svgString,
    downloadSVG,
  } = props;

  return (
    <>
      {/* Left Panel Toggle Button */}
      {!uiState.showLeftPanel && (
        <IconButton
          onClick={() => updateUIState({ showLeftPanel: true })}
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

      {/* Left Control Panel */}
      {uiState.showLeftPanel && (
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
              onClick={() => updateUIState({ showLeftPanel: false })}
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
              onClick={() => updateUIState({ expandEdgeDetection: !uiState.expandEdgeDetection })}
              sx={{ padding: '4px' }}
            >
              <span style={{ fontSize: '16px' }}>{uiState.expandEdgeDetection ? '▼' : '▶'}</span>
            </IconButton>
          </Box>

          <Collapse in={uiState.expandEdgeDetection}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                High Threshold: {config.highThreshold.toFixed(3)}
              </Typography>
              <Slider
                value={config.highThreshold}
                onChange={(_, value) => updateConfig({ highThreshold: value as number })}
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
                Low Threshold: {config.lowThreshold.toFixed(3)}
              </Typography>
              <Slider
                value={config.lowThreshold}
                onChange={(_, value) => updateConfig({ lowThreshold: value as number })}
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
              onClick={() => updateUIState({ expandSVGGeneration: !uiState.expandSVGGeneration })}
              sx={{ padding: '4px' }}
            >
              <span style={{ fontSize: '16px' }}>{uiState.expandSVGGeneration ? '▼' : '▶'}</span>
            </IconButton>
          </Box>

          <Collapse in={uiState.expandSVGGeneration}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Crosshatch Threshold: {config.crosshatchThreshold}
              </Typography>
              <Slider
                value={config.crosshatchThreshold}
                onChange={(_, value) => updateConfig({ crosshatchThreshold: value as number })}
                min={1}
                max={255}
                step={1}
                valueLabelDisplay="auto"
                sx={{ color: '#9c27b0' }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Crosshatch Simplification: {config.crosshatchSimplification}
              </Typography>
              <Slider
                value={config.crosshatchSimplification}
                onChange={(_, value) => updateConfig({ crosshatchSimplification: value as number })}
                min={1}
                max={10}
                step={0.5}
                valueLabelDisplay="auto"
                sx={{ color: '#9c27b0' }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Clean Edge Min Path Length: {config.cleanEdgeMinPathLength}
              </Typography>
              <Slider
                value={config.cleanEdgeMinPathLength}
                onChange={(_, value) => updateConfig({ cleanEdgeMinPathLength: value as number })}
                min={1}
                max={20}
                step={1}
                valueLabelDisplay="auto"
                sx={{ color: '#9c27b0' }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Clean Edge Simplification: {config.cleanEdgeSimplification}
              </Typography>
              <Slider
                value={config.cleanEdgeSimplification}
                onChange={(_, value) => updateConfig({ cleanEdgeSimplification: value as number })}
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
              onClick={() => updateUIState({ expandCrosshatchStyling: !uiState.expandCrosshatchStyling })}
              sx={{ padding: '4px' }}
            >
              <span style={{ fontSize: '16px' }}>{uiState.expandCrosshatchStyling ? '▼' : '▶'}</span>
            </IconButton>
          </Box>

          <Collapse in={uiState.expandCrosshatchStyling}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Stroke Width: {config.crosshatchStrokeWidth.toFixed(2)}
              </Typography>
              <Slider
                value={config.crosshatchStrokeWidth}
                onChange={(_, value) => updateConfig({ crosshatchStrokeWidth: value as number })}
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
                Opacity: {config.crosshatchOpacity.toFixed(2)}
              </Typography>
              <Slider
                value={config.crosshatchOpacity}
                onChange={(_, value) => updateConfig({ crosshatchOpacity: value as number })}
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
                checked={config.useCrosshatchFill}
                onChange={(e) => updateConfig({ useCrosshatchFill: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
              <Typography variant="caption" color="text.secondary">
                Use Fill
              </Typography>
              {config.useCrosshatchFill && (
                <input
                  type="color"
                  value={config.crosshatchFillColor}
                  onChange={(e) => updateConfig({ crosshatchFillColor: e.target.value })}
                  style={{ marginLeft: '8px', cursor: 'pointer' }}
                />
              )}
            </Box>

            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <input
                type="checkbox"
                checked={config.useBezierCrosshatch}
                onChange={(e) => updateConfig({ useBezierCrosshatch: e.target.checked })}
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
              onClick={() => updateUIState({ expandCleanEdgeStyling: !uiState.expandCleanEdgeStyling })}
              sx={{ padding: '4px' }}
            >
              <span style={{ fontSize: '16px' }}>{uiState.expandCleanEdgeStyling ? '▼' : '▶'}</span>
            </IconButton>
          </Box>

          <Collapse in={uiState.expandCleanEdgeStyling}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Stroke Width: {config.cleanEdgesStrokeWidth.toFixed(2)}
              </Typography>
              <Slider
                value={config.cleanEdgesStrokeWidth}
                onChange={(_, value) => updateConfig({ cleanEdgesStrokeWidth: value as number })}
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
                Opacity: {config.cleanEdgesOpacity.toFixed(2)}
              </Typography>
              <Slider
                value={config.cleanEdgesOpacity}
                onChange={(_, value) => updateConfig({ cleanEdgesOpacity: value as number })}
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
                checked={config.useCleanEdgesFill}
                onChange={(e) => updateConfig({ useCleanEdgesFill: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
              <Typography variant="caption" color="text.secondary">
                Use Fill
              </Typography>
              {config.useCleanEdgesFill && (
                <input
                  type="color"
                  value={config.cleanEdgesFillColor}
                  onChange={(e) => updateConfig({ cleanEdgesFillColor: e.target.value })}
                  style={{ marginLeft: '8px', cursor: 'pointer' }}
                />
              )}
            </Box>

            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <input
                type="checkbox"
                checked={config.useBezierCleanLines}
                onChange={(e) => updateConfig({ useBezierCleanLines: e.target.checked })}
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
    </>
  );
}
