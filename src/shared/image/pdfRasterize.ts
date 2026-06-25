import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

/** Renders a PDF page to a canvas at the given scale. */
export async function renderPdfPage(
  file: File,
  pageNumber: number,
  scale: number,
): Promise<HTMLCanvasElement> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const page = await pdf.getPage(Math.min(pageNumber, pdf.numPages));
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d')!;
  await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  return canvas;
}

/** Returns the number of pages in a PDF file. */
export async function getPdfPageCount(file: File): Promise<number> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  return pdf.numPages;
}

/** Renders all PDF pages to canvases. */
export async function renderAllPdfPages(
  file: File,
  scale: number,
): Promise<HTMLCanvasElement[]> {
  const count = await getPdfPageCount(file);
  const pages: HTMLCanvasElement[] = [];
  for (let i = 1; i <= count; i++) {
    pages.push(await renderPdfPage(file, i, scale));
  }
  return pages;
}
