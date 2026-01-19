import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton  from '@mui/material/IconButton';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { useState, Fragment } from 'react';
import type { TMobileFooterProps } from '@/types';

export default function MobileDownload({
    config,
    updateConfig,
    downloadSVG,
    downloadPNG,
    svgString,
}: TMobileFooterProps) {
    const theme = useTheme();
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleDownloadPNG = async () => {
        if (!downloadPNG) return;
        
        try {
            const result = await downloadPNG(svgString, 'edge-detection.png', 1920, 1080);
            
            if (result.action === 'shared' && result.success) {
                setSnackbar({ open: true, message: 'Image saved successfully!', severity: 'success' });
            } else if (result.action === 'downloaded' && result.success) {
                setSnackbar({ open: true, message: 'Image downloaded!', severity: 'success' });
            } else if (result.action === 'cancelled') {
                // Don't show anything for cancelled
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to save image', severity: 'error' });
        }
    };

    const handleDownloadSVG = async () => {
        try {
            console.log('SVG download started');
            const result = await downloadSVG(svgString, 'edge-detection.svg');
            console.log('SVG download result:', result);
            
            if (result.action === 'shared' && result.success) {
                setSnackbar({ open: true, message: 'SVG saved successfully!', severity: 'success' });
            } else if (result.action === 'downloaded' && result.success) {
                setSnackbar({ open: true, message: 'SVG downloaded!', severity: 'success' });
            } else if (result.action === 'cancelled') {
                console.log('SVG download cancelled');
                // Don't show anything for cancelled
            }
        } catch (error) {
            console.error('SVG download error:', error);
            setSnackbar({ open: true, message: 'Failed to save SVG', severity: 'error' });
        }
    };

    return (
        <Fragment>
            <Box
                sx={{
                    width: '100%',
                    paddingBottom: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    px: 8,
                    gap: 8,
                    height: '4dvh',
                }}
            >
            <IconButton
                onClick={handleDownloadPNG}
                aria-label='download PNG'
                sx={{
                    width: '40%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    border: `2px solid ${theme.palette.colors.border}`,
                    borderRadius: '5px',
                    gap: .5,
                    height: '4dvh',
                }}
            >
                <Typography
                    sx={{
                        fontSize: '.8rem',
                        paddingLeft: .8,
                    }}
                    color="black"
                >
                    PNG  
                </Typography>
                <FileDownloadIcon sx={{ color: "black" }} />
            </IconButton>
            <IconButton
                onClick={handleDownloadSVG}
                aria-label='download SVG'
                sx={{
                    width: '40%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    border: `2px solid ${theme.palette.colors.border}`,
                    borderRadius: '5px',
                    gap: .5,
                    height: '4dvh',
                }}
            >
                <Typography
                    sx={{
                        fontSize: '.8rem',
                        paddingLeft: .8,
                    }}
                    color="black"
                >
                    SVG
                </Typography>
                <FileDownloadIcon sx={{ color: "black" }} />
            </IconButton>
        </Box >
        
        <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{ bottom: { xs: 80, sm: 24 } }}
        >
            <Alert
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
        </Fragment>
    );
}