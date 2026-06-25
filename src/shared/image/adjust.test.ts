import { describe, expect, it, vi } from 'vitest';
import { applyAdjustments, buildAdjustFilter } from './adjust';

describe('buildAdjustFilter', () => {
  it('builds css filter from adjustment values', () => {
    expect(buildAdjustFilter({ brightness: 10, contrast: 0, saturation: 0 })).toBe(
      'brightness(110%) contrast(100%) saturate(100%)',
    );
  });
});

describe('applyAdjustments', () => {
  it('returns a canvas with same dimensions', () => {
    const mockCtx = { filter: '', drawImage: vi.fn() };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const source = document.createElement('canvas');
    source.width = 10;
    source.height = 10;
    const result = applyAdjustments(source, { brightness: 10, contrast: 0, saturation: 0 });
    expect(result.width).toBe(10);
    expect(result.height).toBe(10);
  });
});
