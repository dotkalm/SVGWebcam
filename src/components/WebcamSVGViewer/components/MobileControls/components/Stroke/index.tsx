import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { TStrokeProps } from '@/types';
import { 
    sliderContainer,
    sliderStyles,
} from '@/styles/styles';


export default function Stroke({ configs, strokeColor }: TStrokeProps) {
    const theme = useTheme();
    return (
        <Box
            sx={{
                width: '98dvw',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
            }}
        >
            {Object.keys(configs).map((label: string, index: number) => {
                const {
                    changeHandler,
                    max,
                    min,
                    step,
                    value,
                } = configs[label];
                return (
                    <Box
                        key={label}
                        sx={{
                            mb: 1,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            px: '4dvw',
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
                                gap: 2,
                            }}
                        >
                            <Box sx={sliderContainer(theme)}>
                                <Slider
                                    max={max}
                                    min={min}
                                    onChange={changeHandler}
                                    size='small'
                                    step={step}
                                    sx={sliderStyles(theme)}
                                    value={value}
                                    valueLabelDisplay="auto"
                                    valueLabelFormat={(value) => `${value.toFixed(3)}x`}
                                />
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ display: 'block', fontSize: '.8em' }}>
                                {label}
                            </Typography>
                            <br />
                            <Typography variant="body1" color="text.secondary" sx={{ display: 'block', fontSize: '.8em' }}>
                                {value.toFixed(3)}
                            </Typography>
                        </Box>
                    </Box>
                );
            })}
            <Box 
                sx={{
                    alignItems: 'flex-end',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 1,
                    px: '4dvw',
                    width: '100%',
                }}
            >
            <Box 
                sx={{
                    width: '100%',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 2,
                }}
            >
                <Typography variant="caption" color="text.secondary">
                    Stroke Color
                </Typography>
                <input
                    type="color"
                    value={strokeColor.value}
                    onChange={strokeColor.changeHandler}
                    style={{ cursor: 'pointer', height: '24px', width: '48px', border: 'none', borderRadius: '4px' }}
                />
            </Box>
            </Box>
        </Box>
    );
}