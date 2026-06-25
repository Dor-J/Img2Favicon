import { hexToRgb } from './color';

export type DuotoneMode = 'grayscale' | 'duotone';

/** Applies grayscale or duotone effect to canvas pixel data. */
export function applyDuotone(
  source: HTMLCanvasElement,
  mode: DuotoneMode,
  shadowColor: string,
  highlightColor: string,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext('2d', { alpha: true })!;
  ctx.drawImage(source, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;

  const shadow = hexToRgb(shadowColor);
  const highlight = hexToRgb(highlightColor);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    if (mode === 'grayscale') {
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    } else {
      const t = gray / 255;
      data[i] = Math.round(shadow.r + (highlight.r - shadow.r) * t);
      data[i + 1] = Math.round(shadow.g + (highlight.g - shadow.g) * t);
      data[i + 2] = Math.round(shadow.b + (highlight.b - shadow.b) * t);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
