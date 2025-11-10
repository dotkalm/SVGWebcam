export interface Point {
  x: number;
  y: number;
}

export interface Circle {
  center: Point;
  radius: number;
  confidence: number; // 0-1, how confident we are in detection
}

export interface Ellipse {
  center: Point;
  radiusX: number;
  radiusY: number;
  rotation: number; // in radians
  confidence: number;
}

export interface Rectangle {
  topLeft: Point;
  width: number;
  height: number;
  rotation: number;
  confidence: number;
}

export type DetectedShape = Circle | Ellipse | Rectangle;

export interface TCapturedFrame {
  data: number[];  // Array instead of Uint8Array for JSON compatibility
  width: number;
  height: number;
  description: string;
}