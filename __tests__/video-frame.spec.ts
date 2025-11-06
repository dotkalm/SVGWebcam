// __tests__/video-frame.spec.ts
import { createTestContext } from '../src/webgl/createContext';
import { createMockGL } from '../__mocks__/webgl';

// Mock video frame data structure
interface MockVideoFrame {
    data: Uint8Array;
    width: number;
    height: number;
    timestamp: number;
}

// Helper to generate test frame data
function createMockFrame(width: number, height: number, pattern: 'solid' | 'gradient' | 'checkerboard' = 'solid'): MockVideoFrame {
    const data = new Uint8Array(width * height * 4);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            
            switch (pattern) {
                case 'gradient':
                    data[i] = (x / width) * 255;     // R
                    data[i + 1] = (y / height) * 255; // G
                    data[i + 2] = 128;                 // B
                    data[i + 3] = 255;                 // A
                    break;
                case 'checkerboard':
                    const isWhite = (Math.floor(x / 8) + Math.floor(y / 8)) % 2;
                    const val = isWhite ? 255 : 0;
                    data[i] = val;
                    data[i + 1] = val;
                    data[i + 2] = val;
                    data[i + 3] = 255;
                    break;
                case 'solid':
                default:
                    data[i] = 255;     // R
                    data[i + 1] = 0;   // G
                    data[i + 2] = 0;   // B
                    data[i + 3] = 255; // A
                    break;
            }
        }
    }
    
    return { data, width, height, timestamp: Date.now() / 1000 };
}

describe('WebGL video frame handling', () => {
    let gl: WebGLRenderingContext;

    beforeEach(() => {
        gl = createTestContext();
    });

    it('creates a texture from video frame data', () => {
        const frame = createMockFrame(640, 480, 'solid');
        
        const texture = gl.createTexture();
        expect(texture).toBeTruthy();
        
        gl.bindTexture(gl.TEXTURE_2D, texture);
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

        expect(gl.getError()).toBe(gl.NO_ERROR);
    });

    it('sets appropriate texture parameters for video frames', () => {
        const frame = createMockFrame(640, 480);
        const texture = gl.createTexture();
        
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA,
            frame.width, frame.height, 0,
            gl.RGBA, gl.UNSIGNED_BYTE, frame.data
        );
        
        // Video frames typically need these settings
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        expect(gl.getError()).toBe(gl.NO_ERROR);
    });

    it('updates texture with sequential video frames', () => {
        const width = 320;
        const height = 240;
        
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        // Simulate 3 frames at different timestamps
        const frames = [
            createMockFrame(width, height, 'solid'),
            createMockFrame(width, height, 'gradient'),
            createMockFrame(width, height, 'checkerboard')
        ];
        
        // First frame - initialize texture
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
            gl.RGBA, gl.UNSIGNED_BYTE, frames[0].data
        );
        expect(gl.getError()).toBe(gl.NO_ERROR);

        // Subsequent frames - update texture
        frames.slice(1).forEach(frame => {
            gl.texSubImage2D(
                gl.TEXTURE_2D, 0, 0, 0, width, height,
                gl.RGBA, gl.UNSIGNED_BYTE, frame.data
            );
            expect(gl.getError()).toBe(gl.NO_ERROR);
        });
    });

    it('handles different video frame sizes', () => {
        const sizes = [
            { width: 640, height: 480 },   // VGA
            { width: 1280, height: 720 },  // 720p
            { width: 1920, height: 1080 }, // 1080p
        ];

        sizes.forEach(({ width, height }) => {
            const frame = createMockFrame(width, height);
            const texture = gl.createTexture();
            
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(
                gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
                gl.RGBA, gl.UNSIGNED_BYTE, frame.data
            );

            expect(gl.getError()).toBe(gl.NO_ERROR);
            expect(frame.data.length).toBe(width * height * 4);
        });
    });
});

describe('WebGL frame buffer for edge detection', () => {
    let gl: WebGLRenderingContext;

    beforeEach(() => {
        gl = createTestContext();
    });

    it('creates a framebuffer for processing', () => {
        const framebuffer = gl.createFramebuffer();
        expect(framebuffer).toBeTruthy();
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        expect(gl.getError()).toBe(gl.NO_ERROR);
    });

    it('attaches texture to framebuffer for edge detection output', () => {
        const width = 640;
        const height = 480;
        
        // Create output texture for edge detection results
        const outputTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, outputTexture);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
            gl.RGBA, gl.UNSIGNED_BYTE, null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Create and attach to framebuffer
        const framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            outputTexture,
            0
        );

        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        expect(status).toBe(gl.FRAMEBUFFER_COMPLETE);
    });

    it('reads processed frame data from framebuffer', () => {
        const width = 64;
        const height = 64;
        
        const framebuffer = gl.createFramebuffer();
        const texture = gl.createTexture();
        
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
            gl.RGBA, gl.UNSIGNED_BYTE, null
        );
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D, texture, 0
        );

        // Read pixels (simulates reading edge detection results)
        const pixels = new Uint8Array(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        
        expect(pixels).toBeInstanceOf(Uint8Array);
        expect(pixels.length).toBe(width * height * 4);
        expect(gl.getError()).toBe(gl.NO_ERROR);
    });
});