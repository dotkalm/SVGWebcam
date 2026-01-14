import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTheme } from '@mui/material/styles';
import IconButton  from '@mui/material/IconButton';
import SwapVertSharpIcon from '@mui/icons-material/SwapVertSharp';
import type { TOverallProps } from '@/types';
import { 
    sliderContainer,
    sliderStyles,
} from '@/styles/styles';
import { StyledSwitch } from '../Switch';


export default function Overall({ 
    configs,
    outlineEnabled,
    backgroundEnabled,
}: TOverallProps) {
    const theme = useTheme();
    const enableBackgroundLabel = !backgroundEnabled.value ? 'Background Off' : 'Background On';
    const enableOutlineLabel = !outlineEnabled.value ? 'Outline Off' : 'Outline On';
    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    width: '100dvw',
                    px: '4dvw',
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
                                width: '100%',
                                minWidth: '100%',
                                maxWidth: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
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
                        width: '100dvw',
                        px: '4dvw',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: 1,

                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'row',
                                alignContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box
                                    sx={{
                                        flex: 1,
                                    }}
                            >
                                <Box
                                >
                                    Visibility
                                </Box>
                            </Box>
                            <Box
                                    sx={{
                                        flex: 1,
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                            >
                                <IconButton
                                    sx={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1,
                                        padding: 0,
                                    }}
                                >
                                <Box
                                    sx={{
                                        flex: 1,
                                    }}
                                >
                                <Typography
                                    sx={{
                                        flex: 1,
                                        textAlign: 'right',
                                        fontSize: '1rem',
                                        color: 'text.primary',    
                                    }}
                                >
                                    Layer Order
                                </Typography>
                                </Box>
                                    <SwapVertSharpIcon sx={{ color: '#ff6f00' }} />
                                </IconButton>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
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
                                        checked={backgroundEnabled.value}
                                        slotProps={{ input: { 'aria-label': enableBackgroundLabel } }}
                                        onChange={backgroundEnabled.changeHandler}
                                    />
                                }
                                label={enableBackgroundLabel}
                            />
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
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
                                        checked={outlineEnabled.value}
                                        slotProps={{ input: { 'aria-label': enableOutlineLabel } }}
                                        onChange={outlineEnabled.changeHandler}
                                    />
                                }
                                label={enableOutlineLabel}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}