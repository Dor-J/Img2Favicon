import { describe, expect, it } from 'vitest';
import { parseDataUrl } from './dataUrlDecode';

describe('parseDataUrl', () => {
  it('parses a base64 data URL', () => {
    const { mime } = parseDataUrl('data:image/png;base64,AAAA');
    expect(mime).toBe('image/png');
  });

  it('parses raw base64 as png', () => {
    const { mime } = parseDataUrl('AAAA');
    expect(mime).toBe('image/png');
  });
});
