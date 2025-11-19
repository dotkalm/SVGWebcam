// src/utils/captureFrameFixture.ts
import type { TCapturedFrame, TEdgeFrame } from '@/types';

/**
 * Loads a captured frame fixture from JSON format
 *
 * Converts the JSON array data back to Uint8Array for processing
 *
 * @param json - Captured frame in JSON format
 * @returns Frame ready for edge detection processing
 */
export function loadFrameFixture(json: TCapturedFrame): TEdgeFrame {
  return {
    data: new Uint8Array(json.data),
    width: json.width,
    height: json.height,
    description: json.description
  };
}
