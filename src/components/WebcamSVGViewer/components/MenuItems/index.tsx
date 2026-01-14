import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { type TConfigProps, MenuItem, SubMenuItem } from '@/types';

export default function Menu({ config, updateConfig }: Pick<TConfigProps, 'config' | 'updateConfig'>) {
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
                zIndex: 10002,
                gap: '1dvw',
                display: 'flex',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
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
                                bgcolor: isActive ? activeBackground : 'transparent',
                                border: isActive ? `2px solid ${activeBorder}` : `2px solid ${border}`,
                                color: isActive ? activeText : primary,
                                height: '4dvh',
                                display: 'flex',
                                minWidth: '15dvw',
                                maxWidth: '15dvw',
                                width: '15dvw',
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
                                    fontSize: '.7em',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'normal',
                                    hyphens: 'auto',
                                }}
                                lang="en"
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