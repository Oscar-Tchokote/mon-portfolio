const TOAST_EVENT = 'app:toast';

/**
 * Show a toast from anywhere in the admin (client-side feedback).
 *
 * @param {string} text
 * @param {'success'|'error'|'info'} type
 */
export function toast(text, type = 'success') {
    window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { text, type } }));
}

export function onToast(callback) {
    const handler = (event) => callback(event.detail);
    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
}
