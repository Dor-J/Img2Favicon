/** Creates a 2×2 tiled preview canvas from a source texture. */
export function createTilePreview(source: HTMLCanvasElement, repeats = 2): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = source.width * repeats;
  canvas.height = source.height * repeats;
  const ctx = canvas.getContext('2d', { alpha: true })!;

  for (let row = 0; row < repeats; row++) {
    for (let col = 0; col < repeats; col++) {
      ctx.drawImage(source, col * source.width, row * source.height);
    }
  }

  return canvas;
}
