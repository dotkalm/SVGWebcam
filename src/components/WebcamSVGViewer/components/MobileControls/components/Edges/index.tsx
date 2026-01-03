import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { TConfigProps } from '@/types';

export default function Edges({ config, updateConfig }: TConfigProps) {
    const theme = useTheme();
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
            }}
        >
            {['High Threshold', 'Low Threshold'].map((label, index) => {
                return (
                    <Box
                        key={label}
                        sx={{
                            mb: 1,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            paddingRight: '4dvw',
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                alignContent: 'flex-end',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                            }}
                        >
                            <Box
                                sx={{
                                    width: '70%',
                                    height: '4dvh',
                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                    borderRadius: '50px',
                                    borderColor: theme.palette.colors.border,
                                    borderWidth: '.1em',
                                    borderStyle: 'solid',
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
                                        width: '80%',
                                        fontSize: '1dvh',
                                        '& .MuiSlider-rail': {
                                            backgroundColor: '#fff', // white background for the rail
                                            opacity: 1,
                                            height: '.4em'
                                        },
                                        '& .MuiSlider-track': {
                                        },
                                        '& .MuiSlider-thumb': {
                                            backgroundColor: theme.palette.colors.activeBackground,
                                            border: `1px solid ${theme.palette.colors.activeBorder}`,
                                            '&:hover, &.Mui-focusVisible': {
                                                boxShadow: '0 0 0 8px rgba(71, 71, 71, 0)',
                                            },
                                            height: '2em',
                                            width: '2em'
                                        },
                                    }}
                                />
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ display: 'block', fontSize: '.8em' }}>
                                {label}
                            </Typography>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}