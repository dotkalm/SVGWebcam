export interface ViewerConfig {
  // Blur settings
  blurMode: 'gaussian' | 'motion' | 'bokeh';
  aperture: number;
  motionBlurAmount: number;
  motionBlurAngle: number;
  
  // Edge detection
  highThreshold: number;
  lowThreshold: number;
  
  // SVG generation
  crosshatchThreshold: number;
  crosshatchSimplification: number;
  cleanEdgeMinPathLength: number;
  cleanEdgeSimplification: number;
  
  // Crosshatch styling
  crosshatchStrokeWidth: number;
  crosshatchOpacity: number;
  useCrosshatchFill: boolean;
  crosshatchFillColor: string;
  useBezierCrosshatch: boolean;
  
  // Clean edge styling
  cleanEdgesStrokeWidth: number;
  cleanEdgesOpacity: number;
  useCleanEdgesFill: boolean;
  cleanEdgesFillColor: string;
  useBezierCleanLines: boolean;
}

export interface UIState {
  showLeftPanel: boolean;
  showRightPanel: boolean;
  expandEdgeDetection: boolean;
  expandSVGGeneration: boolean;
  expandCrosshatchStyling: boolean;
  expandCleanEdgeStyling: boolean;
}

export const DEFAULT_CONFIG: ViewerConfig = {
  blurMode: 'gaussian',
  aperture: 0.15,
  motionBlurAmount: 60,
  motionBlurAngle: 0,
  highThreshold: 0.02,
  lowThreshold: 0.02,
  crosshatchThreshold: 140,
  crosshatchSimplification: 3,
  cleanEdgeMinPathLength: 5,
  cleanEdgeSimplification: 4,
  crosshatchStrokeWidth: 0.12,
  cleanEdgesStrokeWidth: 0.3,
  crosshatchOpacity: 1,
  cleanEdgesOpacity: 0.6,
  useCrosshatchFill: false,
  useCleanEdgesFill: false,
  crosshatchFillColor: '#000000',
  cleanEdgesFillColor: '#000000',
  useBezierCrosshatch: true,
  useBezierCleanLines: true,
};

export const DEFAULT_UI_STATE: UIState = {
  showLeftPanel: true,
  showRightPanel: true,
  expandEdgeDetection: true,
  expandSVGGeneration: true,
  expandCrosshatchStyling: true,
  expandCleanEdgeStyling: true,
};
