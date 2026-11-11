import { Link, usePage } from '@inertiajs/react';
import Toaster from '@/Components/Admin/Toaster';
import HeroScene from '@/Components/Site/HeroScene';
import PerspectiveGrid from '@/Components/Site/PerspectiveGrid';
import Reveal from '@/Components/Site/Reveal';

export default function GuestLayout({ children, title = 'Espace', accent = 'administration.' }) {
    const { site } = usePage().props;

    return (
        <div className="grid min-h-screen bg-bg lg:grid-cols-2">
            <div className="flex flex-col px-6 py-8 sm:px-12">
                <Link href={route('home')} className="display text-2xl">
                    {site.brand || site.name}
                </Link>

                <div className="flex flex-1 items-center justify-center py-12">
                    <Reveal immediate className="w-full max-w-md">
                        <p className="eyebrow mb-4">// Admin</p>
                        <h1 className="display mb-10 text-5xl sm:text-6xl">
                            {title} <span className="accent-text text-accent">{accent}</span>
                        </h1>
                        {children}
                    </Reveal>
                </div>

                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                    © {new Date().getFullYear()} {site.name}
                </p>
            </div>

            <div className="relative hidden overflow-hidden bg-[#0e0e0c] lg:flex lg:items-center lg:justify-center dark:border-l dark:border-line dark:bg-[#151411]">
                <PerspectiveGrid className="h-[55%] opacity-60" />
                <div className="relative w-[78%] max-w-[620px]">
                    <HeroScene name={site.name} location={site.location} delay={0.2} />
                </div>
            </div>

            <Toaster />
        </div>
    );
}
