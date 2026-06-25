/** Loads an SVG file and rasterizes it to a canvas at the given size. */
export async function rasterizeSvgFile(
  file: File,
  width: number,
  height: number,
): Promise<HTMLCanvasElement> {
  const text = await file.text();
  const blob = new Blob([text], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  try {
    const image = await decodeImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    ctx.drawImage(image, 0, 0, width, height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function decodeImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('That SVG could not be rasterized.'));
    image.src = url;
  });
}
