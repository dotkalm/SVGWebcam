import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import IconButton  from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Attribution';
import type { TMobileFooterProps } from '@/types';
import Zoom from '../Zoom';
import MobileDownload from '../MobileDownload';
import { Typography } from '@mui/material';

export default function MobileFooter({
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
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 110000,
                width: '100%',
                paddingY: 1,
                background: 'rgba(255, 255, 255, .9)',
                backdropFilter: 'blur(8px)',
            }}
        >
            <Zoom
                config={config}
                updateConfig={updateConfig}
            />
            <MobileDownload
                config={config}
                updateConfig={updateConfig}
                downloadSVG={downloadSVG}
                downloadPNG={downloadPNG}
                svgString={svgString}
            />
            <IconButton
                aria-label='info - about'
                href="https://joelholmberg.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 6,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                    width: '10dvw',
                    height: '10dvw',
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
                    fontSize: '.3rem',
                    textAlign: 'left',
                }}
                >
                    Joel Holmberg
                    2026
                </Typography>
            </IconButton>
        </Box >
    );
}