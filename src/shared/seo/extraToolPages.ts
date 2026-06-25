import type { PageEntry } from './pages';

/** Additional tool pages added in the 18-tool suite expansion. */
export const EXTRA_TOOL_PAGES: PageEntry[] = [
  {
    id: 'og-image',
    path: 'tools/og-image/index.html',
    category: 'create',
    title: 'Open Graph image',
    description: 'Resize images to social sharing presets — 1200×630, 1200×600, and 1:1.',
    seoDescription:
      'Create Open Graph and social share images at 1200×630, 1200×600, or square. Free browser tool, no upload.',
    icon: 'share-2',
    keywords: ['open graph image', 'og image generator', 'social share image', '1200x630'],
    faq: [
      { question: 'What sizes are supported?', answer: '1200×630 (Facebook/LinkedIn), 1200×600, 1200×1200 square, and 1500×500 Twitter header.' },
      { question: 'Does this upload my image?', answer: 'No. All resizing happens locally in your browser.' },
    ],
    howItWorks: ['Upload an image.', 'Pick a social preset and fit mode.', 'Download the sized PNG or JPG.'],
  },
  {
    id: 'app-icon',
    path: 'tools/app-icon/index.html',
    category: 'create',
    title: 'App icon generator',
    description: 'Generate iOS and Android store icon sizes from one image.',
    seoDescription:
      'Generate iOS and Android app icon sizes (1024, 512, 192, etc.) from one image. ZIP download, runs in browser.',
    icon: 'smartphone',
    keywords: ['app icon generator', 'ios icon sizes', 'android icon', 'app store icon'],
    faq: [
      { question: 'What sizes are included?', answer: 'Standard iOS and Android sizes from 1024 down to 48px, packaged in a ZIP.' },
      { question: 'Is this the same as the favicon tool?', answer: 'Similar export pattern, but sized for app stores rather than browser tabs.' },
    ],
    howItWorks: ['Upload a square or high-res logo.', 'Choose cover or contain fit.', 'Download the ZIP icon kit.'],
  },
  {
    id: 'placeholder',
    path: 'tools/placeholder/index.html',
    category: 'create',
    title: 'Placeholder generator',
    description: 'Create labeled placeholder PNGs for mockups and wireframes.',
    seoDescription:
      'Generate placeholder PNG images with custom width, height, label, and color. Free browser tool for mockups.',
    icon: 'rectangle-horizontal',
    keywords: ['placeholder image', 'dummy image', 'mockup placeholder', 'wireframe image'],
    faq: [
      { question: 'Do I need to upload an image?', answer: 'No. Enter dimensions and optional label text to generate a PNG.' },
    ],
    howItWorks: ['Set width, height, and colors.', 'Optionally add a label.', 'Download the PNG.'],
  },
  {
    id: 'qr-code',
    path: 'tools/qr-code/index.html',
    category: 'create',
    title: 'QR code generator',
    description: 'Create QR codes as PNG or SVG from any URL or text.',
    seoDescription:
      'Generate QR codes as PNG or SVG from URL or text. Free, private, runs entirely in your browser.',
    icon: 'qr-code',
    keywords: ['qr code generator', 'qr code png', 'qr code svg', 'create qr code'],
    faq: [
      { question: 'What formats can I export?', answer: 'PNG raster or SVG vector.' },
      { question: 'Is data sent to a server?', answer: 'No. QR codes are generated locally.' },
    ],
    howItWorks: ['Enter a URL or text.', 'Set size and error correction.', 'Download PNG or SVG.'],
  },
  {
    id: 'palette',
    path: 'tools/palette/index.html',
    category: 'edit',
    title: 'Palette extractor',
    description: 'Extract dominant colors and copy hex or CSS variables.',
    seoDescription:
      'Extract dominant colors from any image. Copy hex values or CSS custom properties. Private browser tool.',
    icon: 'palette',
    keywords: ['color palette extractor', 'dominant colors', 'hex colors from image', 'css variables'],
    faq: [
      { question: 'How many colors are extracted?', answer: 'Up to 7 dominant colors, with similar shades deduplicated.' },
    ],
    howItWorks: ['Upload an image.', 'View the extracted swatches.', 'Copy hex list or CSS variables.'],
  },
  {
    id: 'padding',
    path: 'tools/padding/index.html',
    category: 'edit',
    title: 'Add padding & border',
    description: 'Add solid or transparent padding and optional borders before export.',
    seoDescription:
      'Add padding and borders to images with solid or transparent backgrounds. Free browser tool, no upload.',
    icon: 'square',
    keywords: ['add padding to image', 'image border', 'transparent padding', 'canvas padding'],
    faq: [
      { question: 'Can padding be transparent?', answer: 'Yes. Choose a transparent background for PNG export.' },
    ],
    howItWorks: ['Upload an image.', 'Set padding and optional border.', 'Download the result.'],
  },
  {
    id: 'mask',
    path: 'tools/mask/index.html',
    category: 'edit',
    title: 'Rounded corners & mask',
    description: 'Export with circle, rounded rect, or squircle masks.',
    seoDescription:
      'Apply circle, rounded rectangle, or squircle masks to images. Export PNG with transparency in browser.',
    icon: 'circle',
    keywords: ['rounded corners image', 'circle crop', 'squircle mask', 'round image corners'],
    faq: [
      { question: 'Which shapes are supported?', answer: 'Circle, rounded rectangle with adjustable radius, and squircle.' },
    ],
    howItWorks: ['Upload an image.', 'Pick a shape and adjust radius.', 'Download masked PNG.'],
  },
  {
    id: 'adjust',
    path: 'tools/adjust/index.html',
    category: 'edit',
    title: 'Adjust brightness & color',
    description: 'Tune brightness, contrast, and saturation with live preview.',
    seoDescription:
      'Adjust image brightness, contrast, and saturation online. Free private browser tool with live preview.',
    icon: 'sun-medium',
    keywords: ['brightness contrast', 'saturation adjust', 'image filters', 'photo adjust'],
    faq: [
      { question: 'Is this a full photo editor?', answer: 'No. It covers basic brightness, contrast, and saturation adjustments only.' },
    ],
    howItWorks: ['Upload an image.', 'Adjust sliders with live preview.', 'Download the adjusted image.'],
  },
  {
    id: 'combine',
    path: 'tools/combine/index.html',
    category: 'edit',
    title: 'Combine images',
    description: 'Create side-by-side, stacked, or grid collages from multiple images.',
    seoDescription:
      'Combine multiple images into a horizontal, vertical, or grid collage. Free browser tool, no upload.',
    icon: 'layout-grid',
    keywords: ['combine images', 'image collage', 'merge images', 'side by side images'],
    faq: [
      { question: 'How many images can I combine?', answer: 'Between 2 and 10 images per collage.' },
    ],
    howItWorks: ['Add 2 or more images.', 'Choose layout, gap, and background.', 'Download the combined image.'],
  },
  {
    id: 'base64',
    path: 'tools/base64/index.html',
    category: 'convert',
    title: 'Image to Base64',
    description: 'Encode images as data URLs for HTML, email, and CMS embeds.',
    seoDescription:
      'Convert images to Base64 data URLs for HTML and email. Free browser encoder, no upload.',
    icon: 'binary',
    keywords: ['image to base64', 'data url generator', 'base64 encoder', 'embed image html'],
    faq: [
      { question: 'What output format is used?', answer: 'A full data URL including the MIME type prefix, e.g. data:image/png;base64,...' },
    ],
    howItWorks: ['Upload an image.', 'View the data URL and size.', 'Copy to clipboard.'],
  },
  {
    id: 'svg-to-png',
    path: 'tools/svg-to-png/index.html',
    category: 'convert',
    title: 'SVG to PNG',
    description: 'Rasterize SVG files to PNG at any pixel size.',
    seoDescription:
      'Convert SVG to PNG at custom dimensions. Client-side rasterization, free and private.',
    icon: 'file-image',
    keywords: ['svg to png', 'rasterize svg', 'svg converter', 'svg export png'],
    faq: [
      { question: 'Can I choose the output size?', answer: 'Yes. Set width and height in pixels before export.' },
    ],
    howItWorks: ['Upload an SVG file.', 'Set output dimensions.', 'Download PNG.'],
  },
  {
    id: 'sprite-sheet',
    path: 'tools/sprite-sheet/index.html',
    category: 'convert',
    title: 'Sprite sheet builder',
    description: 'Pack animation frames into one PNG with optional CSS.',
    seoDescription:
      'Build sprite sheets from multiple frames with CSS background-position output. Free browser tool.',
    icon: 'grid-3x3',
    keywords: ['sprite sheet generator', 'css sprites', 'animation frames', 'sprite png'],
    faq: [
      { question: 'Does it generate CSS?', answer: 'Yes. Optional CSS rules with background-position for each frame.' },
    ],
    howItWorks: ['Upload ordered frame images.', 'Set grid columns and padding.', 'Download PNG and copy CSS.'],
  },
  {
    id: 'favicon-checker',
    path: 'tools/favicon-checker/index.html',
    category: 'web',
    title: 'Favicon checker',
    description: 'Validate your favicon kit — missing sizes, wrong dimensions, no manifest.',
    seoDescription:
      'Check favicon kits for missing files and wrong sizes. Read-only validation in your browser.',
    icon: 'list-checks',
    keywords: ['favicon checker', 'validate favicon', 'favicon audit', 'missing icon sizes'],
    faq: [
      { question: 'Does this generate missing icons?', answer: 'No. It reports issues only. Use the favicon generator to create a kit.' },
    ],
    howItWorks: ['Drop favicon files or a ZIP.', 'Review the validation report.', 'Fix any missing or wrong sizes.'],
  },
  {
    id: 'manifest-builder',
    path: 'tools/manifest-builder/index.html',
    category: 'web',
    title: 'Manifest builder',
    description: 'Build a site.webmanifest JSON file for your PWA icons.',
    seoDescription:
      'Build site.webmanifest JSON for PWA icons and theme colors. Free browser form tool.',
    icon: 'file-json',
    keywords: ['web manifest builder', 'site.webmanifest', 'pwa manifest', 'manifest json'],
    faq: [
      { question: 'Can I download the manifest?', answer: 'Yes. Copy or download site.webmanifest JSON.' },
    ],
    howItWorks: ['Fill in app name, colors, and icon paths.', 'Preview the JSON.', 'Copy or download.'],
  },
  {
    id: 'html-snippet',
    path: 'tools/html-snippet/index.html',
    category: 'web',
    title: 'HTML snippet generator',
    description: 'Generate favicon install tags when you already have the files.',
    seoDescription:
      'Generate HTML link tags for favicons, apple-touch-icon, and manifest. Copy-ready snippet.',
    icon: 'code-2',
    keywords: ['favicon html snippet', 'link rel icon', 'apple touch icon html', 'theme color meta'],
    faq: [
      { question: 'Do I need to upload icons?', answer: 'No. Enter paths and theme color to generate the HTML snippet.' },
    ],
    howItWorks: ['Set theme color and optional custom paths.', 'Preview the HTML snippet.', 'Copy to your site head.'],
  },
  {
    id: 'metadata-viewer',
    path: 'tools/metadata-viewer/index.html',
    category: 'privacy',
    title: 'Metadata viewer',
    description: 'Inspect EXIF and embedded metadata before you strip it.',
    seoDescription:
      'View EXIF and image metadata locally before sharing. Free private metadata inspector.',
    icon: 'info',
    keywords: ['exif viewer', 'image metadata viewer', 'photo exif data', 'metadata inspector'],
    faq: [
      { question: 'What metadata is shown?', answer: 'Camera EXIF, GPS (if present), timestamps, and other embedded tags.' },
    ],
    howItWorks: ['Upload an image.', 'View parsed metadata as JSON.', 'Copy or review before stripping.'],
  },
  {
    id: 'screenshot-sanitizer',
    path: 'tools/screenshot-sanitizer/index.html',
    category: 'privacy',
    title: 'Screenshot sanitizer',
    description: 'Strip metadata and blur sensitive regions in one workflow.',
    seoDescription:
      'Sanitize screenshots by stripping metadata and blurring sensitive areas. Private browser workflow.',
    icon: 'shield-check',
    keywords: ['sanitize screenshot', 'blur sensitive data', 'strip exif screenshot', 'redact screenshot'],
    faq: [
      { question: 'Does export remove metadata?', answer: 'Yes. Re-encoding removes EXIF and embedded metadata.' },
    ],
    howItWorks: ['Upload a screenshot.', 'Draw blur regions on sensitive areas.', 'Download sanitized image.'],
  },
  {
    id: 'compare',
    path: 'tools/compare/index.html',
    category: 'privacy',
    title: 'Compare before/after',
    description: 'Compare original vs compressed quality with a slider overlay.',
    seoDescription:
      'Compare original and compressed images side by side with a draggable slider. See file size savings.',
    icon: 'columns-2',
    keywords: ['compare image quality', 'before after image', 'compression compare', 'jpeg quality compare'],
    faq: [
      { question: 'What does the slider compare?', answer: 'Original vs a compressed version at the quality level you set.' },
    ],
    howItWorks: ['Upload an image.', 'Adjust quality and drag the compare slider.', 'See size savings in the meta line.'],
  },
];
