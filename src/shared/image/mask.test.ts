import { describe, expect, it, vi } from 'vitest';
import { applyShapeMask, applyShapeMaskInPlace } from './mask';

describe('applyShapeMask', () => {
  it('returns square canvas for circle mask', () => {
    const mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      clip: vi.fn(),
      drawImage: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      rect: vi.fn(),
      roundRect: vi.fn(),
      lineTo: vi.fn(),
      moveTo: vi.fn(),
      closePath: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const source = document.createElement('canvas');
    source.width = 80;
    source.height = 60;
    const result = applyShapeMask(source, { shape: 'circle' });
    expect(result.width).toBe(80);
    expect(result.height).toBe(80);
  });
});

describe('applyShapeMaskInPlace', () => {
  it('keeps source dimensions', () => {
    const mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      clip: vi.fn(),
      drawImage: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      rect: vi.fn(),
      roundRect: vi.fn(),
      lineTo: vi.fn(),
      moveTo: vi.fn(),
      closePath: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const source = document.createElement('canvas');
    source.width = 100;
    source.height = 100;
    const result = applyShapeMaskInPlace(source, { shape: 'square' });
    expect(result.width).toBe(100);
    expect(result.height).toBe(100);
  });
});
