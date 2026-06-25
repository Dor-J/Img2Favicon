export type CombineLayout = 'horizontal' | 'vertical' | 'grid';

export interface CombineOptions {
  layout: CombineLayout;
  gap: number;
  background: string;
  gridColumns?: number;
}

/** Combines multiple canvases into one collage canvas. */
export function combineCanvases(
  sources: HTMLCanvasElement[],
  options: CombineOptions,
): HTMLCanvasElement {
  if (sources.length === 0) {
    throw new Error('At least one image is required.');
  }

  const { layout, gap, background, gridColumns = 2 } = options;

  if (layout === 'horizontal') {
    const height = Math.max(...sources.map((c) => c.height));
    const width =
      sources.reduce((sum, c) => sum + c.width, 0) + gap * (sources.length - 1);
    return drawCombined(sources, width, height, background, (ctx, index, x) => {
      const canvas = sources[index]!;
      const y = (height - canvas.height) / 2;
      ctx.drawImage(canvas, x, y);
      return x + canvas.width + gap;
    }, 0);
  }

  if (layout === 'vertical') {
    const width = Math.max(...sources.map((c) => c.width));
    const height =
      sources.reduce((sum, c) => sum + c.height, 0) + gap * (sources.length - 1);
    return drawCombinedVertical(sources, width, height, background, gap);
  }

  const cols = Math.min(gridColumns, sources.length);
  const rows = Math.ceil(sources.length / cols);
  const cellW = Math.max(...sources.map((c) => c.width));
  const cellH = Math.max(...sources.map((c) => c.height));
  const width = cols * cellW + gap * (cols - 1);
  const height = rows * cellH + gap * (rows - 1);
  const canvas = createCanvas(width, height, background);
  const ctx = canvas.getContext('2d', { alpha: true })!;

  sources.forEach((source, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = col * (cellW + gap) + (cellW - source.width) / 2;
    const y = row * (cellH + gap) + (cellH - source.height) / 2;
    ctx.drawImage(source, x, y);
  });

  return canvas;
}

function drawCombinedVertical(
  sources: HTMLCanvasElement[],
  width: number,
  height: number,
  background: string,
  gap: number,
): HTMLCanvasElement {
  const canvas = createCanvas(width, height, background);
  const ctx = canvas.getContext('2d', { alpha: true })!;
  let y = 0;

  for (const source of sources) {
    const x = (width - source.width) / 2;
    ctx.drawImage(source, x, y);
    y += source.height + gap;
  }

  return canvas;
}

function drawCombined(
  sources: HTMLCanvasElement[],
  width: number,
  height: number,
  background: string,
  drawFn: (ctx: CanvasRenderingContext2D, index: number, x: number) => number,
  startX: number,
): HTMLCanvasElement {
  const canvas = createCanvas(width, height, background);
  const ctx = canvas.getContext('2d', { alpha: true })!;
  let x = startX;

  sources.forEach((_, index) => {
    x = drawFn(ctx, index, x);
  });

  return canvas;
}

function createCanvas(width: number, height: number, background: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: true })!;
  if (background !== 'transparent') {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }
  return canvas;
}
