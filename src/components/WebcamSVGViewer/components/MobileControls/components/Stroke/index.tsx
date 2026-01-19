import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { TStrokeProps } from '@/types';
import { 
    sliderContainer,
    sliderStyles,
} from '@/styles/styles';
import { StyledSwitch } from '../Switch';


export default function Stroke({ configs, strokeColor }: TStrokeProps) {
    const theme = useTheme();
    const strokeOpacity = configs['Stroke Opacity'].value;
    const strokeEnabled = strokeOpacity > 0;
    const label = !strokeEnabled ? 'Show Stroke' : 'Hide Stroke';
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
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    width: '100%',
                    px: '4dvw',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        paddingLeft: '1dvw',
                        width: '100%',
                        '& .MuiFormControlLabel-root': {
                            marginLeft: '0 !important',
                            marginRight: '0 !important',
                        },
                        '& .MuiFormControlLabel-label': {
                            paddingLeft: '2dvw',
                            fontSize: '.8em !important',
                        }
                    }}
                >
                    <FormControlLabel
                        control={
                            <StyledSwitch
                                checked={strokeEnabled}
                                slotProps={{ input: { 'aria-label': label } }}
                                onChange={(e) => {
                                    if (strokeEnabled) {
                                        configs['Stroke Opacity'].changeHandler(e as unknown as Event, 0);
                                    } else {
                                        configs['Stroke Opacity'].changeHandler(e as unknown as Event, 100);
                                    }
                                }}
                            />
                        }
                        label={label}                    
                    />
                </Box>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        width: '100%',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: 2,
                        }}
                    >
                        <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{
                                fontSize: '.8em',
                            }}
                        >
                            Stroke Color
                        </Typography>
                        <input
                            type="color"
                            value={strokeColor.value}
                            onChange={strokeColor.changeHandler}
                            style={{ cursor: 'pointer', height: '24px', width: '48px', border: 'none', borderRadius: '8px', background: 'none' }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};