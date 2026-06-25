import JSZip from 'jszip';
import type { AppState } from './types';
import { PNG_EXPORT_SPECS } from './constants';
import {
  buildBrowserConfigText,
  buildInstallationSnippet,
  buildManifestText,
  downloadBlob,
  downloadPng,
  generateIcoBlob,
  generateSvgBlob,
} from './export';
import { getPngArrayBuffer } from './render';

/** Builds and downloads a complete favicon kit ZIP archive. */
export async function buildKitZip(state: AppState): Promise<void> {
  const zip = new JSZip();
  const pngFiles = await Promise.all(
    PNG_EXPORT_SPECS.map(async ([size, name]) => [
      name,
      await getPngArrayBuffer(size, state),
    ] as const),
  );

  pngFiles.forEach(([name, bytes]) => zip.file(name, bytes));
  zip.file('favicon.ico', await generateIcoBlob(state));
  zip.file('favicon.svg', await generateSvgBlob(state));
  zip.file('site.webmanifest', buildManifestText(state));
  zip.file('browserconfig.xml', buildBrowserConfigText(state.colorOne));
  zip.file('favicon-installation.html', buildInstallationSnippet(state.colorOne));
  zip.file(
    'README.txt',
    'Place the included files in your public website root, then paste the contents of favicon-installation.html into your <head>.\n',
  );

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  await downloadBlob(blob, 'favicon-kit.zip');
}

/** Maps export button keys to download handlers. */
export async function exportSingleAsset(
  type: string,
  state: AppState,
): Promise<boolean> {
  const handlers: Record<string, () => Promise<void>> = {
    'png-16': () => downloadPng(16, 'favicon-16x16.png', state),
    'png-32': () => downloadPng(32, 'favicon-32x32.png', state),
    'png-180': () => downloadPng(180, 'apple-touch-icon.png', state),
    'png-192': () => downloadPng(192, 'android-chrome-192.png', state),
    ico: async () => downloadBlob(await generateIcoBlob(state), 'favicon.ico'),
    svg: async () => downloadBlob(await generateSvgBlob(state), 'favicon.svg'),
    manifest: async () =>
      downloadBlob(
        new Blob([buildManifestText(state)], { type: 'application/manifest+json' }),
        'site.webmanifest',
      ),
  };

  const handler = handlers[type];
  if (!handler) return false;

  await handler();
  return true;
}
