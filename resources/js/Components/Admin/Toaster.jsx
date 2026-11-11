import { router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { onToast } from '@/lib/toast';

const DURATION_MS = 4500;

const styles = {
    success: { Icon: CheckCircle2, icon: 'text-emerald-500', bar: 'bg-emerald-500' },
    error: { Icon: AlertCircle, icon: 'text-red-500', bar: 'bg-red-500' },
    info: { Icon: Info, icon: 'text-accent', bar: 'bg-accent' },
};

let nextId = 1;

function ToastItem({ toast, onDismiss }) {
    const { Icon, icon, bar } = styles[toast.type] ?? styles.info;
    const [paused, setPaused] = useState(false);
    const remaining = useRef(DURATION_MS);
    const startedAt = useRef(Date.now());

    useEffect(() => {
        if (paused) {
            remaining.current -= Date.now() - startedAt.current;
            return undefined;
        }
        startedAt.current = Date.now();
        const timer = setTimeout(() => onDismiss(toast.id), remaining.current);
        return () => clearTimeout(timer);
    }, [paused, toast.id, onDismiss]);

    return (
        <motion.li
            layout
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            role={toast.type === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto relative w-full overflow-hidden rounded-xl border border-line bg-surface shadow-[0_18px_40px_-18px_rgb(0_0_0/0.35)]"
        >
            <div className="flex items-start gap-3 px-4 py-3.5">
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${icon}`} />
                <p className="flex-1 text-sm font-medium leading-snug text-fg">{toast.text}</p>
                <button type="button" onClick={() => onDismiss(toast.id)} className="-mr-1 rounded-md p-1 text-muted transition hover:bg-line/60 hover:text-fg" aria-label="Fermer">
                    <X className="h-4 w-4" />
                </button>
            </div>
            <span
                className={`absolute bottom-0 left-0 h-0.5 w-full origin-left ${bar}`}
                style={{ animation: `toast-progress ${DURATION_MS}ms linear forwards`, animationPlayState: paused ? 'paused' : 'running' }}
            />
        </motion.li>
    );
}

/**
 * Stack of toasts fed by server flash messages (success / error), validation
 * errors, server exceptions and client-side `toast()` calls.
 */
export default function Toaster() {
    const { flash, errors } = usePage().props;
    const [toasts, setToasts] = useState([]);

    const push = useCallback((text, type) => {
        if (!text) {
            return;
        }
        setToasts((current) => [...current.filter((item) => item.text !== text), { id: nextId++, text, type }].slice(-4));
    }, []);

    const dismiss = useCallback((id) => setToasts((current) => current.filter((item) => item.id !== id)), []);

    useEffect(() => {
        push(flash?.success, 'success');
        push(flash?.error, 'error');
    }, [flash, push]);

    useEffect(() => {
        const count = Object.keys(errors ?? {}).length;
        if (count > 0) {
            push(count > 1 ? `${count} champs à corriger dans le formulaire.` : 'Un champ est à corriger dans le formulaire.', 'error');
        }
    }, [errors, push]);

    useEffect(() => onToast(({ text, type }) => push(text, type)), [push]);

    useEffect(
        () => router.on('exception', () => {
            push('Une erreur inattendue est survenue. Réessayez dans un instant.', 'error');
        }),
        [push],
    );

    return (
        <ol className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6" aria-live="polite">
            <AnimatePresence initial={false}>
                {toasts.map((item) => (
                    <ToastItem key={item.id} toast={item} onDismiss={dismiss} />
                ))}
            </AnimatePresence>
        </ol>
    );
}
