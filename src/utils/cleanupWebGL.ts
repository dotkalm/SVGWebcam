import type {
    WebGLPrograms,
    WebGLFramebuffers,
    WebGLTextures,
} from '@/types';

export function cleanupWebGL(
  gl: WebGLRenderingContext,
  programs: WebGLPrograms,
  framebuffers: WebGLFramebuffers,
  textures: WebGLTextures
) {
  // Clean up programs
  Object.values(programs).forEach(program => {
    if (program) gl.deleteProgram(program);
  });

  // Clean up framebuffers
  Object.values(framebuffers).forEach(fb => {
    if (fb) gl.deleteFramebuffer(fb);
  });

  // Clean up textures
  Object.values(textures).forEach(texture => {
    if (texture) gl.deleteTexture(texture);
  });
}
