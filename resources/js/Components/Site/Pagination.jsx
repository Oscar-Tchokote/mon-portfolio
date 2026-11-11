import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <nav className="mt-14 flex flex-wrap items-center justify-center gap-1" aria-label="Pagination">
            {links.map((link, index) => {
                const label = link.label.replace('&laquo;', '‹').replace('&raquo;', '›').replace(/pagination\.(previous|next)/, (_, dir) => (dir === 'previous' ? '‹' : '›'));
                const classes = `min-w-[2.5rem] rounded-full px-3 py-2 text-center text-sm font-medium ${link.active ? 'bg-fg text-bg' : 'text-muted hover:bg-line/60 hover:text-fg'}`;

                return link.url ? (
                    <Link key={index} href={link.url} preserveScroll className={classes} dangerouslySetInnerHTML={{ __html: label }} />
                ) : (
                    <span key={index} className={`${classes} opacity-40`} dangerouslySetInnerHTML={{ __html: label }} />
                );
            })}
        </nav>
    );
}
