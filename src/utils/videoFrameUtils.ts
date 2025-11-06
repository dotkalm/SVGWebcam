export interface VideoFrameData {
    data: Uint8Array;
    width: number;
    height: number;
    timestamp: number;
}

export function createVideoTexture(
    gl: WebGLRenderingContext,
    frame: VideoFrameData
): WebGLTexture | null {
    const texture = gl.createTexture();
    if (!texture) return null;

    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // Upload frame data
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        frame.width,
        frame.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        frame.data
    );

    // Set texture parameters for video
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return texture;
}

export function updateVideoTexture(
    gl: WebGLRenderingContext,
    texture: WebGLTexture,
    frame: VideoFrameData
): void {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texSubImage2D(
        gl.TEXTURE_2D,
        0,
        0,
        0,
        frame.width,
        frame.height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        frame.data
    );
}