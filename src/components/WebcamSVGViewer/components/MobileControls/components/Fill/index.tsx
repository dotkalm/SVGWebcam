import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { TFillProps } from '@/types';
import { 
    sliderContainer,
    sliderStyles,
} from '@/styles/styles';
import { StyledSwitch } from '../Switch';
import BottomRow from './components/BottomRow';


export default function Fill({ 
    configs, 
    fillColor, 
    fillEnabled,
    useBezierBackground,
    dashArray,
    createWiggle,
    createDashArray,
 }: TFillProps) {
    const theme = useTheme();
    const fillLabel = !fillEnabled.value ? 'Fill Off' : 'Fill On';
    const bezierLabel = useBezierBackground.value ? 'Bezier Curves' : 'Straight Lines';
    return (
        <Box
            sx={{
                width: '100dvw',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingX: '4dvw',
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
                            alignItems: 'center',
                            alignContent: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                alignContent: 'flex-end',
                                alignItems: 'center',
                                justifyContent: 'space-between',
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
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    flexDirection: 'row',
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        width: '50%',
                        '& .MuiFormControlLabel-root': {
                            marginLeft: '0 !important',
                            marginRight: '0 !important',
                        },
                        '& .MuiFormControlLabel-label': {
                            fontSize: '.8em !important',
                        }
                    }}
                >
                    <FormControlLabel
                        control={
                            <StyledSwitch
                                checked={useBezierBackground.value}
                                slotProps={{ input: { 'aria-label': bezierLabel } }}
                                onChange={useBezierBackground.changeHandler}
                            />
                        }
                        label={bezierLabel}
                    />
                </Box>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        width: '80%',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                            width: '100%',
                        '& .MuiFormControlLabel-root': {
                            marginLeft: '0 !important',
                            marginRight: '0 !important',
                        },
                            '& .MuiFormControlLabel-label': {
                                fontSize: '.8em !important',
                            }
                        }}
                    >
                        <FormControlLabel
                            control={
                                <StyledSwitch
                                    checked={fillEnabled.value}
                                    slotProps={{ input: { 'aria-label': fillLabel } }}
                                    onChange={fillEnabled.changeHandler}
                                />
                            }
                            label={fillLabel}
                        />
                    </Box>
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
                            Fill Color
                        </Typography>
                        <input
                            type="color"
                            value={fillColor.value}
                            onChange={fillColor.changeHandler}
                            style={{ cursor: 'pointer', height: '24px', width: '48px', border: 'none', borderRadius: '8px', background: 'none' }}
                        />
                    </Box>
                </Box>
            </Box>
            <BottomRow
                dashArray={dashArray}
                createWiggle={createWiggle}
                createDashArray={createDashArray}
            />
        </Box>
    );
};