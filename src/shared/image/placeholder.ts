/** Options for generating a placeholder image canvas. */
export interface PlaceholderOptions {
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
  label: string;
}

/** Clamps placeholder dimensions to at least 1px. */
export function normalizePlaceholderSize(width: number, height: number): { width: number; height: number } {
  return {
    width: Math.max(1, width || 400),
    height: Math.max(1, height || 300),
  };
}

/** Builds a download filename for a placeholder PNG. */
export function placeholderFilename(width: number, height: number): string {
  return `placeholder-${width}x${height}.png`;
}

/** Renders a labeled placeholder canvas. */
export function renderPlaceholderCanvas(options: PlaceholderOptions): HTMLCanvasElement {
  const { width, height } = normalizePlaceholderSize(options.width, options.height);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = options.backgroundColor;
  ctx.fillRect(0, 0, width, height);

  const label = options.label.trim();
  if (label) {
    ctx.fillStyle = options.textColor;
    ctx.font = `bold ${Math.round(Math.min(width, height) / 8)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, width / 2, height / 2);
  }

  return canvas;
}
