import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { alpha, styled } from '@mui/material/styles';
import type { TFillProps } from '@/types';
import { 
    sliderContainer,
    sliderStyles,
} from '@/styles/styles';


export default function Fill({ configs, fillColor, fillEnabled }: TFillProps) {
    const theme = useTheme();
    const enabled = fillEnabled.value;
    const label = !enabled ? 'Show Fill' : 'Hide Fill';
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
                        '& .MuiFormControlLabel-label': {
                            fontSize: '.8em !important',
                        }
                    }}
                >
                    <FormControlLabel
                        control={
                            <StyledSwitch
                                checked={enabled}
                                slotProps={{ input: { 'aria-label': label } }}
                                onChange={fillEnabled.changeHandler}
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
                            value={fillColor.value}
                            onChange={fillColor.changeHandler}
                            style={{ cursor: 'pointer', height: '24px', width: '48px', border: 'none', borderRadius: '8px', background: 'none' }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    // Unchecked state (default)
    '& .MuiSwitch-thumb': {
      backgroundColor: `${theme.palette.colors.background} !important`,
      border: `1px solid ${theme.palette.colors.border} !important`,
    },
    '& + .MuiSwitch-track': {
      backgroundColor: `${theme.palette.colors.activeBackground} !important`,
      border: `1px solid ${theme.palette.colors.border} !important`,
      opacity: '1 !important',
    },
    // Checked state
    '&.Mui-checked': {
      '& .MuiSwitch-thumb': {
        backgroundColor: `${theme.palette.colors.activeBackground} !important`,
        border: `1px solid ${theme.palette.colors.activeBorder} !important`,
      opacity: '1 !important',
      },
      '& + .MuiSwitch-track': {
        backgroundColor: `${theme.palette.colors.activeText} !important`,
        border: `1px solid ${theme.palette.colors.activeBorder} !important`,
        opacity: '1 !important',
      },
    },
  },
}));