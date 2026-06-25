import { describe, expect, it, vi } from 'vitest';
import { rasterizeSvgFile } from './svgRasterize';

describe('rasterizeSvgFile', () => {
  it('rasterizes an SVG file to canvas dimensions', async () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>';
    const file = new File([svg], 'icon.svg', { type: 'image/svg+xml' });

    const mockCtx = { drawImage: vi.fn() };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const imageProto = HTMLImageElement.prototype;
    vi.spyOn(imageProto, 'src', 'set').mockImplementation(function set(this: HTMLImageElement) {
      this.onload?.(new Event('load'));
    });

    const canvas = await rasterizeSvgFile(file, 64, 64);
    expect(canvas.width).toBe(64);
    expect(canvas.height).toBe(64);
  });
});
