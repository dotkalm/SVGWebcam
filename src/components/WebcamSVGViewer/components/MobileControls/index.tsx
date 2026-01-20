import Box from '@mui/material/Box';
import CameraSwitch from '@mui/icons-material/Cameraswitch';
import IconButton  from '@mui/material/IconButton';
import type { TMobileControlProps } from '@/types';
import MenuItems from '@/components/WebcamSVGViewer/components/MenuItems';
import Controls from './components/Controls';


export default function MobileControls({
    config,
    updateConfig,
    uiState,
    updateUIState,
    presets,
}: TMobileControlProps) {
    const { facingMode } = config;
    return (
        <Box
            sx={{
                    position: 'absolute',
                    zIndex: 10000,
                    background: 'rgba(255, 255, 255, .9)',
                    backdropFilter: 'blur(8px)',
            }}
        >
            <Box
                sx={{
                    width: '100vw',
                    top: '0dvh',
                    zIndex: 10005,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: '1dvw',
                    gap: '3dvw',
                }}
            >
                <IconButton
                    onClick={() => {
                        updateConfig({
                            facingMode: facingMode === 'user' ? 'environment' : 'user',
                        });
                    }}
                >
                    <CameraSwitch
                        width={140}
                        sx={{
                            color: '#454545ff',
                            fontSize: '4dvh',
                            zIndex: 100010,

                        }}
                    />
                </IconButton>
                <MenuItems
                    config={config}
                    updateConfig={updateConfig}
                />
            </Box>
            <Controls
                config={config}
                updateConfig={updateConfig}
                uiState={uiState}
                updateUIState={updateUIState}
                presets={presets}
            />
        </Box>
    );
}
