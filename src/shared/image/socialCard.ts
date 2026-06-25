/** Supported social card preview platforms. */
export type SocialPlatform = 'twitter' | 'linkedin' | 'slack';

/** Layout options for a social link preview card. */
export interface SocialCardOptions {
  platform: SocialPlatform;
  title: string;
  description: string;
  domain: string;
  width?: number;
  height?: number;
}

export const SOCIAL_CARD_DEFAULTS = { width: 600, height: 340 } as const;

/** Returns the card background color for a platform. */
export function getSocialCardBackground(platform: SocialPlatform): string {
  if (platform === 'linkedin') return '#ffffff';
  if (platform === 'slack') return '#1a1d21';
  return '#15202b';
}

/** Returns the image placeholder strip color when no image is loaded. */
export function getSocialCardImagePlaceholder(platform: SocialPlatform): string {
  return platform === 'linkedin' ? '#eef3f8' : '#38444d';
}

/** Image strip height varies slightly by platform. */
export function getSocialCardImageHeight(platform: SocialPlatform): number {
  return platform === 'twitter' ? 200 : 180;
}

/** Truncates description text for card preview. */
export function truncateSocialDescription(description: string, maxLength = 80): string {
  return description.slice(0, maxLength);
}

/** Builds the download filename for a social card PNG. */
export function socialCardFilename(platform: SocialPlatform): string {
  return `social-card-${platform}.png`;
}

/** Renders a social link preview card canvas. */
export function renderSocialCardCanvas(
  options: SocialCardOptions,
  image: CanvasImageSource | null = null,
): HTMLCanvasElement {
  const width = options.width ?? SOCIAL_CARD_DEFAULTS.width;
  const height = options.height ?? SOCIAL_CARD_DEFAULTS.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = getSocialCardBackground(options.platform);
  ctx.fillRect(0, 0, width, height);

  const imgH = getSocialCardImageHeight(options.platform);
  if (image) {
    ctx.drawImage(image, 0, 0, width, imgH);
  } else {
    ctx.fillStyle = getSocialCardImagePlaceholder(options.platform);
    ctx.fillRect(0, 0, width, imgH);
  }

  const textY = imgH + 20;
  ctx.fillStyle = options.platform === 'linkedin' ? '#000000' : '#ffffff';
  ctx.font = 'bold 16px Inter, sans-serif';
  ctx.fillText(options.title || 'Page title', 16, textY);
  ctx.font = '13px Inter, sans-serif';
  ctx.fillStyle = options.platform === 'linkedin' ? '#666' : '#8899a6';
  ctx.fillText(truncateSocialDescription(options.description || 'Description preview text…'), 16, textY + 24);
  ctx.fillText(options.domain || 'example.com', 16, textY + 48);

  return canvas;
}
