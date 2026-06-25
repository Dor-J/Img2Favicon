import { drawShapePath, type ShapeMode } from './shape';

export interface MaskOptions {
  shape: ShapeMode;
  radiusRatio?: number;
}

/** Applies a shape mask to a canvas and returns a new canvas with transparency. */
export function applyShapeMask(
  source: HTMLCanvasElement,
  options: MaskOptions,
): HTMLCanvasElement {
  const size = Math.max(source.width, source.height);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { alpha: true })!;

  ctx.save();
  drawShapePath(ctx, size, options.shape, options.radiusRatio);
  ctx.clip();

  const offsetX = (size - source.width) / 2;
  const offsetY = (size - source.height) / 2;
  ctx.drawImage(source, offsetX, offsetY);
  ctx.restore();

  return canvas;
}

/** Applies mask keeping original dimensions with shape clip. */
export function applyShapeMaskInPlace(
  source: HTMLCanvasElement,
  options: MaskOptions,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext('2d', { alpha: true })!;
  const size = Math.min(source.width, source.height);

  ctx.save();
  drawShapePath(ctx, size, options.shape, options.radiusRatio);
  ctx.clip();
  ctx.drawImage(source, 0, 0);
  ctx.restore();

  return canvas;
}
