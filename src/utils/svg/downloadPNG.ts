export type DownloadPNGResult = {
  action: 'shared' | 'downloaded' | 'cancelled';
  success: boolean;
};

/**
 * Download or share PNG file from SVG string
 * Converts SVG to canvas, then exports as PNG
 * On mobile: Uses Web Share API to allow saving to camera roll
 * On desktop: Downloads the file
 * @param backgroundColor - Background color for the PNG (default: 'white')
 * @param scale - Resolution multiplier for higher quality (default: 3x for sharp output)
 * @returns Promise with action result for toast notifications
 */
export async function downloadPNG(
  svgString: string, 
  filename: string = 'edges.png',
  width: number = 1920,
  height: number = 1080,
  backgroundColor: string = 'white',
  scale: number = 3
): Promise<DownloadPNGResult> {
  return new Promise<DownloadPNGResult>((resolve, reject) => {
    // Extract actual dimensions from SVG viewBox to maintain correct aspect ratio
    const viewBoxMatch = svgString.match(/viewBox=["']([^"']+)["']/);
    let svgWidth = width;
    let svgHeight = height;
    
    if (viewBoxMatch) {
      const viewBoxValues = viewBoxMatch[1].split(/\s+/);
      if (viewBoxValues.length === 4) {
        const vbWidth = parseFloat(viewBoxValues[2]);
        const vbHeight = parseFloat(viewBoxValues[3]);
        
        // Use viewBox dimensions to maintain correct aspect ratio
        svgWidth = vbWidth;
        svgHeight = vbHeight;
        
        // Scale up to requested size while maintaining aspect ratio
        const aspectRatio = vbWidth / vbHeight;
        const targetAspectRatio = width / height;
        
        if (aspectRatio > targetAspectRatio) {
          // SVG is wider - use width as constraint
          svgWidth = width;
          svgHeight = width / aspectRatio;
        } else {
          // SVG is taller - use height as constraint
          svgHeight = height;
          svgWidth = height * aspectRatio;
        }
      }
    }
    
    // Create an image element from the SVG string
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = async () => {
      // Create canvas with correct aspect ratio dimensions, scaled up for quality
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(svgWidth * scale);
      canvas.height = Math.round(svgHeight * scale);
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Failed to get canvas context');
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Enable high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill background with specified color
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, Math.round(svgWidth * scale), Math.round(svgHeight * scale));

      // Draw the SVG image onto the canvas at scaled dimensions
      ctx.drawImage(img, 0, 0, Math.round(svgWidth * scale), Math.round(svgHeight * scale));

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
            // Share completed successfully
            resolve({ action: 'shared', success: true });
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
            resolve({ action: 'downloaded', success: true });
          }
        } catch (error) {
          // If sharing is cancelled or fails, fallback to download
          if (error instanceof Error && error.name === 'AbortError') {
            console.log('Share cancelled by user');
            resolve({ action: 'cancelled', success: false });
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
            resolve({ action: 'downloaded', success: true });
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
