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
import { Widgets } from '@mui/icons-material';


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
    const fillLabel = !fillEnabled.value ? 'Show Fill' : 'Hide Fill';
    const bezierLabel = useBezierBackground.value ? 'Bezier Curves' : 'Straight Lines';
    const wiggleLabel = createWiggle.value ? 'Wiggle' : 'Static';
    const dashArrayLabel = createDashArray.value ? 'Dashes' : 'Solid';
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
                        width: '50%',
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
                            paddingLeft: '1dvw',
                            width: '100%',
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
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    width: '100%',
                    height: '5dvh',
                    px: '4dvw',
                    gap: 4,
                }}
            >
                <Box
                    sx={{
                        width: '60%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'flex-start',
                        alignItems: 'flex-start',
                        justifyContent: 'space-around',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            width: '100%',
                            '& .MuiFormControlLabel-label': {
                                fontSize: '.8em !important',
                                padding: 0,
                            }
                        }}
                    >
                        <FormControlLabel
                            control={
                                <StyledSwitch
                                    checked={createWiggle.value}
                                    slotProps={{ input: { 'aria-label': wiggleLabel } }}
                                    onChange={createWiggle.changeHandler}
                                />
                            }
                            label={wiggleLabel}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            width: '100%',
                            '& .MuiFormControlLabel-label': {
                                fontSize: '.8em !important',
                                padding: 0,
                            }
                        }}
                    >
                        <FormControlLabel
                            control={
                                <StyledSwitch
                                    checked={createDashArray.value}
                                    slotProps={{ input: { 'aria-label': dashArrayLabel } }}
                                    onChange={createDashArray.changeHandler}
                                />
                            }
                            label={dashArrayLabel}
                            labelPlacement='start'
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'flex-end',
                        alignItems: 'flex-end',
                        justifyContent: 'space-around',
                            height: '5dvh',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            height: '5dvh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                    <Box
                        sx={{
                            ...sliderContainer(theme),
                            width: '100%',
                        }}
                    >
                        <Slider
                            max={dashArray.max}
                            min={dashArray.min}
                            onChange={dashArray.changeHandler}
                            size='small'
                            step={dashArray.step}
                            sx={{
                                ...sliderStyles(theme)
                            }}
                            value={dashArray.value}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value.toFixed(3)}x`}
                        />
                    </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignContent: 'center',
                            width: '100%',
                            height: '5dvh',
                        }}
                    >
                        <Typography variant="body1" color="text.secondary" sx={{ display: 'block', fontSize: '.8em' }}>
                            Dash Length
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};