'use client'
import {
  useRef,
  useState,
  useEffect,
} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { useMediaQuery } from '@mui/material';
import { useGetWebcam } from '@/hooks/useGetWebcam';
import { downloadSVG } from '@/utils';

export default function LinesCirclesDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 640, height: 480 });
  const [lineCount, setLineCount] = useState(0);
  const [circleCount, setCircleCount] = useState(0);
  const previousPoints = useRef<number[]>([]);
  const targetPoints = useRef<number[]>([]);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const morphAnimationRef = useRef<number | null>(null);
  const morphStartTime = useRef<number>(0);
  
  // Thresholds
  const [edgeThreshold, setEdgeThreshold] = useState(38 / 255); // Normalize to 0-1
  const [lineThreshold, setLineThreshold] = useState(20);
  const [circleThreshold, setCircleThreshold] = useState(22);
  const [minRadius, setMinRadius] = useState(30);
  const [maxRadius, setMaxRadius] = useState(120);
  const [fps, setFps] = useState(0);
  const lastFrameTime = useRef<number>(0);

  const { isStreaming } = useGetWebcam({
    facingMode: 'environment',
    height: isPortrait ? 640 : 480,
    videoRef,
    width: isPortrait ? 480 : 640,
  });

  // Update canvas dimensions when orientation changes
  useEffect(() => {
    const newDimensions = isPortrait 
      ? { width: 480, height: 640 }
      : { width: 640, height: 480 };
    setCanvasDimensions(newDimensions);
  }, [isPortrait]);

  // Initialize WebGL2 and detection pipeline
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current || !isStreaming) {
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = canvasDimensions.width;
    canvas.height = canvasDimensions.height;

    const gl = canvas.getContext('webgl2', {
      premultipliedAlpha: false,
      antialias: false
    });

    if (!gl) {
      console.error('WebGL2 not available');
      return;
    }

    glRef.current = gl;

    // Initialize shaders and detection pipeline
    const detector = new GPULineCircleDetector(gl);

    const processFrame = () => {
      if (!video.readyState || video.readyState < 2) {
        animationFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      // Slower framerate for smoother animation morphing
      const now = performance.now();
      const elapsed = now - lastFrameTime.current;
      
      // Process at 1 FPS for smooth morphing animations
      if (elapsed < 1000) { // Minimum 1000ms between frames (1 FPS)
        animationFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      lastFrameTime.current = now;

      // Run detection asynchronously to avoid blocking the animation frame
      setTimeout(() => {
        const t0 = performance.now();
        const { lines, edges, width, height } = detector.detectAll(
          video,
          edgeThreshold,
          lineThreshold,
          circleThreshold,
          minRadius,
          maxRadius
        );
        const t1 = performance.now();

        // Calculate actual FPS based on processing time
        const processingTime = t1 - t0;
        const actualFps = 1000 / Math.max(processingTime, 1000);
        setFps(actualFps);

        console.log('Processing time:', processingTime.toFixed(1), 'ms');
        console.log('Lines detected:', lines.length);
        if (lines.length > 0) {
          console.log('Top 3 lines:', lines.slice(0, 3));
        }

        // Update target points and start morphing animation
        updateMorphTarget(lines, width, height, svgContainerRef, previousPoints, targetPoints, morphAnimationRef, morphStartTime);
        setLineCount(lines.length);
        setCircleCount(0);
        
        // Update timestamp after processing completes to allow next frame
        lastFrameTime.current = performance.now();
      }, 0);

      animationFrameRef.current = requestAnimationFrame(processFrame);
    };

    processFrame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      detector.cleanup();
    };
  }, [isStreaming, canvasDimensions, edgeThreshold, lineThreshold, circleThreshold, minRadius, maxRadius]);

  const handleDownloadSVG = () => {
    const container = svgContainerRef.current;
    if (!container) return;
    const svg = container.querySelector('svg');
    if (!svg) return;
    const svgContent = new XMLSerializer().serializeToString(svg);
    downloadSVG(svgContent, `lines-circles-${Date.now()}.svg`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#000051',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h4" color="white" gutterBottom>
        📏 Lines & Circles Detector (GPU)
      </Typography>

      {/* Hidden video */}
      <Box sx={{ display: 'none' }}>
        <video
          ref={videoRef}
          width={isPortrait ? 480 : 640}
          height={isPortrait ? 640 : 480}
          playsInline
          muted
          autoPlay
        />
      </Box>

      {/* Hidden canvas for processing */}
      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
        style={{ display: 'none' }}
      />

      {/* Controls */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Detection Parameters</Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Edge Threshold: {Math.round(edgeThreshold * 255)} (0-255)
          </Typography>
          <Slider
            value={edgeThreshold * 255}
            onChange={(_, v) => setEdgeThreshold((v as number) / 255)}
            min={10}
            max={150}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Line Threshold: {lineThreshold}
          </Typography>
          <Slider
            value={lineThreshold}
            onChange={(_, v) => setLineThreshold(v as number)}
            min={20}
            max={200}
            step={5}
            valueLabelDisplay="auto"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Circle Threshold: {circleThreshold}
          </Typography>
          <Slider
            value={circleThreshold}
            onChange={(_, v) => setCircleThreshold(v as number)}
            min={10}
            max={100}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Min Radius: {minRadius}
            </Typography>
            <Slider
              value={minRadius}
              onChange={(_, v) => setMinRadius(v as number)}
              min={10}
              max={100}
              step={5}
              valueLabelDisplay="auto"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Max Radius: {maxRadius}
            </Typography>
            <Slider
              value={maxRadius}
              onChange={(_, v) => setMaxRadius(v as number)}
              min={50}
              max={200}
              step={10}
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleDownloadSVG}
            disabled={lineCount === 0}
            size="large"
          >
            Download SVG
          </Button>

          <Typography variant="body2" color="text.secondary">
            Status: {isStreaming ? '🟢 Live' : '⚪ Waiting for camera...'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Lines: {lineCount} | Circles: {circleCount} | FPS: {fps.toFixed(1)}
          </Typography>
        </Box>
      </Paper>

      {/* Live SVG Output */}
      <Paper elevation={3} sx={{ p: 2, bgcolor: '#1a1a1a' }}>
        <Typography variant="subtitle2" color="white" gutterBottom>
          Live Lines & Circles Detection
        </Typography>
        <Box
          sx={{
            bgcolor: '#fff',
            border: '2px solid #333',
            borderRadius: 1,
            minHeight: isPortrait ? 640 : 400,
            aspectRatio: isPortrait ? '480/640' : '640/480',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            mx: 'auto',
            maxWidth: '100%',
          }}
          ref={svgContainerRef}
        />
      </Paper>
    </Box>
  );
}

// ============================================================================
// SMOOTH MORPHING FUNCTIONS
// ============================================================================

function initializeSVG(
  container: HTMLDivElement,
  width: number,
  height: number
) {
  container.innerHTML = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
      <polygon id="morphPoly" fill="#ff6b6b" stroke="none" points=""/>
    </svg>
  `;
}

function updateMorphTarget(
  lines: Array<{rho: number, theta: number, votes: number}>,
  width: number,
  height: number,
  containerRef: React.RefObject<HTMLDivElement | null>,
  previousPointsRef: React.MutableRefObject<number[]>,
  targetPointsRef: React.MutableRefObject<number[]>,
  animationRef: React.MutableRefObject<number | null>,
  startTimeRef: React.MutableRefObject<number>
) {
  const container = containerRef.current;
  if (!container) return;

  // Initialize SVG if needed
  if (!container.querySelector('svg')) {
    initializeSVG(container, width, height);
  }

  const polygon = container.querySelector('#morphPoly') as SVGPolygonElement;
  if (!polygon) return;

  // Build target points array
  const newTargetPoints: number[] = [];
  lines.forEach((line) => {
    const { rho, theta } = line;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const x0 = cos * rho;
    const y0 = sin * rho;

    const x1 = x0 + 1000 * (-sin);
    const y1 = y0 + 1000 * cos;
    const x2 = x0 - 1000 * (-sin);
    const y2 = y0 - 1000 * cos;

    newTargetPoints.push(x1, y1, x2, y2);
  });

  // Initialize previous points if empty
  if (previousPointsRef.current.length === 0) {
    previousPointsRef.current = [...newTargetPoints];
    polygon.setAttribute('points', pointsArrayToString(newTargetPoints));
    return;
  }

  // Set new target and start animation
  targetPointsRef.current = newTargetPoints;
  startTimeRef.current = performance.now();

  // Cancel existing animation
  if (animationRef.current !== null) {
    cancelAnimationFrame(animationRef.current);
  }

  // Start morphing animation
  const animate = () => {
    const elapsed = performance.now() - startTimeRef.current;
    const duration = 1000; // 1 second
    const progress = Math.min(elapsed / duration, 1);

    // Linear interpolation
    const currentPoints = previousPointsRef.current.map((start, i) => {
      const end = targetPointsRef.current[i] || start;
      return start + (end - start) * progress;
    });

    polygon.setAttribute('points', pointsArrayToString(currentPoints));

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Animation complete - update previous points
      previousPointsRef.current = [...targetPointsRef.current];
      animationRef.current = null;
    }
  };

  animationRef.current = requestAnimationFrame(animate);
}

function pointsArrayToString(points: number[]): string {
  const pairs: string[] = [];
  for (let i = 0; i < points.length; i += 2) {
    pairs.push(`${points[i].toFixed(2)},${points[i + 1].toFixed(2)}`);
  }
  return pairs.join(' ');
}

// ============================================================================
// GPU LINE & CIRCLE DETECTOR CLASS
// ============================================================================

class GPULineCircleDetector {
  private gl: WebGL2RenderingContext;
  private edgeProgram: WebGLProgram | null = null;
  private lineProgram: WebGLProgram | null = null;
  private quadBuffer: WebGLBuffer | null = null;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    
    // Enable required extensions for float textures
    const extColorBufferFloat = gl.getExtension('EXT_color_buffer_float');
    if (!extColorBufferFloat) {
      console.warn('EXT_color_buffer_float not supported, line detection may fail');
    }
    
    this.initShaders();
    this.setupQuad();
  }

  private initShaders() {
    const gl = this.gl;

    // Shared vertex shader
    const vertexSource = `#version 300 es
      in vec2 a_position;
      out vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = (a_position + 1.0) * 0.5;
      }
    `;

    // Edge detection shader (Sobel)
    const edgeFragSource = `#version 300 es
      precision highp float;
      
      uniform sampler2D u_image;
      uniform vec2 u_resolution;
      uniform float u_threshold;
      
      in vec2 v_texCoord;
      out vec4 outColor;
      
      void main() {
        vec2 pixel = 1.0 / u_resolution;
        
        float tl = texture(u_image, v_texCoord + vec2(-1.0, -1.0) * pixel).r;
        float tc = texture(u_image, v_texCoord + vec2( 0.0, -1.0) * pixel).r;
        float tr = texture(u_image, v_texCoord + vec2( 1.0, -1.0) * pixel).r;
        float ml = texture(u_image, v_texCoord + vec2(-1.0,  0.0) * pixel).r;
        float mr = texture(u_image, v_texCoord + vec2( 1.0,  0.0) * pixel).r;
        float bl = texture(u_image, v_texCoord + vec2(-1.0,  1.0) * pixel).r;
        float bc = texture(u_image, v_texCoord + vec2( 0.0,  1.0) * pixel).r;
        float br = texture(u_image, v_texCoord + vec2( 1.0,  1.0) * pixel).r;
        
        float gx = -tl + tr - 2.0*ml + 2.0*mr - bl + br;
        float gy = -tl - 2.0*tc - tr + bl + 2.0*bc + br;
        
        float magnitude = sqrt(gx*gx + gy*gy);
        outColor = vec4(magnitude > u_threshold ? 1.0 : 0.0);
      }
    `;

    // Line voting shader - Hough transform
    const lineVotingSource = `#version 300 es
      precision highp float;

      uniform sampler2D u_edges;
      uniform vec2 u_imageSize;
      uniform vec2 u_accumSize;
      uniform float u_maxRho;
      uniform float u_yOffset;

      in vec2 v_texCoord;
      out vec4 outColor;

      const float PI = 3.14159265359;

      void main() {
        float thetaIdx = gl_FragCoord.x;
        float rhoIdx = gl_FragCoord.y;

        float theta = (thetaIdx / u_accumSize.x) * PI;
        float targetRho = (rhoIdx / u_accumSize.y) * (2.0 * u_maxRho) - u_maxRho;

        float cosTheta = cos(theta);
        float sinTheta = sin(theta);

        float votes = 0.0;

        float y = u_yOffset;
        if (y < u_imageSize.y) {
          for (float x = 0.0; x < u_imageSize.x; x += 2.0) {
            vec2 pixelUV = (vec2(x, y) + 0.5) / u_imageSize;
            float edge = texture(u_edges, pixelUV).r;

            if (edge > 0.5) {
              float pixelRho = x * cosTheta + y * sinTheta;
              float diff = abs(pixelRho - targetRho);

              if (diff < 2.5) {
                votes += 1.0;
              }
            }
          }
        }

        outColor = vec4(votes, votes, votes, votes);
      }
    `;

    this.edgeProgram = this.createProgram(vertexSource, edgeFragSource);
    this.lineProgram = this.createProgram(vertexSource, lineVotingSource);
  }

  private setupQuad() {
    const gl = this.gl;
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]);

    this.quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }

  detectAll(
    video: HTMLVideoElement,
    edgeThreshold: number,
    lineThreshold: number,
    circleThreshold: number,
    minRadius: number,
    maxRadius: number
  ) {
    const width = video.videoWidth;
    const height = video.videoHeight;

    // Step 1: Detect edges
    const edges = this.detectEdges(video, width, height, edgeThreshold);

    // Count edge pixels
    let edgeCount = 0;
    for (let i = 0; i < edges.length; i++) {
      if (edges[i] > 0) edgeCount++;
    }
    console.log('Edge pixels:', edgeCount, 'out of', edges.length);

    // Step 2: Detect lines using GPU Hough transform
    const lines = this.detectLines(edges, width, height, lineThreshold);

    // Step 3: Detect circles (CPU-based for now, can be GPU later)
    // const circles = this.detectCirclesCPU(edges, width, height, minRadius, maxRadius, circleThreshold);
    const circles: Array<{x: number, y: number, radius: number, votes: number}> = [];

    return { lines, circles, edges, width, height };
  }

  private detectEdges(video: HTMLVideoElement, width: number, height: number, threshold: number): Uint8Array {
    const gl = this.gl;

    // Create texture from video and convert to grayscale manually
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.drawImage(video, 0, 0, width, height);
    const imageData = tempCtx.getImageData(0, 0, width, height);
    
    // Convert to grayscale
    const gray = new Uint8Array(width * height);
    for (let i = 0; i < gray.length; i++) {
      const r = imageData.data[i * 4];
      const g = imageData.data[i * 4 + 1];
      const b = imageData.data[i * 4 + 2];
      gray[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    }

    const videoTex = this.createTexture(gray, width, height);

    const outputTex = this.createTexture(null, width, height);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, outputTex, 0);
    
    // Check framebuffer status
    const fbStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (fbStatus !== gl.FRAMEBUFFER_COMPLETE) {
      console.error('Edge detection framebuffer incomplete:', fbStatus);
    }

    gl.useProgram(this.edgeProgram);
    this.bindAttributes(this.edgeProgram!);

    gl.uniform1i(gl.getUniformLocation(this.edgeProgram!, 'u_image'), 0);
    gl.uniform2f(gl.getUniformLocation(this.edgeProgram!, 'u_resolution'), width, height);
    gl.uniform1f(gl.getUniformLocation(this.edgeProgram!, 'u_threshold'), threshold);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, videoTex);

    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    const edges = new Uint8Array(width * height);
    for (let i = 0; i < edges.length; i++) {
      edges[i] = pixels[i * 4] > 0 ? 255 : 0;
    }

    gl.deleteTexture(videoTex);
    gl.deleteTexture(outputTex);
    gl.deleteFramebuffer(fb);

    return edges;
  }

  private detectLines(edges: Uint8Array, width: number, height: number, threshold: number): Array<{rho: number, theta: number, votes: number}> {
    const gl = this.gl;

    const numThetas = 180;
    const maxRho = Math.sqrt(width * width + height * height);
    const numRhos = Math.ceil(maxRho * 2);

    // Create accumulator texture with RGBA32F (more compatible than RGBA16F)
    const accumTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, accumTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, numThetas, numRhos, 0, gl.RGBA, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, accumTex, 0);
    
    // Check framebuffer status
    const fbStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (fbStatus !== gl.FRAMEBUFFER_COMPLETE) {
      console.error('Line accumulator framebuffer incomplete:', fbStatus);
      console.error('Status code:', fbStatus);
      return [];
    }

    gl.viewport(0, 0, numThetas, numRhos);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.blendEquation(gl.FUNC_ADD);

    const edgeTex = this.createTexture(edges, width, height);

    gl.useProgram(this.lineProgram);
    this.bindAttributes(this.lineProgram!);

    gl.uniform1i(gl.getUniformLocation(this.lineProgram!, 'u_edges'), 0);
    gl.uniform2f(gl.getUniformLocation(this.lineProgram!, 'u_imageSize'), width, height);
    gl.uniform2f(gl.getUniformLocation(this.lineProgram!, 'u_accumSize'), numThetas, numRhos);
    gl.uniform1f(gl.getUniformLocation(this.lineProgram!, 'u_maxRho'), maxRho);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, edgeTex);

    // Multi-pass: process rows
    const yStep = 2;
    let drawCount = 0;
    for (let y = 0; y < height; y += yStep) {
      gl.uniform1f(gl.getUniformLocation(this.lineProgram!, 'u_yOffset'), y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      drawCount++;
    }
    console.log('Line voting drew', drawCount, 'passes');

    gl.disable(gl.BLEND);
    
    // Check for GL errors
    const error = gl.getError();
    if (error !== gl.NO_ERROR) {
      console.error('WebGL error during line detection:', error);
    }

    // Read accumulator (using FLOAT directly, no conversion needed)
    const accumData = new Float32Array(numThetas * numRhos * 4);
    gl.readPixels(0, 0, numThetas, numRhos, gl.RGBA, gl.FLOAT, accumData);

    // Debug: check accumulator values
    let maxVotes = 0;
    let totalNonZero = 0;
    for (let i = 0; i < accumData.length; i += 4) {
      const val = accumData[i];
      if (val > 0) totalNonZero++;
      if (val > maxVotes) maxVotes = val;
    }
    console.log('Line accumulator - max votes:', maxVotes, 'non-zero cells:', totalNonZero, 'threshold:', threshold);

    // Find peaks
    const lines = [];
    for (let t = 0; t < numThetas; t++) {
      for (let r = 0; r < numRhos; r++) {
        const idx = (r * numThetas + t) * 4;
        const votes = accumData[idx];

        if (votes >= threshold) {
          const theta = (t * Math.PI) / numThetas;
          const rho = r - maxRho;

          let isMax = true;
          for (let dt = -2; dt <= 2 && isMax; dt++) {
            for (let dr = -2; dr <= 2; dr++) {
              const nt = t + dt;
              const nr = r + dr;
              if (nt >= 0 && nt < numThetas && nr >= 0 && nr < numRhos) {
                const nidx = (nr * numThetas + nt) * 4;
                if (accumData[nidx] > votes) {
                  isMax = false;
                  break;
                }
              }
            }
          }

          if (isMax) {
            lines.push({ rho, theta, votes });
          }
        }
      }
    }

    gl.deleteTexture(edgeTex);
    gl.deleteTexture(accumTex);
    gl.deleteFramebuffer(fb);

    return lines.sort((a, b) => b.votes - a.votes).slice(0, 10);
  }

  private detectCirclesCPU(
    edges: Uint8Array,
    width: number,
    height: number,
    minR: number,
    maxR: number,
    threshold: number
  ): Array<{x: number, y: number, radius: number, votes: number}> {
    const circles = [];
    const radiusStep = 5;

    // Pre-compute edge pixels
    const edgePixels = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (edges[y * width + x] > 0) {
          edgePixels.push({ x, y });
        }
      }
    }

    for (let r = minR; r <= maxR; r += radiusStep) {
      const accumulator = new Uint32Array(width * height);

      for (let theta = 0; theta < 360; theta += 15) {
        const rad = (theta * Math.PI) / 180;
        const cosT = Math.cos(rad);
        const sinT = Math.sin(rad);

        for (const edge of edgePixels) {
          const cx = Math.round(edge.x - r * cosT);
          const cy = Math.round(edge.y - r * sinT);

          if (cx >= 0 && cx < width && cy >= 0 && cy < height) {
            accumulator[cy * width + cx]++;
          }
        }
      }

      // Find peaks
      for (let y = r; y < height - r; y += 5) {
        for (let x = r; x < width - r; x += 5) {
          const votes = accumulator[y * width + x];

          if (votes >= threshold) {
            let isMax = true;
            for (let dy = -10; dy <= 10 && isMax; dy += 5) {
              for (let dx = -10; dx <= 10; dx += 5) {
                const ny = y + dy;
                const nx = x + dx;
                if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                  if (accumulator[ny * width + nx] > votes) {
                    isMax = false;
                    break;
                  }
                }
              }
            }

            if (isMax) {
              circles.push({ x, y, radius: r, votes });
            }
          }
        }
      }
    }

    // NMS
    const filtered = [];
    const sorted = circles.sort((a, b) => b.votes - a.votes);

    for (const circle of sorted) {
      let keep = true;
      for (const existing of filtered) {
        const dx = circle.x - existing.x;
        const dy = circle.y - existing.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radiusDiff = Math.abs(circle.radius - existing.radius);

        if (dist < 30 && radiusDiff < 15) {
          keep = false;
          break;
        }
      }

      if (keep) {
        filtered.push(circle);
      }
    }

    return filtered.slice(0, 10);
  }

  private createTexture(data: Uint8Array | null, width: number, height: number): WebGLTexture {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, width, height, 0, gl.RED, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  private bindAttributes(program: WebGLProgram) {
    const gl = this.gl;
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
  }

  private createProgram(vertSrc: string, fragSrc: string): WebGLProgram {
    const gl = this.gl;

    const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertShader, vertSrc);
    gl.compileShader(vertShader);

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader error:', gl.getShaderInfoLog(vertShader));
    }

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragShader, fragSrc);
    gl.compileShader(fragShader);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(fragShader));
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
    }

    return program;
  }

  private halfFloatToFloat(h: number): number {
    const sign = (h & 0x8000) >> 15;
    const exponent = (h & 0x7C00) >> 10;
    const fraction = h & 0x03FF;

    if (exponent === 0) {
      return (sign ? -1 : 1) * Math.pow(2, -14) * (fraction / 1024);
    } else if (exponent === 0x1F) {
      return fraction ? NaN : ((sign ? -1 : 1) * Infinity);
    }

    return (sign ? -1 : 1) * Math.pow(2, exponent - 15) * (1 + fraction / 1024);
  }

  cleanup() {
    const gl = this.gl;
    if (this.quadBuffer) gl.deleteBuffer(this.quadBuffer);
    if (this.edgeProgram) gl.deleteProgram(this.edgeProgram);
    if (this.lineProgram) gl.deleteProgram(this.lineProgram);
  }
}

// ============================================================================
// SVG GENERATION FOR LINES AND CIRCLES
// ============================================================================

function generateShapesSVG(
  lines: Array<{rho: number, theta: number, votes: number}>,
  circles: Array<{x: number, y: number, radius: number, votes: number}>,
  width: number,
  height: number,
  previousPointsStr: string,
  currentPointsRef: React.MutableRefObject<string>
): string {
  // Build points array (20 points for 10 lines)
  const points: number[] = [];
  
  lines.forEach((line) => {
    const { rho, theta } = line;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const x0 = cos * rho;
    const y0 = sin * rho;

    const x1 = x0 + 1000 * (-sin);
    const y1 = y0 + 1000 * cos;
    const x2 = x0 - 1000 * (-sin);
    const y2 = y0 - 1000 * cos;

    points.push(x1, y1, x2, y2);
  });
  
  // Format as space-separated coordinate pairs
  const pointsStr = points.map((p, i) => 
    i % 2 === 0 ? `${p.toFixed(2)},${points[i + 1].toFixed(2)}` : ''
  ).filter(s => s).join(' ');
  
  // Update current points reference for next frame
  currentPointsRef.current = pointsStr;

  const circleElements = circles.map(circle => {
    return `    <circle cx="${circle.x}" cy="${circle.y}" r="${circle.radius}" stroke="#4ecdc4" stroke-width="3" fill="none"/>`;
  }).join('\n');
  
  // Use values with keyTimes for seamless continuous animation
  const animationElement = previousPointsStr && previousPointsStr !== pointsStr
    ? `<animate 
        attributeName="points" 
        values="${previousPointsStr}; ${pointsStr}" 
        keyTimes="0; 1"
        dur="1s" 
        calcMode="linear"
        fill="freeze"
        restart="always"/>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
  <g id="lines">
    <polygon id="morphPoly" points="${pointsStr}" fill="#ff6b6b" stroke="none">
      ${animationElement}
    </polygon>
  </g>
  <g id="circles">
${circleElements}
  </g>
</svg>`;
}
