'use client'
import {
  useRef,
  type FC,
} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useGetWebcam } from '@/hooks/useGetWebcam';
import { useWebGLCanvas } from '@/hooks/useWebGLCanvas';
import type { TCannyEdgeDetectorProps } from '@/types/webgl';

export const EdgeDetector: FC<TCannyEdgeDetectorProps> = ({
  lowThreshold = 0.05,
  highThreshold = 0.15,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { isStreaming } = useGetWebcam({
    facingMode: 'environment',
    height: 480,
    videoRef,
    width: 640,
  });

  useWebGLCanvas({
    canvasRef,
    highThreshold,
    isStreaming,
    lowThreshold,
    videoRef,
  });

  return (
    <Box 
      sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        bgcolor: '#000051',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Hidden video element */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        style={{ display: 'none' }}
      />
      
      {/* Canvas - responsive */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transform: 'rotate(180deg)',
          }}
        />
      </Box>

      {/* Debug Info - Bottom overlay */}
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          px: 2,
          py: 1,
          borderRadius: 2,
          zIndex: 10,
        }}
      >
        <Typography variant="caption" display="block">
          Low: {lowThreshold.toFixed(2)} | High: {highThreshold.toFixed(2)}
        </Typography>
        <Typography variant="caption" display="block">
          {isStreaming ? '🟢 Streaming' : '⚪ Initializing...'}
        </Typography>
      </Paper>
    </Box>
  );
};