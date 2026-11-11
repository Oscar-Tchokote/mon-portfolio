import { usePage } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import ArrowLink from '@/Components/Site/ArrowLink';
import Markdown from '@/Components/Site/Markdown';
import MaskText from '@/Components/Site/MaskText';
import ParallaxImage from '@/Components/Site/ParallaxImage';
import Reveal, { RevealItem } from '@/Components/Site/Reveal';
import Tilt3D from '@/Components/Site/Tilt3D';
import { useOpenCv } from '@/Layouts/SiteLayout';
import { useLang } from '@/lib/i18n';
import { scrollToSection } from '@/lib/sections';

function initials(name) {
    return name.split(' ').filter(Boolean).map((part) => part.charAt(0)).join('').slice(0, 2);
}

export default function AboutSection({ experiences, skills }) {
    const { site } = usePage().props;
    const { t, pick } = useLang();
    const openCv = useOpenCv();
    const statement = t('about.statement').split(' ');
    const statementTail = statement.splice(-3).join(' ');

    return (
        <section id="a-propos" className="scroll-mt-20">
            <div className="container-site grid gap-14 py-28 lg:grid-cols-12 lg:gap-12 lg:py-44">
                <div className="lg:col-span-4">
                    <Reveal y={16}>
                        <p className="eyebrow mb-8">// 01 — {t('about.title')}</p>
                    </Reveal>
                    <Tilt3D max={8} glare className="relative w-full max-w-sm">
                        <span aria-hidden="true" className="absolute inset-0 border border-accent/60 [transform:translate3d(16px,16px,-60px)]" />
                        <ParallaxImage src={site.photo_url} alt={site.name} className="aspect-[4/5] w-full">
                            <div className="flex h-full w-full items-end bg-gradient-to-br from-accent/25 via-line to-line p-8">
                                <span className="accent-text text-[10rem] leading-none text-accent/70">{initials(site.name)}</span>
                            </div>
                        </ParallaxImage>
                        <span
                            aria-hidden="true"
                            className="absolute -bottom-5 -left-5 rounded-full bg-fg px-4 py-2 font-mono text-[11px] text-bg shadow-xl [transform:translateZ(70px)]"
                        >
                            {'<'}{site.brand || 'dev'} {'/>'}
                        </span>
                    </Tilt3D>
                    <Reveal delay={0.2} className="mt-6 font-mono text-xs leading-relaxed text-muted">
                        <p className="text-fg">{site.name}</p>
                        <p>{pick(site, 'title')} · {site.location}</p>
                    </Reveal>
                </div>

                <div className="lg:col-span-8">
                    <h2 className="text-[8vw] font-medium leading-[1.05] tracking-tight sm:text-[5.2vw] lg:text-[3.6vw]">
                        <MaskText
                            lines={[
                                <>
                                    {statement.join(' ')}{' '}
                                    <span className="accent-text text-accent">{statementTail}</span>
                                </>,
                            ]}
                        />
                    </h2>

                    <Reveal delay={0.1} className="mt-12 grid gap-10 lg:grid-cols-[1fr_auto]">
                        <Markdown className="max-w-2xl text-base leading-relaxed text-fg/80 lg:text-lg">{pick(site, 'bio')}</Markdown>
                    </Reveal>

                    <Reveal delay={0.15} className="mt-12 flex flex-wrap items-center gap-4">
                        <ArrowLink onClick={() => scrollToSection('contact')}>{t('nav.hire')}</ArrowLink>
                        <button type="button" onClick={openCv} className="link-underline inline-flex items-center gap-2 text-sm font-medium">
                            <FileText className="h-4 w-4" /> {t('nav.cv')}
                        </button>
                    </Reveal>

                    {experiences.length > 0 && (
                        <div className="mt-24">
                            <Reveal y={16}>
                                <p className="eyebrow mb-6">{t('about.journey')}</p>
                            </Reveal>
                            <Reveal as="ol" stagger={0.06} className="border-t border-line">
                                {experiences.map((item) => (
                                    <RevealItem as="li" key={item.id} className="group grid gap-2 border-b border-line py-6 sm:grid-cols-[9rem_1fr] sm:gap-8">
                                        <p className="font-mono text-xs text-muted">{item.period}</p>
                                        <div>
                                            <h3 className="text-xl font-medium tracking-tight transition-colors duration-500 group-hover:text-accent lg:text-2xl">{pick(item, 'title')}</h3>
                                            <p className="mt-1 text-sm text-muted">
                                                {item.organization}{item.location ? ` — ${item.location}` : ''} · {t(`about.${item.type}`)}
                                            </p>
                                            {pick(item, 'description') && (
                                                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg/75">{pick(item, 'description')}</p>
                                            )}
                                        </div>
                                    </RevealItem>
                                ))}
                            </Reveal>
                        </div>
                    )}

                    {Object.keys(skills).length > 0 && (
                        <div className="mt-24">
                            <Reveal y={16}>
                                <p className="eyebrow mb-6">{t('about.skills')}</p>
                            </Reveal>
                            <Reveal stagger={0.06} className="border-t border-line">
                                {Object.entries(skills).map(([category, items]) => (
                                    <RevealItem key={category} className="grid gap-3 border-b border-line py-6 sm:grid-cols-[9rem_1fr] sm:gap-8">
                                        <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted">{t(`skills.${category}`)}</p>
                                        <p className="text-xl font-medium leading-snug tracking-tight lg:text-2xl">
                                            {items.map((skill, index) => (
                                                <span key={skill.name}>
                                                    {skill.name}
                                                    {index < items.length - 1 && <span className="mx-2 text-accent">/</span>}
                                                </span>
                                            ))}
                                        </p>
                                    </RevealItem>
                                ))}
                            </Reveal>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
