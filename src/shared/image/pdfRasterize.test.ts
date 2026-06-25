import { describe, expect, it, vi } from 'vitest';
import { getPdfPageCount } from './pdfRasterize';

vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  getDocument: vi.fn(() => ({
    promise: Promise.resolve({
      numPages: 3,
      destroy: vi.fn(),
    }),
  })),
}));

describe('getPdfPageCount', () => {
  it('returns number of pages in a PDF file', async () => {
    const file = new File(['pdf'], 'doc.pdf', { type: 'application/pdf' });
    await expect(getPdfPageCount(file)).resolves.toBe(3);
  });
});
