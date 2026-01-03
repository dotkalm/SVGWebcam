import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { TConfigProps } from '@/types';
import { 
    sliderContainer,
    sliderStyles,
} from '@/styles/styles';

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
                                    max={0.1}
                                    min={0.001}
                                    onChange={(_, value) => {
                                        if (index === 0) {
                                            return updateConfig({ highThreshold: value as number })
                                        }
                                        return updateConfig({ lowThreshold: value as number })
                                    }}
                                    size='small'
                                    step={0.001}
                                    sx={sliderStyles(theme)}
                                    value={index === 0 ? config.highThreshold : config.lowThreshold}
                                    valueLabelDisplay="auto"
                                    valueLabelFormat={(value) => `${value.toFixed(3)}x`}
                                />
                            </Box>
                            <Typography variant="body1" color="text.secondary" sx={{ display: 'block', fontSize: '.8em' }}>
                                {label}
                            </Typography>
                            <br/>
                            <Typography variant="body1" color="text.secondary" sx={{ display: 'block', fontSize: '.8em' }}>
                                {index === 0 ? config.highThreshold.toFixed(3) : config.lowThreshold.toFixed(3)}
                            </Typography>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}