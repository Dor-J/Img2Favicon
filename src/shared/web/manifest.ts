/** Options for building a web app manifest JSON document. */
export interface ManifestOptions {
  name: string;
  shortName: string;
  themeColor: string;
  backgroundColor: string;
  display: string;
  icon192: string;
  icon512: string;
}

/** Serializes a PWA manifest JSON string. */
export function buildManifestJson(options: ManifestOptions): string {
  return (
    JSON.stringify(
      {
        name: options.name,
        short_name: options.shortName,
        icons: [
          {
            src: options.icon192,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: options.icon512,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        theme_color: options.themeColor,
        background_color: options.backgroundColor,
        display: options.display,
      },
      null,
      2,
    ) + '\n'
  );
}

/** Builds manifest JSON from theme color for favicon kit compatibility. */
export function buildFaviconManifestText(themeColor: string, backgroundColor?: string): string {
  return buildManifestJson({
    name: 'Your Website',
    shortName: 'Website',
    themeColor,
    backgroundColor: backgroundColor ?? '#ffffff',
    display: 'standalone',
    icon192: '/android-chrome-192.png',
    icon512: '/android-chrome-512.png',
  });
}
