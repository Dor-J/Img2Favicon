import { expandForRotation } from './dimensions';

export interface TransformOptions {
  rotation: number;
  flipH: boolean;
  flipV: boolean;
}

/** Draws an image with rotation and flip onto an expanded canvas. */
export function drawTransformed(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  options: TransformOptions,
): HTMLCanvasElement {
  const bounds = expandForRotation(sourceWidth, sourceHeight, options.rotation);
  const canvas = document.createElement('canvas');
  canvas.width = bounds.width;
  canvas.height = bounds.height;
  const ctx = canvas.getContext('2d', { alpha: true })!;

  ctx.translate(bounds.width / 2, bounds.height / 2);
  ctx.rotate((options.rotation * Math.PI) / 180);
  ctx.scale(options.flipH ? -1 : 1, options.flipV ? -1 : 1);
  ctx.drawImage(source, -sourceWidth / 2, -sourceHeight / 2, sourceWidth, sourceHeight);

  return canvas;
}

/** Resizes a canvas to exact output dimensions. */
export function resizeCanvas(
  source: HTMLCanvasElement,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: true })!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}
