import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Menu() {
    const menuItems = [
    'Edge Detection',
    'Background',
    'Outline',
    'Blur',
    'Presets',
    ];

    return(
        <Box
        sx={{
            position:'absolute',
            zIndex:10002,
            top:'12dvh',
            right:'1.8em',
        }}
        >
            {
                menuItems.map((item) => (
                    <Button
                        key={item}
                        sx={{
                            display: 'block',
                            bgcolor: '#ff6f00',
                        }}
                    >
                        <Typography
                            key={item}
                        >
                            {item}
                        </Typography>
                    </Button>
                ))
            }
            <Typography>Mobile Controls</Typography>
        </Box>

    )
}