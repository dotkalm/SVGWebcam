import type { ViewerConfig, Preset, PresetSettings } from '@/types';

export type { Preset, PresetSettings };

const STORAGE_KEY = 'edgeDetectorPresets';

export const loadPresetsFromStorage = (): Preset[] => {
  if (typeof window === 'undefined') return [];
  
  const savedPresets = localStorage.getItem(STORAGE_KEY);
  if (savedPresets) {
    try {
      return JSON.parse(savedPresets);
    } catch (e) {
      console.error('Failed to load presets:', e);
      return [];
    }
  }
  return [];
};

export const savePresetsToStorage = (presets: Preset[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
};

export const createPreset = (name: string, settings: PresetSettings): Preset => {
  return { name, settings };
};
