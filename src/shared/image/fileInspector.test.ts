import { describe, expect, it, vi } from 'vitest';
import {
  buildFileInspectResult,
  detectAlphaChannel,
  formatAspectRatio,
  formatInspectText,
} from './fileInspector';

describe('formatAspectRatio', () => {
  it('returns 1:1 for square images', () => {
    expect(formatAspectRatio(100, 100)).toBe('1:1');
  });

  it('simplifies landscape ratios', () => {
    expect(formatAspectRatio(1920, 1080)).toBe('16:9');
  });
});

describe('detectAlphaChannel', () => {
  it('detects transparency in canvas pixels', () => {
    const data = new Uint8ClampedArray(16);
    data[3] = 128;
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      getImageData: vi.fn(() => ({ data })),
    } as unknown as CanvasRenderingContext2D);

    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    expect(detectAlphaChannel(canvas)).toBe(true);
  });

  it('returns false for opaque canvas', () => {
    const data = new Uint8ClampedArray(16).fill(255);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      getImageData: vi.fn(() => ({ data })),
    } as unknown as CanvasRenderingContext2D);

    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    expect(detectAlphaChannel(canvas)).toBe(false);
  });
});

describe('buildFileInspectResult', () => {
  it('builds inspection stats from file metadata', () => {
    const file = new File(['x'], 'photo.png', { type: 'image/png' });
    const result = buildFileInspectResult(file, 800, 600, false);
    expect(result.name).toBe('photo.png');
    expect(result.orientation).toBe('landscape');
    expect(result.aspectRatio).toBe('4:3');
  });
});

describe('formatInspectText', () => {
  it('includes key fields in output', () => {
    const file = new File(['x'], 'photo.png', { type: 'image/png' });
    const text = formatInspectText(buildFileInspectResult(file, 100, 100, true));
    expect(text).toContain('photo.png');
    expect(text).toContain('Alpha channel: yes');
  });
});
