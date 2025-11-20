// Component prop types

export interface WebcamCaptureProps {
  width?: number;
  height?: number;
}

export interface LeftControlPanelProps {
  config: ViewerConfig;
  updateConfig: (updates: Partial<ViewerConfig>) => void;
  uiState: UIState;
  updateUIState: (updates: Partial<UIState>) => void;
  svgString: string;
  downloadSVG: (svg: string, filename: string) => void;
}

export interface RightControlPanelProps {
  config: ViewerConfig;
  updateConfig: (updates: Partial<ViewerConfig>) => void;
  uiState: UIState;
  updateUIState: (updates: Partial<UIState>) => void;
  presets: Preset[];
  presetName: string;
  setPresetName: (name: string) => void;
  savePreset: () => void;
  loadPreset: (settings: PresetSettings) => void;
  deletePreset: (index: number) => void;
}

// Config types
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
  enableBackground: boolean;
  backgroundStrokeWidth: number;
  backgroundStrokeColor: string;
  backgroundStrokeOpacity: number;
  useBackgroundFill: boolean;
  backgroundFillColor: string;
  backgroundFillOpacity: number;
  useBezierBackground: boolean;
  backgroundWiggle: boolean;
  
  // Outline path styling
  enableOutlinePaths: boolean;
  outlinePathsStrokeWidth: number;
  outlinePathsStrokeColor: string;
  outlinePathsStrokeOpacity: number;
  useOutlinePathsFill: boolean;
  outlinePathsFillColor: string;
  outlinePathsFillOpacity: number;
  useBezierOutlinePaths: boolean;
  outlinePathsWiggle: boolean;
}

export interface UIState {
  showLeftPanel: boolean;
  showRightPanel: boolean;
  expandEdgeDetection: boolean;
  expandBackgroundStyling: boolean;
  expandOutlinePathStyling: boolean;
  layerOrder: ('background' | 'outlinePaths')[];
}

// Preset types
export type PresetSettings = ViewerConfig;

export interface Preset {
  name: string;
  settings: PresetSettings;
}
