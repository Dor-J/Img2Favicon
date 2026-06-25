/** Expected favicon kit file specification. */
export interface FaviconKitSpec {
  filename: string;
  width: number;
  height: number;
  optional?: boolean;
}

/** Standard favicon kit files and expected dimensions. */
export const FAVICON_KIT_SPECS: FaviconKitSpec[] = [
  { filename: 'favicon.ico', width: 16, height: 16 },
  { filename: 'favicon.svg', width: 512, height: 512, optional: true },
  { filename: 'favicon-16x16.png', width: 16, height: 16 },
  { filename: 'favicon-32x32.png', width: 32, height: 32 },
  { filename: 'favicon-48x48.png', width: 48, height: 48, optional: true },
  { filename: 'apple-touch-icon.png', width: 180, height: 180 },
  { filename: 'android-chrome-192.png', width: 192, height: 192 },
  { filename: 'android-chrome-512.png', width: 512, height: 512 },
  { filename: 'site.webmanifest', width: 0, height: 0, optional: true },
];

export type FaviconCheckStatus = 'ok' | 'missing' | 'wrong-size' | 'extra';

/** Result of validating a single favicon kit file. */
export interface FaviconCheckItem {
  filename: string;
  status: FaviconCheckStatus;
  message: string;
  expected?: string;
  actual?: string;
}

/** Validates uploaded favicon files against the standard kit checklist. */
export function validateFaviconKit(
  files: { name: string; width: number; height: number }[],
): FaviconCheckItem[] {
  const results: FaviconCheckItem[] = [];
  const normalized = files.map((f) => ({
    ...f,
    name: f.name.toLowerCase().split('/').pop() ?? f.name.toLowerCase(),
  }));

  for (const spec of FAVICON_KIT_SPECS) {
    const match = normalized.find((f) => f.name === spec.filename.toLowerCase());

    if (!match) {
      if (!spec.optional) {
        results.push({
          filename: spec.filename,
          status: 'missing',
          message: `Missing required file`,
          expected: spec.width > 0 ? `${spec.width}×${spec.height}` : undefined,
        });
      }
      continue;
    }

    if (spec.width === 0) {
      results.push({
        filename: spec.filename,
        status: 'ok',
        message: 'Present',
      });
      continue;
    }

    if (match.width === spec.width && match.height === spec.height) {
      results.push({
        filename: spec.filename,
        status: 'ok',
        message: 'Correct size',
        expected: `${spec.width}×${spec.height}`,
        actual: `${match.width}×${match.height}`,
      });
    } else {
      results.push({
        filename: spec.filename,
        status: 'wrong-size',
        message: `Expected ${spec.width}×${spec.height}, got ${match.width}×${match.height}`,
        expected: `${spec.width}×${spec.height}`,
        actual: `${match.width}×${match.height}`,
      });
    }
  }

  const knownNames = new Set(FAVICON_KIT_SPECS.map((s) => s.filename.toLowerCase()));
  for (const file of normalized) {
    if (!knownNames.has(file.name)) {
      results.push({
        filename: file.name,
        status: 'extra',
        message: 'Unexpected file in kit',
        actual: file.width > 0 ? `${file.width}×${file.height}` : undefined,
      });
    }
  }

  return results;
}
