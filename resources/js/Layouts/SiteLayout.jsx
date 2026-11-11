import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Mail, Menu, Moon, Sun, X } from 'lucide-react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { GithubIcon, LinkedinIcon, WhatsappIcon, XIcon } from '@/Components/Site/BrandIcons';
import Curtain from '@/Components/Site/Curtain';
import CustomCursor from '@/Components/Site/CustomCursor';
import CvModal from '@/Components/Site/CvModal';
import { whatsappLink } from '@/lib/format';
import { useLang } from '@/lib/i18n';
import { EASE_EXPO, EASE_EXPO_IN_OUT } from '@/lib/motion';
import { SECTION_IDS, scrollToSection } from '@/lib/sections';

const CvContext = createContext(() => {});

export function useOpenCv() {
    return useContext(CvContext);
}

function useTheme() {
    const [dark, setDark] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

    const toggle = useCallback(() => {
        setDark((current) => {
            const next = !current;
            document.documentElement.classList.toggle('dark', next);
            try {
                localStorage.setItem('theme', next ? 'dark' : 'light');
            } catch (e) {
                // Ignore storage errors.
            }
            return next;
        });
    }, []);

    return [dark, toggle];
}

export function SocialLinks({ className = '', onDark = false }) {
    const { site } = usePage().props;
    const links = [
        { href: site.github, label: 'GitHub', Icon: GithubIcon },
        { href: site.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
        { href: site.twitter, label: 'X', Icon: XIcon },
        { href: whatsappLink(site.whatsapp), label: 'WhatsApp', Icon: WhatsappIcon },
        { href: site.email ? `mailto:${site.email}` : null, label: 'Email', Icon: Mail },
    ].filter((link) => link.href);

    const tone = onDark ? 'text-bone/60 hover:bg-bone/10 hover:text-bone' : 'text-muted hover:bg-line/60 hover:text-fg';

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {links.map(({ href, label, Icon }) => (
                <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`rounded-full p-2 transition duration-500 ${tone}`}
                >
                    <Icon className="h-[18px] w-[18px]" />
                </a>
            ))}
        </div>
    );
}

/**
 * Track which landing section is currently in view (scroll-spy).
 */
function useActiveSection(enabled) {
    const [active, setActive] = useState(null);

    useEffect(() => {
        if (!enabled) {
            setActive(null);
            return undefined;
        }

        const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
        const visible = new Map();
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
                setActive(SECTION_IDS.find((id) => visible.get(id)) ?? null);
            },
            { rootMargin: '-45% 0px -50% 0px' },
        );
        elements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, [enabled]);

    return active;
}

/**
 * Header state: hidden while scrolling down, shown again when scrolling up.
 */
function useHeaderScroll() {
    const [state, setState] = useState({ scrolled: false, hidden: false, pastHero: false });

    useEffect(() => {
        let lastY = window.scrollY;
        const onScroll = () => {
            const currentY = window.scrollY;
            setState({ scrolled: currentY > 24, hidden: currentY > 320 && currentY > lastY, pastHero: currentY > window.innerHeight * 0.7 });
            lastY = currentY;
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return state;
}

export default function SiteLayout({ children }) {
    const { site, auth } = usePage().props;
    const { url } = usePage();
    const { lang, setLang, t } = useLang();
    const [dark, toggleTheme] = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const [cvOpen, setCvOpen] = useState(false);
    const { scrolled, hidden, pastHero } = useHeaderScroll();

    useEffect(() => setMenuOpen(false), [url]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    const path = url.split(/[?#]/)[0];
    const onHome = path === '/';
    const activeSection = useActiveSection(onHome);

    const nav = [
        { id: 'a-propos', label: t('nav.about') },
        { id: 'projets', label: t('nav.projects'), match: '/projets' },
        { id: 'services', label: t('nav.services') },
        ...(site.show_blog ? [{ id: 'blog', label: t('nav.blog'), match: '/blog' }] : []),
        { id: 'contact', label: t('nav.contact') },
    ];
    const isActive = (item) => (onHome ? activeSection === item.id : Boolean(item.match && path.startsWith(item.match)));

    const navLinkProps = (item) => ({
        href: `${route('home')}#${item.id}`,
        onClick: (event) => {
            if (onHome && scrollToSection(item.id)) {
                event.preventDefault();
                setMenuOpen(false);
            }
        },
    });

    const goTop = (event) => {
        if (onHome) {
            event.preventDefault();
            setMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.history.replaceState(window.history.state, '', route('home'));
        }
    };
    const openCv = useCallback(() => {
        setMenuOpen(false);
        setCvOpen(true);
    }, []);
    const whatsapp = whatsappLink(site.whatsapp);
    const brand = site.brand || site.name;

    return (
        <CvContext.Provider value={openCv}>
            <div className="flex min-h-screen flex-col">
                <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg">
                    Aller au contenu
                </a>

                <header
                    className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-700 ease-expo ${
                        hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
                    } ${scrolled && !menuOpen ? 'border-b border-line/70 bg-bg/80 backdrop-blur-md' : 'border-b border-transparent'}`}
                >
                    <div className="container-site flex h-16 items-center justify-between gap-4 lg:h-20">
                        <Link href={route('home')} onClick={goTop} className={`display text-2xl transition-colors duration-500 ${menuOpen ? 'text-bone' : ''}`}>
                            {brand}
                        </Link>

                        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigation principale">
                            {nav.map((item, index) => (
                                <Link
                                    key={item.id}
                                    {...navLinkProps(item)}
                                    aria-current={isActive(item) ? 'true' : undefined}
                                    className={`flex items-baseline gap-1.5 text-sm transition-colors duration-500 ${isActive(item) ? 'text-fg' : 'text-muted hover:text-fg'}`}
                                >
                                    <span className={`font-mono text-[10px] transition-colors duration-500 ${isActive(item) ? 'text-accent' : 'text-muted/60'}`}>0{index + 1}</span>
                                    <span className={`link-underline ${isActive(item) ? 'after:origin-left after:scale-x-100' : ''}`}>{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className={`flex items-center gap-1 transition-colors duration-500 ${menuOpen ? 'text-bone' : ''}`}>
                            <button
                                type="button"
                                onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                                className="rounded-full px-2.5 py-2 font-mono text-xs font-medium opacity-70 transition hover:opacity-100"
                                aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
                            >
                                {lang === 'fr' ? 'EN' : 'FR'}
                            </button>
                            <button type="button" onClick={toggleTheme} className="rounded-full p-2 opacity-70 transition hover:opacity-100" aria-label="Thème">
                                {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
                            </button>
                            <button type="button" onClick={openCv} className="btn-ghost ml-2 hidden px-4 py-2 sm:inline-flex">
                                <FileText className="h-4 w-4" />
                                {t('nav.cv')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setMenuOpen((open) => !open)}
                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full md:hidden"
                                aria-label="Menu"
                                aria-expanded={menuOpen}
                            >
                                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </header>

                <AnimatePresence>
                    {menuOpen && (
                        <motion.nav
                            key="mobile-menu"
                            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
                            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
                            transition={{ duration: 0.8, ease: EASE_EXPO_IN_OUT }}
                            className="fixed inset-0 z-40 flex flex-col justify-end bg-[#0e0e0c] pb-10 text-bone md:hidden"
                            aria-label="Navigation mobile"
                        >
                            <div className="container-site">
                                <ul className="flex flex-col gap-1">
                                    {nav.map((item, index) => (
                                        <li key={item.id} className="overflow-hidden">
                                            <motion.div
                                                initial={{ y: '110%' }}
                                                animate={{ y: '0%' }}
                                                exit={{ y: '110%' }}
                                                transition={{ duration: 0.9, delay: 0.25 + index * 0.06, ease: EASE_EXPO }}
                                            >
                                                <Link {...navLinkProps(item)} className="flex items-baseline gap-3 py-1">
                                                    <span className="font-mono text-xs text-bone/40">0{index + 1}</span>
                                                    <span className={`display text-[13vw] ${isActive(item) ? 'accent-text text-[#d0714c]' : ''}`}>{item.label}</span>
                                                </Link>
                                            </motion.div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-10 flex items-center justify-between border-t border-bone/15 pt-6">
                                    <button type="button" onClick={openCv} className="inline-flex items-center gap-2 text-sm text-bone/80">
                                        <FileText className="h-4 w-4" /> {t('nav.cv')}
                                    </button>
                                    <SocialLinks className="-mr-2" onDark />
                                </div>
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>

                <main id="main" className={`flex-1 ${onHome ? '' : 'pt-16 lg:pt-20'}`}>
                    {children}
                </main>

                <footer className="relative overflow-hidden bg-[#0e0e0c] text-bone dark:border-t dark:border-line dark:bg-[#151411]">
                    <div className="container-site pb-8 pt-24 lg:pt-32">
                        <div className="grid gap-12 lg:grid-cols-12">
                            <div className="lg:col-span-7">
                                <p className="eyebrow mb-6 text-bone/50">// {t('footer.say_hello')}</p>
                                {site.email && (
                                    <a href={`mailto:${site.email}`} className="display link-underline break-all text-[7vw] leading-none sm:text-[5vw] lg:text-[3.4vw]" data-cursor="Email">
                                        {site.email}
                                    </a>
                                )}
                                {site.phone && <p className="mt-6 font-mono text-sm text-bone/60">{site.phone} · {site.location}</p>}
                            </div>
                            <div className="flex flex-col gap-8 lg:col-span-5 lg:items-end">
                                <ul className="flex flex-col gap-2 text-sm lg:items-end">
                                    {nav.map((item) => (
                                        <li key={item.id}>
                                            <Link {...navLinkProps(item)} className="link-underline text-bone/70 transition-colors hover:text-bone">{item.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                                <SocialLinks className="-ml-2 lg:-mr-2 lg:ml-0" onDark />
                            </div>
                        </div>

                        <p className="display mt-20 select-none whitespace-nowrap text-[15vw] leading-[0.8] text-bone/[0.07] lg:text-[11vw]" aria-hidden="true">
                            {brand}
                        </p>

                        <div className="mt-8 flex flex-col gap-3 border-t border-bone/15 pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-bone/50 sm:flex-row sm:items-center sm:justify-between">
                            <p>© {new Date().getFullYear()} {site.name}</p>
                            <p>
                                {t('footer.built')}
                                {auth.user?.is_admin && (
                                    <>
                                        {' · '}
                                        <Link href={route('dashboard')} className="underline hover:text-bone">Admin</Link>
                                    </>
                                )}
                            </p>
                            <a href={route('home')} onClick={goTop} className="link-underline w-fit hover:text-bone">↑ Top</a>
                        </div>
                    </div>
                </footer>

                {whatsapp && (
                    <a
                        href={whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('contact.whatsapp')}
                        tabIndex={onHome && !pastHero ? -1 : undefined}
                        className={`fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition duration-500 ease-expo hover:scale-110 ${
                            onHome && !pastHero ? 'pointer-events-none translate-y-6 scale-75 opacity-0' : 'translate-y-0 opacity-100'
                        }`}
                    >
                        <WhatsappIcon className="h-7 w-7" />
                    </a>
                )}

                <CvModal open={cvOpen} onClose={() => setCvOpen(false)} />
                <CustomCursor />
                <Curtain brand={brand} />
            </div>
        </CvContext.Provider>
    );
}
