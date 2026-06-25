/** Master canvas resolution used for all favicon exports. */
export const MASTER_SIZE = 512;

export const ACCEPTED_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);

export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 32_000_000;
export const MAX_IMAGE_EDGE = 8_192;

export const ICO_SIZES = [16, 32, 48] as const;

export const PNG_EXPORT_SPECS = [
  [16, 'favicon-16x16.png'],
  [32, 'favicon-32x32.png'],
  [48, 'favicon-48x48.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'android-chrome-192.png'],
  [512, 'android-chrome-512.png'],
  [150, 'mstile-150x150.png'],
] as const;
