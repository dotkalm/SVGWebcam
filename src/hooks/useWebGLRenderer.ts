'use client';
import { useEffect, useRef } from 'react';

interface UseWebGLRendererOptions {
  gl: WebGLRenderingContext | WebGL2RenderingContext | null;
  texture: WebGLTexture | null;
  vertexShaderSource: string;
  fragmentShaderSource: string;
  enabled: boolean;
}

export function useWebGLRenderer({
  gl,
  texture,
  vertexShaderSource,
  fragmentShaderSource,
  enabled
}: UseWebGLRendererOptions) {
  const programRef = useRef<WebGLProgram | null>(null);
  const positionBufferRef = useRef<WebGLBuffer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!gl || !enabled) return;

    // Compile shader helper
    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    // Compile shaders
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      console.error('Failed to compile shaders');
      return;
    }

    // Create program
    const program = gl.createProgram();
    if (!program) {
      console.error('Failed to create program');
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;

    // Create position buffer (full screen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,  // bottom left
       1.0, -1.0,  // bottom right
      -1.0,  1.0,  // top left
       1.0,  1.0,  // top right
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    positionBufferRef.current = positionBuffer;

    // Render loop
    const render = () => {
      if (!programRef.current || !positionBufferRef.current || !gl) return;

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(programRef.current);

      // Bind texture if available
      if (texture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        // Set texture uniform
        const textureLocation = gl.getUniformLocation(programRef.current, 'u_texture');
        gl.uniform1i(textureLocation, 0); // Use texture unit 0
      }

      // Set up position attribute
      const positionLocation = gl.getAttribLocation(programRef.current, 'a_position');
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferRef.current);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // Continue loop
      animationFrameRef.current = requestAnimationFrame(render);
    };

    // Start rendering
    render();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (program) {
        gl.deleteProgram(program);
      }
      if (positionBuffer) {
        gl.deleteBuffer(positionBuffer);
      }
      if (vertexShader) {
        gl.deleteShader(vertexShader);
      }
      if (fragmentShader) {
        gl.deleteShader(fragmentShader);
      }
    };
  }, [gl, texture, vertexShaderSource, fragmentShaderSource, enabled]);

  return {
    program: programRef.current
  };
}