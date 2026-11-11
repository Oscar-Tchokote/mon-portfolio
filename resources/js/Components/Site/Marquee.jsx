import { Fragment } from 'react';

/**
 * Infinite horizontal ticker; the content is duplicated so the loop is seamless.
 */
export default function Marquee({ items, className = '', separator = '✦', reverse = false }) {
    if (!items.length) {
        return null;
    }

    const sequence = items.map((item, index) => (
        <Fragment key={index}>
            <span>{item}</span>
            <span className="text-accent" aria-hidden="true">{separator}</span>
        </Fragment>
    ));

    return (
        <div className={`flex overflow-hidden whitespace-nowrap ${className}`} role="marquee" aria-label={items.join(', ')}>
            <div
                className="flex shrink-0 animate-marquee items-center gap-[0.4em] pr-[0.4em] motion-reduce:animate-none"
                style={reverse ? { animationDirection: 'reverse' } : undefined}
                aria-hidden="true"
            >
                <Fragment key="first">{sequence}</Fragment>
                <Fragment key="second">{sequence}</Fragment>
            </div>
        </div>
    );
}
