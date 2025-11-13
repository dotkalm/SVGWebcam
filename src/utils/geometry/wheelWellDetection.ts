// src/utils/geometry/wheelWellDetection.ts

/**
 * Represents a detected horizontal line in the image
 */
export interface HorizontalLine {
  y: number;        // Y coordinate of the line
  startX: number;   // X coordinate where line starts
  endX: number;     // X coordinate where line ends
  length: number;   // Length of the line in pixels
}

/**
 * Represents a detected semi-circular concave region
 */
export interface SemiCircle {
  centerX: number;  // X coordinate of circle center
  centerY: number;  // Y coordinate of circle center
  radius: number;   // Radius in pixels
  score: number;    // Confidence score (0-1)
}

/**
 * Represents a detected wheel well (line + semi-circle intersection)
 */
export interface WheelWell {
  x: number;        // X coordinate of wheel well center
  y: number;        // Y coordinate of wheel well center
  radius: number;   // Radius of the wheel well arc
  lineY: number;    // Y coordinate of the associated horizontal line
  score: number;    // Confidence score (0-1)
}

/**
 * Result of wheel well detection
 */
export interface WheelWellResult {
  confidence: number;           // Overall confidence (0-1)
  wheelWells: WheelWell[];     // Detected wheel wells
  horizontalLines: HorizontalLine[];  // Detected horizontal lines
}

/**
 * Options for horizontal line detection
 */
export interface LineDetectionOptions {
  minLineLength?: number;       // Minimum line length in pixels (default: 100)
  searchRegionStart?: number;   // Start Y coordinate (default: height/3)
  searchRegionEnd?: number;     // End Y coordinate (default: height)
}

/**
 * Options for semi-circle detection
 */
export interface SemiCircleDetectionOptions {
  minRadius?: number;           // Minimum radius in pixels (default: 30)
  maxRadius?: number;           // Maximum radius in pixels (default: 80)
}

/**
 * Detects horizontal lines in edge-detected image
 *
 * Algorithm:
 * 1. Scan each row in the search region
 * 2. Find consecutive edge pixels (horizontal runs)
 * 3. Filter by minimum length
 * 4. Return sorted by length (confidence)
 *
 * @param edgeData - RGBA pixel data from edge detection
 * @param width - Image width
 * @param height - Image height
 * @param options - Detection options
 * @returns Array of detected horizontal lines
 */

export function detectHorizontalLines(
  edgeData: Uint8Array,
  width: number,
  height: number,
  options: LineDetectionOptions = {}
): HorizontalLine[] {
  // TODO: Implement horizontal line detection
  // For now, return empty array to make tests fail
  return [];
}

/**
 * Detects semi-circular concave regions in edge-detected image
 *
 * Algorithm:
 * 1. Scan image for potential arc patterns
 * 2. Use template matching or edge tracing
 * 3. Look for upward-facing arcs (concave)
 * 4. Filter by radius constraints
 * 5. Return sorted by confidence score
 *
 * @param edgeData - RGBA pixel data from edge detection
 * @param width - Image width
 * @param height - Image height
 * @param options - Detection options
 * @returns Array of detected semi-circles
 */
export function detectSemiCircles(
  edgeData: Uint8Array,
  width: number,
  height: number,
  options: SemiCircleDetectionOptions = {}
): SemiCircle[] {
  // TODO: Implement semi-circle detection
  // For now, return empty array to make tests fail
  return [];
}

/**
 * Detects wheel wells by finding horizontal lines with semi-circular
 * concave regions (wheel well arcs) cutting into them
 *
 * Algorithm:
 * 1. Detect horizontal lines (rocker panel/body line)
 * 2. Detect semi-circular concave regions
 * 3. Match semi-circles to lines (find intersections)
 * 4. Validate spacing between wheel wells
 * 5. Calculate confidence score
 *
 * Expected pattern:
 * ```
 *    ___________________
 *   |_______     _______|  ← Horizontal line (rocker panel)
 *          ∩   ∩            ← Semi-circles (wheel wells)
 * ```
 *
 * @param edgeData - RGBA pixel data from edge detection
 * @param width - Image width
 * @param height - Image height
 * @returns Detection result with confidence and wheel wells
 */
export function detectWheelWells(
  edgeData: Uint8Array,
  width: number,
  height: number
): WheelWellResult {
  // TODO: Implement full wheel well detection algorithm
  // For now, return stub result to make tests fail

  const lines = detectHorizontalLines(edgeData, width, height);
  const circles = detectSemiCircles(edgeData, width, height);

  // Stub: Return zero confidence and no wheel wells
  return {
    confidence: 0,
    wheelWells: [],
    horizontalLines: lines
  };
}
