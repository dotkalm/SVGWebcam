import Box from '@mui/material/Box';
import CameraSwitch from '@mui/icons-material/Cameraswitch';
import IconButton  from '@mui/material/IconButton';
import type { LeftControlPanelProps } from '@/types';
import Zoom from './components/Zoom';
import MenuItems from '@/components/WebcamSVGViewer/components/MenuItems';
import Controls from './components/Controls';


export default function MobileControls(props: LeftControlPanelProps) {
    const { config, updateConfig } = props;
    const { facingMode } = config;
    return (
        <>
            <IconButton
                sx={{
                    left: '14px',
                    top: '0dvh',
                    position: 'absolute',
                    zIndex: 10005,
                }}
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
                        fontSize: '5dvh',

                    }}
                />
            </IconButton>
            <MenuItems 
                config={config}
                updateConfig={updateConfig}
            />
            <Controls
                config={config}
                updateConfig={updateConfig}
            />
            <Box
                sx={{
                    height: '8dvh',
                    width: '100vw',
                    position: 'absolute',
                    bottom: 10,
                    left: 0,
                    zIndex: 10000,
                }}
            >
                <Zoom
                    config={props.config}
                    updateConfig={props.updateConfig}
                />
            </Box>
        </>
    );
}
