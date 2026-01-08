import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { type TConfigProps, MenuItem, SubMenuItem } from '@/types';

export default function Menu({ config, updateConfig }: TConfigProps) {
    const menuItems = [
        'Edges',
        'BG',
        'Outline',
        'Blur',
        'Presets',
    ];
    const theme = useTheme();
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
                position: 'absolute',
                zIndex: 10002,
                width: '100%',
                paddingLeft: '15dvw',
                paddingRight: '1dvw',
                gap: '1dvw',
                display: 'flex',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'right',
                height: '6.5dvh',
            }}
        >
            {
                Object.values(MenuItem).map((item: MenuItem) => {
                    const { activeMenuItem } = config;
                    const isActive = item === activeMenuItem;
                    return (
                        <Button
                            key={item}
                            sx={{
                                display: 'block',
                                bgcolor: isActive ? activeBackground : 'transparent',
                                border: isActive ? `2px solid ${activeBorder}` : `2px solid ${border}`,
                                color: isActive ? activeText : primary,
                                height: '4dvh',
                            }}
                            onClick={() => {
                                updateConfig({
                                    activeMenuItem: item,
                                    activeSubMenuItem: SubMenuItem.FIDELITY,
                                })
                            }}
                        >
                            <Typography
                                key={item}
                                sx={{
                                    fontSize: '.8em',
                                }}
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