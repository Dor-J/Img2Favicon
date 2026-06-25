/** Accepted input MIME types for image tools. */
export const ACCEPTED_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);

export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 32_000_000;
export const MAX_IMAGE_EDGE = 8_192;

/** Supported output image formats. */
export type OutputFormat = 'png' | 'jpeg' | 'webp' | 'avif';

/** MIME type map for output formats. */
export const FORMAT_MIME: Record<OutputFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
};

/** File extension map for output formats. */
export const FORMAT_EXT: Record<OutputFormat, string> = {
  png: 'png',
  jpeg: 'jpg',
  webp: 'webp',
  avif: 'avif',
};
