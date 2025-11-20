import type { ViewerConfig, TWebGLFramebuffers } from '@/types';

export interface UseSVGGenerationProps {
  blurCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  config: ViewerConfig;
  connectEdgesBackground: boolean;
  connectEdgesOutlinePaths: boolean;
  framebuffersRef: React.RefObject<TWebGLFramebuffers> | undefined;
  glRef: React.RefObject<WebGLRenderingContext | null>;
  isStreaming: boolean;
  setSvgBackground: (svg: string) => void;
  setSvgOutlinePaths: (svg: string) => void;
}