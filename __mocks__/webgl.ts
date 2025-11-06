export function createMockGL() {
  const glMock = {
    attachShader: jest.fn(),
    compileShader: jest.fn(),
    createProgram: jest.fn(() => ({})),
    createShader: jest.fn(() => ({})),
    getExtension: jest.fn(),
    getProgramInfoLog: jest.fn(() => ''),
    getProgramParameter: jest.fn(() => true),
    getShaderInfoLog: jest.fn(() => ''),
    getShaderParameter: jest.fn(() => true),
    linkProgram: jest.fn(),
    shaderSource: jest.fn(),
    useProgram: jest.fn(),
  };
  return glMock;
}