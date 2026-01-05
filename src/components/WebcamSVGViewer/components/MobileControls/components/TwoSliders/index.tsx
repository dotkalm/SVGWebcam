import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { TTwoSlidersProps } from '@/types';
import { 
    sliderContainer,
    sliderStyles,
} from '@/styles/styles';


export default function TwoSliders({ configs }: TTwoSlidersProps) {
    const theme = useTheme();
    console.log({ configs });   
    return (
        <Box
            sx={{
                width: '98dvw',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
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
                            minWidth: '100%',
                            maxWidth: '100%',
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
                            <br/>
                            <Typography variant="body1" color="text.secondary" sx={{ display: 'block', fontSize: '.8em' }}>
                                {value.toFixed(3)}
                            </Typography>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}