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

export type TSliderProps = Pick<LeftControlPanelProps, 'config' | 'updateConfig'>;
export type TConfigProps = Pick<LeftControlPanelProps, 'config' | 'updateConfig'>;

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
  // Camera settings
  cameraZoom: number;
  facingMode: 'user' | 'environment';
  
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
  backgroundUseDashArray: boolean;
  backgroundDashSize: number;
  
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
  outlinePathsUseDashArray: boolean;
  outlinePathsDashSize: number;

  // menu items
  activeMenuItem?: MenuItem;
  activeSubMenuItem?: SubMenuItem;
}

export interface UIState {
  showLeftPanel: boolean;
  showRightPanel: boolean;
  expandCameraSettings: boolean;
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

export enum MenuItem {
  EDGE_DETECTION = 'Edges',
  BACKGROUND_STYLING = 'BG',
  OUTLINE = 'Outline',
  BLUR = 'Blur',
  PRESETS = 'Presets',
}

export enum SubMenuItem {
  FIDELITY = 'Fidelity',
  STROKE = 'Stroke',
  STYLE = 'Style',
}

export type TConfigKey  = Record<string, {
    changeHandler: (event: Event, value: number) => void;
    max: number;
    min: number;
    step: number;
    value: number;
}>;

export type TTwoSlidersProps = {
  configs: TConfigKey;
}
export type TStrokeProps = {
  configs: TConfigKey;
  strokeColor: {
    value: string;
    changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

export type TFillProps = {
  configs: TConfigKey;
  fillEnabled: {
    value: boolean;
    changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  fillColor: {
    value: string;
    changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  useBezierBackground: {
    value: boolean;
    changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  createWiggle: {
    value: boolean;
    changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  createDashArray: {
    value: boolean;
    changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  dashArray: {
    changeHandler: (event: Event, value: number) => void;
    max: number;
    min: number;
    step: number;
    value: number;
  }
}