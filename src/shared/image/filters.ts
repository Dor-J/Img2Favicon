import type { CropRect } from './crop';

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/** Applies color-key transparency to image pixel data. */
export function colorKeyToAlpha(
  data: Uint8ClampedArray,
  key: RgbColor,
  tolerance: number,
  feather: number,
): void {
  const tol = tolerance * 4.42;

  for (let i = 0; i < data.length; i += 4) {
    const dr = data[i]! - key.r;
    const dg = data[i + 1]! - key.g;
    const db = data[i + 2]! - key.b;
    const distance = Math.sqrt(dr * dr + dg * dg + db * db);

    if (distance <= tol) {
      data[i + 3] = 0;
    } else if (feather > 0 && distance <= tol + feather * 4.42) {
      const alpha = ((distance - tol) / (feather * 4.42)) * 255;
      data[i + 3] = Math.min(data[i + 3]!, Math.round(alpha));
    }
  }
}

/** Reads an RGB color from image data at pixel coordinates. */
export function sampleColor(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
): RgbColor {
  const i = (y * width + x) * 4;
  return { r: data[i]!, g: data[i + 1]!, b: data[i + 2]! };
}

/** Pixelates a rectangular region on a canvas. */
export function pixelateRegion(
  ctx: CanvasRenderingContext2D,
  rect: CropRect,
  blockSize: number,
): void {
  const size = Math.max(2, blockSize);
  const imageData = ctx.getImageData(rect.x, rect.y, rect.width, rect.height);
  const { data, width, height } = imageData;

  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;

      for (let dy = 0; dy < size && y + dy < height; dy++) {
        for (let dx = 0; dx < size && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          r += data[idx]!;
          g += data[idx + 1]!;
          b += data[idx + 2]!;
          a += data[idx + 3]!;
          count++;
        }
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      a = Math.round(a / count);

      for (let dy = 0; dy < size && y + dy < height; dy++) {
        for (let dx = 0; dx < size && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = a;
        }
      }
    }
  }

  ctx.putImageData(imageData, rect.x, rect.y);
}

/** Applies a blur filter to a rectangular region. */
export function blurRegion(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  rect: CropRect,
  blurPx: number,
): void {
  const temp = document.createElement('canvas');
  temp.width = rect.width;
  temp.height = rect.height;
  const tctx = temp.getContext('2d', { alpha: true })!;
  tctx.filter = `blur(${blurPx}px)`;
  tctx.drawImage(canvas, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
  tctx.filter = 'none';
  ctx.drawImage(temp, rect.x, rect.y);
}

/** Region for redaction effects. */
export interface EffectRegion extends CropRect {
  id: string;
}
