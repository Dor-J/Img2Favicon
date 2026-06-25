import type { ToolCategory } from './categories';
import { EXTRA_TOOL_PAGES } from './extraToolPages';
import { BATCH2_TOOL_PAGES } from './batch2ToolPages';

export type { ToolCategory };

/** FAQ item for SEO and GEO content blocks. */
export interface FaqItem {
  question: string;
  answer: string;
}

/** Registry entry for a public page. */
export interface PageEntry {
  id: string;
  path: string;
  title: string;
  description: string;
  seoDescription: string;
  category?: ToolCategory;
  icon?: string;
  keywords?: string[];
  faq?: FaqItem[];
  howItWorks?: string[];
}

export const HUB_PAGE: PageEntry = {
  id: 'hub',
  path: 'index.html',
  title: 'Private Browser Image Tools',
  description:
    'Independent utilities for favicons, resizing, cropping, format conversion, and more. Nothing leaves your device.',
  seoDescription:
    'Free private browser image tools — favicon kit generator, resize, crop, convert, watermark, and more. No upload, runs locally.',
  keywords: [
    'browser image tools',
    'private image editor',
    'online image utilities',
    'client-side image processing',
  ],
  faq: [
    {
      question: 'Does Img2Favicon upload my images?',
      answer:
        'No. All processing happens in your browser. Your files never leave your device and nothing is sent to a server.',
    },
    {
      question: 'Do I need an account or install anything?',
      answer:
        'No account or install is required. Open a tool in your browser, load an image, and download the result.',
    },
    {
      question: 'What tools are included?',
      answer:
        'The suite includes 44 tools: favicon and app icon generators, splash screens, Open Graph and social previews, resize, crop, trim, bulk processing, convert, palette and duotone effects, PDF and GIF tools, WCAG contrast checking, PWA icon validation, metadata tools, and more — all running locally in your browser.',
    },
  ],
  howItWorks: [
    'Open any tool from the hub page in your browser.',
    'Load an image or configure the tool settings locally.',
    'Preview the result and download — no server upload required.',
  ],
};

const BASE_TOOL_PAGES: PageEntry[] = [
  {
    id: 'favicon',
    path: 'tools/favicon/index.html',
    category: 'create',
    title: 'Favicon Kit Generator',
    description: 'Create a complete favicon kit from any image or text.',
    seoDescription:
      'Free online favicon generator — create ICO, SVG, PNG sizes, web manifest, and HTML snippet. Runs in your browser, no upload.',
    icon: 'sparkles',
    keywords: ['favicon generator', 'favicon kit', 'ico generator', 'apple touch icon'],
    faq: [
      {
        question: 'What files are in a favicon kit?',
        answer:
          'A complete kit includes favicon.ico, favicon.svg, PNG sizes (16, 32, 180, 192), site.webmanifest, and a ready-to-paste HTML snippet.',
      },
      {
        question: 'Does this upload my image?',
        answer: 'No. Image and text favicons are generated entirely in your browser.',
      },
      {
        question: 'Can I create a favicon from text?',
        answer:
          'Yes. Enter letters, pick fonts and colors, and export the same multi-format kit as image-based favicons.',
      },
      {
        question: 'Is the favicon generator free?',
        answer: 'Yes. Img2Favicon is free to use with no account required.',
      },
    ],
    howItWorks: [
      'Upload an image or switch to text mode and enter your letters.',
      'Adjust background, framing, and preview sizes in the live canvas.',
      'Download individual files or the complete ZIP favicon kit.',
    ],
  },
  {
    id: 'resize',
    path: 'tools/resize/index.html',
    category: 'edit',
    title: 'Resize & compress',
    description: 'Resize images to max dimensions and compress to a target file size.',
    seoDescription:
      'Free browser-based image resizer and compressor. Set max dimensions and target KB — processed locally, no upload.',
    icon: 'minimize-2',
    keywords: ['image resize', 'compress image', 'reduce file size', 'online resizer'],
    faq: [
      {
        question: 'Can I resize without losing aspect ratio?',
        answer: 'Yes. Enable "Maintain aspect ratio" to scale proportionally within your max width and height.',
      },
      {
        question: 'How does target file size compression work?',
        answer:
          'Set a target size in KB and the tool iteratively adjusts quality until the export meets your limit.',
      },
      {
        question: 'Are my images uploaded to a server?',
        answer: 'No. Resize and compression run entirely in your browser.',
      },
    ],
    howItWorks: [
      'Drop or browse for a PNG, JPG, WebP, or GIF image.',
      'Set max dimensions and optional target file size.',
      'Download the resized or compressed image.',
    ],
  },
  {
    id: 'crop',
    path: 'tools/crop/index.html',
    category: 'edit',
    title: 'Crop',
    description: 'Crop images to fixed ratios or a freeform region.',
    seoDescription:
      'Free online image cropper with aspect ratio presets (1:1, 16:9, 4:3) or freeform crop. Private, browser-based.',
    icon: 'crop',
    keywords: ['crop image', 'image cropper', 'aspect ratio crop', 'free crop tool'],
    faq: [
      {
        question: 'What aspect ratios are supported?',
        answer: 'Free, 1:1, 16:9, 4:3, and 3:2 presets are available, plus freeform cropping.',
      },
      {
        question: 'Does cropping upload my photo?',
        answer: 'No. Cropping is done locally in your browser.',
      },
    ],
    howItWorks: [
      'Upload an image to the crop tool.',
      'Choose an aspect ratio or freeform mode and adjust the crop region.',
      'Download the cropped image in your chosen format.',
    ],
  },
  {
    id: 'convert',
    path: 'tools/convert/index.html',
    category: 'convert',
    title: 'Convert format',
    description: 'Convert images between PNG, JPEG, WebP, and AVIF.',
    seoDescription:
      'Convert images between PNG, JPEG, WebP, and AVIF in your browser. Free, private format converter — no upload.',
    icon: 'refresh-cw',
    keywords: ['convert image format', 'png to webp', 'jpg to png', 'avif converter'],
    faq: [
      {
        question: 'Which formats can I convert between?',
        answer: 'PNG, JPEG, WebP, and AVIF are supported as input and output formats.',
      },
      {
        question: 'Is conversion done on a server?',
        answer: 'No. Format conversion uses the browser Canvas API locally.',
      },
    ],
    howItWorks: [
      'Upload a PNG, JPG, WebP, or GIF image.',
      'Select the output format and adjust quality if needed.',
      'Download the converted file.',
    ],
  },
  {
    id: 'remove-bg',
    path: 'tools/remove-bg/index.html',
    category: 'edit',
    title: 'Remove background',
    description: 'Remove solid backgrounds using color tolerance. Not AI.',
    seoDescription:
      'Remove solid image backgrounds with color tolerance — not AI. Free browser tool for simple backgrounds, no upload.',
    icon: 'eraser',
    keywords: ['remove background', 'transparent background', 'color key', 'background remover'],
    faq: [
      {
        question: 'Is this AI background removal?',
        answer:
          'No. This tool uses color tolerance to remove solid or similar backgrounds. It is not AI-powered.',
      },
      {
        question: 'What backgrounds work best?',
        answer: 'Solid or uniform backgrounds work best. Click the preview to pick the key color.',
      },
      {
        question: 'Does my image leave my device?',
        answer: 'No. Background removal runs entirely in your browser.',
      },
    ],
    howItWorks: [
      'Upload an image with a solid or simple background.',
      'Click the preview to pick the background color and adjust tolerance.',
      'Download a PNG with transparency.',
    ],
  },
  {
    id: 'rotate',
    path: 'tools/rotate/index.html',
    category: 'edit',
    title: 'Rotate & flip',
    description: 'Rotate, flip, and straighten images with expanded canvas bounds.',
    seoDescription:
      'Rotate, flip, and straighten images online in your browser. Free private tool with expanded canvas bounds.',
    icon: 'rotate-cw',
    keywords: ['rotate image', 'flip image', 'straighten photo', 'image orientation'],
    faq: [
      {
        question: 'Can I flip images horizontally or vertically?',
        answer: 'Yes. Use the Flip H and Flip V buttons alongside rotation and straighten controls.',
      },
      {
        question: 'What happens to the canvas when rotating?',
        answer: 'The canvas expands automatically so rotated content is not clipped.',
      },
    ],
    howItWorks: [
      'Upload an image to rotate or flip.',
      'Adjust rotation, straighten, or use flip controls with live preview.',
      'Download the transformed image.',
    ],
  },
  {
    id: 'watermark',
    path: 'tools/watermark/index.html',
    category: 'edit',
    title: 'Watermark',
    description: 'Add text or logo watermarks with opacity and position control.',
    seoDescription:
      'Add text or logo watermarks to images in your browser. Control opacity and position — free, no upload.',
    icon: 'stamp',
    keywords: ['watermark image', 'add watermark', 'logo watermark', 'text watermark'],
    faq: [
      {
        question: 'Can I watermark with my logo?',
        answer: 'Yes. Switch to logo mode and upload a PNG or WebP logo with scale and position controls.',
      },
      {
        question: 'Where can the watermark be placed?',
        answer: 'Nine positions are available: corners, center, and top/bottom center.',
      },
    ],
    howItWorks: [
      'Upload the image you want to watermark.',
      'Choose text or logo mode and configure content, opacity, and position.',
      'Download the watermarked image.',
    ],
  },
  {
    id: 'blur',
    path: 'tools/blur/index.html',
    category: 'edit',
    title: 'Blur & pixelate',
    description: 'Blur or pixelate rectangular regions to redact sensitive content.',
    seoDescription:
      'Blur or pixelate regions in images to redact sensitive content. Free browser tool — private, no upload.',
    icon: 'scan-eye',
    keywords: ['blur image', 'pixelate image', 'redact photo', 'censor image region'],
    faq: [
      {
        question: 'Can I redact only part of an image?',
        answer: 'Yes. Drag on the preview to add rectangular blur or pixelate regions.',
      },
      {
        question: 'What is the difference between blur and pixelate?',
        answer: 'Blur softens content; pixelate replaces detail with blocks. Both redact sensitive areas.',
      },
    ],
    howItWorks: [
      'Upload an image to redact.',
      'Choose blur or pixelate mode and drag regions on the preview.',
      'Download the redacted image.',
    ],
  },
  {
    id: 'strip-metadata',
    path: 'tools/strip-metadata/index.html',
    category: 'privacy',
    title: 'Strip metadata',
    description: 'Remove EXIF and metadata by re-encoding locally in your browser.',
    seoDescription:
      'Remove EXIF and image metadata locally in your browser. Strip GPS, camera info, and timestamps — no upload.',
    icon: 'shield-off',
    keywords: ['remove exif', 'strip metadata', 'remove image metadata', 'privacy photo tool'],
    faq: [
      {
        question: 'What EXIF data is removed?',
        answer:
          'Re-encoding removes camera GPS, device info, timestamps, and other embedded metadata from the export.',
      },
      {
        question: 'Does stripping metadata upload my photo?',
        answer: 'No. Metadata is removed by re-encoding the image entirely in your browser.',
      },
      {
        question: 'Why strip image metadata?',
        answer:
          'Metadata can include location and device details. Stripping it protects privacy before sharing photos.',
      },
    ],
    howItWorks: [
      'Upload a photo that may contain EXIF or other metadata.',
      'Choose output format — the tool re-encodes locally without metadata.',
      'Download a clean image file.',
    ],
  },
];

/** All tool pages with SEO and GEO content. */
export const TOOL_PAGES: PageEntry[] = [...BASE_TOOL_PAGES, ...EXTRA_TOOL_PAGES, ...BATCH2_TOOL_PAGES];

/** All public pages including the hub. */
export const ALL_PAGES: PageEntry[] = [HUB_PAGE, ...TOOL_PAGES];

/** Finds a page entry by id. */
export function getPageById(id: string): PageEntry | undefined {
  return ALL_PAGES.find((page) => page.id === id);
}

/** Finds a page entry by path. */
export function getPageByPath(path: string): PageEntry | undefined {
  return ALL_PAGES.find((page) => page.path === path);
}
