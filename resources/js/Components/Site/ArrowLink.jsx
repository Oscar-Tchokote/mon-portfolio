import { Link } from '@inertiajs/react';

function Arrow({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${className}`} aria-hidden="true">
            <path d="M5 19 19 5M8 5h11v11" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

/**
 * Pill button whose arrow slides out and a fresh one slides in on hover.
 * Renders an Inertia <Link> (href), an external <a> (external) or a <button> (onClick).
 */
export default function ArrowLink({ href, onClick, external = false, dark = false, children, className = '', cursor }) {
    const classes = `group inline-flex w-fit shrink-0 items-center gap-3 rounded-full border py-2.5 pl-6 pr-2.5 text-sm font-medium transition-colors duration-500 ease-expo ${
        dark ? 'border-bone/30 text-bone hover:bg-bone hover:text-ink' : 'border-fg/20 text-fg hover:bg-fg hover:text-bg'
    } ${className}`;

    const content = (
        <>
            {children}
            <span className={`relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-colors duration-500 ${dark ? 'bg-bone text-ink group-hover:bg-accent group-hover:text-accent-fg' : 'bg-fg text-bg group-hover:bg-accent group-hover:text-accent-fg'}`}>
                <Arrow className="transition-transform duration-500 ease-expo group-hover:-translate-y-8 group-hover:translate-x-8" />
                <Arrow className="absolute -translate-x-8 translate-y-8 transition-transform duration-500 ease-expo group-hover:translate-x-0 group-hover:translate-y-0" />
            </span>
        </>
    );

    const cursorProps = cursor ? { 'data-cursor': cursor } : {};

    if (onClick) {
        return <button type="button" onClick={onClick} className={classes} {...cursorProps}>{content}</button>;
    }

    if (external) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...cursorProps}>{content}</a>;
    }

    return <Link href={href} className={classes} {...cursorProps}>{content}</Link>;
}
