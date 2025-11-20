export interface SVGPoint {
  x: number;
  y: number;
  intensity?: number;
}

export interface EdgePath {
  points: SVGPoint[];
  intensity: number;
  intensities?: number[];
}

export interface SVGGenerationOptions {
  threshold?: number;
  minPathLength?: number;
  simplification?: number;
  strokeWidth?: number;
  strokeColor?: string;
  opacity?: number;
  fill?: string;
  connectEdges?: boolean;
  useBezier?: boolean;
  groupId?: string;
  useWiggle?: boolean;
  useDashArray?: boolean;
  dashSize?: number;
}
