import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { type TConfigProps, MenuItem } from '@/types';
import Edges from '../Edges';

export default function Controls({ config, updateConfig }: TConfigProps) {
    const theme = useTheme();
    const { activeMenuItem } = config;

    if (!activeMenuItem) {
        return null;
    }

    return (
        <Box
            sx={{
                margin: '1dvw',
                border: `2px solid ${theme.palette.colors.border}`,
                zIndex: 100010,
                position: 'absolute',
                top: '7dvh',
                width: '98dvw',
                height: '18dvh',
                borderRadius: '10px',
            }}
        >
            {activeMenuItem === MenuItem.EDGE_DETECTION && (
                <Edges config={config} updateConfig={updateConfig} />
            )}
        </Box>
    )
}