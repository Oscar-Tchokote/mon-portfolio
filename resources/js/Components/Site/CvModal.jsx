import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Download, ExternalLink, Share2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/i18n';

function trackShare() {
    const token = document.head.querySelector('meta[name="csrf-token"]')?.content;
    const xsrf = decodeURIComponent(document.cookie.split('; ').find((c) => c.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '');

    fetch(route('cv.track'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-XSRF-TOKEN': xsrf, ...(token ? { 'X-CSRF-TOKEN': token } : {}) },
        body: JSON.stringify({ action: 'share' }),
    }).catch(() => {});
}

export default function CvModal({ open, onClose }) {
    const { site } = usePage().props;
    const { t } = useLang();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!open) {
            return undefined;
        }
        const onKey = (event) => event.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    const share = async () => {
        const url = route('cv.show');
        trackShare();
        if (navigator.share) {
            try {
                await navigator.share({ title: `CV — ${site.name}`, url });
                return;
            } catch (e) {
                // User cancelled: fall back to copy.
            }
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            window.prompt('URL', url);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={t('cv.title')}
                        className="flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-line bg-surface sm:h-[88vh] sm:rounded-3xl"
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 40, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
                            <div>
                                <p className="eyebrow">{t('cv.title')}</p>
                                <p className="font-semibold">{site.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {site.has_cv && (
                                    <>
                                        <button type="button" onClick={share} className="btn-ghost px-3 py-2" title={t('cv.share')}>
                                            {copied ? <Check className="h-4 w-4 text-accent" /> : <Share2 className="h-4 w-4" />}
                                            <span className="hidden sm:inline">{copied ? t('cv.copied') : t('cv.share')}</span>
                                        </button>
                                        <a href={route('cv.show')} target="_blank" rel="noopener" className="btn-ghost hidden px-3 py-2 sm:inline-flex" title={t('cv.open')}>
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                        <a href={route('cv.download')} className="btn-primary px-4 py-2">
                                            <Download className="h-4 w-4" />
                                            <span className="hidden sm:inline">{t('cv.download')}</span>
                                        </a>
                                    </>
                                )}
                                <button type="button" onClick={onClose} className="rounded-full p-2 text-muted hover:bg-line/60 hover:text-fg" aria-label={t('common.close')}>
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-line/30">
                            {site.has_cv ? (
                                <iframe src={`${route('cv.show')}#view=FitH`} title={t('cv.title')} className="h-full w-full" />
                            ) : (
                                <div className="flex h-full items-center justify-center p-8 text-center text-muted">{t('cv.unavailable')}</div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
