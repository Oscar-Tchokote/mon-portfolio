/**
 * Anchors of the one-page landing, in display order.
 */
export const SECTION_IDS = ['a-propos', 'projets', 'services', 'blog', 'contact'];

const CONTACT_PREFILL_EVENT = 'contact:prefill';

/**
 * Smoothly scroll to a landing section and reflect it in the URL hash.
 */
export function scrollToSection(id) {
    const element = document.getElementById(id);
    if (!element) {
        return false;
    }
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(window.history.state, '', `#${id}`);
    return true;
}

/**
 * Fill the contact form subject/message, then scroll to it.
 */
export function prefillContact(subject, message = '') {
    window.dispatchEvent(new CustomEvent(CONTACT_PREFILL_EVENT, { detail: { subject, message } }));
    scrollToSection('contact');
}

export function onContactPrefill(callback) {
    const handler = (event) => callback(event.detail);
    window.addEventListener(CONTACT_PREFILL_EVENT, handler);
    return () => window.removeEventListener(CONTACT_PREFILL_EVENT, handler);
}
