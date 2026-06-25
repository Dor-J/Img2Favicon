import { jsPDF } from 'jspdf';

export type PdfFitMode = 'fit' | 'fill';

/** Creates a single-page PDF from a canvas image. */
export function canvasToPdf(
  canvas: HTMLCanvasElement,
  mode: PdfFitMode = 'fit',
): Blob {
  const pxToMm = 0.264583;
  const imgW = canvas.width * pxToMm;
  const imgH = canvas.height * pxToMm;

  const orientation = canvas.width >= canvas.height ? 'landscape' : 'portrait';
  const pdf = new jsPDF({ orientation, unit: 'mm', format: [imgW, imgH] });

  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  pdf.addImage(dataUrl, 'JPEG', 0, 0, imgW, imgH);

  if (mode === 'fill') {
    // Single page already matches image dimensions
  }

  return pdf.output('blob');
}
