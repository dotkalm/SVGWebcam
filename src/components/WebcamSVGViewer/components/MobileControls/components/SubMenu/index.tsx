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
                height: '4dvh',
                gap: '1dvw',
                justifyContent: 'flex-end',
                alignContent: 'center',
                width: '98dvw',
                zIndex: 100010,
                paddingBottom: '2dvh',
            }}
        >
            {
                Object.values(SubMenuItem).map((item: SubMenuItem, index: number) => {
                    const isActive = item === activeSubMenuItem || (index === 0 && !activeSubMenuItem);
                    return (
                        <Button
                            key={item}
                            sx={{
                                borderRadius: '5px',
                                height: '3.5dvh',
                                width: '16dvw',
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
