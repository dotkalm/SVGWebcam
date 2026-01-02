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
                    top: '5dvh',
                    position: 'absolute',
                    zIndex: 10001,
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
            <IconButton
                sx={{
                    right: '14px',
                    top: '5dvh',
                    position: 'absolute',
                    zIndex: 10001,
                }}
                onClick={() => {
                    updateConfig({
                        facingMode: facingMode === 'user' ? 'environment' : 'user',
                    });
                }}
            >
                <Menu
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
                {activeTab !== 'zoom' && (
                <IconButton
                    sx={{
                        left: '10px',
                        bottom: '2dvh',
                        position: 'absolute',
                    }}
                >
                    <ArrowCircleLeft
                        sx={{
                            color: 'darkgray',
                            fontSize: '6dvh',
                        }}
                        width={140}
                    />
                </IconButton>)
                }
                {activeTab === 'zoom' && <Zoom
                    config={props.config}
                    updateConfig={props.updateConfig}
                />}
                {activeTab !== 'zoom' && (
                    <IconButton
                        sx={{
                            right: '10px',
                            bottom: '2dvh',
                            position: 'absolute',
                        }}
                    >
                        <ArrowCircleRight
                            sx={{
                                color: 'darkgray',
                                fontSize: '6dvh',
                                position: 'absolute',
                                right: '10px',
                                bottom: '2dvh',
                            }}
                        />
                    </IconButton>)
                }
            </Box>
        </>
    );
}
