let toastTimer: number | undefined;

/** Shows a temporary toast notification. */
export function showToast(message: string): void {
  const toast = document.querySelector('#toast');
  const toastText = document.querySelector('#toastText');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}
