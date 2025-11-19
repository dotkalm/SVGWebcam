import type { EdgePath } from '@/types/svg';
import { calculateDashOffset } from './calculateDashOffset';

/**
 * Apply scaling and translation transformation to a 2D point
 * Uses a 2x3 affine transformation matrix:
 * [x'] = [sx  0  tx] [x]
 * [y']   [0  sy ty] [y]
 *                   [1]
 */
function transformPoint(
  x: number,
  y: number,
  scaleX: number,
  scaleY: number,
  translateX: number,
  translateY: number
): { x: number; y: number } {
  return {
    x: x * scaleX + translateX,
    y: y * scaleY + translateY
  };
}

/**
 * Generate SVG string from edge paths
 */
export function generateSVG(
  paths: EdgePath[],
  width: number,
  height: number,
  strokeWidth: number,
  strokeColor: string,
  time?: number,
  globalOpacity?: number,
  fill: string = 'none',
  connectEdges: boolean = false
): string {
  // Calculate oscillating dash offset based on time
  const dashOffset = time !== undefined
    ? calculateDashOffset(time)
    : 0;

  const { innerWidth, innerHeight } = window;

  // Calculate aspect ratios
  const sourceAspectRatio = width / height;
  const targetAspectRatio = innerWidth / innerHeight;

  let scaleX: number;
  let scaleY: number;
  let translateX: number;
  let translateY: number;

  // Preserve aspect ratio by using uniform scaling
  if (targetAspectRatio > sourceAspectRatio) {
    // Window is wider than video - fit to height
    scaleY = innerHeight / height;
    scaleX = scaleY;

    // Center horizontally
    const scaledWidth = width * scaleX;
    translateX = (innerWidth - scaledWidth) / 2;
    translateY = 0;
  } else {
    // Window is taller than video - fit to width
    scaleX = innerWidth / width;
    scaleY = scaleX;

    // Center vertically
    const scaledHeight = height * scaleY;
    translateX = 0;
    translateY = (innerHeight - scaledHeight) / 2;
  }

  // Scale stroke width proportionally
  const scaledStrokeWidth = strokeWidth * scaleX * 2;

  let pathElements: string;

  if (connectEdges && paths.length > 0) {
    // Connect paths, but only if distance is less than 1/4 of viewport
    const maxDistance = Math.max(innerWidth, innerHeight) / 4;
    const allPoints: string[] = [];
    let lastPoint: { x: number; y: number } | null = null;

    paths.forEach((path, pathIndex) => {
      if (path.points.length < 2) return;

      path.points.forEach((p, i) => {
        // Flip Y coordinate (WebGL origin is bottom-left, SVG is top-left)
        const flippedY = height - p.y;

        // Apply scaling and translation transformation
        const transformed = transformPoint(p.x, flippedY, scaleX, scaleY, translateX, translateY);

        if (i === 0) {
          // First point of a new path
          if (lastPoint === null) {
            // Very first point overall
            allPoints.push(`M ${transformed.x.toFixed(2)} ${transformed.y.toFixed(2)}`);
          } else {
            // Calculate distance from last point
            const dx = transformed.x - lastPoint.x;
            const dy = transformed.y - lastPoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= maxDistance) {
              // Close enough - draw line to connect
              allPoints.push(`L ${transformed.x.toFixed(2)} ${transformed.y.toFixed(2)}`);
            } else {
              // Too far - start new disconnected segment
              allPoints.push(`M ${transformed.x.toFixed(2)} ${transformed.y.toFixed(2)}`);
            }
          }
        } else {
          // Subsequent points within the same path - always connect
          allPoints.push(`L ${transformed.x.toFixed(2)} ${transformed.y.toFixed(2)}`);
        }

        lastPoint = transformed;
      });
    });

    const d = allPoints.join(' ');
    const opacity = globalOpacity !== undefined ? globalOpacity : 1;

    pathElements = `    <path
      d="${d}"
      stroke="${strokeColor}"
      stroke-width="${scaledStrokeWidth.toFixed(2)}"
      fill="${fill}"
      opacity="${opacity.toFixed(2)}"
      stroke-linecap="round"
      stroke-linejoin="round"
    />`;
  } else {
    // Keep paths separate
    pathElements = paths
      .map(path => {
        if (path.points.length < 2) return '';

        // Transform each point from video space to window space
        const d = path.points
          .map((p, i) => {
            // Flip Y coordinate (WebGL origin is bottom-left, SVG is top-left)
            const flippedY = height - p.y;

            // Apply scaling and translation transformation
            const transformed = transformPoint(p.x, flippedY, scaleX, scaleY, translateX, translateY);

            return `${i === 0 ? 'M' : 'L'} ${transformed.x.toFixed(2)} ${transformed.y.toFixed(2)}`;
          })
          .join(' ');

        // Calculate path opacity, applying global opacity if provided
        const pathOpacity = Math.max(0.3, path.intensity); // Minimum 30% opacity
        const opacity = globalOpacity !== undefined ? globalOpacity : pathOpacity;

        // Create dash array from actual pixel intensity values
        // Sample every few points to avoid too many values
        const intensities = path.intensities || [];
        const sampleRate = Math.max(1, Math.floor(intensities.length / 20));
        const dashArray = intensities.length > 0
          ? intensities
            .filter((_, i) => i % sampleRate === 0)
            .map(intensity => {
              // Map intensity (0-255) to dash length (1-30)
              return Math.max(1, Math.floor(intensity / 255 * 30));
            })
            .join(' ')
          : '5 5'; // Fallback dash pattern

        return `    <path
          d="${d}"
          stroke="${strokeColor}"
          stroke-width="${scaledStrokeWidth.toFixed(2)}"
          fill="${fill}"
          opacity="${opacity.toFixed(2)}"
          stroke-linecap="round"
          stroke-linejoin="round"
        />`;
      })
      .filter(p => p.length > 0)
      .join('\n');
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${innerWidth}" height="${innerHeight}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${innerWidth} ${innerHeight}">
  <g id="edges">
${pathElements}
  </g>
</svg>`;
}

        // stroke-dasharray="${dashArray}" 
        // stroke-dashoffset="${dashOffset.toFixed(2)}"