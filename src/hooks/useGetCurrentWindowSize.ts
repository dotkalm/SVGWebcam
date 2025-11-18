// useGetCurrentWindowSize.tsx
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export const useGetCurrentWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    window.addEventListener('orientationchange', handleResize);
    
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', handleResize);
      }
    };
  }, []);

  return windowSize;
};