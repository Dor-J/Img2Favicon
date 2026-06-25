/** PWA / Apple touch icon validation result item. */
export interface PwaIconCheckItem {
  filename: string;
  status: 'ok' | 'warn' | 'error';
  message: string;
}

const RECOMMENDED_SIZES = new Set([180, 192, 512, 1024]);

/** Validates PWA and Apple touch icon files. */
export function validatePwaIcons(
  files: { name: string; width: number; height: number }[],
): PwaIconCheckItem[] {
  const results: PwaIconCheckItem[] = [];

  if (!files.length) {
    return [{ filename: '—', status: 'error', message: 'No icon files uploaded.' }];
  }

  for (const file of files) {
    const name = file.name.toLowerCase().split('/').pop() ?? file.name.toLowerCase();

    if (file.width !== file.height) {
      results.push({
        filename: name,
        status: 'error',
        message: `Not square: ${file.width}×${file.height}. Icons must be 1:1.`,
      });
      continue;
    }

    const size = file.width;
    const isApple = name.includes('apple') || size === 180;
    const isMaskable = name.includes('maskable') || name.includes('512');

    if (isApple && size !== 180) {
      results.push({
        filename: name,
        status: 'warn',
        message: `Apple touch icons should be 180×180, got ${size}×${size}.`,
      });
    } else if (RECOMMENDED_SIZES.has(size)) {
      results.push({
        filename: name,
        status: 'ok',
        message: `Valid ${size}×${size}${isMaskable ? ' (maskable candidate)' : ''}.`,
      });
    } else if (size < 48) {
      results.push({
        filename: name,
        status: 'error',
        message: `${size}×${size} is too small for PWA icons.`,
      });
    } else {
      results.push({
        filename: name,
        status: 'warn',
        message: `${size}×${size} is non-standard. Prefer 192, 512, or 180.`,
      });
    }

    if (size >= 192) {
      results.push({
        filename: name,
        status: 'warn',
        message: 'Ensure important content stays inside the center 80% safe zone for maskable icons.',
      });
    }
  }

  const has180 = files.some((f) => f.width === 180 && f.height === 180);
  const has512 = files.some((f) => f.width === 512 && f.height === 512);
  if (!has180) {
    results.push({
      filename: 'apple-touch-icon',
      status: 'warn',
      message: 'Missing recommended 180×180 Apple touch icon.',
    });
  }
  if (!has512) {
    results.push({
      filename: 'maskable-512',
      status: 'warn',
      message: 'Missing recommended 512×512 maskable icon.',
    });
  }

  return results;
}
