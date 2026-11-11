import { Link } from '@inertiajs/react';
import Tilt3D from '@/Components/Site/Tilt3D';
import { formatDate } from '@/lib/format';
import { useLang } from '@/lib/i18n';

export default function PostCard({ post }) {
    const { lang, t } = useLang();

    return (
        <Link href={route('blog.show', post.slug)} className="group flex h-full flex-col">
            <Tilt3D max={8} className="aspect-[16/10] overflow-hidden bg-line/40">
                {post.cover_url ? (
                    <img src={post.cover_url} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-expo group-hover:scale-110" />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent/10 to-transparent">
                        <span className="font-mono text-4xl text-fg/20">{post.title.charAt(0)}</span>
                    </div>
                )}
            </Tilt3D>
            <div className="mt-4 flex items-center gap-2 font-mono text-xs text-muted">
                <span>{formatDate(post.published_at, lang)}</span>
                <span aria-hidden="true">·</span>
                <span>{post.reading_minutes} {t('blog.min')}</span>
                {post.lang !== lang && <span className="uppercase">· {post.lang}</span>}
            </div>
            <h3 className="mt-2 text-2xl font-medium leading-snug tracking-tight transition-colors duration-500 group-hover:text-accent">{post.title}</h3>
            {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>}
        </Link>
    );
}
