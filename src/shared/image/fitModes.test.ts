import { describe, expect, it, vi } from 'vitest';
import { drawFittedImage, fitImageToCanvas } from './fitModes';

describe('fitImageToCanvas', () => {
  it('creates canvas at target dimensions', () => {
    const mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
      fillStyle: '',
      fillRect: vi.fn(),
      drawImage: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const source = document.createElement('canvas');
    source.width = 400;
    source.height = 200;
    const result = fitImageToCanvas(source, 1200, 630, 'cover');
    expect(result.width).toBe(1200);
    expect(result.height).toBe(630);
  });

  it('fills background for contain mode', () => {
    const mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
      fillStyle: '',
      fillRect: vi.fn(),
      drawImage: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const source = document.createElement('canvas');
    source.width = 100;
    source.height = 100;
    fitImageToCanvas(source, 200, 200, 'contain', '#ffffff');
    expect(mockCtx.fillRect).toHaveBeenCalled();
  });
});

describe('drawFittedImage', () => {
  it('centers contained image', () => {
    const drawImage = vi.fn();
    const fillRect = vi.fn();
    const ctx = {
      fillStyle: '',
      fillRect,
      drawImage,
    } as unknown as CanvasRenderingContext2D;

    const source = document.createElement('canvas');
    source.width = 200;
    source.height = 100;
    drawFittedImage(ctx, source, 200, 100, 100, 100, 'contain', '#000');
    expect(fillRect).toHaveBeenCalled();
    expect(drawImage).toHaveBeenCalled();
  });
});
