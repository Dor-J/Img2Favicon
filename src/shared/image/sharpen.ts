/** Applies unsharp mask sharpening to a canvas. */
export function sharpenCanvas(
  source: HTMLCanvasElement,
  amount: number,
  radius: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext('2d', { alpha: true })!;
  ctx.drawImage(source, 0, 0);

  const blurred = document.createElement('canvas');
  blurred.width = source.width;
  blurred.height = source.height;
  const bctx = blurred.getContext('2d', { alpha: true })!;
  bctx.filter = `blur(${Math.max(0.5, radius)}px)`;
  bctx.drawImage(source, 0, 0);
  bctx.filter = 'none';

  const original = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const blurData = bctx.getImageData(0, 0, canvas.width, canvas.height);
  const strength = amount / 100;

  for (let i = 0; i < original.data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const idx = i + c;
      const sharp = original.data[idx]! + strength * (original.data[idx]! - blurData.data[idx]!);
      original.data[idx] = Math.max(0, Math.min(255, Math.round(sharp)));
    }
  }

  ctx.putImageData(original, 0, 0);
  return canvas;
}
