// Hook option types

export interface WindowSize {
  width: number;
  height: number;
}

export interface UseWebcamOptions {
  width?: number;
  height?: number;
  facingMode?: 'user' | 'environment';
}

export interface UseWebGLContextOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  enabled: boolean;
}

export interface UseWebGLRendererOptions {
  gl: WebGLRenderingContext | WebGL2RenderingContext | null;
  texture: WebGLTexture | null;
  vertexShaderSource: string;
  fragmentShaderSource: string;
  enabled: boolean;
}
