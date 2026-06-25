import { initShell } from '../shell/initShell';
import { bindFileDrop, resetDropzone, setDropzoneLoaded } from '../ui/fileDrop';
import {
  bindQualityVisibility,
  getSelectedFormat,
  populateFormatSelect,
} from '../ui/formatControls';
import { updateRangeDisplay } from '../ui/rangeDisplay';
import { showToast } from '../ui/toast';
import {
  loadImageFromFile,
  revokeLoadedImage,
  type LoadedImage,
} from '../image/loadImage';
import { $ } from './toolHelpers';

export interface ToolImageContext {
  loaded: LoadedImage | null;
  qualityInput: HTMLInputElement;
  formatSelect: HTMLSelectElement;
  metaEl: HTMLElement;
  previewCanvas: HTMLCanvasElement;
}

/** Shared image load + dropzone wiring for standard tools. */
export function initToolImageLoader(
  onLoad: (loaded: LoadedImage) => void | Promise<void>,
  onClear: () => void,
): void {
  const dropzone = $<HTMLElement>('#dropzone');
  const input = $<HTMLInputElement>('#imageInput');

  bindFileDrop({
    dropzone,
    input,
    onFile: async (file) => {
      try {
        const loaded = await loadImageFromFile(file);
        setDropzoneLoaded(
          dropzone,
          $<HTMLElement>('#uploadTitle'),
          $<HTMLElement>('#uploadSub'),
          $<HTMLElement>('#uploadName'),
          $<HTMLImageElement>('#uploadThumb'),
          file,
          loaded.width,
          loaded.height,
          loaded.url,
        );
        await onLoad(loaded);
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Failed to load image.');
        input.value = '';
      }
    },
  });

  $('#clearImage').addEventListener('click', () => {
    onClear();
    resetDropzone(
      dropzone,
      $<HTMLElement>('#uploadTitle'),
      $<HTMLElement>('#uploadSub'),
      $<HTMLElement>('#uploadName'),
      document.querySelector('#uploadThumb'),
      input,
    );
  });
}

/** Initializes format select and quality slider for a tool page. */
export async function initFormatControls(): Promise<{
  formatSelect: HTMLSelectElement;
  qualityInput: HTMLInputElement;
}> {
  const formatSelect = $<HTMLSelectElement>('#formatSelect');
  const qualityInput = $<HTMLInputElement>('#qualityRange');
  const qualityField = $<HTMLElement>('#qualityField');
  const qualityValue = $<HTMLOutputElement>('#qualityValue');

  await populateFormatSelect(formatSelect);
  bindQualityVisibility(formatSelect, qualityField);

  qualityInput.addEventListener('input', () => {
    updateRangeDisplay(qualityInput, qualityValue, '%');
  });
  updateRangeDisplay(qualityInput, qualityValue, '%');

  return { formatSelect, qualityInput };
}

/** Returns current export settings from the page controls. */
export function getExportSettings(ctx: Pick<ToolImageContext, 'formatSelect' | 'qualityInput'>): {
  format: ReturnType<typeof getSelectedFormat>;
  quality: number;
} {
  return {
    format: getSelectedFormat(ctx.formatSelect),
    quality: Number(ctx.qualityInput.value),
  };
}

/** Clears a loaded image and revokes its object URL. */
export function clearLoadedImage(loaded: LoadedImage | null): null {
  revokeLoadedImage(loaded);
  return null;
}

/** Standard shell init for image tools. */
export function initToolShell(toolId: string, onReset: () => void): void {
  initShell({ activeToolId: toolId, showReset: true, onReset });
}
