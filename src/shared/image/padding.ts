export interface PaddingOptions {
  top: number;
  right: number;
  bottom: number;
  left: number;
  background: string | 'transparent';
  borderWidth: number;
  borderColor: string;
}

/** Adds padding and optional border around a source canvas. */
export function addPaddingBorder(
  source: HTMLCanvasElement,
  options: PaddingOptions,
): HTMLCanvasElement {
  const { top, right, bottom, left, background, borderWidth, borderColor } = options;
  const canvas = document.createElement('canvas');
  canvas.width = source.width + left + right + borderWidth * 2;
  canvas.height = source.height + top + bottom + borderWidth * 2;
  const ctx = canvas.getContext('2d', { alpha: true })!;

  if (background !== 'transparent') {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const imageX = left + borderWidth;
  const imageY = top + borderWidth;
  ctx.drawImage(source, imageX, imageY);

  if (borderWidth > 0) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(
      imageX - borderWidth / 2,
      imageY - borderWidth / 2,
      source.width + borderWidth,
      source.height + borderWidth,
    );
  }

  return canvas;
}
