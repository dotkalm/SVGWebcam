import Typography from '@mui/material/Typography';
import IconButton  from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Attribution';

export default function Attribution() {
    return (
        <IconButton
            aria-label='info - about'
            href="https://joelholmberg.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
                position: 'absolute',
                bottom: 0,
                right: 6,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'flex-end',
                width: '20dvw',
                height: '3dvw',
                gap: .15,
            }}
        >
            <InfoIcon
                sx={{
                    color: "gray",
                }}
            />
            <Typography
                sx={{
                    fontSize: '1rem',
                    textAlign: 'right',
                }}
            >
                Joel Holmberg
                2026
            </Typography>
        </IconButton>
    )
}