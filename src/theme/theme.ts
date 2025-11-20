'use client';

import { createTheme } from '@mui/material/styles';

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
  },
});

export default theme;
