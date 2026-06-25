import { describe, expect, it, vi } from 'vitest';
import { combineCanvases } from './combine';

describe('combineCanvases', () => {
  it('combines two canvases horizontally', () => {
    const mockCtx = { fillStyle: '', fillRect: vi.fn(), drawImage: vi.fn() };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const a = document.createElement('canvas');
    a.width = 10;
    a.height = 10;
    const b = document.createElement('canvas');
    b.width = 20;
    b.height = 10;
    const result = combineCanvases([a, b], {
      layout: 'horizontal',
      gap: 5,
      background: '#000000',
    });
    expect(result.width).toBe(35);
    expect(result.height).toBe(10);
  });
});
