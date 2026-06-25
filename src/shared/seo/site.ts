/** Production site URL (no trailing slash). Override via SITE_URL env at build time. */
export const SITE_URL =
  (typeof process !== 'undefined' && process.env?.SITE_URL) ||
  'https://dor-j.github.io/Img2Favicon';

export const SITE_NAME = 'Img2Favicon';

export const SITE_DESCRIPTION =
  'Free private browser image tools — favicon kit generator, resize, crop, convert, and more. Nothing leaves your device.';

export const DEFAULT_OG_IMAGE = '/og-image.png';

/** Builds an absolute URL from a site-relative path. */
export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
