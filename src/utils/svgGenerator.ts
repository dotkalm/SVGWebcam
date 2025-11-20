export const generateSVGFromFramebuffer = (
  gl: WebGLRenderingContext,
  framebuffer: WebGLFramebuffer | null,
  canvasWidth: number,
  canvasHeight: number,
  readFramebufferToSVG: Function,
  options: any
): string => {
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  return readFramebufferToSVG(gl, canvasWidth, canvasHeight, options);
};

export const extractBlurTexture = (
  gl: WebGLRenderingContext,
  blurCtx: CanvasRenderingContext2D,
  framebuffer: WebGLFramebuffer,
  canvasWidth: number,
  canvasHeight: number
): void => {
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  const pixels = new Uint8Array(canvasWidth * canvasHeight * 4);
  gl.readPixels(0, 0, canvasWidth, canvasHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  // Flip vertically (WebGL origin is bottom-left, Canvas 2D is top-left)
  const flippedPixels = new Uint8ClampedArray(canvasWidth * canvasHeight * 4);
  for (let y = 0; y < canvasHeight; y++) {
    const sourceRow = (canvasHeight - 1 - y) * canvasWidth * 4;
    const destRow = y * canvasWidth * 4;
    for (let x = 0; x < canvasWidth * 4; x++) {
      flippedPixels[destRow + x] = pixels[sourceRow + x];
    }
  }

  const imageData = new ImageData(flippedPixels, canvasWidth, canvasHeight);
  blurCtx.putImageData(imageData, 0, 0);
};

export const createSVGString = (
  width: number,
  height: number,
  svgBackground: string,
  svgOutlinePaths: string,
  layerOrder: ('background' | 'outlinePaths')[] = ['background', 'outlinePaths']
): string => {
  const layers: Record<string, string> = {
    background: svgBackground,
    outlinePaths: svgOutlinePaths,
  };
  
  const orderedLayers = layerOrder.map(layerKey => layers[layerKey]).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
${orderedLayers}
</svg>`;
};
