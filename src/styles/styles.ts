import type { Theme } from '@mui/material/styles';

export const sliderStyles = (theme: Theme) => ({
    width: '80%',
    fontSize: '1dvh',
    '& .MuiSlider-rail': {
        backgroundColor: '#fff',
        opacity: 1,
        height: '.4em'
    },
    '& .MuiSlider-track': {
    },
    '& .MuiSlider-thumb': {
        backgroundColor: theme.palette.colors.activeBackground,
        border: `1px solid ${theme.palette.colors.activeBorder}`,
        '&:hover, &.Mui-focusVisible': {
            boxShadow: '0 0 0 8px rgba(71, 71, 71, 0)',
        },
        height: '2em',
        width: '2em'
    },
});
export const sliderContainer = (theme: Theme) => ({
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: theme.palette.colors.border,
    borderRadius: '50px',
    borderStyle: 'solid',
    borderWidth: '.1em',
    display: 'flex',
    height: '4dvh',
    justifyContent: 'center',
    width: '70%',
})