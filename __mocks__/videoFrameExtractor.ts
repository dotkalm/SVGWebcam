// __mocks__/videoFrameExtractor.ts
import { VideoFrame } from '../src/utils/videoFrameExtractor';

export class MockVideoFrameExtractor {
    private width = 640;
    private height = 480;

    async load(_videoUrl: string): Promise<void> {
        return Promise.resolve();
    }

    extractFrame(timestamp: number = 0): VideoFrame {
        const size = this.width * this.height * 4;
        const data = new Uint8Array(size);
        
        // Generate test pattern based on timestamp
        const color = Math.floor((timestamp * 255) % 255);
        for (let i = 0; i < data.length; i += 4) {
            data[i] = color;     // R
            data[i + 1] = 255 - color; // G
            data[i + 2] = 128;   // B
            data[i + 3] = 255;   // A
        }

        return { data, width: this.width, height: this.height, timestamp };
    }
}