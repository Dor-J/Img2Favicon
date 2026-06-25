import { describe, expect, it, vi } from 'vitest';
import { drawTransformed, resizeCanvas } from './transform';

describe('drawTransformed', () => {
  it('returns expanded canvas for rotated source', () => {
    const mockCtx = { translate: vi.fn(), rotate: vi.fn(), scale: vi.fn(), drawImage: vi.fn() };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const source = document.createElement('canvas');
    source.width = 100;
    source.height = 50;
    const result = drawTransformed(source, 100, 50, { rotation: 90, flipH: false, flipV: false });
    expect(result.width).toBeGreaterThanOrEqual(50);
    expect(result.height).toBeGreaterThanOrEqual(100);
  });
});

describe('resizeCanvas', () => {
  it('outputs exact target dimensions', () => {
    const mockCtx = { drawImage: vi.fn() };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const source = document.createElement('canvas');
    source.width = 200;
    source.height = 100;
    const result = resizeCanvas(source, 80, 40);
    expect(result.width).toBe(80);
    expect(result.height).toBe(40);
  });
});
