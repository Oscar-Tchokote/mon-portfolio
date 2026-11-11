import { Link, usePage } from '@inertiajs/react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import SectionTitle from '@/Components/Site/Sections/SectionTitle';
import Tilt3D from '@/Components/Site/Tilt3D';
import { useLang } from '@/lib/i18n';

function ProjectSlide({ project, index }) {
    const { t, pick } = useLang();

    return (
        <Link
            href={route('projects.show', project.slug)}
            className="group block w-[82vw] shrink-0 snap-start sm:w-[58vw] lg:w-[34vw]"
            data-cursor={t('projects.drag')}
        >
            <Tilt3D max={7} scale={1.015} className="relative h-[52vh] overflow-hidden bg-bone/5 lg:h-[58vh]">
                {project.cover_url ? (
                    <img
                        src={project.cover_url}
                        alt={project.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1.6s] ease-expo group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-end bg-gradient-to-br from-[#d0714c]/30 via-bone/5 to-transparent p-8 transition-transform duration-[1.6s] ease-expo group-hover:scale-105">
                        <pre className="font-mono text-xs leading-relaxed text-bone/50">
                            {`<Project\n  name="${project.title}"\n  stack={[${(project.technologies ?? []).slice(0, 3).map((tech) => `"${tech}"`).join(', ')}]}\n/>`}
                        </pre>
                    </div>
                )}
                <span className="display absolute right-4 top-3 text-6xl text-bone/90 mix-blend-difference">
                    {String(index + 1).padStart(2, '0')}
                </span>
            </Tilt3D>
            <div className="mt-5 flex items-start justify-between gap-6">
                <div className="min-w-0">
                    <h3 className="text-2xl font-medium tracking-tight transition-colors duration-500 group-hover:text-[#d0714c]">{project.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-bone/50">{pick(project, 'summary')}</p>
                    {project.technologies?.length > 0 && (
                        <p className="mt-3 font-mono text-[11px] text-bone/40">
                            {project.technologies.slice(0, 4).map((tech) => `#${tech}`).join('  ')}
                        </p>
                    )}
                </div>
                <span className="eyebrow mt-1 shrink-0 rounded-full border border-bone/25 px-3 py-1.5 text-bone/70">
                    {t(`cat.${project.category}`)}
                </span>
            </div>
        </Link>
    );
}

function GithubSlide() {
    const { site } = usePage().props;
    const { t } = useLang();

    if (!site.github) {
        return null;
    }

    return (
        <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-[60vw] shrink-0 snap-start flex-col items-center justify-center gap-4 border border-bone/15 p-8 text-center transition-colors duration-500 hover:border-bone/40 sm:w-[40vw] lg:h-[58vh] lg:w-[22vw]"
            data-cursor="GitHub"
        >
            <span className="display text-4xl transition-colors duration-500 group-hover:text-[#d0714c] lg:text-[2.8vw]">{t('projects.more')}</span>
            <span className="text-sm text-bone/50">{t('projects.more_sub')}</span>
        </a>
    );
}

/**
 * On large screens the vertical scroll drives a horizontal track (sticky pin);
 * on small screens it falls back to a native swipeable carousel.
 */
function useHorizontalScroll(deps) {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const [distance, setDistance] = useState(0);
    const reduceMotion = useReducedMotion();

    useLayoutEffect(() => {
        const media = window.matchMedia('(min-width: 1024px)');
        const measure = () => {
            const track = trackRef.current;
            setDistance(media.matches && !reduceMotion && track ? Math.max(0, track.scrollWidth - window.innerWidth) : 0);
        };
        measure();
        const observer = new ResizeObserver(measure);
        if (trackRef.current) {
            observer.observe(trackRef.current);
        }
        window.addEventListener('resize', measure);
        media.addEventListener('change', measure);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', measure);
            media.removeEventListener('change', measure);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reduceMotion, ...deps]);

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
    const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
    const velocity = useVelocity(scrollYProgress);
    const skewX = useSpring(useTransform(velocity, [-1.5, 0, 1.5], [5, 0, -5]), { stiffness: 260, damping: 40 });

    return { sectionRef, trackRef, distance, x, skewX };
}

export default function ProjectsSection({ projects }) {
    const { t } = useLang();
    const [category, setCategory] = useState('all');

    const categories = useMemo(() => ['all', ...new Set(projects.map((project) => project.category))], [projects]);
    const visible = category === 'all' ? projects : projects.filter((project) => project.category === category);
    const { sectionRef, trackRef, distance, x, skewX } = useHorizontalScroll([visible.length]);
    const pinned = distance > 0;

    return (
        <section id="projets" className="relative scroll-mt-0 bg-[#0e0e0c] text-bone dark:border-y dark:border-line dark:bg-[#151411]">
            <div ref={sectionRef} style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}>
                <div className={`flex flex-col justify-center overflow-hidden py-24 ${pinned ? 'sticky top-0 h-screen lg:py-0 lg:pt-10' : 'lg:py-32'}`}>
                    <div className="container-site">
                        <SectionTitle
                            onDark
                            number="02"
                            label={t('projects.title')}
                            title={t('home.featured')}
                            className="!mb-10 lg:!mb-12"
                            aside={
                                categories.length > 2 && (
                                    <div className="flex flex-wrap gap-2" role="tablist">
                                        {categories.map((key) => (
                                            <button
                                                key={key}
                                                type="button"
                                                role="tab"
                                                aria-selected={category === key}
                                                onClick={() => setCategory(key)}
                                                className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-500 ${
                                                    category === key ? 'border-bone bg-bone text-[#0e0e0c]' : 'border-bone/25 text-bone/60 hover:border-bone/60 hover:text-bone'
                                                }`}
                                            >
                                                {key === 'all' ? t('projects.all') : t(`cat.${key}`)}
                                            </button>
                                        ))}
                                    </div>
                                )
                            }
                        />
                    </div>

                    {visible.length === 0 ? (
                        <p className="container-site py-20 text-bone/50">{t('projects.empty')}</p>
                    ) : (
                        <motion.div
                            ref={trackRef}
                            style={pinned ? { x, skewX } : undefined}
                            className={`flex gap-5 px-5 pb-4 sm:px-8 lg:gap-10 lg:px-12 ${pinned ? 'w-max' : 'snap-x snap-mandatory scroll-pl-5 overflow-x-auto sm:scroll-pl-8'}`}
                        >
                            {visible.map((project, index) => (
                                <ProjectSlide key={project.id} project={project} index={index} />
                            ))}
                            <GithubSlide />
                        </motion.div>
                    )}

                    <div className="container-site mt-8 flex items-center justify-between gap-4 lg:hidden">
                        <p className="eyebrow text-bone/40">← swipe →</p>
                        <span className="font-mono text-xs text-bone/40">{String(visible.length).padStart(2, '0')} {t('projects.title').toLowerCase()}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
