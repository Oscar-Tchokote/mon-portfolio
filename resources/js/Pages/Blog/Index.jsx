import { Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import PageHeader from '@/Components/Site/PageHeader';
import Pagination from '@/Components/Site/Pagination';
import PostCard from '@/Components/Site/PostCard';
import Reveal from '@/Components/Site/Reveal';
import Seo from '@/Components/Site/Seo';
import SiteLayout from '@/Layouts/SiteLayout';
import { useLang } from '@/lib/i18n';

export default function BlogIndex({ posts, tags, filters }) {
    const { t } = useLang();
    const [query, setQuery] = useState(filters.q);

    const search = (event) => {
        event.preventDefault();
        router.get(route('blog.index'), { q: query || undefined, tag: filters.tag || undefined }, { preserveState: true });
    };

    return (
        <SiteLayout>
            <Seo title={t('blog.title')} description={t('blog.subtitle')} />
            <PageHeader eyebrow={t('blog.title')} title={t('blog.title')} subtitle={t('blog.subtitle')}>
                <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <form onSubmit={search} className="relative w-full max-w-md">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('blog.search')} className="field rounded-full py-3 pl-11" />
                    </form>
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <Link href={route('blog.index', filters.q ? { q: filters.q } : {})} className={`chip ${!filters.tag ? 'border-fg text-fg' : 'hover:text-fg'}`}>
                                {t('projects.all')}
                            </Link>
                            {tags.map((tag) => (
                                <Link key={tag} href={route('blog.index', { tag, ...(filters.q ? { q: filters.q } : {}) })} className={`chip ${filters.tag === tag ? 'border-fg text-fg' : 'hover:text-fg'}`}>
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </PageHeader>

            <section className="container-site pb-24">
                {posts.data.length === 0 ? (
                    <p className="py-20 text-center text-muted">{t('blog.empty')}</p>
                ) : (
                    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.data.map((post, index) => (
                            <Reveal key={post.id} delay={(index % 3) * 0.06}>
                                <PostCard post={post} />
                            </Reveal>
                        ))}
                    </div>
                )}
                <Pagination links={posts.links} />
            </section>
        </SiteLayout>
    );
}
