import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';


export const StyledSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
        // Unchecked state (default)
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
        // Checked state
        '&.Mui-checked': {
            '& .MuiSwitch-thumb': {
                backgroundColor: `${theme.palette.colors.background} !important`,
                border: `1px solid ${theme.palette.colors.border} !important`,
            },
            '& + .MuiSwitch-track': {
                backgroundColor: `${theme.palette.colors.activeBackground} !important`,
                border: `1px solid ${theme.palette.colors.border} !important`,
                opacity: '1 !important',
            },
        },
    },
}));