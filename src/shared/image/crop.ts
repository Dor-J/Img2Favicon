/** Crop rectangle in source pixel coordinates. */
export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Aspect ratio preset identifiers. */
export type CropRatio = 'free' | '1:1' | '16:9' | '4:3' | '3:2';

const RATIO_VALUES: Record<Exclude<CropRatio, 'free'>, number> = {
  '1:1': 1,
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '3:2': 3 / 2,
};

/** Returns a centered crop rect for the given aspect ratio. */
export function defaultCropRectForRatio(
  imgWidth: number,
  imgHeight: number,
  ratio: CropRatio,
): CropRect {
  if (ratio === 'free') {
    return { x: 0, y: 0, width: imgWidth, height: imgHeight };
  }

  const target = RATIO_VALUES[ratio];
  const imgRatio = imgWidth / imgHeight;
  let width = imgWidth;
  let height = imgHeight;

  if (imgRatio > target) {
    width = Math.round(imgHeight * target);
  } else {
    height = Math.round(imgWidth / target);
  }

  return {
    x: Math.round((imgWidth - width) / 2),
    y: Math.round((imgHeight - height) / 2),
    width,
    height,
  };
}

/** Crops a canvas region to a new canvas at native resolution. */
export function applyCrop(
  source: HTMLCanvasElement,
  rect: CropRect,
): HTMLCanvasElement {
  const clamped: CropRect = {
    x: Math.max(0, Math.min(rect.x, source.width - 1)),
    y: Math.max(0, Math.min(rect.y, source.height - 1)),
    width: Math.max(1, Math.min(rect.width, source.width - rect.x)),
    height: Math.max(1, Math.min(rect.height, source.height - rect.y)),
  };

  const canvas = document.createElement('canvas');
  canvas.width = clamped.width;
  canvas.height = clamped.height;
  const ctx = canvas.getContext('2d', { alpha: true })!;
  ctx.drawImage(
    source,
    clamped.x,
    clamped.y,
    clamped.width,
    clamped.height,
    0,
    0,
    clamped.width,
    clamped.height,
  );
  return canvas;
}

/** Clamps a crop rect to image bounds. */
export function clampCropRect(rect: CropRect, imgWidth: number, imgHeight: number): CropRect {
  const width = Math.max(1, Math.min(rect.width, imgWidth));
  const height = Math.max(1, Math.min(rect.height, imgHeight));
  return {
    x: Math.max(0, Math.min(rect.x, imgWidth - width)),
    y: Math.max(0, Math.min(rect.y, imgHeight - height)),
    width,
    height,
  };
}

/** Resizes a crop rect to match a new aspect ratio while keeping its center. */
export function cropRectForRatioAtCenter(
  imgWidth: number,
  imgHeight: number,
  ratio: CropRatio,
  centerX: number,
  centerY: number,
): CropRect {
  const base = defaultCropRectForRatio(imgWidth, imgHeight, ratio);
  const rect: CropRect = {
    x: Math.round(centerX - base.width / 2),
    y: Math.round(centerY - base.height / 2),
    width: base.width,
    height: base.height,
  };
  return clampCropRect(rect, imgWidth, imgHeight);
}
