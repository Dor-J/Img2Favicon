import { describe, expect, it } from 'vitest';
import { extensionForFormat, formatFileSize } from './encode';

describe('extensionForFormat', () => {
  it('returns file extensions for supported formats', () => {
    expect(extensionForFormat('png')).toBe('png');
    expect(extensionForFormat('jpeg')).toBe('jpg');
    expect(extensionForFormat('webp')).toBe('webp');
    expect(extensionForFormat('avif')).toBe('avif');
  });
});

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(512)).toBe('512 B');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(2048)).toBe('2.0 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(2 * 1024 * 1024)).toBe('2.00 MB');
  });
});
