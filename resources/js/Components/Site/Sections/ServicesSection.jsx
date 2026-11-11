import { ArrowRight, Calculator, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import Reveal, { RevealItem } from '@/Components/Site/Reveal';
import SectionTitle from '@/Components/Site/Sections/SectionTitle';
import ServiceIcon from '@/Components/Site/ServiceIcon';
import Tilt3D from '@/Components/Site/Tilt3D';
import { formatFcfa } from '@/lib/format';
import { useLang } from '@/lib/i18n';
import { prefillContact } from '@/lib/sections';

function Estimator({ options }) {
    const { t, pick } = useLang();
    const types = options.type ?? [];
    const features = options.feature ?? [];
    const support = options.support ?? [];
    const [typeId, setTypeId] = useState(null);
    const [extras, setExtras] = useState([]);

    const selectedType = types.find((option) => option.id === typeId);
    const selectedExtras = [...features, ...support].filter((option) => extras.includes(option.id));
    const total = useMemo(
        () => (selectedType?.price ?? 0) + selectedExtras.reduce((sum, option) => sum + option.price, 0),
        [selectedType, selectedExtras],
    );

    const toggle = (id) => setExtras((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));

    const summary = selectedType
        ? [
            `${t('estimator.type')} : ${pick(selectedType, 'label')}`,
            ...selectedExtras.map((option) => `+ ${pick(option, 'label')}`),
            `${t('estimator.total')} : ${t('estimator.from')} ${formatFcfa(total)}`,
        ].join('\n')
        : '';

    const optionClass = (active) =>
        `flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left text-sm transition ${active ? 'border-accent bg-accent/5' : 'border-line hover:border-fg/30'}`;

    const renderGroup = (title, items, multiple) => items.length > 0 && (
        <fieldset>
            <legend className="eyebrow mb-3">{title}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
                {items.map((option) => {
                    const active = multiple ? extras.includes(option.id) : typeId === option.id;
                    return (
                        <button key={option.id} type="button" aria-pressed={active} onClick={() => (multiple ? toggle(option.id) : setTypeId(option.id))} className={optionClass(active)}>
                            <span className="flex items-center gap-3">
                                <span className={`flex h-5 w-5 shrink-0 items-center justify-center border ${multiple ? 'rounded-md' : 'rounded-full'} ${active ? 'border-accent bg-accent text-accent-fg' : 'border-line'}`}>
                                    {active && <Check className="h-3 w-3" strokeWidth={3} />}
                                </span>
                                <span className="font-medium">{pick(option, 'label')}</span>
                            </span>
                            <span className="shrink-0 font-mono text-xs text-muted">{multiple ? '+' : ''}{formatFcfa(option.price)}</span>
                        </button>
                    );
                })}
            </div>
        </fieldset>
    );

    return (
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-8">
                {renderGroup(t('estimator.type'), types, false)}
                {renderGroup(t('estimator.feature'), features, true)}
                {renderGroup(t('estimator.support'), support, true)}
            </div>
            <div className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-2xl bg-fg p-6 text-bg sm:p-8">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-bg/60">{t('estimator.total')}</p>
                    {selectedType ? (
                        <>
                            <p className="mt-3 text-sm text-bg/60">{t('estimator.from')}</p>
                            <p className="display text-5xl">{formatFcfa(total)}</p>
                            <ul className="mt-6 space-y-2 border-t border-bg/15 pt-5 text-sm text-bg/80">
                                <li>{pick(selectedType, 'label')}</li>
                                {selectedExtras.map((option) => <li key={option.id}>+ {pick(option, 'label')}</li>)}
                            </ul>
                            <button type="button" onClick={() => prefillContact(t('estimator.title'), summary)} className="btn mt-6 w-full bg-accent py-3 text-accent-fg hover:brightness-110">
                                {t('estimator.send')} <ArrowRight className="h-4 w-4" />
                            </button>
                        </>
                    ) : (
                        <p className="mt-4 text-sm text-bg/70">{t('estimator.pick_type')}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ServicesSection({ services, packs, estimator }) {
    const { t, pick } = useLang();
    const hasEstimator = (estimator.type ?? []).length > 0;

    if (services.length === 0 && packs.length === 0 && !hasEstimator) {
        return null;
    }

    return (
        <section id="services" className="scroll-mt-20 py-28 lg:py-40">
            <div className="container-site">
                <SectionTitle
                    number="03"
                    label={t('services.title')}
                    title={t('home.services')}
                    aside={<p className="max-w-sm text-sm leading-relaxed text-muted">{t('services.subtitle')}</p>}
                />

                <Reveal as="ol" stagger={0.07} className="border-t border-line">
                    {services.map((service, index) => (
                        <RevealItem as="li" key={service.id} className="group relative border-b border-line">
                            <div className="grid gap-4 py-8 transition-[padding] duration-700 ease-expo lg:grid-cols-12 lg:items-start lg:gap-8 lg:py-10 lg:group-hover:pl-6">
                                <span className="font-mono text-xs text-muted lg:col-span-1 lg:pt-3">({String(index + 1).padStart(2, '0')})</span>
                                <div className="flex items-center gap-4 lg:col-span-5">
                                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-accent transition-[color,background-color,border-color,transform] duration-700 ease-expo [transform:perspective(400px)_rotateY(0deg)] group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg group-hover:[transform:perspective(400px)_rotateY(360deg)]">
                                        <ServiceIcon name={service.icon} className="h-5 w-5" />
                                    </span>
                                    <h3 className="display text-3xl transition-colors duration-500 group-hover:text-accent lg:text-5xl">{pick(service, 'title')}</h3>
                                </div>
                                <div className="lg:col-span-6 lg:pt-2">
                                    <p className="leading-relaxed text-fg/75">{pick(service, 'description')}</p>
                                    {service.features?.length > 0 && (
                                        <ul className="mt-5 flex flex-wrap gap-2">
                                            {service.features.map((feature) => (
                                                <li key={feature} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </RevealItem>
                    ))}
                </Reveal>

                {packs.length > 0 && (
                    <div className="mt-20">
                        <Reveal className="mb-10 max-w-2xl">
                            <h3 className="display text-4xl lg:text-5xl">{t('services.packs')}</h3>
                            <p className="mt-3 text-muted">{t('services.packs_sub')}</p>
                        </Reveal>
                        <div className="grid gap-5 lg:grid-cols-3">
                            {packs.map((pack, index) => (
                                <Reveal key={pack.id} delay={index * 0.06} className="h-full">
                                <Tilt3D
                                    max={6}
                                    fill
                                    className={`flex h-full flex-col rounded-2xl border p-7 ${pack.is_highlighted ? 'border-fg bg-fg text-bg shadow-[0_40px_80px_-40px_rgb(var(--accent)/0.6)]' : 'border-line bg-bg'}`}
                                >
                                    {pack.is_highlighted && (
                                        <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-fg">
                                            {t('services.recommended')}
                                        </span>
                                    )}
                                    <h4 className="text-2xl font-medium tracking-tight">{pick(pack, 'name')}</h4>
                                    {pick(pack, 'tagline') && <p className={`mt-1 text-sm ${pack.is_highlighted ? 'text-bg/70' : 'text-muted'}`}>{pick(pack, 'tagline')}</p>}
                                    <div className="mt-6">
                                        {pick(pack, 'price_note') && <p className={`text-xs ${pack.is_highlighted ? 'text-bg/60' : 'text-muted'}`}>{pick(pack, 'price_note')}</p>}
                                        <p className="display text-4xl">
                                            {pack.price ? formatFcfa(pack.price) : t('services.on_quote')}
                                        </p>
                                    </div>
                                    {pack.features?.length > 0 && (
                                        <ul className={`mt-6 space-y-2.5 border-t pt-6 text-sm ${pack.is_highlighted ? 'border-bg/15' : 'border-line'}`}>
                                            {pack.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-2">
                                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => prefillContact(`Pack ${pick(pack, 'name')}`)}
                                        className={`btn mt-8 py-3 ${pack.is_highlighted ? 'bg-accent text-accent-fg hover:brightness-110' : 'border border-line hover:border-fg'}`}
                                    >
                                        {t('services.choose')}
                                    </button>
                                </Tilt3D>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                )}

                {hasEstimator && (
                    <div id="estimateur" className="mt-20 scroll-mt-20">
                        <Reveal className="mb-10 max-w-2xl">
                            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                <Calculator className="h-5 w-5" />
                            </div>
                            <h3 className="display text-4xl lg:text-5xl">{t('estimator.title')}</h3>
                            <p className="mt-3 text-muted">{t('estimator.subtitle')}</p>
                        </Reveal>
                        <Estimator options={estimator} />
                    </div>
                )}
            </div>
        </section>
    );
}
