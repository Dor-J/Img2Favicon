import { describe, expect, it } from 'vitest';
import { hasAllowedImageSignature, isImageWithinLimits } from './imageValidation';

const PNG_HEADER = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00,
]);

const JPEG_HEADER = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);

const GIF_HEADER = new Uint8Array([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61,
]);

const WEBP_HEADER = new Uint8Array([
  0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
]);

describe('hasAllowedImageSignature', () => {
  it('accepts PNG magic bytes', () => {
    expect(hasAllowedImageSignature(PNG_HEADER)).toBe(true);
  });

  it('accepts JPEG magic bytes', () => {
    expect(hasAllowedImageSignature(JPEG_HEADER)).toBe(true);
  });

  it('accepts GIF magic bytes', () => {
    expect(hasAllowedImageSignature(GIF_HEADER)).toBe(true);
  });

  it('accepts WebP magic bytes', () => {
    expect(hasAllowedImageSignature(WEBP_HEADER)).toBe(true);
  });

  it('rejects unknown file headers', () => {
    expect(hasAllowedImageSignature(new Uint8Array([0, 1, 2, 3]))).toBe(false);
  });
});

describe('isImageWithinLimits', () => {
  it('accepts images within edge and pixel limits', () => {
    expect(isImageWithinLimits(1024, 1024, 8192, 32_000_000)).toBe(true);
  });

  it('rejects images that exceed the max edge', () => {
    expect(isImageWithinLimits(9000, 1000, 8192, 32_000_000)).toBe(false);
  });

  it('rejects images that exceed the max pixel count', () => {
    expect(isImageWithinLimits(6000, 6000, 8192, 32_000_000)).toBe(false);
  });
});
