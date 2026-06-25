export interface SpriteSheetOptions {
  columns: number;
  padding: number;
  uniformCellSize: boolean;
}

export interface SpriteSheetResult {
  canvas: HTMLCanvasElement;
  css: string;
  cellWidth: number;
  cellHeight: number;
  columns: number;
  rows: number;
}

/** Packs frame canvases into a sprite sheet with CSS background-position rules. */
export function buildSpriteSheet(
  frames: HTMLCanvasElement[],
  options: SpriteSheetOptions,
): SpriteSheetResult {
  if (frames.length === 0) {
    throw new Error('At least one frame is required.');
  }

  const columns = Math.max(1, options.columns);
  const rows = Math.ceil(frames.length / columns);
  const cellWidth = options.uniformCellSize
    ? Math.max(...frames.map((f) => f.width))
    : frames[0]!.width;
  const cellHeight = options.uniformCellSize
    ? Math.max(...frames.map((f) => f.height))
    : frames[0]!.height;
  const pad = options.padding;

  const sheetWidth = columns * cellWidth + pad * (columns - 1);
  const sheetHeight = rows * cellHeight + pad * (rows - 1);
  const canvas = document.createElement('canvas');
  canvas.width = sheetWidth;
  canvas.height = sheetHeight;
  const ctx = canvas.getContext('2d', { alpha: true })!;

  const cssLines: string[] = [
    `.sprite { background-image: url('sprite.png'); background-repeat: no-repeat; }`,
  ];

  frames.forEach((frame, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = col * (cellWidth + pad);
    const y = row * (cellHeight + pad);
    const offsetX = x + (cellWidth - frame.width) / 2;
    const offsetY = y + (cellHeight - frame.height) / 2;
    ctx.drawImage(frame, offsetX, offsetY);
    cssLines.push(
      `.sprite-${index} { width: ${frame.width}px; height: ${frame.height}px; background-position: -${x}px -${y}px; }`,
    );
  });

  return {
    canvas,
    css: cssLines.join('\n'),
    cellWidth,
    cellHeight,
    columns,
    rows,
  };
}
