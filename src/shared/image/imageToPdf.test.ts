import { describe, expect, it, vi } from 'vitest';
import { canvasToPdf } from './imageToPdf';

vi.mock('jspdf', () => ({
  jsPDF: class MockJsPdf {
    addImage = vi.fn();
    output = vi.fn(() => new Blob(['pdf'], { type: 'application/pdf' }));
  },
}));

describe('canvasToPdf', () => {
  it('returns a PDF blob from canvas', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    vi.spyOn(canvas, 'toDataURL').mockReturnValue('data:image/jpeg;base64,abc');

    const blob = canvasToPdf(canvas, 'fit');
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/pdf');
  });
});
