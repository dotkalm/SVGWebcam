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
  backgroundStrokeColor: '#000000',
  backgroundStrokeOpacity: 1,
  useBackgroundFill: false,
  backgroundFillColor: '#000000',
  backgroundFillOpacity: 0,
  useBezierBackground: true,
  backgroundWiggle: false,
  enableOutlinePaths: true,
  outlinePathsStrokeWidth: 0.3,
  outlinePathsStrokeColor: '#000000',
  outlinePathsStrokeOpacity: 0.6,
  useOutlinePathsFill: false,
  outlinePathsFillColor: '#000000',
  outlinePathsFillOpacity: 0,
  useBezierOutlinePaths: true,
  outlinePathsWiggle: false,
};

export const DEFAULT_UI_STATE: UIState = {
  showLeftPanel: true,
  showRightPanel: true,
  expandEdgeDetection: true,
  expandBackgroundStyling: true,
  expandOutlinePathStyling: true,
  layerOrder: ['background', 'outlinePaths'],
};
