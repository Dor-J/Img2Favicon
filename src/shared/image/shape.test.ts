import { describe, expect, it, vi } from 'vitest';
import { drawShapePath } from './shape';

describe('drawShapePath', () => {
  it('draws a circle path', () => {
    const ctx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      rect: vi.fn(),
      roundRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    drawShapePath(ctx, 100, 'circle');
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.arc).toHaveBeenCalled();
  });

  it('draws a square path', () => {
    const ctx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      rect: vi.fn(),
      roundRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    drawShapePath(ctx, 64, 'square');
    expect(ctx.rect).toHaveBeenCalledWith(0, 0, 64, 64);
  });
});
