import { describe, expect, it, vi } from 'vitest';
import { drawMaskableOverlay, renderMaskablePreview } from './maskablePreview';

describe('renderMaskablePreview', () => {
  it('renders square preview at requested size', () => {
    const mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      roundRect: vi.fn(),
      clip: vi.fn(),
      drawImage: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const source = document.createElement('canvas');
    source.width = 100;
    source.height = 80;
    const result = renderMaskablePreview(source, 192, 'circle');
    expect(result.width).toBe(192);
    expect(result.height).toBe(192);
  });
});

describe('drawMaskableOverlay', () => {
  it('draws safe zone and circle guides when enabled', () => {
    const ctx = {
      save: vi.fn(),
      restore: vi.fn(),
      strokeStyle: '',
      lineWidth: 0,
      setLineDash: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      stroke: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    drawMaskableOverlay(ctx, 192, true, true);
    expect(ctx.stroke).toHaveBeenCalledTimes(2);
  });
});
