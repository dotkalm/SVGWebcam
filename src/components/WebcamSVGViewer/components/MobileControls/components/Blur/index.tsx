import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { TBlurProps } from '@/types';
import { 
    sliderContainer,
    sliderStyles,
} from '@/styles/styles';
import { StyledSwitch } from '../Switch';


export default function Fill({ 
    blurMode,
    configs, 
    useBlur,
 }: TBlurProps) {
    const theme = useTheme();
    const blurLabel = !useBlur?.value ? 'Blur Off' : 'Blur On';
    return (
        <Box
            sx={{
                width: '98dvw',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}
        >
            {!!useBlur && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        flexDirection: 'row',
                        width: '100%',
                        px: '4dvw',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            flexDirection: 'row',
                            paddingLeft: '2dvw',
                            width: '100%',
                            '& .MuiFormControlLabel-label': {
                                fontSize: '.8em !important',
                            }
                        }}
                    >
                        <FormControlLabel
                            control={
                                <StyledSwitch
                                    checked={useBlur.value}
                                    slotProps={{ input: { 'aria-label': blurLabel } }}
                                    onChange={useBlur.changeHandler}
                                />
                            }
                            label={blurLabel}
                        />
                    </Box>
                </Box>
            )}
            {Object.keys(configs).map((label: string) => {
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
        </Box>
    );
};