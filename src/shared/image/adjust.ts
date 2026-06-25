export interface AdjustOptions {
  brightness: number;
  contrast: number;
  saturation: number;
}

/** Builds a CSS filter string from adjustment values (-100 to 100). */
export function buildAdjustFilter(options: AdjustOptions): string {
  const brightness = 100 + options.brightness;
  const contrast = 100 + options.contrast;
  const saturation = 100 + options.saturation;
  return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
}

/** Applies brightness, contrast, and saturation adjustments to a canvas copy. */
export function applyAdjustments(
  source: HTMLCanvasElement,
  options: AdjustOptions,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext('2d', { alpha: true })!;
  ctx.filter = buildAdjustFilter(options);
  ctx.drawImage(source, 0, 0);
  ctx.filter = 'none';
  return canvas;
}
