/** Splits a sprite sheet canvas into individual frame canvases. */
export function splitSpriteSheet(
  source: HTMLCanvasElement,
  columns: number,
  padding: number,
): HTMLCanvasElement[] {
  const cols = Math.max(1, columns);
  const cellW = Math.floor((source.width - padding * (cols - 1)) / cols);
  if (cellW <= 0) throw new Error('Invalid grid: columns too large for image width.');

  const rows = Math.ceil(source.height / (cellW + padding));
  const frames: HTMLCanvasElement[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * (cellW + padding);
      const y = row * (cellW + padding);
      if (y + cellW > source.height) break;

      const frame = document.createElement('canvas');
      frame.width = cellW;
      frame.height = cellW;
      frame.getContext('2d', { alpha: true })!.drawImage(
        source,
        x,
        y,
        cellW,
        cellW,
        0,
        0,
        cellW,
        cellW,
      );
      frames.push(frame);
    }
  }

  return frames;
}

/** Splits a uniform grid when cell size is known. */
export function splitUniformGrid(
  source: HTMLCanvasElement,
  cellWidth: number,
  cellHeight: number,
  padding: number,
): HTMLCanvasElement[] {
  const frames: HTMLCanvasElement[] = [];
  const stepX = cellWidth + padding;
  const stepY = cellHeight + padding;

  for (let y = 0; y + cellHeight <= source.height; y += stepY) {
    for (let x = 0; x + cellWidth <= source.width; x += stepX) {
      const frame = document.createElement('canvas');
      frame.width = cellWidth;
      frame.height = cellHeight;
      frame.getContext('2d', { alpha: true })!.drawImage(
        source,
        x,
        y,
        cellWidth,
        cellHeight,
        0,
        0,
        cellWidth,
        cellHeight,
      );
      frames.push(frame);
    }
  }

  return frames;
}
