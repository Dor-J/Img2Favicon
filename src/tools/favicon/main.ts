import { initShell } from '../../shared/shell/initShell';
import { showToast } from '../../shared/ui/toast';
import { updateRangeDisplay } from '../../shared/ui/rangeDisplay';
import {
  ACCEPTED_IMAGE_TYPES,
  MASTER_SIZE,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_EDGE,
  MAX_IMAGE_PIXELS,
} from './lib/constants';
import { extractDominantColors } from '../../shared/image/palette';
import { dedupeSimilarColors } from './lib/color';
import { buildInstallationSnippet, copyText, downloadPng } from './lib/export';
import {
  isImageWithinLimits,
  verifyImageFileSignature,
} from './lib/imageValidation';
import { buildKitZip, exportSingleAsset } from './lib/kit';
import {
  createIconCanvas,
  renderIcon,
} from './lib/render';
import { createDefaultState, resetState } from './lib/state';
import type { AppState, BackgroundMode, ShapeMode, SourceMode } from './lib/types';
import '../../styles/shared.css';
const $ = <T extends Element>(selector: string, root: ParentNode = document): T =>
  root.querySelector(selector)!;

const $$ = <T extends Element>(selector: string, root: ParentNode = document): T[] =>
  Array.from(root.querySelectorAll(selector));

const state: AppState = createDefaultState();

const canvas = $<HTMLCanvasElement>('#editorCanvas');
const ctx = canvas.getContext('2d', { alpha: true })!;

const previews = {
  16: $<HTMLCanvasElement>('#preview16'),
  32: $<HTMLCanvasElement>('#preview32'),
  48: $<HTMLCanvasElement>('#preview48'),
  180: $<HTMLCanvasElement>('#preview180'),
  192: $<HTMLCanvasElement>('#preview192'),
  tab: $<HTMLCanvasElement>('#tabPreview'),
};

const refs = {
  imageSection: $('#imageSection'),
  textSection: $('#textSection'),
  imageEditSection: $('#imageEditSection'),
  sourceTabs: $$<HTMLButtonElement>('.tab'),
  bgButtons: $$<HTMLButtonElement>('#backgroundMode button'),
  shapeButtons: $$<HTMLButtonElement>('#shapeMode button'),
  imageInput: $<HTMLInputElement>('#imageInput'),
  dropzone: $('#dropzone'),
  uploadThumb: $<HTMLImageElement>('#uploadThumb'),
  uploadTitle: $('#uploadTitle'),
  uploadSub: $('#uploadSub'),
  uploadName: $('#uploadName'),
  canvasHint: $('#canvasHint'),
  palette: $('#palette'),
  colorTwoField: $('#colorTwoField'),
  angleField: $('#angleField'),
  snippet: $('#snippetCode'),
};

function initRanges(): void {
  const bindings: Array<[string, string, string]> = [
    ['#textScale', '#textScaleValue', '%'],
    ['#gradientAngle', '#gradientAngleValue', '°'],
    ['#zoomRange', '#zoomValue', '%'],
    ['#rotateRange', '#rotateValue', '°'],
    ['#paddingRange', '#paddingValue', '%'],
  ];

  bindings.forEach(([input, output, suffix]) =>
    updateRangeDisplay($<HTMLInputElement>(input), $<HTMLOutputElement>(output), suffix),
  );
}

function renderAll(): void {
  renderIcon(ctx, MASTER_SIZE, state);

  ([16, 32, 48, 180, 192] as const).forEach((size) => {
    const target = previews[size];
    const source = createIconCanvas(size, state);
    const targetContext = target.getContext('2d', { alpha: true })!;
    targetContext.clearRect(0, 0, size, size);
    targetContext.drawImage(source, 0, 0);
  });

  const tabContext = previews.tab.getContext('2d', { alpha: true })!;
  tabContext.clearRect(0, 0, 32, 32);
  tabContext.drawImage(createIconCanvas(32, state), 0, 0);

  refs.snippet.textContent = buildInstallationSnippet(state.colorOne);
  setImageControlState();
}

function setImageControlState(): void {
  const isImage = state.source === 'image';
  refs.imageEditSection.classList.toggle('disabled', !isImage || !state.image);
  refs.canvasHint.textContent =
    isImage && state.image
      ? 'Drag to reposition'
      : isImage
        ? 'Upload an image to edit'
        : 'Text favicon preview';
}

function setSource(source: SourceMode): void {
  state.source = source;
  refs.sourceTabs.forEach((button) => {
    const active = button.dataset.source === source;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  refs.imageSection.classList.toggle('hide', source !== 'image');
  refs.textSection.classList.toggle('hide', source !== 'text');
  renderAll();
}

function setBackground(mode: BackgroundMode): void {
  state.background = mode;
  refs.bgButtons.forEach((button) =>
    button.classList.toggle('active', button.dataset.bg === mode),
  );
  refs.colorTwoField.classList.toggle('hide', mode !== 'gradient');
  refs.angleField.classList.toggle('hide', mode !== 'gradient');
  renderAll();
}

function setShape(shape: ShapeMode): void {
  state.shape = shape;
  refs.shapeButtons.forEach((button) =>
    button.classList.toggle('active', button.dataset.shape === shape),
  );
  renderAll();
}

async function setImage(file: File | undefined): Promise<void> {
  if (!file) return;

  if (
    !ACCEPTED_IMAGE_TYPES.has(file.type) ||
    file.size === 0 ||
    file.size > MAX_IMAGE_BYTES
  ) {
    showToast('Choose a PNG, JPG, WebP, or GIF under 20 MB.');
    refs.imageInput.value = '';
    return;
  }

  try {
    if (!(await verifyImageFileSignature(file))) {
      showToast('That file does not contain a supported image format.');
      refs.imageInput.value = '';
      return;
    }
  } catch {
    showToast('The image could not be verified.');
    refs.imageInput.value = '';
    return;
  }

  const pendingUrl = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = 'async';
  image.onload = () => {
    if (
      !isImageWithinLimits(
        image.naturalWidth,
        image.naturalHeight,
        MAX_IMAGE_EDGE,
        MAX_IMAGE_PIXELS,
      )
    ) {
      URL.revokeObjectURL(pendingUrl);
      refs.imageInput.value = '';
      showToast('That image is too large. Use an image below 32 megapixels.');
      return;
    }

    if (state.imageUrl) URL.revokeObjectURL(state.imageUrl);
    state.image = image;
    state.imageUrl = pendingUrl;
    state.imageName = file.name;
    state.panX = 0;
    state.panY = 0;
    state.rotation = 0;
    state.zoom = 100;

    const zoomRange = $<HTMLInputElement>('#zoomRange');
    const rotateRange = $<HTMLInputElement>('#rotateRange');
    zoomRange.value = '100';
    rotateRange.value = '0';
    updateRangeDisplay(zoomRange, $<HTMLOutputElement>('#zoomValue'), '%');
    updateRangeDisplay(rotateRange, $<HTMLOutputElement>('#rotateValue'), '°');

    refs.dropzone.classList.add('has-image');
    refs.uploadThumb.src = pendingUrl;
    refs.uploadTitle.textContent = 'Image ready';
    refs.uploadSub.textContent = `${image.naturalWidth} × ${image.naturalHeight} px`;
    refs.uploadName.textContent = file.name;
    renderAll();
    showToast('Image added to your favicon.');
  };
  image.onerror = () => {
    URL.revokeObjectURL(pendingUrl);
    refs.imageInput.value = '';
    showToast('That image could not be decoded.');
  };
  image.src = pendingUrl;
}

function clearImage(): void {
  if (state.imageUrl) URL.revokeObjectURL(state.imageUrl);
  state.image = null;
  state.imageUrl = '';
  state.imageName = '';
  refs.imageInput.value = '';
  refs.dropzone.classList.remove('has-image');
  refs.uploadThumb.removeAttribute('src');
  refs.uploadTitle.textContent = 'Drop an image here or browse';
  refs.uploadSub.textContent = 'PNG, JPG, WebP, or GIF · up to 20 MB';
  refs.uploadName.textContent = '';
  refs.palette.classList.add('hide');
  refs.palette.innerHTML = '';
  renderAll();
}

function fitImage(): void {
  state.zoom = 100;
  state.rotation = 0;
  state.panX = 0;
  state.panY = 0;

  const zoomRange = $<HTMLInputElement>('#zoomRange');
  const rotateRange = $<HTMLInputElement>('#rotateRange');
  zoomRange.value = '100';
  rotateRange.value = '0';
  updateRangeDisplay(zoomRange, $<HTMLOutputElement>('#zoomValue'), '%');
  updateRangeDisplay(rotateRange, $<HTMLOutputElement>('#rotateValue'), '°');
  renderAll();
  showToast('Image framing reset.');
}

async function copySnippet(): Promise<void> {
  await copyText(refs.snippet.textContent ?? '');
  showToast('Installation snippet copied.');
}

function extractPalette(): void {
  if (!state.image) {
    showToast('Upload an image first to extract its colors.');
    return;
  }

  const sample = document.createElement('canvas');
  const size = 64;
  sample.width = size;
  sample.height = size;
  const sampleContext = sample.getContext('2d', { willReadFrequently: true })!;
  sampleContext.drawImage(state.image, 0, 0, size, size);
  const data = sampleContext.getImageData(0, 0, size, size).data;
  const colors = dedupeSimilarColors(extractDominantColors(data));

  if (!colors.length) {
    showToast('No suitable image colors found.');
    return;
  }

  refs.palette.innerHTML = colors
    .map(
      (color) =>
        `<button class="swatch" type="button" title="Use ${color}" style="background:${color}" data-color="${color}" aria-label="Use color ${color}"></button>`,
    )
    .join('');
  refs.palette.classList.remove('hide');
  $$<HTMLButtonElement>('.swatch', refs.palette).forEach((button) =>
    button.addEventListener('click', () => {
      const color = button.dataset.color;
      if (!color) return;
      state.colorOne = color;
      $<HTMLInputElement>('#colorOne').value = color;
      setBackground('solid');
      showToast(`${color} set as primary color.`);
    }),
  );
  showToast('Suggested colors extracted.');
}

function randomize(): void {
  const palettes = [
    ['#ff5a1f', '#6d28d9'],
    ['#0f766e', '#22c55e'],
    ['#e11d48', '#fb7185'],
    ['#0f4c81', '#38bdf8'],
    ['#ca8a04', '#f97316'],
    ['#334155', '#64748b'],
    ['#7c3aed', '#ec4899'],
  ];
  const pick = palettes[Math.floor(Math.random() * palettes.length)]!;
  state.colorOne = pick[0]!;
  state.colorTwo = pick[1]!;
  state.angle = Math.floor(Math.random() * 360);
  state.shape = (['rounded', 'square', 'circle'] as const)[
    Math.floor(Math.random() * 3)
  ]!;
  state.background = Math.random() > 0.28 ? 'gradient' : 'solid';

  if (state.source === 'text') {
    state.textColor = ['#ffffff', '#111827', '#fef3c7'][
      Math.floor(Math.random() * 3)
    ]!;
    state.textScale = 50 + Math.floor(Math.random() * 22);
  }

  $<HTMLInputElement>('#colorOne').value = state.colorOne;
  $<HTMLInputElement>('#colorTwo').value = state.colorTwo;
  $<HTMLInputElement>('#gradientAngle').value = String(state.angle);
  $<HTMLInputElement>('#textColor').value = state.textColor;
  $<HTMLInputElement>('#textScale').value = String(state.textScale);
  updateRangeDisplay(
    $<HTMLInputElement>('#gradientAngle'),
    $<HTMLOutputElement>('#gradientAngleValue'),
    '°',
  );
  updateRangeDisplay(
    $<HTMLInputElement>('#textScale'),
    $<HTMLOutputElement>('#textScaleValue'),
    '%',
  );
  setBackground(state.background);
  setShape(state.shape);
  renderAll();
  showToast('A fresh direction is ready.');
}

function resetAll(): void {
  resetState(state);

  $<HTMLInputElement>('#textValue').value = state.text;
  $<HTMLSelectElement>('#fontSelect').value = state.font;
  $<HTMLSelectElement>('#fontWeight').value = state.weight;
  $<HTMLInputElement>('#textColor').value = state.textColor;
  $<HTMLInputElement>('#textScale').value = String(state.textScale);
  $<HTMLInputElement>('#colorOne').value = state.colorOne;
  $<HTMLInputElement>('#colorTwo').value = state.colorTwo;
  $<HTMLInputElement>('#gradientAngle').value = String(state.angle);
  $<HTMLInputElement>('#zoomRange').value = String(state.zoom);
  $<HTMLInputElement>('#rotateRange').value = String(state.rotation);
  $<HTMLInputElement>('#paddingRange').value = String(state.padding);
  initRanges();
  setSource(state.source);
  setBackground(state.background);
  setShape(state.shape);
  showToast('Settings reset.');
}

function attachEvents(): void {
  refs.sourceTabs.forEach((button) =>
    button.addEventListener('click', () => setSource(button.dataset.source as SourceMode)),
  );
  refs.bgButtons.forEach((button) =>
    button.addEventListener('click', () => setBackground(button.dataset.bg as BackgroundMode)),
  );
  refs.shapeButtons.forEach((button) =>
    button.addEventListener('click', () => setShape(button.dataset.shape as ShapeMode)),
  );

  refs.imageInput.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    void setImage(input.files?.[0]);
  });
  $('#clearImage').addEventListener('click', clearImage);
  $('#fitImage').addEventListener('click', fitImage);

  ['dragenter', 'dragover'].forEach((eventName) =>
    refs.dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      event.stopPropagation();
      refs.dropzone.classList.add('dragover');
    }),
  );
  ['dragleave', 'drop'].forEach((eventName) =>
    refs.dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      event.stopPropagation();
      refs.dropzone.classList.remove('dragover');
    }),
  );
  refs.dropzone.addEventListener('drop', (event) => {
    const files = (event as DragEvent).dataTransfer?.files;
    const file = files && files.length === 1 ? files[0] : null;
    if (!file) {
      showToast('Drop one image at a time.');
      return;
    }
    void setImage(file);
  });
  ['dragover', 'drop'].forEach((eventName) =>
    document.addEventListener(eventName, (event) => event.preventDefault()),
  );

  $<HTMLInputElement>('#textValue').addEventListener('input', (event) => {
    const input = event.target as HTMLInputElement;
    state.text = input.value.replace(/\s/g, '').slice(0, 3) || 'F';
    input.value = state.text;
    renderAll();
  });
  $<HTMLSelectElement>('#fontSelect').addEventListener('change', (event) => {
    state.font = (event.target as HTMLSelectElement).value;
    renderAll();
  });
  $<HTMLSelectElement>('#fontWeight').addEventListener('change', (event) => {
    state.weight = (event.target as HTMLSelectElement).value;
    renderAll();
  });
  $<HTMLInputElement>('#textColor').addEventListener('input', (event) => {
    state.textColor = (event.target as HTMLInputElement).value;
    renderAll();
  });
  $<HTMLInputElement>('#colorOne').addEventListener('input', (event) => {
    state.colorOne = (event.target as HTMLInputElement).value;
    renderAll();
  });
  $<HTMLInputElement>('#colorTwo').addEventListener('input', (event) => {
    state.colorTwo = (event.target as HTMLInputElement).value;
    renderAll();
  });

  const rangeBindings: Array<[string, keyof AppState, string, string]> = [
    ['#textScale', 'textScale', '#textScaleValue', '%'],
    ['#gradientAngle', 'angle', '#gradientAngleValue', '°'],
    ['#zoomRange', 'zoom', '#zoomValue', '%'],
    ['#rotateRange', 'rotation', '#rotateValue', '°'],
    ['#paddingRange', 'padding', '#paddingValue', '%'],
  ];
  rangeBindings.forEach(([inputSelector, property, outputSelector, suffix]) => {
    $<HTMLInputElement>(inputSelector).addEventListener('input', (event) => {
      const input = event.target as HTMLInputElement;
      (state[property] as number) = Number(input.value);
      updateRangeDisplay(input, $<HTMLOutputElement>(outputSelector), suffix);
      renderAll();
    });
  });

  $('#randomize').addEventListener('click', randomize);
  $('#extractPalette').addEventListener('click', extractPalette);
  $('#downloadMaster').addEventListener('click', () => {
    void downloadPng(512, 'favicon-master-512.png', state);
  });
  $('#downloadKit').addEventListener('click', () => {
    void buildKitZip(state).then(() => showToast('Complete favicon kit downloaded.'));
  });
  $$<HTMLButtonElement>('.download-one[data-export]').forEach((button) =>
    button.addEventListener('click', () => {
      void exportSingleAsset(button.dataset.export ?? '', state).then((exported) => {
        if (exported) showToast('Export downloaded.');
      });
    }),
  );
  $('#copySnippet').addEventListener('click', () => {
    void copySnippet();
  });
  $('#copySnippetIcon').addEventListener('click', () => {
    void copySnippet();
  });

  let drag: { x: number; y: number; startX: number; startY: number } | null = null;
  canvas.addEventListener('pointerdown', (event) => {
    if (state.source !== 'image' || !state.image) return;
    drag = {
      x: event.clientX,
      y: event.clientY,
      startX: state.panX,
      startY: state.panY,
    };
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add('dragging');
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = MASTER_SIZE / rect.width;
    state.panX = drag.startX + (event.clientX - drag.x) * ratio;
    state.panY = drag.startY + (event.clientY - drag.y) * ratio;
    renderAll();
  });
  const finishDrag = (): void => {
    drag = null;
    canvas.classList.remove('dragging');
  };
  canvas.addEventListener('pointerup', finishDrag);
  canvas.addEventListener('pointercancel', finishDrag);
  canvas.addEventListener('lostpointercapture', finishDrag);
}

window.addEventListener(
  'pagehide',
  () => {
    if (state.imageUrl) URL.revokeObjectURL(state.imageUrl);
  },
  { once: true },
);

initShell({ activeToolId: 'favicon', showReset: true, onReset: resetAll });
initRanges();
attachEvents();
setSource(state.source);
setBackground(state.background);
setShape(state.shape);
renderAll();
