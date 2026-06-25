/** Parses a data URL or raw Base64 string into a Blob. */
export function parseDataUrl(input: string): { blob: Blob; mime: string } {
  const trimmed = input.trim();

  if (trimmed.startsWith('data:')) {
    const match = /^data:([^;,]+)?(?:;base64)?,(.*)$/s.exec(trimmed);
    if (!match) throw new Error('Invalid data URL format.');
    const mime = match[1] || 'application/octet-stream';
    const payload = match[2]!;
    if (trimmed.includes(';base64')) {
      return { blob: base64ToBlob(payload, mime), mime };
    }
    return { blob: new Blob([decodeURIComponent(payload)], { type: mime }), mime };
  }

  return { blob: base64ToBlob(trimmed.replace(/\s/g, ''), 'image/png'), mime: 'image/png' };
}

/** Decodes a data URL string to an HTMLImageElement. */
export function dataUrlToImage(input: string): Promise<HTMLImageElement> {
  const { blob } = parseDataUrl(input);
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not decode image from data URL.'));
    };
    img.src = url;
  });
}

function base64ToBlob(base64: string, mime: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)!;
  return new Blob([bytes], { type: mime });
}
