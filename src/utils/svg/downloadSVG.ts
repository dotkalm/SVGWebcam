export type DownloadSVGResult = {
  action: 'shared' | 'downloaded' | 'cancelled';
  success: boolean;
};

/**
 * Download SVG file
 * SVG files are downloaded directly to Files app (not shared via Web Share API)
 * because iOS/mobile browsers don't support saving SVG to camera roll
 * @returns Promise with action result for toast notifications
 */
export async function downloadSVG(svgString: string, filename: string = 'edges.svg'): Promise<DownloadSVGResult> {
  console.log('downloadSVG called with filename:', filename);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  
  return new Promise((resolve) => {
    try {
      // Direct download for all platforms
      // Note: We don't use Web Share API for SVG because iOS treats SVG as a generic file,
      // not an image, and "Save Image" option fails with AbortError
      console.log('Using direct download for SVG');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      
      // Listen for page visibility change to detect when user returns after saving
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          // User returned to page - assume they saved the file
          console.log('User returned to page after download dialog');
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          URL.revokeObjectURL(url);
          resolve({ action: 'downloaded', success: true });
        }
      };
      
      // Add visibility listener before clicking
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Also add a timeout fallback in case visibility API doesn't fire
      const timeout = setTimeout(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        URL.revokeObjectURL(url);
        resolve({ action: 'downloaded', success: true });
      }, 3000); // 3 second fallback
      
      a.click();
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('downloadSVG error:', error);
      resolve({ action: 'downloaded', success: false });
    }
  });
}
