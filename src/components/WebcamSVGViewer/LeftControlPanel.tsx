'use client'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Switch from '@mui/material/Switch';
import type { ViewerConfig, UIState, LeftControlPanelProps } from '@/types';

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
            padding: 2,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            minWidth: 280,
            maxWidth: 320,
            maxHeight: 'calc(100vh - 32px)',
            overflowY: 'auto',
          }}
        >
          {/* Hide Panel Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => updateUIState({ showLeftPanel: false })}
              sx={{ padding: '4px' }}
            >
              <span style={{ fontSize: '16px' }}>✕</span>
            </IconButton>
          </Box>

          {/* Edge Detection Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
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
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
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

            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
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

          {/* Background Styling Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, mb: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
              Background Styling
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Switch
                checked={config.enableBackground}
                onChange={(e) => updateConfig({ enableBackground: e.target.checked })}
                size="small"
                sx={{ color: '#9c27b0' }}
              />
              <IconButton
                size="small"
                onClick={() => updateUIState({ expandBackgroundStyling: !uiState.expandBackgroundStyling })}
                sx={{ padding: '4px' }}
              >
                <span style={{ fontSize: '16px' }}>{uiState.expandBackgroundStyling ? '▼' : '▶'}</span>
              </IconButton>
            </Box>
          </Box>

          <Collapse in={uiState.expandBackgroundStyling}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
                Background Threshold: {config.backgroundThreshold}
              </Typography>
              <Slider
                value={config.backgroundThreshold}
                onChange={(_, value) => updateConfig({ backgroundThreshold: value as number })}
                min={1}
                max={255}
                step={1}
                valueLabelDisplay="auto"
                sx={{ color: '#9c27b0' }}
              />
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
                Background Simplification: {config.backgroundSimplification}
              </Typography>
              <Slider
                value={config.backgroundSimplification}
                onChange={(_, value) => updateConfig({ backgroundSimplification: value as number })}
                min={1}
                max={10}
                step={0.5}
                valueLabelDisplay="auto"
                sx={{ color: '#9c27b0' }}
              />
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
                Stroke Width: {config.backgroundStrokeWidth.toFixed(2)}
              </Typography>
              <Slider
                value={config.backgroundStrokeWidth}
                onChange={(_, value) => updateConfig({ backgroundStrokeWidth: value as number })}
                min={0.01}
                max={2}
                step={0.01}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => value.toFixed(2)}
                sx={{ color: '#9c27b0' }}
              />
            </Box>

            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Stroke Color
              </Typography>
              <input
                type="text"
                value={config.backgroundStrokeColor}
                onChange={(e) => updateConfig({ backgroundStrokeColor: e.target.value })}
                placeholder="rgba(0,0,0,1)"
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '12px',
                  width: '140px',
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  fontFamily: 'monospace'
                }}
              />
            </Box>

            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Use Fill
              </Typography>
              <Switch
                checked={config.useBackgroundFill}
                onChange={(e) => updateConfig({ useBackgroundFill: e.target.checked })}
                size="small"
                sx={{ color: '#9c27b0' }}
              />
            </Box>

            {config.useBackgroundFill && (
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  Fill Color
                </Typography>
                <input
                  type="text"
                  value={config.backgroundFillColor}
                  onChange={(e) => updateConfig({ backgroundFillColor: e.target.value })}
                  placeholder="rgba(0,0,0,0.5)"
                  style={{ 
                    padding: '4px 8px', 
                    fontSize: '12px',
                    width: '140px',
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontFamily: 'monospace'
                  }}
                />
              </Box>
            )}

            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Use Bezier Curves
              </Typography>
              <Switch
                checked={config.useBezierBackground}
                onChange={(e) => updateConfig({ useBezierBackground: e.target.checked })}
                size="small"
                sx={{ color: '#9c27b0' }}
              />
            </Box>
          </Collapse>

          {/* Outline Path Styling Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, mb: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
              Outline Path Styling
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Switch
                checked={config.enableOutlinePaths}
                onChange={(e) => updateConfig({ enableOutlinePaths: e.target.checked })}
                size="small"
                sx={{ color: '#9c27b0' }}
              />
              <IconButton
                size="small"
                onClick={() => updateUIState({ expandOutlinePathStyling: !uiState.expandOutlinePathStyling })}
                sx={{ padding: '4px' }}
              >
                <span style={{ fontSize: '16px' }}>{uiState.expandOutlinePathStyling ? '▼' : '▶'}</span>
              </IconButton>
            </Box>
          </Box>

          <Collapse in={uiState.expandOutlinePathStyling}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
                Outline Path Min Path Length: {config.outlinePathMinPathLength}
              </Typography>
              <Slider
                value={config.outlinePathMinPathLength}
                onChange={(_, value) => updateConfig({ outlinePathMinPathLength: value as number })}
                min={1}
                max={20}
                step={1}
                valueLabelDisplay="auto"
                sx={{ color: '#9c27b0' }}
              />
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
                Outline Path Simplification: {config.outlinePathSimplification}
              </Typography>
              <Slider
                value={config.outlinePathSimplification}
                onChange={(_, value) => updateConfig({ outlinePathSimplification: value as number })}
                min={1}
                max={10}
                step={0.5}
                valueLabelDisplay="auto"
                sx={{ color: '#9c27b0' }}
              />
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
                Stroke Width: {config.outlinePathsStrokeWidth.toFixed(2)}
              </Typography>
              <Slider
                value={config.outlinePathsStrokeWidth}
                onChange={(_, value) => updateConfig({ outlinePathsStrokeWidth: value as number })}
                min={0.01}
                max={2}
                step={0.01}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => value.toFixed(2)}
                sx={{ color: '#9c27b0' }}
              />
            </Box>

            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Stroke Color
              </Typography>
              <input
                type="text"
                value={config.outlinePathsStrokeColor}
                onChange={(e) => updateConfig({ outlinePathsStrokeColor: e.target.value })}
                placeholder="rgba(0,0,0,1)"
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '12px',
                  width: '140px',
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  fontFamily: 'monospace'
                }}
              />
            </Box>

            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Use Fill
              </Typography>
              <Switch
                checked={config.useOutlinePathsFill}
                onChange={(e) => updateConfig({ useOutlinePathsFill: e.target.checked })}
                size="small"
                sx={{ color: '#9c27b0' }}
              />
            </Box>

            {config.useOutlinePathsFill && (
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  Fill Color
                </Typography>
                <input
                  type="text"
                  value={config.outlinePathsFillColor}
                  onChange={(e) => updateConfig({ outlinePathsFillColor: e.target.value })}
                  placeholder="rgba(0,0,0,0.5)"
                  style={{ 
                    padding: '4px 8px', 
                    fontSize: '12px',
                    width: '140px',
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontFamily: 'monospace'
                  }}
                />
              </Box>
            )}

            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Use Bezier Curves
              </Typography>
              <Switch
                checked={config.useBezierOutlinePaths}
                onChange={(e) => updateConfig({ useBezierOutlinePaths: e.target.checked })}
                size="small"
                sx={{ color: '#9c27b0' }}
              />
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
