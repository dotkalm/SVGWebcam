/**
 * Download or share PNG file from SVG string
 * Converts SVG to canvas, then exports as PNG
 * On mobile: Uses Web Share API to allow saving to camera roll
 * On desktop: Downloads the file
 */
export async function downloadPNG(
  svgString: string, 
  filename: string = 'edges.png',
  width: number = 1920,
  height: number = 1080
) {
  return new Promise<void>((resolve, reject) => {
    // Create an image element from the SVG string
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = async () => {
      // Create canvas with specified dimensions
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Failed to get canvas context');
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Draw the SVG image onto the canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('Failed to create PNG blob');
          reject(new Error('Failed to create PNG blob'));
          return;
        }

        try {
          // Check if Web Share API is available and can share files (mobile)
          const file = new File([blob], filename, { type: 'image/png' });
          
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            // Use Web Share API for mobile - allows saving to camera roll
            await navigator.share({
              files: [file],
              title: 'Edge Detection',
              text: 'SVG edge detection image'
            });
            resolve();
          } else {
            // Fallback to download for desktop
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(pngUrl);
            resolve();
          }
        } catch (error) {
          // If sharing is cancelled or fails, fallback to download
          if (error instanceof Error && error.name === 'AbortError') {
            console.log('Share cancelled by user');
            resolve();
          } else {
            console.error('Error sharing/downloading:', error);
            // Try download as last resort
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(pngUrl);
            resolve();
          }
        }
      }, 'image/png');

      // Clean up the SVG object URL
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      console.error('Failed to load SVG image');
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG image'));
    };

    img.src = url;
  });
}
