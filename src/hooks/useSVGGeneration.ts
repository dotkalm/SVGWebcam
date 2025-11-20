import { useEffect, useRef } from 'react';
import type { ViewerConfig } from '@/components/WebcamSVGViewer/config';
import type { TWebGLFramebuffers } from '@/types/webgl';
import { readFramebufferToSVG } from '@/utils';
import { extractBlurTexture, generateSVGFromFramebuffer } from '@/components/WebcamSVGViewer/svgGenerator';

// Helper function to convert hex color and opacity to rgba
function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

interface UseSVGGenerationProps {
  isStreaming: boolean;
  glRef: React.MutableRefObject<WebGLRenderingContext | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  blurCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  framebuffersRef: React.RefObject<TWebGLFramebuffers> | undefined;
  config: ViewerConfig;
  connectEdgesBackground: boolean;
  connectEdgesOutlinePaths: boolean;
  setSvgBackground: (svg: string) => void;
  setSvgOutlinePaths: (svg: string) => void;
}

export function useSVGGeneration({
  isStreaming,
  glRef,
  canvasRef,
  blurCanvasRef,
  framebuffersRef,
  config,
  connectEdgesBackground,
  connectEdgesOutlinePaths,
  setSvgBackground,
  setSvgOutlinePaths,
}: UseSVGGenerationProps) {
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isStreaming || !glRef.current || !canvasRef.current) {
      return;
    }

    const updateSVG = () => {
      try {
        const { width: canvasWidth, height: canvasHeight } = canvasRef.current!;

        // Extract Gaussian blurred texture from WebGL framebuffer
        if (blurCanvasRef.current && glRef.current && framebuffersRef?.current?.blur) {
          const gl = glRef.current;
          const blurCtx = blurCanvasRef.current.getContext('2d')!;
          extractBlurTexture(gl, blurCtx, framebuffersRef.current.blur, canvasWidth, canvasHeight);
        }

        // Generate background SVG from blur framebuffer
        if (config.enableBackground && glRef.current && framebuffersRef?.current?.blur) {
          const svgCross = generateSVGFromFramebuffer(
            glRef.current,
            framebuffersRef.current.blur,
            canvasWidth,
            canvasHeight,
            readFramebufferToSVG,
            {
              threshold: config.backgroundThreshold,
              minPathLength: 3,
              simplification: config.backgroundSimplification,
              strokeWidth: config.backgroundStrokeWidth,
              strokeColor: hexToRgba(config.backgroundStrokeColor, config.backgroundStrokeOpacity),
              opacity: 1,
              fill: config.useBackgroundFill ? hexToRgba(config.backgroundFillColor, config.backgroundFillOpacity) : 'none',
              connectEdges: connectEdgesBackground,
              useBezier: config.useBezierBackground,
              groupId: 'background',
              useWiggle: config.backgroundWiggle
            }
          );
          setSvgBackground(svgCross);
        } else if (!config.enableBackground) {
          setSvgBackground('');
        }

        // Generate outline paths SVG from canvas
        if (config.enableOutlinePaths && glRef.current) {
          const svgClean = generateSVGFromFramebuffer(
            glRef.current,
            null,
            canvasWidth,
            canvasHeight,
            readFramebufferToSVG,
            {
              threshold: 10,
              minPathLength: config.outlinePathMinPathLength,
              simplification: config.outlinePathSimplification,
              strokeWidth: config.outlinePathsStrokeWidth,
              strokeColor: hexToRgba(config.outlinePathsStrokeColor, config.outlinePathsStrokeOpacity),
              opacity: 1,
              fill: config.useOutlinePathsFill ? hexToRgba(config.outlinePathsFillColor, config.outlinePathsFillOpacity) : 'none',
              connectEdges: connectEdgesOutlinePaths,
              useBezier: config.useBezierOutlinePaths,
              groupId: 'outlinePaths',
              useWiggle: config.outlinePathsWiggle
            }
          );
          setSvgOutlinePaths(svgClean);
        } else if (!config.enableOutlinePaths) {
          setSvgOutlinePaths('');
        }
      } catch (error) {
        console.error('Error generating SVG:', error);
      }

      animationFrameRef.current = requestAnimationFrame(updateSVG);
    };

    updateSVG();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    isStreaming,
    glRef,
    canvasRef,
    blurCanvasRef,
    framebuffersRef,
    config,
    connectEdgesBackground,
    connectEdgesOutlinePaths,
    setSvgBackground,
    setSvgOutlinePaths,
  ]);
}
