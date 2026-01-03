import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { type TConfigProps, SubMenuItem, MenuItem } from '@/types';

export default function Submenu({ config, updateConfig }: TConfigProps) {
    const theme = useTheme();
    const { activeMenuItem, activeSubMenuItem } = config;

    if (activeMenuItem !== MenuItem.BACKGROUND_STYLING && activeMenuItem !== MenuItem.OUTLINE) {
        return null;
    }
    const {
        palette: {
            text: {
                primary
            },
            colors: {
                activeBackground,
                activeBorder,
                activeText,
                border,
            } 
        } 
    } = theme;

    return (
        <Box
            sx={{
                alignItems: 'center',
                display: 'flex',
                height: '1dvh',
                gap: '1dvw',
                justifyContent: 'space-evenly',
                alignContent: 'center',
                margin: '1dvw',
                position: 'absolute',
                top: '25.5dvh',
                width: '98dvw',
                zIndex: 100010,
            }}
        >
            {
                Object.values(SubMenuItem).map((item: SubMenuItem, index: number) => {
                    const isActive = item === activeSubMenuItem || (index === 0 && !activeSubMenuItem);
                    return (
                        <Button
                            key={item}
                            sx={{
                                borderRadius: '10px',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: isActive ? activeBackground : 'transparent',
                                border: isActive ? `2px solid ${activeBorder}` : `2px solid ${border}`,
                                color: isActive ? activeText : primary,
                            }}
                            onClick={() => {
                                updateConfig({
                                    activeSubMenuItem: item,
                                })
                            }}
                        >
                            <Typography
                                variant="caption"
                            >
                                {item}
                            </Typography>
                        </Button>
                    )
                })
            }
        </Box>
    )
}
