import MaskText from './MaskText';
import PerspectiveGrid from './PerspectiveGrid';
import Reveal from './Reveal';

/**
 * Inner-page opener: mono eyebrow, huge display title (last word in italic serif)
 * revealed line by line, over a faint 3D grid floor.
 */
export default function PageHeader({ eyebrow, title, subtitle, children }) {
    const words = title.split(' ');
    const last = words.pop();

    return (
        <section className="relative overflow-hidden">
            <PerspectiveGrid className="h-[70%] opacity-50" />
            <div className="container-site relative pb-14 pt-16 sm:pt-24">
                {eyebrow && (
                    <Reveal y={16}>
                        <p className="eyebrow mb-6">// {eyebrow}</p>
                    </Reveal>
                )}
                <h1 className="display text-[16vw] sm:text-8xl lg:text-[9vw]">
                    <MaskText
                        immediate
                        lines={[
                            <>
                                {words.join(' ')}{words.length ? ' ' : ''}
                                <span className="accent-text text-accent">{last}</span>
                            </>,
                        ]}
                    />
                </h1>
                {subtitle && (
                    <Reveal delay={0.25} className="mt-8 max-w-xl">
                        <p className="text-lg leading-relaxed text-muted">{subtitle}</p>
                    </Reveal>
                )}
                {children}
            </div>
        </section>
    );
}
