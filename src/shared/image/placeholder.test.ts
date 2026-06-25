import { describe, expect, it, vi } from 'vitest';
import {
  normalizePlaceholderSize,
  placeholderFilename,
  renderPlaceholderCanvas,
} from './placeholder';

describe('normalizePlaceholderSize', () => {
  it('clamps invalid dimensions to defaults', () => {
    expect(normalizePlaceholderSize(0, 0)).toEqual({ width: 400, height: 300 });
  });

  it('preserves valid dimensions', () => {
    expect(normalizePlaceholderSize(800, 600)).toEqual({ width: 800, height: 600 });
  });
});

describe('placeholderFilename', () => {
  it('includes dimensions in filename', () => {
    expect(placeholderFilename(400, 300)).toBe('placeholder-400x300.png');
  });
});

describe('renderPlaceholderCanvas', () => {
  it('creates a canvas with requested dimensions', () => {
    const fillRect = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillStyle: '',
      font: '',
      textAlign: 'center',
      textBaseline: 'middle',
      fillRect,
      fillText: vi.fn(),
    } as unknown as CanvasRenderingContext2D);

    const canvas = renderPlaceholderCanvas({
      width: 200,
      height: 100,
      backgroundColor: '#ff0000',
      textColor: '#ffffff',
      label: 'Test',
    });
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(100);
    expect(fillRect).toHaveBeenCalled();
  });
});
