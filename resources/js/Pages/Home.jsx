import { usePage } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ArrowLink from '@/Components/Site/ArrowLink';
import { entranceDelay } from '@/Components/Site/Curtain';
import MaskText from '@/Components/Site/MaskText';
import HeroScene from '@/Components/Site/HeroScene';
import Marquee from '@/Components/Site/Marquee';
import PerspectiveGrid from '@/Components/Site/PerspectiveGrid';
import PostCard from '@/Components/Site/PostCard';
import Reveal, { RevealItem } from '@/Components/Site/Reveal';
import AboutSection from '@/Components/Site/Sections/AboutSection';
import ContactSection from '@/Components/Site/Sections/ContactSection';
import ProjectsSection from '@/Components/Site/Sections/ProjectsSection';
import SectionTitle from '@/Components/Site/Sections/SectionTitle';
import ServicesSection from '@/Components/Site/Sections/ServicesSection';
import Seo from '@/Components/Site/Seo';
import SiteLayout from '@/Layouts/SiteLayout';
import { useLang } from '@/lib/i18n';
import { EASE_EXPO } from '@/lib/motion';
import { scrollToSection } from '@/lib/sections';

function Hero({ skills }) {
    const { site } = usePage().props;
    const { t, pick } = useLang();
    const reduceMotion = useReducedMotion();
    const [delay] = useState(() => entranceDelay());
    const title = pick(site, 'title');
    const [firstWord, ...rest] = title.split(' ');

    const fade = (extra) => (reduceMotion ? {} : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1.2, delay: delay + extra, ease: EASE_EXPO },
    });

    return (
        <section className="relative overflow-hidden">
        <PerspectiveGrid className="opacity-70 dark:opacity-50" />
        <div className="container-site relative flex min-h-[100svh] flex-col justify-end pb-8 pt-28 lg:pb-10">
            <div className="absolute right-5 top-[30%] hidden w-[34vw] max-w-[620px] sm:right-8 lg:right-12 lg:block">
                <HeroScene name={site.name} location={site.location} stack={skills} delay={delay + 0.3} />
            </div>
            <motion.div {...fade(0.5)} className="mb-auto flex flex-col gap-6 pt-8 sm:flex-row sm:items-start sm:justify-between lg:pt-14">
                <p className="font-mono text-xs leading-relaxed text-muted">
                    <span className="text-accent">const</span> dev = <span className="text-fg">&quot;{site.name}&quot;</span>;
                    <br />
                    <span className="text-accent">status</span>: {site.is_available ? t('hero.available') : t('hero.unavailable')}
                    <span className="ml-1 inline-block h-3.5 w-[7px] translate-y-0.5 animate-blink bg-accent motion-reduce:animate-none" aria-hidden="true" />
                </p>
                <p className="max-w-xs text-sm leading-relaxed text-fg/70 sm:text-right">{pick(site, 'hero')}</p>
            </motion.div>

            <h1 className="sr-only">{site.name} — {title}</h1>
            <MaskText
                as="div"
                immediate
                delay={delay}
                className="display mt-16 text-[14vw] sm:text-[11vw] lg:max-w-[58vw] lg:text-[8.6vw]"
                lines={[firstWord, <span key="rest" className="accent-text text-[0.86em] text-accent">{rest.join(' ')}</span>]}
            />

            <motion.div {...fade(0.7)} className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-fg/15 pt-6">
                <button type="button" onClick={() => scrollToSection('a-propos')} className="flex items-center gap-4" aria-label={t('hero.scroll')}>
                    <span className="relative block h-12 w-px overflow-hidden bg-fg/15">
                        <span className="absolute inset-0 animate-scroll-cue bg-fg motion-reduce:animate-none" />
                    </span>
                    <span className="eyebrow hidden md:block">{t('hero.scroll')}</span>
                </button>
                <p className="eyebrow hidden md:block">
                    {t('hero.based')} {site.location}
                </p>
                <div className="flex flex-wrap gap-3">
                    <ArrowLink onClick={() => scrollToSection('projets')}>{t('hero.cta_projects')}</ArrowLink>
                </div>
            </motion.div>
        </div>
        </section>
    );
}

function SkillsMarquee({ skills }) {
    if (!skills.length) {
        return null;
    }

    return (
        <section className="border-y border-line py-6 lg:py-8" aria-label="Technologies">
            <Marquee items={skills} className="display text-5xl text-fg/90 lg:text-7xl" />
        </section>
    );
}

export default function Home({ projects, services, packs, estimator, experiences, skillGroups, skills, posts }) {
    const { t } = useLang();

    useEffect(() => {
        const id = window.location.hash.slice(1);
        if (id) {
            requestAnimationFrame(() => scrollToSection(id));
        }
    }, []);

    return (
        <SiteLayout>
            <Seo />
            <Hero skills={skills} />
            <SkillsMarquee skills={skills} />
            <AboutSection experiences={experiences} skills={skillGroups} />
            <ProjectsSection projects={projects} />
            <ServicesSection services={services} packs={packs} estimator={estimator} />

            {posts.length > 0 && (
                <section id="blog" className="container-site scroll-mt-20 py-28 lg:py-40">
                    <SectionTitle
                        number="04"
                        label={t('nav.blog')}
                        title={t('home.blog')}
                        aside={<ArrowLink href={route('blog.index')}>{t('home.all_posts')}</ArrowLink>}
                    />
                    <Reveal stagger={0.08} className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <RevealItem key={post.id}>
                                <PostCard post={post} />
                            </RevealItem>
                        ))}
                    </Reveal>
                </section>
            )}

            <ContactSection />
        </SiteLayout>
    );
}
