import { useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Mail, MapPin, Paperclip, Phone, Send } from 'lucide-react';
import { useEffect } from 'react';
import { WhatsappIcon } from '@/Components/Site/BrandIcons';
import Reveal from '@/Components/Site/Reveal';
import MaskText from '@/Components/Site/MaskText';
import { SocialLinks } from '@/Layouts/SiteLayout';
import { whatsappLink } from '@/lib/format';
import { useLang } from '@/lib/i18n';
import { onContactPrefill } from '@/lib/sections';

const budgets = ['< 300 000 FCFA', '300 000 – 1 000 000 FCFA', '1 000 000 – 3 000 000 FCFA', '> 3 000 000 FCFA'];

/**
 * Must match the "max:2048" (KB) rule in ContactController.
 */
const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;

const formatMegabytes = (bytes, lang) => {
    const size = (bytes / 1024 / 1024).toFixed(1);
    return lang === 'en' ? `${size} MB` : `${size.replace('.', ',')} Mo`;
};

function Field({ label, error, children, className = '' }) {
    return (
        <div className={className}>
            <label className="label-mono">{label}</label>
            {children}
            {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}

export default function ContactSection() {
    const { site, flash } = usePage().props;
    const { t, lang } = useLang();
    const { data, setData, post, processing, errors, reset, progress, setError, clearErrors } = useForm({
        name: '', email: '', phone: '', subject: '', budget: '', message: '', attachment: null, website: '',
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('subject')) setData('subject', params.get('subject'));
        if (params.get('message')) setData('message', `${params.get('message')}\n\n`);

        return onContactPrefill(({ subject, message }) => {
            setData((current) => ({ ...current, subject, message: message ? `${message}\n\n` : current.message }));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pickAttachment = (event) => {
        const file = event.target.files[0] ?? null;

        if (file && file.size > MAX_ATTACHMENT_BYTES) {
            event.target.value = '';
            setData('attachment', null);
            setError('attachment', t('contact.too_large').replace('{size}', formatMegabytes(file.size, lang)));
            return;
        }

        clearErrors('attachment');
        setData('attachment', file);
    };

    const submit = (event) => {
        event.preventDefault();
        if (data.attachment && data.attachment.size > MAX_ATTACHMENT_BYTES) {
            return;
        }
        post(route('contact.store'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const sent = flash.success === 'message_sent';
    const whatsapp = whatsappLink(site.whatsapp);

    return (
        <section id="contact" className="scroll-mt-20 border-t border-line py-28 lg:py-40">
            <div className="container-site">
                <Reveal y={16}>
                    <p className="eyebrow mb-6">// 05 — {t('contact.title')}</p>
                </Reveal>
                <h2 className="display mb-16 text-[14vw] sm:text-8xl lg:mb-24 lg:text-[8.5vw]">
                    <MaskText lines={[t('contact.big'), <span key="accent" className="accent-text text-accent">{t('contact.big_accent')}</span>]} />
                </h2>

                <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
                    <Reveal className="space-y-8 lg:col-span-4">
                        <p className="max-w-xs text-sm leading-relaxed text-muted">{t('contact.subtitle')}</p>
                        <ul className="divide-y divide-line border-y border-line">
                            {site.email && (
                                <li>
                                    <a href={`mailto:${site.email}`} className="group flex items-center justify-between gap-4 py-4">
                                        <span className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted" /><span className="link-underline">{site.email}</span></span>
                                    </a>
                                </li>
                            )}
                            {site.phone && (
                                <li className="flex items-center gap-3 py-4">
                                    <Phone className="h-4 w-4 text-muted" /> <span>{site.phone}</span>
                                </li>
                            )}
                            {site.location && (
                                <li className="flex items-center gap-3 py-4">
                                    <MapPin className="h-4 w-4 text-muted" /> <span>{site.location}</span>
                                </li>
                            )}
                        </ul>
                        {whatsapp && (
                            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] px-6 py-3 text-white hover:brightness-105">
                                <WhatsappIcon className="h-5 w-5" /> {t('contact.whatsapp')}
                            </a>
                        )}
                        <SocialLinks className="-ml-2" />
                    </Reveal>

                    <Reveal delay={0.1} className="lg:col-span-8">
                        {sent ? (
                            <div className="flex flex-col items-start border-t border-fg/15 pt-10">
                                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                                <p className="display mt-6 text-4xl">{t('contact.sent')}</p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="grid gap-x-8 gap-y-8 sm:grid-cols-2" noValidate>
                                <input type="text" name="website" value={data.website} onChange={(e) => setData('website', e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                                <Field label={t('contact.name')} error={errors.name}>
                                    <input className="field-line" value={data.name} onChange={(e) => setData('name', e.target.value)} required autoComplete="name" />
                                </Field>
                                <Field label={t('contact.email')} error={errors.email}>
                                    <input type="email" className="field-line" value={data.email} onChange={(e) => setData('email', e.target.value)} required autoComplete="email" />
                                </Field>
                                <Field label={t('contact.phone')} error={errors.phone}>
                                    <input type="tel" className="field-line" value={data.phone} onChange={(e) => setData('phone', e.target.value)} autoComplete="tel" placeholder="+237" />
                                </Field>
                                <Field label={t('contact.budget')} error={errors.budget}>
                                    <select className="field-line" value={data.budget} onChange={(e) => setData('budget', e.target.value)}>
                                        <option value="">{t('contact.budget_none')}</option>
                                        {budgets.map((budget) => <option key={budget} value={budget}>{budget}</option>)}
                                    </select>
                                </Field>
                                <Field label={t('contact.subject')} error={errors.subject} className="sm:col-span-2">
                                    <input className="field-line" value={data.subject} onChange={(e) => setData('subject', e.target.value)} />
                                </Field>
                                <Field label={t('contact.message')} error={errors.message} className="sm:col-span-2">
                                    <textarea rows={6} className="field-line" value={data.message} onChange={(e) => setData('message', e.target.value)} required />
                                </Field>
                                <Field label={t('contact.attachment')} error={errors.attachment} className="sm:col-span-2">
                                    <label className="mt-2 flex cursor-pointer items-center gap-3 border-b border-dashed border-fg/25 py-3 text-sm text-muted transition-colors duration-500 hover:border-accent hover:text-fg">
                                        <Paperclip className="h-4 w-4" />
                                        <span className="truncate">{data.attachment?.name ?? 'PDF, DOC, DOCX, PNG, JPG, ZIP'}</span>
                                        <input type="file" className="sr-only" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip" onChange={pickAttachment} />
                                    </label>
                                    {progress && <progress value={progress.percentage} max="100" className="mt-2 h-1 w-full" />}
                                </Field>
                                <div className="sm:col-span-2">
                                    <button type="submit" disabled={processing} className="btn-primary w-full py-4 text-base sm:w-auto sm:px-10" data-cursor="Send">
                                        <Send className="h-4 w-4" /> {processing ? t('contact.sending') : t('contact.send')}
                                    </button>
                                </div>
                            </form>
                        )}
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
