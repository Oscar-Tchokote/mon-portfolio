import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, LogOut } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

let openDialog = null;

/**
 * Ask the user to confirm an action. Resolves to true when confirmed.
 * Falls back to the native dialog when no <ConfirmHost> is mounted.
 *
 * @param {{ title: string, message?: string, confirmLabel?: string, cancelLabel?: string, tone?: 'danger'|'default', icon?: 'logout'|'warning' }} options
 * @returns {Promise<boolean>}
 */
export function confirmAction(options) {
    if (!openDialog) {
        return Promise.resolve(window.confirm(options.message ? `${options.title}\n\n${options.message}` : options.title));
    }
    return openDialog(options);
}

const icons = { logout: LogOut, warning: AlertTriangle };

/**
 * Renders the confirmation dialog; mount once in the admin layout.
 */
export default function ConfirmHost() {
    const [dialog, setDialog] = useState(null);
    const resolver = useRef(null);
    const confirmButton = useRef(null);

    useEffect(() => {
        openDialog = (options) => new Promise((resolve) => {
            resolver.current?.(false);
            resolver.current = resolve;
            setDialog(options);
        });
        return () => {
            openDialog = null;
        };
    }, []);

    const close = useCallback((result) => {
        resolver.current?.(result);
        resolver.current = null;
        setDialog(null);
    }, []);

    useEffect(() => {
        if (!dialog) {
            return undefined;
        }
        confirmButton.current?.focus();
        const onKey = (event) => {
            if (event.key === 'Escape') {
                close(false);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [dialog, close]);

    const Icon = icons[dialog?.icon] ?? AlertTriangle;
    const danger = dialog?.tone !== 'default';

    return (
        <>
            <AnimatePresence>
                {dialog && (
                    <motion.div
                        className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => close(false)}
                    >
                        <motion.div
                            role="alertdialog"
                            aria-modal="true"
                            aria-labelledby="confirm-title"
                            className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl"
                            initial={{ opacity: 0, y: 24, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="flex items-start gap-4">
                                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${danger ? 'bg-red-500/10 text-red-500' : 'bg-accent/10 text-accent'}`}>
                                    <Icon className="h-5 w-5" />
                                </span>
                                <div className="min-w-0">
                                    <h2 id="confirm-title" className="text-lg font-semibold tracking-tight">{dialog.title}</h2>
                                    {dialog.message && <p className="mt-1.5 text-sm leading-relaxed text-muted">{dialog.message}</p>}
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <button type="button" onClick={() => close(false)} className="btn border border-line px-5 py-2.5 hover:border-fg">
                                    {dialog.cancelLabel ?? 'Annuler'}
                                </button>
                                <button
                                    ref={confirmButton}
                                    type="button"
                                    onClick={() => close(true)}
                                    className={`btn px-5 py-2.5 ${danger ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-fg text-bg hover:bg-accent hover:text-accent-fg'}`}
                                >
                                    {dialog.confirmLabel ?? 'Confirmer'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
