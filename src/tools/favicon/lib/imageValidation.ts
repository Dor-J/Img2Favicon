/**
 * Validates image file magic bytes against supported formats.
 * @param header - First bytes of the uploaded file.
 */
export function hasAllowedImageSignature(header: Uint8Array): boolean {
  const isPng =
    header.length >= 8 &&
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (byte, index) => header[index] === byte,
    );
  const isJpeg =
    header.length >= 3 &&
    header[0] === 0xff &&
    header[1] === 0xd8 &&
    header[2] === 0xff;
  const gifHeader = String.fromCharCode(...header.slice(0, 6));
  const isGif =
    header.length >= 6 && (gifHeader === 'GIF87a' || gifHeader === 'GIF89a');
  const isWebp =
    header.length >= 12 &&
    String.fromCharCode(...header.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...header.slice(8, 12)) === 'WEBP';

  return isPng || isJpeg || isGif || isWebp;
}

/** Reads the file header and checks whether it matches a supported image type. */
export async function verifyImageFileSignature(file: File): Promise<boolean> {
  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  return hasAllowedImageSignature(header);
}

/** Returns true when decoded image dimensions are within supported limits. */
export function isImageWithinLimits(
  width: number,
  height: number,
  maxEdge: number,
  maxPixels: number,
): boolean {
  return width <= maxEdge && height <= maxEdge && width * height <= maxPixels;
}
