import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import type { TSliderProps } from '@/types';

export default function Zoom({
    config,
    updateConfig,
}: TSliderProps) {
    return (
        <Box
            sx={{
                mb: 1,
                width: '100dvw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    width: '70dvw',
                    height: '5dvh',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '50px',
                    borderColor: '#313131ff',
                    borderWidth: '.1em',
                    borderStyle: 'solid',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Slider
                    size='small'
                    value={config.cameraZoom}
                    onChange={(_, value) => updateConfig({ cameraZoom: value as number })}
                    min={1}
                    max={5}
                    step={0.1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value.toFixed(1)}x`}
                    sx={{
                        color: '#ff6f00',
                        width: '90%',
                        fontSize: '1dvh',
                        '& .MuiSlider-rail': {
                            backgroundColor: '#fff', // white background for the rail
                            opacity: 1,
                            height: '.4em'
                        },
                        '& .MuiSlider-track': {
                            backgroundColor: '#ff6f00',
                        },
                        '& .MuiSlider-thumb': {
                            backgroundColor: '#a6a6a6ff', // white thumb
                            border: '1px solid #5b5b5bff', // black outline on thumb
                            '&:hover, &.Mui-focusVisible': {
                                boxShadow: '0 0 0 8px rgba(71, 71, 71, 0)',
                            },
                            height: '2em',
                            width: '2em'
                        },
                    }}
                />
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
                Camera Zoom: {config.cameraZoom?.toFixed(1)}x
            </Typography>
        </Box>
    )
}