import { describe, expect, it, vi } from 'vitest';
import { APP_ICON_SIZES, appIconToBlob, createAppIconCanvas } from './appIconKit';

vi.mock('../image/encode', () => ({
  canvasToBlob: vi.fn(async () => new Blob(['png'], { type: 'image/png' })),
}));

describe('APP_ICON_SIZES', () => {
  it('includes standard store icon sizes', () => {
    expect(APP_ICON_SIZES[0]).toEqual([1024, 'icon-1024.png']);
    expect(APP_ICON_SIZES.some(([size]) => size === 192)).toBe(true);
  });
});

describe('createAppIconCanvas', () => {
  it('creates square icon canvas', () => {
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
    source.width = 200;
    source.height = 200;
    const result = createAppIconCanvas(source, 512, 'contain', '#ffffff');
    expect(result.width).toBe(512);
    expect(result.height).toBe(512);
  });
});

describe('appIconToBlob', () => {
  it('returns encoded PNG blob', async () => {
    const canvas = document.createElement('canvas');
    const blob = await appIconToBlob(canvas);
    expect(blob.type).toBe('image/png');
  });
});
