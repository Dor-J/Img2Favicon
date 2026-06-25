import { describe, expect, it, vi } from 'vitest';
import { createTilePreview } from './tilePreview';

describe('createTilePreview', () => {
  it('tiles source canvas in a 2x2 grid by default', () => {
    const mockCtx = { drawImage: vi.fn() };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const source = document.createElement('canvas');
    source.width = 50;
    source.height = 30;
    const result = createTilePreview(source);
    expect(result.width).toBe(100);
    expect(result.height).toBe(60);
    expect(mockCtx.drawImage).toHaveBeenCalledTimes(4);
  });
});
