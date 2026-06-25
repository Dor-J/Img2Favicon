export type WatermarkPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface WatermarkTextOptions {
  mode: 'text';
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  position: WatermarkPosition;
}

export interface WatermarkLogoOptions {
  mode: 'logo';
  logo: HTMLImageElement;
  scale: number;
  opacity: number;
  position: WatermarkPosition;
}

export type WatermarkOptions = WatermarkTextOptions | WatermarkLogoOptions;

/** Computes x/y anchor for a watermark within canvas bounds. */
export function watermarkAnchor(
  canvasWidth: number,
  canvasHeight: number,
  contentWidth: number,
  contentHeight: number,
  position: WatermarkPosition,
  padding = 16,
): { x: number; y: number } {
  const positions: Record<WatermarkPosition, { x: number; y: number }> = {
    'top-left': { x: padding, y: padding },
    'top-center': { x: (canvasWidth - contentWidth) / 2, y: padding },
    'top-right': { x: canvasWidth - contentWidth - padding, y: padding },
    'center-left': { x: padding, y: (canvasHeight - contentHeight) / 2 },
    center: { x: (canvasWidth - contentWidth) / 2, y: (canvasHeight - contentHeight) / 2 },
    'center-right': {
      x: canvasWidth - contentWidth - padding,
      y: (canvasHeight - contentHeight) / 2,
    },
    'bottom-left': { x: padding, y: canvasHeight - contentHeight - padding },
    'bottom-center': {
      x: (canvasWidth - contentWidth) / 2,
      y: canvasHeight - contentHeight - padding,
    },
    'bottom-right': {
      x: canvasWidth - contentWidth - padding,
      y: canvasHeight - contentHeight - padding,
    },
  };

  return positions[position];
}

/** Draws a watermark onto a canvas context. */
export function drawWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  options: WatermarkOptions,
): void {
  ctx.save();
  ctx.globalAlpha = options.opacity / 100;

  if (options.mode === 'text') {
    ctx.font = `700 ${options.fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
    ctx.fillStyle = options.color;
    const metrics = ctx.measureText(options.text);
    const anchor = watermarkAnchor(
      canvasWidth,
      canvasHeight,
      metrics.width,
      options.fontSize,
      options.position,
    );
    ctx.fillText(options.text, anchor.x, anchor.y + options.fontSize);
  } else {
    const width = options.logo.naturalWidth * options.scale;
    const height = options.logo.naturalHeight * options.scale;
    const anchor = watermarkAnchor(
      canvasWidth,
      canvasHeight,
      width,
      height,
      options.position,
    );
    ctx.drawImage(options.logo, anchor.x, anchor.y, width, height);
  }

  ctx.restore();
}
