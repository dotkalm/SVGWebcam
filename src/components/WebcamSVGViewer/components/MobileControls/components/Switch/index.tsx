import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';


export const StyledSwitch = styled(Switch)(({ theme }) => ({
    width: 42,
    height: 20,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        // Unchecked state (default)
        '& .MuiSwitch-thumb': {
            width: 16,
            height: 16,
            backgroundColor: `${theme.palette.colors.activeBackground} !important`,
            border: `1px solid ${theme.palette.colors.activeBorder} !important`,
            opacity: '1 !important',
        },
        '& + .MuiSwitch-track': {
            backgroundColor: `${theme.palette.colors.activeText} !important`,
            border: `1px solid ${theme.palette.colors.activeBorder} !important`,
            opacity: '1 !important',
            borderRadius: 10,
        },
        // Checked state
        '&.Mui-checked': {
            transform: 'translateX(22px)',
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
    '& .MuiSwitch-track': {
        borderRadius: 10,
    },
}));