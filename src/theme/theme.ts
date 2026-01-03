'use client';

import { createTheme } from '@mui/material/styles';

// Extend MUI theme to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    colors: {
      background: string;
      border: string;
      activeBorder: string;
      activeBackground: string;
      activeText: string;
    };
  }
  interface PaletteOptions {
    colors?: {
      border?: string;
      background?: string;
      activeBorder?: string;
      activeBackground?: string;
      activeText?: string;
    };
  }
}

const theme = createTheme({
  typography: {
    fontFamily: "'Circular Std', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
  },
  palette: {
    mode: 'light',
    text: {
      primary: '#000000',
      secondary: '#000000',
    },
    colors:{
      background: '#fff',
      border: '#313131ff',
      activeBorder: '#5b5b5bff',
      activeBackground: '#a6a6a6ff',
      activeText: '#ffffff',
    },
    common: {
      black: '#000000',
      white: '#ffffff',
    },
  },
});

export default theme;
