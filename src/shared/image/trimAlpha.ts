/** Bounding box of non-transparent pixels in RGBA data. */
export interface AlphaBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Finds the bounding box of pixels with alpha above the threshold. */
export function findAlphaBounds(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  alphaThreshold = 1,
): AlphaBounds | null {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3]!;
      if (alpha > alphaThreshold) {
        found = true;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (!found) return null;

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

/** Crops a canvas to its non-transparent content bounds. */
export function trimTransparentCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = source.getContext('2d', { alpha: true });
  if (!ctx) return source;

  const { data, width, height } = ctx.getImageData(0, 0, source.width, source.height);
  const bounds = findAlphaBounds(data, width, height);
  if (!bounds) return source;

  const canvas = document.createElement('canvas');
  canvas.width = bounds.width;
  canvas.height = bounds.height;
  canvas.getContext('2d', { alpha: true })!.drawImage(
    source,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    0,
    0,
    bounds.width,
    bounds.height,
  );
  return canvas;
}
