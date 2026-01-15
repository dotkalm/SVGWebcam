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
  downloadPNG: (svg: string, filename: string, width: number, height: number) => void;
}

export type TSliderProps = Pick<LeftControlPanelProps, 'config' | 'updateConfig'>;
export type TConfigProps = Pick<LeftControlPanelProps, 'config' | 'updateConfig' | 'uiState' | 'updateUIState'> & {
  presets: TPresets;
};
export interface TMobileFooterProps extends TSliderProps {
  downloadSVG: LeftControlPanelProps['downloadSVG'];
  downloadPNG: LeftControlPanelProps['downloadPNG'];
  svgString: LeftControlPanelProps['svgString'];
}

export interface RightControlPanelProps extends TPresets{
  config: ViewerConfig;
  updateConfig: (updates: Partial<ViewerConfig>) => void;
  uiState: UIState;
  updateUIState: (updates: Partial<UIState>) => void;
}

export interface TMobileControlProps extends LeftControlPanelProps { 
  presets: TPresets;
}

// Config types
export interface ViewerConfig {
  // Camera settings
  cameraZoom: number;
  facingMode: 'user' | 'environment';
  
  // Blur settings
  blurOff: boolean;
  blurMode: SubMenuItemBlur;
  aperture: number;
  motionBlurAmount: number;
  motionBlurAngle: number;
  gaussianBlurAmount: number;
  
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
  EDGE_DETECTION = 'Overall',
  BACKGROUND_STYLING = 'Background',
  OUTLINE = 'Outline',
  BLUR = 'Blur',
  PRESETS = 'Presets',
}

export enum SubMenuItemBlur {
  GAUSSIAN = 'Gaussian',
  MOTION = 'Motion',
  BOKEH = 'Bokeh',
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
export interface TPresets {
  presets: Preset[];
  presetName: string;
  setPresetName: (name: string) => void;
  savePreset: () => void;
  loadPreset: (settings: PresetSettings) => void;
  deletePreset: (index: number) => void;
}

export type TOverallProps = {
  backgroundEnabled: {
    value: boolean;
    changeHandler: () => void;
  };
  configs: TConfigKey;
  outlineEnabled: {
    value: boolean;
    changeHandler: () => void;
  };
  swapOrder: {
    value: ('background' | 'outlinePaths')[];
    changeHandler: () => void;
  };
};

export type TStrokeProps = {
  configs: TConfigKey;
  strokeColor: {
    value: string;
    changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

export type TBlurProps = {
  configs: TConfigKey;
  blurMode: SubMenuItemBlur;
  useBlur: {
    value: boolean;
    changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  motionBlurAngle?: {
    value: number;
    changeHandler: (value: number) => void;
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