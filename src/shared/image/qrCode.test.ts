import { describe, expect, it } from 'vitest';
import {
  defaultQrPreviewText,
  normalizeQrSize,
  qrDownloadFilename,
  QR_MIN_SIZE,
} from './qrCode';

describe('qrCode helpers', () => {
  it('enforces minimum QR size', () => {
    expect(normalizeQrSize(64)).toBe(QR_MIN_SIZE);
    expect(normalizeQrSize(512)).toBe(512);
  });

  it('defaults invalid size to 256', () => {
    expect(normalizeQrSize(0)).toBe(256);
  });

  it('builds download filenames by format', () => {
    expect(qrDownloadFilename('png')).toBe('qrcode.png');
    expect(qrDownloadFilename('svg')).toBe('qrcode.svg');
  });

  it('provides default preview text', () => {
    expect(defaultQrPreviewText()).toContain('https://');
  });
});
