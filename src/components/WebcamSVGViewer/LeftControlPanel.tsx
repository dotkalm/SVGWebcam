'use client'
import { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Switch from '@mui/material/Switch';
import DragIndicator from '@mui/icons-material/DragIndicator';
import type { LeftControlPanelProps } from '@/types';

export function LeftControlPanel(props: LeftControlPanelProps) {
  const {
    config,
    updateConfig,
    uiState,
    updateUIState,
    svgString,
    downloadSVG,
  } = props;

  const [draggedSection, setDraggedSection] = useState<'background' | 'outlinePaths' | null>(null);

  const handleDragStart = (section: 'background' | 'outlinePaths') => (e: React.DragEvent) => {
    setDraggedSection(section);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (targetSection: 'background' | 'outlinePaths') => (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedSection || draggedSection === targetSection) {
      setDraggedSection(null);
      return;
    }

    const newOrder = [...uiState.layerOrder];
    const draggedIndex = newOrder.indexOf(draggedSection);
    const targetIndex = newOrder.indexOf(targetSection);

    // Swap the sections
    newOrder[draggedIndex] = targetSection;
    newOrder[targetIndex] = draggedSection;

    updateUIState({ layerOrder: newOrder });
    setDraggedSection(null);
  };

  const handleDragEnd = () => {
    setDraggedSection(null);
  };

  // Reusable section renderer
  const renderStylingSection = (
    sectionType: 'background' | 'outlinePaths',
    title: string,
    config: {
      enabled: boolean;
      expanded: boolean;
      threshold?: number;
      minPathLength?: number;
      simplification: number;
      strokeWidth: number;
      strokeColor: string;
      strokeOpacity: number;
      useFill: boolean;
      fillColor: string;
      fillOpacity: number;
      useBezier: boolean;
      wiggle: boolean;
      useDashArray: boolean;
      dashSize: number;
    },
    handlers: {
      onToggleEnable: (enabled: boolean) => void;
      onToggleExpand: () => void;
      onUpdateThreshold?: (value: number) => void;
      onUpdateMinPathLength?: (value: number) => void;
      onUpdateSimplification: (value: number) => void;
      onUpdateStrokeWidth: (value: number) => void;
      onUpdateStrokeColor: (value: string) => void;
      onUpdateStrokeOpacity: (value: number) => void;
      onToggleFill: (enabled: boolean) => void;
      onUpdateFillColor: (value: string) => void;
      onUpdateFillOpacity: (value: number) => void;
      onToggleBezier: (enabled: boolean) => void;
      onToggleWiggle: (enabled: boolean) => void;
      onToggleDashArray: (enabled: boolean) => void;
      onUpdateDashSize: (value: number) => void;
    }
  ) => {
    return (
      <Box
        key={sectionType}
        draggable
        onDragStart={handleDragStart(sectionType)}
        onDragOver={handleDragOver}
        onDrop={handleDrop(sectionType)}
        onDragEnd={handleDragEnd}
        sx={{
          cursor: 'move',
          opacity: draggedSection === sectionType ? 0.5 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {/* Section Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragIndicator sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' }, color: '#000000', opacity: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
              {title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Switch
              checked={config.enabled}
              onChange={(e) => handlers.onToggleEnable(e.target.checked)}
              size="small"
              sx={{ color: '#9c27b0' }}
            />
            <IconButton
              size="small"
              onClick={handlers.onToggleExpand}
              sx={{ padding: '4px' }}
            >
              <span style={{ fontSize: '16px' }}>{config.expanded ? '▼' : '▶'}</span>
            </IconButton>
          </Box>
        </Box>

        <Collapse in={config.expanded}>
          {/* Threshold (Background only) */}
          {config.threshold !== undefined && handlers.onUpdateThreshold && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
                Threshold: {config.threshold}
              </Typography>
              <Slider
                value={config.threshold}
                onChange={(_, value) => handlers.onUpdateThreshold!(value as number)}
                min={1}
                max={255}
                step={1}
                valueLabelDisplay="auto"
                sx={{ color: '#9c27b0' }}
              />
            </Box>
          )}

          {/* Min Path Length (Outline only) */}
          {config.minPathLength !== undefined && handlers.onUpdateMinPathLength && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
                Min Path Length: {config.minPathLength}
              </Typography>
              <Slider
                value={config.minPathLength}
                onChange={(_, value) => handlers.onUpdateMinPathLength!(value as number)}
                min={1}
                max={20}
                step={1}
                valueLabelDisplay="auto"
                sx={{ color: '#9c27b0' }}
              />
            </Box>
          )}

          {/* Simplification */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
              Simplification: {config.simplification}
            </Typography>
            <Slider
              value={config.simplification}
              onChange={(_, value) => handlers.onUpdateSimplification(value as number)}
              min={1}
              max={10}
              step={0.5}
              valueLabelDisplay="auto"
              sx={{ color: '#9c27b0' }}
            />
          </Box>

          {/* Stroke Width */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
              Stroke Width: {config.strokeWidth.toFixed(2)}
            </Typography>
            <Slider
              value={config.strokeWidth}
              onChange={(_, value) => handlers.onUpdateStrokeWidth(value as number)}
              min={0.01}
              max={2}
              step={0.01}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => value.toFixed(2)}
              sx={{ color: '#9c27b0' }}
            />
          </Box>

          {/* Stroke Color */}
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              Stroke Color
            </Typography>
            <input
              type="color"
              value={config.strokeColor}
              onChange={(e) => handlers.onUpdateStrokeColor(e.target.value)}
              style={{ cursor: 'pointer', height: '24px', width: '48px', border: 'none', borderRadius: '4px' }}
            />
          </Box>

          {/* Stroke Opacity */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
              Stroke Opacity: {config.strokeOpacity.toFixed(2)}
            </Typography>
            <Slider
              value={config.strokeOpacity}
              onChange={(_, value) => handlers.onUpdateStrokeOpacity(value as number)}
              min={0}
              max={1}
              step={0.01}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => value.toFixed(2)}
              sx={{ color: '#9c27b0' }}
            />
          </Box>

          {/* Use Fill */}
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              Use Fill
            </Typography>
            <Switch
              checked={config.useFill}
              onChange={(e) => handlers.onToggleFill(e.target.checked)}
              size="small"
              sx={{ color: '#9c27b0' }}
            />
          </Box>

          {/* Fill Color & Opacity */}
          {config.useFill && (
            <>
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  Fill Color
                </Typography>
                <input
                  type="color"
                  value={config.fillColor}
                  onChange={(e) => handlers.onUpdateFillColor(e.target.value)}
                  style={{ cursor: 'pointer', height: '24px', width: '48px', border: 'none', borderRadius: '4px' }}
                />
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
                  Fill Opacity: {config.fillOpacity.toFixed(2)}
                </Typography>
                <Slider
                  value={config.fillOpacity}
                  onChange={(_, value) => handlers.onUpdateFillOpacity(value as number)}
                  min={0}
                  max={1}
                  step={0.01}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => value.toFixed(2)}
                  sx={{ color: '#9c27b0' }}
                />
              </Box>
            </>
          )}

          {/* Use Bezier Curves */}
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              Use Bezier Curves
            </Typography>
            <Switch
              checked={config.useBezier}
              onChange={(e) => handlers.onToggleBezier(e.target.checked)}
              size="small"
              sx={{ color: '#9c27b0' }}
            />
          </Box>

          {/* Create Wiggle */}
          {config.useBezier && (
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Create Wiggle
              </Typography>
              <Switch
                checked={config.wiggle}
                onChange={(e) => handlers.onToggleWiggle(e.target.checked)}
                size="small"
                sx={{ color: '#9c27b0' }}
              />
            </Box>
          )}

          {/* Use Dash Array */}
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              Use Dash Array
            </Typography>
            <Switch
              checked={config.useDashArray}
              onChange={(e) => handlers.onToggleDashArray(e.target.checked)}
              size="small"
              sx={{ color: '#9c27b0' }}
            />
          </Box>

          {/* Dash Size */}
          {config.useDashArray && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
                Dash Size: {config.dashSize}
              </Typography>
              <Slider
                value={config.dashSize}
                onChange={(_, value) => handlers.onUpdateDashSize(value as number)}
                min={1}
                max={50}
                step={1}
                valueLabelDisplay="auto"
                sx={{ color: '#9c27b0' }}
              />
            </Box>
          )}

          {/* Download SVG Button (Outline only) */}
          {sectionType === 'outlinePaths' && (
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
          )}
        </Collapse>
      </Box>
    );
  };

  // Create sections in the order specified by layerOrder
  const renderSection = (sectionType: 'background' | 'outlinePaths') => {
    if (sectionType === 'background') {
      return renderStylingSection(
        'background',
        'Background',
        {
          enabled: config.enableBackground,
          expanded: uiState.expandBackgroundStyling,
          threshold: config.backgroundThreshold,
          simplification: config.backgroundSimplification,
          strokeWidth: config.backgroundStrokeWidth,
          strokeColor: config.backgroundStrokeColor,
          strokeOpacity: config.backgroundStrokeOpacity,
          useFill: config.useBackgroundFill,
          fillColor: config.backgroundFillColor,
          fillOpacity: config.backgroundFillOpacity,
          useBezier: config.useBezierBackground,
          wiggle: config.backgroundWiggle,
          useDashArray: config.backgroundUseDashArray,
          dashSize: config.backgroundDashSize,
        },
        {
          onToggleEnable: (enabled) => updateConfig({ enableBackground: enabled }),
          onToggleExpand: () => updateUIState({ expandBackgroundStyling: !uiState.expandBackgroundStyling }),
          onUpdateThreshold: (value) => updateConfig({ backgroundThreshold: value }),
          onUpdateSimplification: (value) => updateConfig({ backgroundSimplification: value }),
          onUpdateStrokeWidth: (value) => updateConfig({ backgroundStrokeWidth: value }),
          onUpdateStrokeColor: (value) => updateConfig({ backgroundStrokeColor: value }),
          onUpdateStrokeOpacity: (value) => updateConfig({ backgroundStrokeOpacity: value }),
          onToggleFill: (enabled) => updateConfig({ useBackgroundFill: enabled }),
          onUpdateFillColor: (value) => updateConfig({ backgroundFillColor: value }),
          onUpdateFillOpacity: (value) => updateConfig({ backgroundFillOpacity: value }),
          onToggleBezier: (enabled) => updateConfig({ useBezierBackground: enabled }),
          onToggleWiggle: (enabled) => updateConfig({ backgroundWiggle: enabled }),
          onToggleDashArray: (enabled) => updateConfig({ backgroundUseDashArray: enabled }),
          onUpdateDashSize: (value) => updateConfig({ backgroundDashSize: value }),
        }
      );
    } else {
      return renderStylingSection(
        'outlinePaths',
        'Outline',
        {
          enabled: config.enableOutlinePaths,
          expanded: uiState.expandOutlinePathStyling,
          minPathLength: config.outlinePathMinPathLength,
          simplification: config.outlinePathSimplification,
          strokeWidth: config.outlinePathsStrokeWidth,
          strokeColor: config.outlinePathsStrokeColor,
          strokeOpacity: config.outlinePathsStrokeOpacity,
          useFill: config.useOutlinePathsFill,
          fillColor: config.outlinePathsFillColor,
          fillOpacity: config.outlinePathsFillOpacity,
          useBezier: config.useBezierOutlinePaths,
          wiggle: config.outlinePathsWiggle,
          useDashArray: config.outlinePathsUseDashArray,
          dashSize: config.outlinePathsDashSize,
        },
        {
          onToggleEnable: (enabled) => updateConfig({ enableOutlinePaths: enabled }),
          onToggleExpand: () => updateUIState({ expandOutlinePathStyling: !uiState.expandOutlinePathStyling }),
          onUpdateMinPathLength: (value) => updateConfig({ outlinePathMinPathLength: value }),
          onUpdateSimplification: (value) => updateConfig({ outlinePathSimplification: value }),
          onUpdateStrokeWidth: (value) => updateConfig({ outlinePathsStrokeWidth: value }),
          onUpdateStrokeColor: (value) => updateConfig({ outlinePathsStrokeColor: value }),
          onUpdateStrokeOpacity: (value) => updateConfig({ outlinePathsStrokeOpacity: value }),
          onToggleFill: (enabled) => updateConfig({ useOutlinePathsFill: enabled }),
          onUpdateFillColor: (value) => updateConfig({ outlinePathsFillColor: value }),
          onUpdateFillOpacity: (value) => updateConfig({ outlinePathsFillOpacity: value }),
          onToggleBezier: (enabled) => updateConfig({ useBezierOutlinePaths: enabled }),
          onToggleWiggle: (enabled) => updateConfig({ outlinePathsWiggle: enabled }),
          onToggleDashArray: (enabled) => updateConfig({ outlinePathsUseDashArray: enabled }),
          onUpdateDashSize: (value) => updateConfig({ outlinePathsDashSize: value }),
        }
      );
    }
  };

  // Old implementation - DELETE
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

          {/* Render draggable styling sections in layer order */}
          {uiState.layerOrder.map(sectionType => renderSection(sectionType))}
        </Box>
      )}
    </>
  );
}
