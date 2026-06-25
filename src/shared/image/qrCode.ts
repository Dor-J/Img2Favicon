/** Minimum QR code canvas size in pixels. */
export const QR_MIN_SIZE = 128;

/** Normalizes QR output size to a usable pixel dimension. */
export function normalizeQrSize(size: number): number {
  return Math.max(QR_MIN_SIZE, size || 256);
}

/** Builds a download filename for a QR export. */
export function qrDownloadFilename(format: 'png' | 'svg'): string {
  return format === 'svg' ? 'qrcode.svg' : 'qrcode.png';
}

/** Default QR payload when the input is empty during preview. */
export function defaultQrPreviewText(): string {
  return 'https://example.com';
}
