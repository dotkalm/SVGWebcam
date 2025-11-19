import type { ViewerConfig, UIState } from '@/types';

export type { ViewerConfig, UIState };

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
  enableBackground: true,
  backgroundStrokeWidth: 0.12,
  backgroundStrokeColor: 'rgba(0, 0, 0, 1)',
  useBackgroundFill: false,
  backgroundFillColor: 'rgba(0, 0, 0, 0)',
  useBezierBackground: true,
  enableOutlinePaths: true,
  outlinePathsStrokeWidth: 0.3,
  outlinePathsStrokeColor: 'rgba(0, 0, 0, 0.6)',
  useOutlinePathsFill: false,
  outlinePathsFillColor: 'rgba(0, 0, 0, 0)',
  useBezierOutlinePaths: true,
};

export const DEFAULT_UI_STATE: UIState = {
  showLeftPanel: true,
  showRightPanel: true,
  expandEdgeDetection: true,
  expandBackgroundStyling: true,
  expandOutlinePathStyling: true,
};
