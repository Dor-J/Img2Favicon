export type FitMode = 'cover' | 'contain';

/** Draws a source image into target dimensions using cover or contain fit. */
export function drawFittedImage(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  mode: FitMode,
  background = '#000000',
): void {
  if (mode === 'contain') {
    const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
    const drawW = sourceWidth * scale;
    const drawH = sourceHeight * scale;
    const x = (targetWidth - drawW) / 2;
    const y = (targetHeight - drawH) / 2;

    if (background !== 'transparent') {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    ctx.drawImage(source, x, y, drawW, drawH);
    return;
  }

  const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const drawW = sourceWidth * scale;
  const drawH = sourceHeight * scale;
  const x = (targetWidth - drawW) / 2;
  const y = (targetHeight - drawH) / 2;
  ctx.drawImage(source, x, y, drawW, drawH);
}

/** Creates a canvas with fitted image content. */
export function fitImageToCanvas(
  source: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
  mode: FitMode,
  background = '#000000',
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { alpha: true })!;

  if (mode === 'cover') {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, targetWidth, targetHeight);
    ctx.clip();
  }

  drawFittedImage(
    ctx,
    source,
    source.width,
    source.height,
    targetWidth,
    targetHeight,
    mode,
    background,
  );

  if (mode === 'cover') ctx.restore();
  return canvas;
}
