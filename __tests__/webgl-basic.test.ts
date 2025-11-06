import { createTestContext } from '../src/webgl/createContext';
import { createMockGL } from '../__mocks__/webgl';
import vertexShaderSrc from '../src/shaders/basic.vert';
import fragmentShaderSrc from '../src/shaders/basic.frag';

test('creates a WebGLRenderingContext', () => {
  const gl = createMockGL();
  expect(gl.createShader).toBeDefined();
});

describe('WebGL basic context', () => {
    it('creates a WebGLRenderingContext', () => {
        const gl = createTestContext();
        expect(gl).toBeTruthy();
        if (typeof WebGLRenderingContext !== 'undefined') {
            expect(gl instanceof WebGLRenderingContext).toBe(true);
        } else {
            // fallback for Node / Jest
            expect(typeof gl.createShader).toBe('function');
        }

    });

    it('can compile a simple shader', () => {
        const gl = createTestContext();

        const compileShader = (shaderType: number, source: string) => {
            const shader = gl.createShader(shaderType)!;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile failed');
            }
            return shader;
        };

        const vs = compileShader(gl.VERTEX_SHADER, vertexShaderSrc);
        const fs = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);
        const program = gl.createProgram()!;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        expect(gl.getProgramParameter(program, gl.LINK_STATUS)).toBe(true);
    });
});
