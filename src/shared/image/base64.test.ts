import { describe, expect, it } from 'vitest';
import { estimateDataUrlBytes, formatByteSize } from './base64';

describe('formatByteSize', () => {
  it('formats bytes', () => {
    expect(formatByteSize(512)).toBe('512 B');
  });

  it('formats kilobytes', () => {
    expect(formatByteSize(2048)).toBe('2.0 KB');
  });

  it('formats megabytes', () => {
    expect(formatByteSize(2 * 1024 * 1024)).toBe('2.00 MB');
  });
});

describe('estimateDataUrlBytes', () => {
  it('estimates decoded size from base64 payload', () => {
    const dataUrl = 'data:image/png;base64,AAAA';
    expect(estimateDataUrlBytes(dataUrl)).toBeGreaterThan(0);
  });
});
