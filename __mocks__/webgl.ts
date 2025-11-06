// __mocks__/webgl.ts

interface MockTextureData {
  width?: number;
  height?: number;
  format?: number;
  type?: number;
  data?: ArrayBufferView | null;
  updated?: boolean;
  [key: string]: number | ArrayBufferView | null | boolean | undefined;
}

interface MockFramebufferData {
  attachment?: WebGLTexture;
  [key: string]: WebGLTexture | undefined;
}

export function createMockGL(): Partial<WebGLRenderingContext> {
  // Internal state for tracking textures and framebuffers
  const textures = new Map<WebGLTexture, MockTextureData>();
  const framebuffers = new Map<WebGLFramebuffer, MockFramebufferData>();
  let textureIdCounter = 1;
  let framebufferIdCounter = 1;
  let boundTexture: WebGLTexture | null = null;
  let boundFramebuffer: WebGLFramebuffer | null = null;

  const glMock = {
    // WebGL Constants
    VERTEX_SHADER: 35633,
    FRAGMENT_SHADER: 35632,
    COMPILE_STATUS: 35713,
    LINK_STATUS: 35714,
    NO_ERROR: 0,
    TEXTURE_2D: 3553,
    RGBA: 6408,
    UNSIGNED_BYTE: 5121,
    TEXTURE_WRAP_S: 10242,
    TEXTURE_WRAP_T: 10243,
    TEXTURE_MIN_FILTER: 10241,
    TEXTURE_MAG_FILTER: 10240,
    CLAMP_TO_EDGE: 33071,
    LINEAR: 9729,
    NEAREST: 9728,
    FRAMEBUFFER: 36160,
    COLOR_ATTACHMENT0: 36064,
    FRAMEBUFFER_COMPLETE: 36053,

    // Existing shader methods
    attachShader: jest.fn(),
    compileShader: jest.fn(),
    createProgram: jest.fn(() => ({ id: Math.random() } as WebGLProgram)),
    createShader: jest.fn(() => ({ id: Math.random() } as WebGLShader)),
    getExtension: jest.fn(),
    getProgramInfoLog: jest.fn(() => ''),
    getProgramParameter: jest.fn(() => true),
    getShaderInfoLog: jest.fn(() => ''),
    getShaderParameter: jest.fn(() => true),
    linkProgram: jest.fn(),
    shaderSource: jest.fn(),
    useProgram: jest.fn(),

    // Texture methods
    createTexture: jest.fn(() => {
      const texture = { id: textureIdCounter++ } as WebGLTexture;
      textures.set(texture, {});
      return texture;
    }),

    deleteTexture: jest.fn((texture: WebGLTexture | null) => {
      if (texture) {
        textures.delete(texture);
      }
    }),

    bindTexture: jest.fn((target: number, texture: WebGLTexture | null) => {
      boundTexture = texture;
    }),

    texImage2D: jest.fn((
      target: number,
      level: number,
      internalformat: number,
      width: number,
      height: number,
      border: number,
      format: number,
      type: number,
      pixels: ArrayBufferView | null
    ) => {
      if (boundTexture) {
        const textureData = textures.get(boundTexture) || {};
        textures.set(boundTexture, {
          ...textureData,
          width,
          height,
          format,
          type,
          data: pixels
        });
      }
    }),

    texSubImage2D: jest.fn((
      target: number,
      level: number,
      xoffset: number,
      yoffset: number,
      width: number,
      height: number,
      format: number,
      type: number,
      pixels: ArrayBufferView | null
    ) => {
      if (boundTexture) {
        const textureData = textures.get(boundTexture) || {};
        textures.set(boundTexture, {
          ...textureData,
          width,
          height,
          format,
          type,
          data: pixels,
          updated: true
        });
      }
    }),

    texParameteri: jest.fn((target: number, pname: number, param: number) => {
      if (boundTexture) {
        const textureData = textures.get(boundTexture) || {};
        textures.set(boundTexture, {
          ...textureData,
          [`param_${pname}`]: param
        });
      }
    }),

    // Framebuffer methods
    createFramebuffer: jest.fn(() => {
      const framebuffer = { id: framebufferIdCounter++ } as WebGLFramebuffer;
      framebuffers.set(framebuffer, {});
      return framebuffer;
    }),

    deleteFramebuffer: jest.fn((framebuffer: WebGLFramebuffer | null) => {
      if (framebuffer) {
        framebuffers.delete(framebuffer);
      }
    }),

    bindFramebuffer: jest.fn((target: number, framebuffer: WebGLFramebuffer | null) => {
      boundFramebuffer = framebuffer;
    }),

    framebufferTexture2D: jest.fn((
      target: number,
      attachment: number,
      textarget: number,
      texture: WebGLTexture | null,
      level: number
    ) => {
      if (boundFramebuffer && texture) {
        const fbData = framebuffers.get(boundFramebuffer) || {};
        framebuffers.set(boundFramebuffer, {
          ...fbData,
          attachment: texture
        });
      }
    }),

    checkFramebufferStatus: jest.fn(() => 36053),

    readPixels: jest.fn((
      x: number,
      y: number,
      width: number,
      height: number,
      format: number,
      type: number,
      pixels: ArrayBufferView | null
    ) => {
      if (pixels && pixels instanceof Uint8Array) {
        pixels.fill(0);
      }
    }),

    // Buffer methods
    createBuffer: jest.fn(() => ({ id: Math.random() } as WebGLBuffer)),
    bindBuffer: jest.fn(),
    bufferData: jest.fn(),

    // Drawing and state
    viewport: jest.fn(),
    clear: jest.fn(),
    clearColor: jest.fn(),
    drawArrays: jest.fn(),
    drawElements: jest.fn(),

    // Error handling
    getError: jest.fn(() => 0),

    // Attribute and uniform methods
    getAttribLocation: jest.fn(() => 0),
    getUniformLocation: jest.fn(() => ({ id: Math.random() } as WebGLUniformLocation)),
    enableVertexAttribArray: jest.fn(),
    vertexAttribPointer: jest.fn(),
    uniform1f: jest.fn(),
    uniform1i: jest.fn(),
    uniform2f: jest.fn(),
    uniform3f: jest.fn(),
    uniform4f: jest.fn(),
    uniformMatrix4fv: jest.fn(),
  };

  return glMock as unknown as Partial<WebGLRenderingContext>;
}