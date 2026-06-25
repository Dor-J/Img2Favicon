import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { TOOL_PAGES } from '../seo/pages';

/**
 * Maps each registered tool to unit test files that cover its core logic.
 * Image tools delegate to shared modules; favicon uses tool-local lib tests.
 */
export const TOOL_TEST_FILES: Record<string, readonly string[]> = {
  favicon: [
    'src/tools/favicon/lib/color.test.ts',
    'src/tools/favicon/lib/export.test.ts',
    'src/tools/favicon/lib/state.test.ts',
    'src/tools/favicon/lib/imageValidation.test.ts',
  ],
  resize: [
    'src/shared/image/dimensions.test.ts',
    'src/shared/image/transform.test.ts',
    'src/shared/image/compress.test.ts',
  ],
  crop: ['src/shared/image/crop.test.ts'],
  convert: ['src/shared/image/encode.test.ts'],
  'remove-bg': ['src/shared/image/filters.test.ts'],
  rotate: ['src/shared/image/transform.test.ts', 'src/shared/image/dimensions.test.ts'],
  watermark: ['src/shared/image/watermark.test.ts'],
  blur: ['src/shared/image/filters.test.ts'],
  'strip-metadata': ['src/shared/image/encode.test.ts'],
  'og-image': ['src/shared/image/fitModes.test.ts', 'src/shared/web/ogPresets.test.ts'],
  'app-icon': ['src/shared/web/appIconKit.test.ts', 'src/shared/image/fitModes.test.ts'],
  placeholder: ['src/shared/image/placeholder.test.ts'],
  'qr-code': ['src/shared/image/qrCode.test.ts'],
  palette: ['src/shared/image/palette.test.ts', 'src/shared/image/color.test.ts'],
  padding: ['src/shared/image/padding.test.ts'],
  mask: ['src/shared/image/mask.test.ts', 'src/shared/image/shape.test.ts'],
  adjust: ['src/shared/image/adjust.test.ts'],
  combine: ['src/shared/image/combine.test.ts'],
  base64: ['src/shared/image/base64.test.ts'],
  'svg-to-png': ['src/shared/image/svgRasterize.test.ts'],
  'sprite-sheet': ['src/shared/image/spriteSheet.test.ts'],
  'favicon-checker': ['src/shared/web/faviconKit.test.ts'],
  'manifest-builder': ['src/shared/web/manifest.test.ts'],
  'html-snippet': ['src/shared/web/htmlSnippet.test.ts'],
  'metadata-viewer': ['src/shared/image/metadataFormat.test.ts'],
  'screenshot-sanitizer': ['src/shared/image/filters.test.ts'],
  compare: ['src/shared/image/dimensions.test.ts', 'src/shared/image/encode.test.ts'],
  'trim-alpha': ['src/shared/image/trimAlpha.test.ts'],
  'dataurl-decode': ['src/shared/image/dataUrlDecode.test.ts'],
  'bulk-resize': [
    'src/shared/image/dimensions.test.ts',
    'src/shared/image/transform.test.ts',
    'src/shared/image/compress.test.ts',
  ],
  'splash-screen': ['src/shared/web/splashScreen.test.ts', 'src/shared/image/fitModes.test.ts'],
  'maskable-preview': ['src/shared/image/maskablePreview.test.ts'],
  duotone: ['src/shared/image/duotone.test.ts'],
  'contrast-checker': ['src/shared/image/contrast.test.ts'],
  'social-card': ['src/shared/image/socialCard.test.ts'],
  'icon-checker': ['src/shared/web/pwaIconCheck.test.ts'],
  'file-inspector': ['src/shared/image/fileInspector.test.ts'],
  'css-filters': ['src/shared/image/cssFilters.test.ts'],
  'split-image': ['src/shared/image/splitSprite.test.ts'],
  'gif-maker': ['src/shared/image/gifEncode.test.ts'],
  'pdf-to-image': ['src/shared/image/pdfRasterize.test.ts'],
  'image-to-pdf': ['src/shared/image/imageToPdf.test.ts'],
  sharpen: ['src/shared/image/sharpen.test.ts'],
  'tile-preview': ['src/shared/image/tilePreview.test.ts'],
};

/** Returns tool ids whose mapped test files are missing on disk. */
export function getToolsWithMissingTests(root = process.cwd()): string[] {
  return TOOL_PAGES.filter((tool) => {
    const tests = TOOL_TEST_FILES[tool.id];
    if (!tests?.length) return true;
    return tests.some((file) => !existsSync(join(root, file)));
  }).map((tool) => tool.id);
}

/** Returns tool ids with no test mapping entry. */
export function getUnmappedTools(): string[] {
  return TOOL_PAGES.filter((tool) => !TOOL_TEST_FILES[tool.id]?.length).map((tool) => tool.id);
}
