// Utility types

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
