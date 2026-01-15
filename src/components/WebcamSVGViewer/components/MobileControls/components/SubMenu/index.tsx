import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { type TConfigProps, SubMenuItem, MenuItem, SubMenuItemBlur } from '@/types';

export default function Submenu({ config, updateConfig }: Pick<TConfigProps, 'config' | 'updateConfig'>) {
    const theme = useTheme();
    const { activeMenuItem, activeSubMenuItem, blurMode: activeSubMenuItemBlur } = config;

    if (activeMenuItem !== MenuItem.BACKGROUND_STYLING && activeMenuItem !== MenuItem.OUTLINE && activeMenuItem !== MenuItem.BLUR) {
        return null;
    }

    const submenuItemsArray: SubMenuItem[] | SubMenuItemBlur[] = activeMenuItem !== MenuItem.BLUR ? Object.values(SubMenuItem) : Object.values(SubMenuItemBlur);

    const activeItem = activeMenuItem !== MenuItem.BLUR ? activeSubMenuItem : activeSubMenuItemBlur;

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
                submenuItemsArray.map((item: SubMenuItem | SubMenuItemBlur, index: number) => {
                    const isActive = item === activeItem || (index === 0 && !activeItem);
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
                                if(activeMenuItem !== MenuItem.BLUR) {
                                    updateConfig({
                                        activeSubMenuItem: item as SubMenuItem,
                                    });
                                }else{
                                    updateConfig({
                                        blurMode: item as SubMenuItemBlur,
                                    });
                                }
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    fontSize: '.7em',
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
