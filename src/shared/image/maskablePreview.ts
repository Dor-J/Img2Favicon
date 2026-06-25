/** Draws Android maskable safe zone overlay on a square canvas preview. */
export function drawMaskableOverlay(
  ctx: CanvasRenderingContext2D,
  size: number,
  showSafeZone: boolean,
  showCircle: boolean,
): void {
  if (showSafeZone) {
    const safeRadius = size * 0.4;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 90, 31, 0.85)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, safeRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (showCircle) {
    ctx.save();
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

/** Renders icon with maskable/circle clip previews. */
export function renderMaskablePreview(
  source: HTMLCanvasElement,
  size: number,
  clip: 'none' | 'circle' | 'squircle',
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { alpha: true })!;

  ctx.save();
  if (clip === 'circle') {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();
  } else if (clip === 'squircle') {
    const r = size * 0.22;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, r);
    ctx.clip();
  }

  const scale = Math.min(size / source.width, size / source.height);
  const w = source.width * scale;
  const h = source.height * scale;
  ctx.drawImage(source, (size - w) / 2, (size - h) / 2, w, h);
  ctx.restore();

  return canvas;
}
