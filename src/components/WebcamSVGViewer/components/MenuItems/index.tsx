import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Menu() {
    const menuItems = [
    'Edges',
    'BG',
    'Outline',
    'Blur',
    'Presets',
    ];

    return(
        <Box
        sx={{
            position:'absolute',
            zIndex:10002,
            width: '100%',
            paddingLeft: '15dvw',
            paddingRight: '1dvw',
            gap: '1dvw',
            display:'flex',
            flexDirection:'row',
            alignContent:'center',
            alignItems:'center',
            justifyContent:'right',
            height: '6.5dvh',
        }}
        >
            {
                menuItems.map((item) => (
                    <Button
                        key={item}
                        sx={{
                            display: 'block',
                            bgcolor: '#ff6f00',
                            height: '4dvh',
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
                ))
            }
        </Box>

    )
}