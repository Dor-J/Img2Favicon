/** Options for generating favicon HTML install tags. */
export interface HtmlSnippetOptions {
  themeColor: string;
  faviconIco?: string;
  faviconSvg?: string;
  favicon32?: string;
  appleTouchIcon?: string;
  manifest?: string;
}

/** Builds HTML link tags for favicon installation. */
export function buildInstallationSnippet(options: HtmlSnippetOptions | string): string {
  const opts: HtmlSnippetOptions =
    typeof options === 'string' ? { themeColor: options } : options;

  const ico = opts.faviconIco ?? '/favicon.ico';
  const svg = opts.faviconSvg ?? '/favicon.svg';
  const png32 = opts.favicon32 ?? '/favicon-32x32.png';
  const apple = opts.appleTouchIcon ?? '/apple-touch-icon.png';
  const manifest = opts.manifest ?? '/site.webmanifest';

  return `<!-- Place these files in your public root -->
<link rel="icon" href="${ico}" sizes="any">
<link rel="icon" type="image/svg+xml" href="${svg}">
<link rel="icon" type="image/png" sizes="32x32" href="${png32}">
<link rel="apple-touch-icon" sizes="180x180" href="${apple}">
<link rel="manifest" href="${manifest}">
<meta name="theme-color" content="${opts.themeColor}">`;
}
