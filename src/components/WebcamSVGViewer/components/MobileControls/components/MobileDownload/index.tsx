import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton  from '@mui/material/IconButton';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useTheme } from '@mui/material/styles';
import type { TMobileFooterProps } from '@/types';

export default function MobileDownload({
    config,
    updateConfig,
    downloadSVG,
    downloadPNG,
    svgString,
}: TMobileFooterProps) {
    const theme = useTheme();
    return (
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
                onClick={() => downloadPNG && downloadPNG(svgString, 'edge-detection.png', 1920, 1080)}
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
                onClick={() => downloadSVG(svgString, 'edge-detection.svg')}
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
    );
}