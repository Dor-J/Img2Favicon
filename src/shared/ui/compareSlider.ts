/** Binds drag interaction for a before/after compare slider. */
export function bindCompareSlider(options: {
  wrap: HTMLElement;
  beforeLayer: HTMLElement;
  handle: HTMLElement;
  onChange?: (percent: number) => void;
}): void {
  let dragging = false;

  const setPosition = (clientX: number): void => {
    const rect = options.wrap.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    options.beforeLayer.style.width = `${percent}%`;
    options.handle.style.left = `${percent}%`;
    options.onChange?.(percent);
  };

  const onPointerDown = (event: PointerEvent): void => {
    dragging = true;
    options.handle.setPointerCapture(event.pointerId);
    setPosition(event.clientX);
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (!dragging) return;
    setPosition(event.clientX);
  };

  const onPointerUp = (): void => {
    dragging = false;
  };

  options.handle.addEventListener('pointerdown', onPointerDown);
  options.handle.addEventListener('pointermove', onPointerMove);
  options.handle.addEventListener('pointerup', onPointerUp);
  options.handle.addEventListener('pointercancel', onPointerUp);

  options.wrap.addEventListener('click', (event) => {
    if (event.target === options.handle) return;
    setPosition(event.clientX);
  });

  setPosition(options.wrap.getBoundingClientRect().left + options.wrap.offsetWidth / 2);
}
