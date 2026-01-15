import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import type { TMobileFooterProps } from '@/types';
import Zoom from '../Zoom';
import MobileDownload from '../MobileDownload';

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
                paddingBottom: 1,
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
        </Box >
    );
}