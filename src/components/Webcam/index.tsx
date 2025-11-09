'use client';

import { useRef } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useWebcam } from '@/hooks/useWebcam';
import { useWebGLContext } from '@/hooks/useWebGLContext';
import { useVideoTexture } from '@/hooks/useVideoTexture';
import { useWebGLRenderer } from '@/hooks/useWebGLRenderer';
import vertexShaderSrc from '@/shaders/video.vert';
import fragmentShaderSrc from '@/shaders/video.frag';

interface WebcamCaptureProps {
  width?: number;
  height?: number;
}

export default function WebcamCapture({ 
  width = 640, 
  height = 480,
}: WebcamCaptureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Use custom webcam hook
  const { videoRef, isStreaming, error: webcamError } = useWebcam({
    width,
    height,
    facingMode: 'user'
  });

  // Use custom WebGL context hook
  const { gl, error: glError } = useWebGLContext({
    canvasRef,
    enabled: isStreaming
  });

  // Create texture from video frames
  const { texture } = useVideoTexture({
    gl,
    videoRef,
    enabled: isStreaming && !!gl
  });

  // Render texture to canvas
  const { program } = useWebGLRenderer({
    gl,
    texture,
    vertexShaderSource: vertexShaderSrc,
    fragmentShaderSource: fragmentShaderSrc,
    enabled: !!gl && !!texture
  });

  const error = webcamError || glError;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && (
        <Alert severity="error">{error}</Alert>
      )}

      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          width: width,
          height: height,
          overflow: 'hidden'
        }}
      >
        {/* Hidden video - we'll render via WebGL instead */}
        <video
          ref={videoRef}
          width={width}
          height={height}
          style={{ display: 'none' }}
          playsInline
          muted
        />

        {/* Canvas for WebGL rendering */}
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ display: 'block' }}
        />

        {!isStreaming && !error && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.200',
              gap: 2
            }}
          >
            <CircularProgress />
            <Typography color="text.secondary">
              Initializing webcam...
            </Typography>
          </Box>
        )}
      </Paper>

      {isStreaming && (
        <Alert severity="success">
          Webcam active {gl && '| WebGL ready'} {texture && '| Video texture streaming'} {program && '| Rendering'}
        </Alert>
      )}
    </Box>
  );
}