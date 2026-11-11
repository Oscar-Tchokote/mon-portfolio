import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ArrowLink from '@/Components/Site/ArrowLink';
import Markdown from '@/Components/Site/Markdown';
import MaskText from '@/Components/Site/MaskText';
import ParallaxImage from '@/Components/Site/ParallaxImage';
import PerspectiveGrid from '@/Components/Site/PerspectiveGrid';
import Reveal, { RevealItem } from '@/Components/Site/Reveal';
import Seo from '@/Components/Site/Seo';
import Tilt3D from '@/Components/Site/Tilt3D';
import SiteLayout from '@/Layouts/SiteLayout';
import { useLang } from '@/lib/i18n';
import { EASE_EXPO } from '@/lib/motion';

function Lightbox({ images, index, onClose, onMove }) {
    useEffect(() => {
        const onKey = (event) => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'ArrowRight') onMove(1);
            if (event.key === 'ArrowLeft') onMove(-1);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose, onMove]);

    return (
        <motion.div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
            <button type="button" className="absolute right-4 top-4 rounded-full p-2 text-white/80 hover:bg-white/10" aria-label="Fermer"><X className="h-6 w-6" /></button>
            {images.length > 1 && (
                <>
                    <button type="button" onClick={(e) => { e.stopPropagation(); onMove(-1); }} className="absolute left-2 rounded-full p-3 text-white/80 hover:bg-white/10 sm:left-6" aria-label="Précédent"><ChevronLeft className="h-7 w-7" /></button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); onMove(1); }} className="absolute right-2 rounded-full p-3 text-white/80 hover:bg-white/10 sm:right-6" aria-label="Suivant"><ChevronRight className="h-7 w-7" /></button>
                </>
            )}
            <AnimatePresence mode="wait">
                <motion.img
                    key={images[index]}
                    src={images[index]}
                    alt=""
                    className="max-h-[88vh] max-w-full object-contain"
                    initial={{ opacity: 0, rotateY: -12, scale: 0.96 }}
                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                    exit={{ opacity: 0, rotateY: 12, scale: 0.96 }}
                    transition={{ duration: 0.5, ease: EASE_EXPO }}
                    style={{ transformPerspective: 1200 }}
                    onClick={(e) => e.stopPropagation()}
                />
            </AnimatePresence>
            <p className="absolute bottom-5 font-mono text-xs text-white/60">{index + 1} / {images.length}</p>
        </motion.div>
    );
}

export default function ProjectShow({ project, others }) {
    const { t, pick } = useLang();
    const [lightbox, setLightbox] = useState(null);
    const gallery = [project.cover_url, ...project.images.map((image) => image.url)].filter(Boolean);
    const next = others[0];

    const meta = [
        { label: 'Type', value: t(`cat.${project.category}`) },
        project.client && { label: t('projects.client'), value: project.client },
        project.year && { label: t('projects.year'), value: project.year },
        project.technologies?.length > 0 && { label: t('projects.stack'), value: project.technologies.join(' · ') },
    ].filter(Boolean);

    return (
        <SiteLayout>
            <Seo title={project.title} description={pick(project, 'summary')} image={project.cover_url} />

            <article>
                <header className="relative overflow-hidden">
                    <PerspectiveGrid className="h-[80%] opacity-40" />
                    <div className="container-site relative pb-14 pt-10 sm:pt-16">
                        <Link href={`${route('home')}#projets`} className="link-underline inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-muted hover:text-fg">
                            <ArrowLeft className="h-3.5 w-3.5" /> {t('projects.back')}
                        </Link>

                        <h1 className="display mt-12 text-[13vw] sm:text-8xl lg:text-[8vw]">
                            <MaskText immediate delay={0.1} lines={[project.title]} />
                        </h1>

                        <Reveal delay={0.3} className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
                            <p className="max-w-2xl text-lg leading-relaxed text-fg/75 lg:col-span-7">{pick(project, 'summary')}</p>
                            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
                                {project.demo_url && <ArrowLink href={project.demo_url} external cursor="Live">{t('projects.demo')}</ArrowLink>}
                                {project.github_url && <ArrowLink href={project.github_url} external cursor="Code">{t('projects.code')}</ArrowLink>}
                            </div>
                        </Reveal>
                    </div>
                </header>

                <Reveal as="dl" stagger={0.06} immediate className="container-site grid grid-cols-2 border-y border-line lg:grid-cols-4">
                    {meta.map((item) => (
                        <RevealItem key={item.label} y={16} className="border-line py-6 pr-6 [&:not(:last-child)]:lg:border-r lg:pl-6 lg:first:pl-0">
                            <dt className="eyebrow">{item.label}</dt>
                            <dd className="mt-2 font-medium">{item.value}</dd>
                        </RevealItem>
                    ))}
                </Reveal>

                {project.cover_url && (
                    <div className="container-site mt-14">
                        <button type="button" onClick={() => setLightbox(0)} className="block w-full" data-cursor="Zoom">
                            <ParallaxImage src={project.cover_url} alt={project.title} className="aspect-[16/9] w-full" speed={8} />
                        </button>
                    </div>
                )}

                <div className="container-site grid gap-12 py-24 lg:grid-cols-12 lg:gap-12 lg:py-32">
                    <Reveal className="lg:col-span-4">
                        <p className="eyebrow lg:sticky lg:top-28">// Case study</p>
                    </Reveal>
                    <Reveal delay={0.1} className="lg:col-span-8">
                        <Markdown className="prose-lg max-w-3xl">{pick(project, 'description')}</Markdown>
                    </Reveal>
                </div>

                {project.images.length > 0 && (
                    <section className="container-site pb-24">
                        <Reveal y={16}>
                            <p className="eyebrow mb-8">// {t('projects.gallery')}</p>
                        </Reveal>
                        <Reveal stagger={0.08} className="grid gap-6 sm:grid-cols-2">
                            {project.images.map((image, index) => (
                                <RevealItem key={image.id} className={index % 3 === 0 ? 'sm:col-span-2' : ''}>
                                    <button type="button" onClick={() => setLightbox(project.cover_url ? index + 1 : index)} className="block w-full" data-cursor="Zoom">
                                        <Tilt3D max={6} className={`overflow-hidden bg-line ${index % 3 === 0 ? 'aspect-[16/8]' : 'aspect-[4/3]'}`}>
                                            <img src={image.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                                        </Tilt3D>
                                    </button>
                                </RevealItem>
                            ))}
                        </Reveal>
                    </section>
                )}
            </article>

            {next && (
                <section className="relative overflow-hidden bg-[#0e0e0c] text-bone dark:border-t dark:border-line dark:bg-[#151411]">
                    <Link href={route('projects.show', next.slug)} className="group container-site flex flex-col gap-6 py-24 lg:py-32" data-cursor={t('projects.drag')}>
                        <p className="eyebrow text-bone/50">// {t('projects.others')}</p>
                        <span className="display text-[12vw] transition-colors duration-700 group-hover:text-[#d0714c] lg:text-[7vw]">
                            {next.title} <span className="inline-block transition-transform duration-700 ease-expo group-hover:translate-x-4">→</span>
                        </span>
                        {pick(next, 'summary') && <span className="max-w-xl text-sm text-bone/50">{pick(next, 'summary')}</span>}
                    </Link>
                </section>
            )}

            <AnimatePresence>
                {lightbox !== null && gallery.length > 0 && (
                    <Lightbox
                        images={gallery}
                        index={lightbox}
                        onClose={() => setLightbox(null)}
                        onMove={(step) => setLightbox((current) => (current + step + gallery.length) % gallery.length)}
                    />
                )}
            </AnimatePresence>
        </SiteLayout>
    );
}
