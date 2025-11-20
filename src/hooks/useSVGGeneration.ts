import { useEffect, useRef } from 'react';
import type { UseSVGGenerationProps  } from '@/types';
import { 
  extractBlurTexture, 
  generateSVGFromFramebuffer, 
  hexToRgba, 
  readFramebufferToSVG,
} from '@/utils';

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
              useWiggle: config.backgroundWiggle,
              useDashArray: config.backgroundUseDashArray,
              dashSize: config.backgroundDashSize
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
              useWiggle: config.outlinePathsWiggle,
              useDashArray: config.outlinePathsUseDashArray,
              dashSize: config.outlinePathsDashSize
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
    blurCanvasRef,
    canvasRef,
    config,
    connectEdgesBackground,
    connectEdgesOutlinePaths,
    framebuffersRef,
    glRef,
    isStreaming,
    setSvgBackground,
    setSvgOutlinePaths,
  ]);
}
