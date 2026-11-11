import { Link } from '@inertiajs/react';
import {
    CategoryScale, Chart as ChartJS, Filler, LinearScale, LineElement, PointElement, Tooltip,
} from 'chart.js';
import { Download, Eye, FileText, FolderKanban, Inbox, MessageSquare, Newspaper, Share2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatDate } from '@/lib/format';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

function cssColor(name, alpha = 1) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim().split(' ').join(',');
    return `rgba(${value},${alpha})`;
}

function useIsDark() {
    const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
    useEffect(() => {
        const observer = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark')));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);
    return dark;
}

function Stat({ label, value, icon: Icon, href }) {
    const content = (
        <>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted">{label}</p>
                <Icon className="h-4 w-4 text-muted" />
            </div>
            <p className="mt-3 text-3xl font-extrabold tracking-tight tabular-nums">{value}</p>
        </>
    );
    const className = 'card block p-5 transition hover:border-fg/30';
    return href ? <Link href={href} className={className}>{content}</Link> : <div className="card p-5">{content}</div>;
}

function ViewsChart({ chart }) {
    const dark = useIsDark();
    const accent = cssColor('accent');
    const muted = cssColor('muted');
    const line = cssColor('line');

    const data = {
        labels: chart.map((point) => formatDate(point.day, 'fr', { day: 'numeric', month: 'short' })),
        datasets: [
            {
                label: 'Pages vues',
                data: chart.map((point) => point.views),
                borderColor: accent,
                backgroundColor: cssColor('accent', 0.12),
                fill: true,
                tension: 0.35,
                pointRadius: 0,
                pointHoverRadius: 4,
                borderWidth: 2,
            },
            {
                label: 'Visiteurs uniques',
                data: chart.map((point) => point.visitors),
                borderColor: muted,
                borderDash: [4, 4],
                fill: false,
                tension: 0.35,
                pointRadius: 0,
                pointHoverRadius: 4,
                borderWidth: 1.5,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { padding: 10, cornerRadius: 8 } },
        scales: {
            x: { grid: { display: false }, ticks: { color: muted, maxTicksLimit: 8, font: { size: 11 } }, border: { color: line } },
            y: { beginAtZero: true, grid: { color: line }, ticks: { color: muted, precision: 0, font: { size: 11 } }, border: { display: false } },
        },
    };

    return <div className="h-64"><Line key={dark ? 'dark' : 'light'} data={data} options={options} /></div>;
}

function Bars({ rows, labelKey, emptyText }) {
    const max = Math.max(1, ...rows.map((row) => row.total));
    if (rows.length === 0) {
        return <p className="py-6 text-center text-sm text-muted">{emptyText}</p>;
    }
    return (
        <ul className="space-y-3">
            {rows.map((row) => (
                <li key={row[labelKey]}>
                    <div className="mb-1 flex justify-between gap-4 text-sm">
                        <span className="truncate font-mono text-xs">{row[labelKey]}</span>
                        <span className="tabular-nums text-muted">{row.total}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-line/60">
                        <div className="h-1.5 rounded-full bg-accent" style={{ width: `${(row.total / max) * 100}%` }} />
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default function Dashboard({ stats, chart, cv, topPages, devices, topProjects, latestMessages, latestActivity }) {
    const deviceTotal = Object.values(devices).reduce((sum, n) => sum + n, 0) || 1;
    const deviceLabels = { desktop: 'Ordinateur', mobile: 'Mobile', tablet: 'Tablette' };

    return (
        <AuthenticatedLayout title="Tableau de bord">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Stat label="Pages vues aujourd'hui" value={stats.views_today} icon={Eye} />
                <Stat label="Visiteurs uniques (30 j)" value={stats.visitors_30d} icon={Users} />
                <Stat label="Messages non lus" value={stats.unread_messages} icon={Inbox} href={route('admin.messages.index')} />
                <Stat label="Commentaires à valider" value={stats.pending_comments} icon={MessageSquare} href={route('admin.comments.index')} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-3">
                <section className="card p-6 xl:col-span-2">
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                        <h2 className="font-bold">Audience — 30 derniers jours</h2>
                        <p className="text-sm text-muted">
                            <span className="font-semibold text-fg">{stats.views_30d}</span> pages vues ·{' '}
                            <span className="inline-flex items-center gap-1"><span className="inline-block h-0.5 w-3 bg-accent" /> vues</span>{' '}
                            <span className="inline-flex items-center gap-1"><span className="inline-block h-0.5 w-3 border-t border-dashed border-muted" /> visiteurs</span>
                        </p>
                    </div>
                    <ViewsChart chart={chart} />
                </section>

                <section className="card p-6">
                    <h2 className="mb-4 font-bold">CV (30 j)</h2>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        {[
                            ['view', 'Consultations', FileText],
                            ['download', 'Téléchargements', Download],
                            ['share', 'Partages', Share2],
                        ].map(([key, label, Icon]) => (
                            <div key={key} className="rounded-xl bg-line/30 p-3">
                                <Icon className="mx-auto h-4 w-4 text-muted" />
                                <p className="mt-2 text-2xl font-extrabold tabular-nums">{cv[key] ?? 0}</p>
                                <p className="text-[11px] text-muted">{label}</p>
                            </div>
                        ))}
                    </div>
                    <h3 className="mb-3 mt-6 text-sm font-bold">Appareils</h3>
                    <div className="flex h-2 overflow-hidden rounded-full bg-line/60">
                        {Object.entries(devices).map(([device, total], index) => (
                            <div key={device} style={{ width: `${(total / deviceTotal) * 100}%`, opacity: 1 - index * 0.3 }} className="bg-accent" />
                        ))}
                    </div>
                    <ul className="mt-3 space-y-1 text-sm">
                        {Object.entries(devices).map(([device, total]) => (
                            <li key={device} className="flex justify-between"><span className="text-muted">{deviceLabels[device] ?? device}</span><span className="tabular-nums">{Math.round((total / deviceTotal) * 100)} %</span></li>
                        ))}
                        {Object.keys(devices).length === 0 && <li className="text-muted">Pas encore de données.</li>}
                    </ul>
                </section>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <section className="card p-6">
                    <h2 className="mb-4 font-bold">Pages les plus vues</h2>
                    <Bars rows={topPages} labelKey="path" emptyText="Pas encore de visites." />
                </section>

                <section className="card p-6">
                    <h2 className="mb-4 font-bold">Projets populaires</h2>
                    <Bars rows={topProjects.map((p) => ({ title: p.title, total: p.views }))} labelKey="title" emptyText="Aucun projet." />
                    <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                        <Link href={route('admin.resource.index', 'projects')} className="flex items-center gap-2 rounded-xl bg-line/30 p-3 hover:bg-line/60"><FolderKanban className="h-4 w-4" /> {stats.projects} projets</Link>
                        <Link href={route('admin.resource.index', 'blogs')} className="flex items-center gap-2 rounded-xl bg-line/30 p-3 hover:bg-line/60"><Newspaper className="h-4 w-4" /> {stats.posts} articles</Link>
                    </div>
                </section>

                <section className="card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-bold">Derniers messages</h2>
                        <Link href={route('admin.messages.index')} className="text-xs font-semibold text-accent">Tout voir</Link>
                    </div>
                    {latestMessages.length === 0 && <p className="py-6 text-center text-sm text-muted">Aucun message.</p>}
                    <ul className="divide-y divide-line">
                        {latestMessages.map((message) => (
                            <li key={message.id} className="flex items-start gap-3 py-3">
                                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${message.read_at ? 'bg-line' : 'bg-accent'}`} />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold">{message.name}</p>
                                    <p className="truncate text-xs text-muted">{message.subject || '(sans sujet)'} · {formatDate(message.created_at, 'fr', { day: 'numeric', month: 'short' })}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <section className="card mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-bold">Activité récente</h2>
                    <Link href={route('admin.activity.index')} className="text-xs font-semibold text-accent">Journal complet</Link>
                </div>
                {latestActivity.length === 0 && <p className="text-sm text-muted">Aucune activité.</p>}
                <ul className="space-y-2 text-sm">
                    {latestActivity.map((log) => (
                        <li key={log.id} className="flex flex-wrap gap-x-2">
                            <span className="font-mono text-xs text-muted">{formatDate(log.created_at, 'fr', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="font-medium">{log.action}</span>
                            {log.subject && <span className="text-muted">— {log.subject}</span>}
                        </li>
                    ))}
                </ul>
            </section>
        </AuthenticatedLayout>
    );
}
