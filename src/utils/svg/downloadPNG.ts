/**
 * Download PNG file from SVG string
 * Converts SVG to canvas, then exports as PNG
 */
export function downloadPNG(
  svgString: string, 
  filename: string = 'edges.png',
  width: number = 1920,
  height: number = 1080
) {
  // Create an image element from the SVG string
  const img = new Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    // Create canvas with specified dimensions
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      URL.revokeObjectURL(url);
      return;
    }

    // Draw the SVG image onto the canvas
    ctx.drawImage(img, 0, 0, width, height);

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Failed to create PNG blob');
        return;
      }

      const pngUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(pngUrl);
    }, 'image/png');

    // Clean up the SVG object URL
    URL.revokeObjectURL(url);
  };

  img.onerror = () => {
    console.error('Failed to load SVG image');
    URL.revokeObjectURL(url);
  };

  img.src = url;
}
