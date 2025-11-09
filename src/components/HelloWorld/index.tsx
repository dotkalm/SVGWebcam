// src/components/ShaderHelloWorld.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import vertexShaderSrc from '@/shaders/hello.vert';
import fragmentShaderSrc from '@/shaders/hello.frag';

export default function ShaderHelloWorld() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<string>('Initializing...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl2');
        if (!gl) {
            setError('WebGL not supported');
            return;
        }

        setStatus('WebGL context created');

        // Compile shader helper
        const compileShader = (type: number, source: string): WebGLShader | null => {
            const shader = gl.createShader(type);
            if (!shader) return null;

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                const info = gl.getShaderInfoLog(shader);
                setError(`Shader compile error: ${info}`);
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        };

        // Compile shaders
        const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSrc);
        const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);

        if (!vertexShader || !fragmentShader) {
            setError('Failed to compile shaders');
            return;
        }

        setStatus('Shaders compiled successfully');

        // Create program
        const program = gl.createProgram();
        if (!program) {
            setError('Failed to create program');
            return;
        }

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(program);
            setError(`Program link error: ${info}`);
            return;
        }

        setStatus('Program linked successfully');

        // Create position buffer (full screen quad)
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = new Float32Array([
            -1.0, -1.0,  // bottom left
            1.0, -1.0,  // bottom right
            -1.0, 1.0,  // top left
            1.0, 1.0,  // top right
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        // Set up rendering
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        // Set up position attribute
        const positionLocation = gl.getAttribLocation(program, 'a_position');
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Draw!
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        setStatus('✨ Rendering complete! If you see hot pink, shaders are working!');

        // Cleanup
        return () => {
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(positionBuffer);
        };
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" component="h2">
                Shader Hello World - Hot Pink Test
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {!error && <Alert severity="success">{status}</Alert>}

            <Paper elevation={3} color="dodgerblue"
            >
                <canvas
                    ref={canvasRef}
                    width={640}
                    height={480}
                    style={{
                        display: 'block',
                        width: '100%',      // Match internal width
                        height: '100%'      // Match internal height
                    }}
                />
            </Paper>

            <Typography variant="body2" color="white">
                Expected: A solid hot pink (magenta) canvas. This proves your shader files are loaded and WebGL is working!
            </Typography>
        </Box>
    );
}