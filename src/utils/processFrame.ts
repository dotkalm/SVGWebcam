import { renderPass } from '@/utils';
import type { TProcessFrame } from '@/types';

export const processFrame: TProcessFrame = (
  gl,
  video,
  programs,
  framebuffers,
  textures,
  buffers,
  lowThreshold,
  highThreshold,
  useMotionBlur = 'gaussian',
  aperture = 0.15,
  motionBlurAmount = 60,
  motionBlurAngle = 0
) => {
  const width = video.videoWidth;
  const height = video.videoHeight;

  // Flip video horizontally to fix mirror effect from front-facing camera
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.save();
  tempCtx.translate(width, 0);
  tempCtx.scale(-1, 1);
  tempCtx.drawImage(video, 0, 0, width, height);
  tempCtx.restore();

  gl.bindTexture(gl.TEXTURE_2D, textures.input);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tempCanvas);

  // Pass 1: Blur (Gaussian, Motion, or Bokeh)
  if (useMotionBlur === 'motion') {
    // Motion blur with adjustable direction and amount
    const angleRad = (motionBlurAngle * Math.PI) / 180;
    const directionX = Math.cos(angleRad) * motionBlurAmount;
    const directionY = Math.sin(angleRad) * motionBlurAmount;
    
    renderPass(gl, programs.motionBlur, framebuffers.blur, textures.input, buffers, width, height, {
      u_resolution: [width, height],
      u_direction: [directionX, directionY]
    });
  } else if (useMotionBlur === 'bokeh') {
    // Bokeh blur with adjustable depth of field
    renderPass(gl, programs.bokehBlur, framebuffers.blur, textures.input, buffers, width, height, {
      u_resolution: [width, height],
      u_focusPoint: [0.5, 0.5], // Center focus
      u_focusRange: aperture, // Depth of field controlled by aperture
      u_maxBlur: 25.0 // Strong blur amount
    });
  } else {
    // Gaussian blur
    renderPass(gl, programs.blur, framebuffers.blur, textures.input, buffers, width, height, {
      u_resolution: [width, height]
    });
  }

  // Pass 2: Gradient
  renderPass(gl, programs.gradient, framebuffers.gradient, textures.blur, buffers, width, height, {
    u_resolution: [width, height]
  });

  // Pass 3: Non-Maximum Suppression
  renderPass(gl, programs.nonMax, framebuffers.nonMax, textures.gradient, buffers, width, height, {
    u_resolution: [width, height]
  });

  // Pass 4: Threshold (render to screen)
  renderPass(gl, programs.threshold, null, textures.nonMax, buffers, width, height, {
    u_lowThreshold: lowThreshold,
    u_highThreshold: highThreshold
  });
}
