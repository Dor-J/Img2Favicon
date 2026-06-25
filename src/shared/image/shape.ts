/** Shape modes for masking and favicon clipping. */
export type ShapeMode = 'circle' | 'square' | 'rounded' | 'squircle';

/** Builds a clip path for the requested shape. */
export function drawShapePath(
  context: CanvasRenderingContext2D,
  size: number,
  shape: ShapeMode,
  radiusRatio = 0.19,
): void {
  if (shape === 'circle') {
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    return;
  }

  if (shape === 'square') {
    context.beginPath();
    context.rect(0, 0, size, size);
    return;
  }

  if (shape === 'squircle') {
    drawSquirclePath(context, size);
    return;
  }

  const radius = Math.round(size * radiusRatio);
  context.beginPath();
  context.roundRect(0, 0, size, size, radius);
}

/** Approximates a squircle using a superellipse path. */
function drawSquirclePath(context: CanvasRenderingContext2D, size: number): void {
  const n = 4;
  const cx = size / 2;
  const cy = size / 2;
  const rx = size / 2;
  const ry = size / 2;
  context.beginPath();

  for (let angle = 0; angle <= Math.PI * 2; angle += Math.PI / 64) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = cx + rx * Math.sign(cos) * Math.abs(cos) ** (2 / n);
    const y = cy + ry * Math.sign(sin) * Math.abs(sin) ** (2 / n);
    if (angle === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }

  context.closePath();
}
