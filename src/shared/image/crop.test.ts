import { describe, expect, it, vi } from 'vitest';
import {
  applyCrop,
  clampCropRect,
  defaultCropRectForRatio,
} from './crop';

describe('defaultCropRectForRatio', () => {
  it('returns full image for free ratio', () => {
    expect(defaultCropRectForRatio(800, 600, 'free')).toEqual({
      x: 0,
      y: 0,
      width: 800,
      height: 600,
    });
  });

  it('centers a 1:1 crop on a landscape image', () => {
    expect(defaultCropRectForRatio(800, 600, '1:1')).toEqual({
      x: 100,
      y: 0,
      width: 600,
      height: 600,
    });
  });
});

describe('clampCropRect', () => {
  it('keeps crop rect within image bounds', () => {
    expect(clampCropRect({ x: -10, y: 500, width: 900, height: 200 }, 800, 600)).toEqual({
      x: 0,
      y: 400,
      width: 800,
      height: 200,
    });
  });
});

describe('applyCrop', () => {
  it('returns a canvas with cropped dimensions', () => {
    const mockCtx = { drawImage: vi.fn() };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const source = document.createElement('canvas');
    source.width = 100;
    source.height = 80;
    const cropped = applyCrop(source, { x: 10, y: 10, width: 40, height: 30 });
    expect(cropped.width).toBe(40);
    expect(cropped.height).toBe(30);
    expect(mockCtx.drawImage).toHaveBeenCalled();
  });
});
