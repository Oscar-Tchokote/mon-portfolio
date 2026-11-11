import { Head, Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Briefcase, Calculator, ExternalLink, FolderKanban, History, Inbox, Layers, LayoutDashboard,
    LogOut, Menu, MessageSquare, Moon, Newspaper, Sparkles, Sun, Tags, User, UserCog, X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ConfirmHost, { confirmAction } from '@/Components/Admin/ConfirmDialog';
import Toaster from '@/Components/Admin/Toaster';

const sections = [
    {
        items: [
            { label: 'Tableau de bord', href: () => route('dashboard'), icon: LayoutDashboard, match: /^\/admin\/?$/ },
            { label: 'Messages', href: () => route('admin.messages.index'), icon: Inbox, match: /^\/admin\/messages/, badge: 'messages' },
            { label: 'Commentaires', href: () => route('admin.comments.index'), icon: MessageSquare, match: /^\/admin\/commentaires/, badge: 'comments' },
        ],
    },
    {
        title: 'Contenu',
        items: [
            { label: 'Projets', href: () => route('admin.resource.index', 'projects'), icon: FolderKanban, match: /\/contenu\/projects/ },
            { label: 'Articles', href: () => route('admin.resource.index', 'blogs'), icon: Newspaper, match: /\/contenu\/blogs/ },
            { label: 'Services', href: () => route('admin.resource.index', 'services'), icon: Layers, match: /\/contenu\/services/ },
            { label: 'Packs & tarifs', href: () => route('admin.resource.index', 'packs'), icon: Tags, match: /\/contenu\/packs/ },
            { label: 'Estimateur', href: () => route('admin.resource.index', 'estimator'), icon: Calculator, match: /\/contenu\/estimator/ },
            { label: 'Parcours', href: () => route('admin.resource.index', 'experiences'), icon: Briefcase, match: /\/contenu\/experiences/ },
            { label: 'Compétences', href: () => route('admin.resource.index', 'skills'), icon: Sparkles, match: /\/contenu\/skills/ },
        ],
    },
    {
        title: 'Réglages',
        items: [
            { label: 'Profil & site', href: () => route('admin.settings.edit'), icon: UserCog, match: /^\/admin\/profil-site/ },
            { label: 'Journal d\'activité', href: () => route('admin.activity.index'), icon: History, match: /^\/admin\/journal/ },
            { label: 'Mon compte', href: () => route('profile.edit'), icon: User, match: /^\/admin\/compte/ },
        ],
    },
];

export default function AuthenticatedLayout({ header, title, actions, children }) {
    const { auth, adminBadges, site } = usePage().props;
    const { url } = usePage();
    const [open, setOpen] = useState(false);
    const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
    const path = url.split('?')[0];

    useEffect(() => setOpen(false), [url]);

    const toggleTheme = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle('dark', next);
        try {
            localStorage.setItem('theme', next ? 'dark' : 'light');
        } catch (e) {
            // Ignore.
        }
    };

    const logout = async () => {
        setOpen(false);
        const confirmed = await confirmAction({
            title: 'Se déconnecter ?',
            message: 'Vous devrez saisir à nouveau votre email et votre mot de passe pour revenir dans l\'administration.',
            confirmLabel: 'Se déconnecter',
            icon: 'logout',
        });
        if (confirmed) {
            router.post(route('logout'));
        }
    };

    const sidebar = (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between px-5">
                <Link href={route('dashboard')} className="font-extrabold tracking-tight">
                    {site.brand || site.name} <span className="font-mono text-xs font-normal text-muted">admin</span>
                </Link>
                <button type="button" className="rounded-lg p-1.5 lg:hidden" onClick={() => setOpen(false)} aria-label="Fermer le menu">
                    <X className="h-5 w-5" />
                </button>
            </div>
            <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
                {sections.map((section, index) => (
                    <div key={index}>
                        {section.title && <p className="eyebrow mb-2 px-3 text-[10px]">{section.title}</p>}
                        <ul className="space-y-0.5">
                            {section.items.map((item) => {
                                const active = item.match.test(path);
                                const count = item.badge ? adminBadges?.[item.badge] : 0;
                                return (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href()}
                                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${active ? 'bg-fg text-bg' : 'text-muted hover:bg-line/60 hover:text-fg'}`}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            <span className="flex-1">{item.label}</span>
                                            {count > 0 && (
                                                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? 'bg-bg text-fg' : 'bg-accent text-accent-fg'}`}>{count}</span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
            <div className="space-y-1 border-t border-line p-3">
                <a href={route('home')} target="_blank" rel="noopener" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-line/60 hover:text-fg">
                    <ExternalLink className="h-4 w-4" /> Voir le site
                </a>
                <button type="button" onClick={toggleTheme} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-line/60 hover:text-fg">
                    {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} Thème {dark ? 'clair' : 'sombre'}
                </button>
                <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400">
                    <LogOut className="h-4 w-4" /> Déconnexion
                </button>
                <p className="truncate px-3 pt-2 text-xs text-muted">{auth.user?.email}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg">
            <Head title={title ? `${title} — Admin` : 'Admin'} />

            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-surface lg:block">{sidebar}</aside>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div className="fixed inset-0 z-40 bg-black/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
                        <motion.aside
                            className="fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-surface lg:hidden"
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'tween', duration: 0.25 }}
                        >
                            {sidebar}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur sm:px-8">
                    <button type="button" className="-ml-1 rounded-lg p-1.5 lg:hidden" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="min-w-0 flex-1 truncate text-lg font-bold tracking-tight">{header ?? title}</div>
                    {actions}
                </header>
                <main className="px-4 py-8 sm:px-8">{children}</main>
            </div>

            <Toaster />
            <ConfirmHost />
        </div>
    );
}
