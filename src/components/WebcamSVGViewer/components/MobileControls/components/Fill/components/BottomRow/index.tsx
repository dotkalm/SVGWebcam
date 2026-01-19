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
import { StyledSwitch } from '../../../Switch';


export default function BottomRow({ 
    dashArray,
    createWiggle,
    createDashArray,
}: Pick<TFillProps, 'dashArray' | 'createWiggle' | 'createDashArray'>) {
    const theme = useTheme();
    const wiggleLabel = createWiggle.value ? 'Wiggle' : 'Static';
    const dashArrayLabel = createDashArray.value ? 'Dashes' : 'Solid';
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                alignContent: 'center',
                flexDirection: 'row',
                width: '100%',
                height: '5dvh',
                gap: 1,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '5dvh',
                    flex: '1 1 25%',
                    maxWidth: '25%',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        '& .MuiFormControlLabel-root': {
                            margin: '0 !important',
                        },
                        '& .MuiFormControlLabel-label': {
                            margin: '0 !important',
                            fontSize: '.8em !important',
                            padding: 0,
                            minWidth: '50px',
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
            </Box>
            <Box
                sx={{
                    flex: '1 1 25%',
                    maxWidth: '25%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '5dvh',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        width: '100%',
                        '& .MuiFormControlLabel-root': {
                            margin: '0 !important',
                        },
                        '& .MuiFormControlLabel-label': {
                            fontSize: '.8em !important',
                            padding: 0,
                            minWidth: '50px',
                        }
                    }}
                >
                    <FormControlLabel
                        sx={{ width: '100%', justifyContent: 'center' }}
                        control={
                            <StyledSwitch
                                checked={createDashArray.value}
                                slotProps={{ input: { 'aria-label': dashArrayLabel } }}
                                onChange={createDashArray.changeHandler}
                            />
                        }
                        label={dashArrayLabel}
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    flex: '1 1 50%',
                    maxWidth: '50%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '5dvh',
                    visibility: createDashArray.value ? 'visible' : 'hidden',
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
                        justifyContent: 'flex-end',
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
    );
};
/*
    return (
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
    );
*/