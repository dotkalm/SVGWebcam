import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { type TConfigProps, MenuItem } from '@/types';

export default function Submenu({ config, updateConfig }: TConfigProps) {
    const theme = useTheme();
    const { activeMenuItem } = config;

    if (activeMenuItem !== MenuItem.BACKGROUND_STYLING && activeMenuItem !== MenuItem.OUTLINE) {
        return null;
    }

    return (
        <Box
            sx={{
                margin: '1dvw',
                border: `2px solid ${theme.palette.colors.border}`,
                zIndex: 100010,
                position: 'absolute',
                top: '25.5dvh',
                width: '98dvw',
                height: '3dvh',
                borderRadius: '10px',
                paddingLeft: '4dvw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}
        >
            <Box
            >
                <Typography>
                    Fidelity
                </Typography>
            </Box>
        </Box>
    )
}
