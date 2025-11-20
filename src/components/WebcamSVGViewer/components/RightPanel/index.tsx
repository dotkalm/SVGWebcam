'use client'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import type { RightControlPanelProps } from '@/types';

export function RightControlPanel(props: RightControlPanelProps) {
  const {
    config,
    updateConfig,
    uiState,
    updateUIState,
    presets,
    presetName,
    setPresetName,
    savePreset,
    loadPreset,
    deletePreset,
  } = props;

  return (
    <>
      {/* Right Panel Toggle Button */}
      {!uiState.showRightPanel && (
        <IconButton
          onClick={() => updateUIState({ showRightPanel: true })}
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

      {/* Right Control Panel */}
      {uiState.showRightPanel && (
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
            onClick={() => updateUIState({ showRightPanel: false })}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              padding: '8px',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
            }}
          >
            <span style={{ fontSize: '16px' }}>✕</span>
          </IconButton>

          {/* Blur Mode Toggle Button */}
          <button
            onClick={() => {
              const modes: Array<'gaussian' | 'motion' | 'bokeh'> = ['gaussian', 'motion', 'bokeh'];
              const currentIndex = modes.indexOf(config.blurMode);
              const nextIndex = (currentIndex + 1) % modes.length;
              updateConfig({ blurMode: modes[nextIndex] });
            }}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              backgroundColor: config.blurMode === 'gaussian' ? '#2196F3' : config.blurMode === 'motion' ? '#4CAF50' : '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            {config.blurMode === 'gaussian' ? 'Gaussian Blur' : config.blurMode === 'motion' ? 'Motion Blur' : 'Bokeh (Shallow DOF)'}
          </button>

          {/* Motion Blur Controls */}
          {config.blurMode === 'motion' && (
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
                value={config.motionBlurAmount}
                onChange={(_, value) => updateConfig({ motionBlurAmount: value as number })}
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
                    updateConfig({ motionBlurAngle: (angle * 180) / Math.PI });
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '50%',
                      height: 3,
                      backgroundColor: '#4CAF50',
                      transformOrigin: 'left center',
                      transform: `translateY(-50%) rotate(${config.motionBlurAngle}deg)`,
                      borderRadius: 1,
                    }}
                  />
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
                    {config.motionBlurAngle.toFixed(0)}°
                  </Typography>
                  <Slider
                    value={config.motionBlurAngle}
                    onChange={(_, value) => updateConfig({ motionBlurAngle: value as number })}
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
          {config.blurMode === 'bokeh' && (
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
                value={config.aperture}
                onChange={(_, value) => updateConfig({ aperture: value as number })}
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
    </>
  );
}
