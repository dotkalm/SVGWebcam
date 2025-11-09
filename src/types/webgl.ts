export interface CannyEdgeDetectorProps {
  lowThreshold?: number;
  highThreshold?: number;
}

export interface WebGLPrograms {
  blur?: WebGLProgram | null;
  gradient?: WebGLProgram | null;
  nonMax?: WebGLProgram | null;
  threshold?: WebGLProgram | null;
}

export interface WebGLFramebuffers {
  blur?: WebGLFramebuffer | null;
  gradient?: WebGLFramebuffer | null;
  nonMax?: WebGLFramebuffer | null;
}

export interface WebGLTextures {
  input: WebGLTexture | null;
  blur?: WebGLTexture | null;
  gradient?: WebGLTexture | null;
  direction?: WebGLTexture | null;
  nonMax?: WebGLTexture | null;
}

export interface WebGLBuffers {
  position: WebGLBuffer | null;
  texCoord: WebGLBuffer | null;
}

export type UniformValue = number | [number, number];