import { describe, expect, it } from 'vitest';
import { hasAllowedImageSignature, isImageWithinLimits } from './validation';

describe('hasAllowedImageSignature', () => {
  it('detects PNG signature', () => {
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(hasAllowedImageSignature(png)).toBe(true);
  });

  it('detects JPEG signature', () => {
    const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0x00]);
    expect(hasAllowedImageSignature(jpeg)).toBe(true);
  });

  it('rejects unknown signature', () => {
    expect(hasAllowedImageSignature(new Uint8Array([0, 1, 2, 3]))).toBe(false);
  });
});

describe('isImageWithinLimits', () => {
  it('accepts dimensions within limits', () => {
    expect(isImageWithinLimits(1000, 800, 8192, 32_000_000)).toBe(true);
  });

  it('rejects oversized edge', () => {
    expect(isImageWithinLimits(9000, 100, 8192, 32_000_000)).toBe(false);
  });

  it('rejects too many pixels', () => {
    expect(isImageWithinLimits(6000, 6000, 8192, 32_000_000)).toBe(false);
  });
});
