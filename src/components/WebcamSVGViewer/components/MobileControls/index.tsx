import { useState } from 'react';
import ArrowCircleLeft from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRight from '@mui/icons-material/ArrowCircleRightOutlined';
import Box from '@mui/material/Box';
import CameraSwitch from '@mui/icons-material/Cameraswitch';
import Menu from '@mui/icons-material/Menu';
import IconButton  from '@mui/material/IconButton';
import type { LeftControlPanelProps } from '@/types';
import Zoom from './components/Zoom';
import MenuItems from '@/components/WebcamSVGViewer/components/MenuItems';


export default function MobileControls(props: LeftControlPanelProps) {
    const [ activeTab, setActiveTab ] = useState('zoom');
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

                    }} />
            </IconButton>
            <MenuItems />
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
                {activeTab === 'zoom' && <Zoom
                    config={props.config}
                    updateConfig={props.updateConfig}
                />}
            </Box>
        </>
    );
}
