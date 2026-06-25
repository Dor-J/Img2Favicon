import { describe, expect, it, vi } from 'vitest';
import { compressToTargetSize } from './compress';

vi.mock('./encode', () => ({
  canvasToBlob: vi.fn(async (_canvas: HTMLCanvasElement, _mime: string, quality?: number) => {
    const size = quality ? Math.round(quality * 10000) : 5000;
    return new Blob([new Uint8Array(size)], { type: _mime });
  }),
}));

describe('compressToTargetSize', () => {
  it('returns png blob without quality search', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const result = await compressToTargetSize(canvas, 'png', 10000);
    expect(result.quality).toBe(1);
    expect(result.blob).toBeInstanceOf(Blob);
  });

  it('binary-searches jpeg quality toward target size', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const result = await compressToTargetSize(canvas, 'jpeg', 7000);
    expect(result.quality).toBeGreaterThan(0);
    expect(result.quality).toBeLessThanOrEqual(1);
  });
});
