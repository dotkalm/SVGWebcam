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
  backgroundThreshold: number;
  backgroundSimplification: number;
  outlinePathMinPathLength: number;
  outlinePathSimplification: number;
  
  // Background styling
  backgroundStrokeWidth: number;
  backgroundOpacity: number;
  useBackgroundFill: boolean;
  backgroundFillColor: string;
  useBezierBackground: boolean;
  
  // Outline path styling
  outlinePathsStrokeWidth: number;
  outlinePathsOpacity: number;
  useOutlinePathsFill: boolean;
  outlinePathsFillColor: string;
  useBezierOutlinePaths: boolean;
}

export interface UIState {
  showLeftPanel: boolean;
  showRightPanel: boolean;
  expandEdgeDetection: boolean;
  expandBackgroundStyling: boolean;
  expandOutlinePathStyling: boolean;
}

export const DEFAULT_CONFIG: ViewerConfig = {
  blurMode: 'gaussian',
  aperture: 0.15,
  motionBlurAmount: 60,
  motionBlurAngle: 0,
  highThreshold: 0.02,
  lowThreshold: 0.02,
  backgroundThreshold: 140,
  backgroundSimplification: 3,
  outlinePathMinPathLength: 5,
  outlinePathSimplification: 4,
  backgroundStrokeWidth: 0.12,
  outlinePathsStrokeWidth: 0.3,
  backgroundOpacity: 1,
  outlinePathsOpacity: 0.6,
  useBackgroundFill: false,
  useOutlinePathsFill: false,
  backgroundFillColor: '#000000',
  outlinePathsFillColor: '#000000',
  useBezierBackground: true,
  useBezierOutlinePaths: true,
};

export const DEFAULT_UI_STATE: UIState = {
  showLeftPanel: true,
  showRightPanel: true,
  expandEdgeDetection: true,
  expandBackgroundStyling: true,
  expandOutlinePathStyling: true,
};
