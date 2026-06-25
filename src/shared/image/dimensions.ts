export interface Size {
  width: number;
  height: number;
}

/** Computes output dimensions that fit within max width/height bounds. */
export function fitWithinBox(
  width: number,
  height: number,
  maxWidth: number | null,
  maxHeight: number | null,
  maintainAspect = true,
): Size {
  let outW = width;
  let outH = height;

  if (maxWidth !== null && outW > maxWidth) {
    outW = maxWidth;
    if (maintainAspect) outH = Math.round((height / width) * outW);
  }

  if (maxHeight !== null && outH > maxHeight) {
    outH = maxHeight;
    if (maintainAspect) outW = Math.round((width / height) * outH);
  }

  return {
    width: Math.max(1, Math.round(outW)),
    height: Math.max(1, Math.round(outH)),
  };
}

/** Computes bounding box size after rotation in degrees. */
export function expandForRotation(width: number, height: number, degrees: number): Size {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  return {
    width: Math.ceil(width * cos + height * sin),
    height: Math.ceil(width * sin + height * cos),
  };
}

/** Scales dimensions to fit within a max preview edge for UI display. */
export function scaleToFitPreview(
  width: number,
  height: number,
  maxPreview: number,
): Size {
  const scale = Math.min(1, maxPreview / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** Maps display coordinates to source image coordinates. */
export function displayToSourceRect(
  displayRect: { x: number; y: number; width: number; height: number },
  displaySize: Size,
  sourceSize: Size,
): { x: number; y: number; width: number; height: number } {
  const scaleX = sourceSize.width / displaySize.width;
  const scaleY = sourceSize.height / displaySize.height;

  return {
    x: Math.round(displayRect.x * scaleX),
    y: Math.round(displayRect.y * scaleY),
    width: Math.round(displayRect.width * scaleX),
    height: Math.round(displayRect.height * scaleY),
  };
}
