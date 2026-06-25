import type { PageEntry } from './pages';

/** Tool pages added in the second expansion batch (17 tools). */
export const BATCH2_TOOL_PAGES: PageEntry[] = [
  {
    id: 'trim-alpha',
    path: 'tools/trim-alpha/index.html',
    category: 'edit',
    title: 'Trim transparent pixels',
    description: 'Auto-crop invisible padding around logos and icons.',
    seoDescription:
      'Trim transparent pixels from PNG images automatically. Free browser tool for icons and logos — no upload.',
    icon: 'scan',
    keywords: ['trim transparent', 'crop alpha', 'remove padding png', 'autocrop transparency'],
    faq: [
      { question: 'What images work best?', answer: 'PNG or WebP images with transparent backgrounds, such as logos and icons.' },
    ],
    howItWorks: ['Upload a PNG with transparency.', 'Preview the trimmed result.', 'Download the cropped image.'],
  },
  {
    id: 'dataurl-decode',
    path: 'tools/dataurl-decode/index.html',
    category: 'convert',
    title: 'Data URL to image',
    description: 'Decode a Base64 data URL back into a downloadable image file.',
    seoDescription:
      'Convert Base64 data URLs to PNG or JPG images locally in your browser. Free decoder, no upload.',
    icon: 'file-down',
    keywords: ['data url to image', 'base64 decode', 'decode data uri', 'base64 to png'],
    faq: [
      { question: 'Do I need the data: prefix?', answer: 'Either works — paste the full data URL or raw Base64 payload.' },
    ],
    howItWorks: ['Paste a data URL or Base64 string.', 'Preview the decoded image.', 'Download as PNG or JPG.'],
  },
  {
    id: 'bulk-resize',
    path: 'tools/bulk-resize/index.html',
    category: 'edit',
    title: 'Bulk resize & compress',
    description: 'Resize or compress many images at once into a ZIP download.',
    seoDescription:
      'Bulk resize and compress multiple images to a ZIP file in your browser. Free, private batch processing.',
    icon: 'files',
    keywords: ['bulk resize', 'batch compress', 'resize multiple images', 'zip images'],
    faq: [
      { question: 'How many files can I process?', answer: 'Up to 20 images per batch, each under 20 MB.' },
    ],
    howItWorks: ['Add multiple images.', 'Set max dimensions and quality.', 'Download the ZIP archive.'],
  },
  {
    id: 'splash-screen',
    path: 'tools/splash-screen/index.html',
    category: 'create',
    title: 'Splash screen generator',
    description: 'Generate iOS and PWA splash screen sizes from one image.',
    seoDescription:
      'Generate iOS and PWA splash screen PNG sizes from one image. ZIP download, runs in your browser.',
    icon: 'monitor-smartphone',
    keywords: ['splash screen generator', 'pwa splash', 'ios splash screen', 'startup image'],
    faq: [
      { question: 'What sizes are included?', answer: 'Common iOS and PWA splash dimensions for phones and tablets.' },
    ],
    howItWorks: ['Upload a splash or brand image.', 'Choose fit mode and background.', 'Download the ZIP kit.'],
  },
  {
    id: 'maskable-preview',
    path: 'tools/maskable-preview/index.html',
    category: 'web',
    title: 'Maskable icon preview',
    description: 'Preview how icons look inside Android maskable and circular crops.',
    seoDescription:
      'Preview maskable and circular icon crops with Android safe-zone overlay. Free browser tool for PWA icons.',
    icon: 'circle-dot',
    keywords: ['maskable icon', 'pwa icon preview', 'android adaptive icon', 'safe zone'],
    faq: [
      { question: 'What is the safe zone?', answer: 'The inner 80% circle where important content should stay visible under Android masks.' },
    ],
    howItWorks: ['Upload a square icon.', 'Toggle maskable and circle previews.', 'Download preview PNGs.'],
  },
  {
    id: 'duotone',
    path: 'tools/duotone/index.html',
    category: 'edit',
    title: 'Grayscale & duotone',
    description: 'Convert images to black and white or a two-color duotone effect.',
    seoDescription:
      'Apply grayscale or duotone effects to images in your browser. Free creative filter tool, no upload.',
    icon: 'contrast',
    keywords: ['duotone image', 'grayscale converter', 'two color effect', 'black and white photo'],
    faq: [
      { question: 'Can I pick custom duotone colors?', answer: 'Yes. Choose shadow and highlight colors for the duotone effect.' },
    ],
    howItWorks: ['Upload an image.', 'Pick grayscale or duotone mode.', 'Download the styled image.'],
  },
  {
    id: 'contrast-checker',
    path: 'tools/contrast-checker/index.html',
    category: 'web',
    title: 'WCAG contrast checker',
    description: 'Check color contrast ratios for WCAG AA and AAA compliance.',
    seoDescription:
      'Check WCAG color contrast ratios for text and UI. Free accessibility contrast checker in your browser.',
    icon: 'accessibility',
    keywords: ['wcag contrast', 'contrast ratio checker', 'accessibility colors', 'aa aaa contrast'],
    faq: [
      { question: 'What ratios are checked?', answer: 'WCAG 2.1 contrast ratios for normal and large text at AA and AAA levels.' },
    ],
    howItWorks: ['Pick foreground and background colors.', 'View contrast ratio and pass/fail results.', 'Copy colors or ratio.'],
  },
  {
    id: 'social-card',
    path: 'tools/social-card/index.html',
    category: 'web',
    title: 'Social card preview',
    description: 'Mock Twitter, LinkedIn, and Slack link unfurls with your image and copy.',
    seoDescription:
      'Preview social link cards for Twitter, LinkedIn, and Slack. Free mockup tool for OG images and copy.',
    icon: 'message-square',
    keywords: ['social card preview', 'twitter card mockup', 'linkedin preview', 'og preview'],
    faq: [
      { question: 'Is this an exact platform preview?', answer: 'It is an approximate mockup for layout and copy review, not a live fetch preview.' },
    ],
    howItWorks: ['Enter title, description, and upload an image.', 'Switch between platform mockups.', 'Download the card preview PNG.'],
  },
  {
    id: 'icon-checker',
    path: 'tools/icon-checker/index.html',
    category: 'web',
    title: 'PWA icon checker',
    description: 'Validate Apple touch icons and maskable PWA icons for size and safe padding.',
    seoDescription:
      'Validate PWA and Apple touch icons for correct sizes, aspect ratio, and maskable safe zone. Read-only browser checker.',
    icon: 'badge-check',
    keywords: ['pwa icon checker', 'apple touch icon validator', 'maskable icon check', 'icon audit'],
    faq: [
      { question: 'Does this replace the favicon checker?', answer: 'No. Use favicon checker for full kits; this tool focuses on PWA and touch icon rules.' },
    ],
    howItWorks: ['Drop icon PNGs or a ZIP.', 'Review size, aspect ratio, and safe-zone warnings.', 'Fix issues before shipping.'],
  },
  {
    id: 'file-inspector',
    path: 'tools/file-inspector/index.html',
    category: 'privacy',
    title: 'Image file inspector',
    description: 'Quick width, height, MIME, size, aspect ratio, and alpha channel stats.',
    seoDescription:
      'Inspect image file dimensions, MIME type, size, aspect ratio, and alpha locally. Faster than full EXIF viewers.',
    icon: 'file-search',
    keywords: ['image file info', 'image dimensions', 'check image size', 'image inspector'],
    faq: [
      { question: 'Does this show EXIF?', answer: 'No. Use the metadata viewer for EXIF; this tool shows file and pixel stats only.' },
    ],
    howItWorks: ['Upload an image.', 'View dimensions, MIME, size, and alpha info.', 'Copy stats as text.'],
  },
  {
    id: 'css-filters',
    path: 'tools/css-filters/index.html',
    category: 'web',
    title: 'CSS filter playground',
    description: 'Preview CSS filter() values on an image and copy the rule.',
    seoDescription:
      'Preview CSS filter effects on images and copy the filter rule. Free browser playground for blur, brightness, and more.',
    icon: 'sliders-horizontal',
    keywords: ['css filter playground', 'css blur preview', 'filter css generator', 'image css filters'],
    faq: [
      { question: 'Can I copy the CSS?', answer: 'Yes. Copy a ready-to-use filter property value for your stylesheet.' },
    ],
    howItWorks: ['Upload an image.', 'Adjust CSS filter sliders.', 'Copy the filter CSS.'],
  },
  {
    id: 'split-image',
    path: 'tools/split-image/index.html',
    category: 'convert',
    title: 'Split sprite sheet',
    description: 'Slice a grid or sprite sheet into separate PNG files in a ZIP.',
    seoDescription:
      'Split sprite sheets and image grids into separate PNG files. Free browser tool — download as ZIP.',
    icon: 'table-columns-split',
    keywords: ['split sprite sheet', 'unpack sprites', 'grid to images', 'slice sprite'],
    faq: [
      { question: 'Can I set custom grid columns?', answer: 'Yes. Specify columns and optional padding between cells.' },
    ],
    howItWorks: ['Upload a sprite sheet or grid image.', 'Set columns and padding.', 'Download individual frames as ZIP.'],
  },
  {
    id: 'gif-maker',
    path: 'tools/gif-maker/index.html',
    category: 'convert',
    title: 'GIF from frames',
    description: 'Combine ordered frames into an animated GIF.',
    seoDescription:
      'Create animated GIFs from multiple frames in your browser. Set delay and loop — free, no upload.',
    icon: 'film',
    keywords: ['gif maker', 'images to gif', 'animated gif creator', 'frame to gif'],
    faq: [
      { question: 'How many frames are supported?', answer: 'Up to 30 frames per GIF, in upload order.' },
    ],
    howItWorks: ['Upload frame images in order.', 'Set frame delay and loop count.', 'Download the animated GIF.'],
  },
  {
    id: 'pdf-to-image',
    path: 'tools/pdf-to-image/index.html',
    category: 'convert',
    title: 'PDF to image',
    description: 'Rasterize PDF pages to PNG locally in your browser.',
    seoDescription:
      'Convert PDF pages to PNG images locally in your browser. Free PDF rasterizer — no upload to server.',
    icon: 'file-type',
    keywords: ['pdf to png', 'pdf to image', 'rasterize pdf', 'convert pdf page'],
    faq: [
      { question: 'Can I export all pages?', answer: 'Yes. Export the first page only or all pages as a ZIP.' },
    ],
    howItWorks: ['Upload a PDF file.', 'Choose page range and scale.', 'Download PNG or ZIP.'],
  },
  {
    id: 'image-to-pdf',
    path: 'tools/image-to-pdf/index.html',
    category: 'convert',
    title: 'Image to PDF',
    description: 'Create a single-page PDF from a PNG or JPG image.',
    seoDescription:
      'Convert PNG or JPG images to a single-page PDF locally in your browser. Free, private PDF export.',
    icon: 'file-text',
    keywords: ['image to pdf', 'png to pdf', 'jpg to pdf', 'convert image pdf'],
    faq: [
      { question: 'Is it one page per image?', answer: 'Yes. Each export creates a single-page PDF sized to the image dimensions.' },
    ],
    howItWorks: ['Upload an image.', 'Choose page fit mode.', 'Download the PDF.'],
  },
  {
    id: 'sharpen',
    path: 'tools/sharpen/index.html',
    category: 'edit',
    title: 'Sharpen image',
    description: 'Apply unsharp mask sharpening with live preview.',
    seoDescription:
      'Sharpen images with unsharp mask in your browser. Free local tool with amount and radius controls.',
    icon: 'focus',
    keywords: ['sharpen image', 'unsharp mask', 'image sharpening', 'sharpen photo online'],
    faq: [
      { question: 'What is unsharp mask?', answer: 'A classic sharpening technique that boosts edge contrast without heavy artifacts at moderate settings.' },
    ],
    howItWorks: ['Upload an image.', 'Adjust sharpen amount and radius.', 'Download the sharpened image.'],
  },
  {
    id: 'tile-preview',
    path: 'tools/tile-preview/index.html',
    category: 'edit',
    title: 'Seamless tile preview',
    description: 'Preview textures tiled 2×2 to check seamless patterns.',
    seoDescription:
      'Preview seamless tile textures in a 2×2 grid locally in your browser. Free pattern checker for designers.',
    icon: 'grid-2x2',
    keywords: ['seamless tile preview', 'texture tile check', 'pattern preview', 'tileable texture'],
    faq: [
      { question: 'Does this make tiles seamless?', answer: 'No. It only previews how a texture repeats so you can spot seams.' },
    ],
    howItWorks: ['Upload a tileable texture.', 'View a 2×2 repeat preview.', 'Download the preview PNG.'],
  },
];
