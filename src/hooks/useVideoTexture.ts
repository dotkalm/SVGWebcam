'use client';
import { useEffect, useRef, RefObject } from 'react';

interface UseVideoTextureOptions {
  gl: WebGLRenderingContext | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  enabled: boolean;
}

export function useVideoTexture({
  gl,
  videoRef,
  enabled
}: UseVideoTextureOptions) {
    const textureRef = useRef<WebGLTexture | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        if (!gl || !videoRef.current || !enabled) return;

        const video = videoRef.current;

        // Create texture
        const texture = gl.createTexture();
        if (!texture) {
            console.error('Failed to create texture');
            return;
        }

        textureRef.current = texture;
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set texture parameters for video
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Animation loop to update texture with video frames
        const updateFrame = () => {
            if (!video || !texture || !gl) return;

            // Check if video has data
            if (video.readyState >= video.HAVE_CURRENT_DATA) {
                gl.bindTexture(gl.TEXTURE_2D, texture);

                // Upload the video frame to the texture
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,           // mip level
                    gl.RGBA,     // internal format
                    gl.RGBA,     // source format
                    gl.UNSIGNED_BYTE, // source type
                    video        // source: the video element!
                );
            }

            // Continue loop
            animationFrameRef.current = requestAnimationFrame(updateFrame);
        };

        // Start the loop
        updateFrame();

        // Cleanup
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (texture && gl) {
                gl.deleteTexture(texture);
            }
        };
    }, [gl, videoRef, enabled]);

    return {
        texture: textureRef.current
    };
}