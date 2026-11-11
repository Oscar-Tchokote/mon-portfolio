import MaskText from '@/Components/Site/MaskText';
import Reveal from '@/Components/Site/Reveal';

/**
 * Section opener: mono "// 02 — Label" eyebrow, big display title revealed line by line.
 * The last word of the title is set in italic serif accent.
 */
export default function SectionTitle({ number, label, title, accent, aside, onDark = false, className = '' }) {
    const words = title.split(' ');
    const accentWord = accent ?? words.pop();
    const head = accent ? title : words.join(' ');

    return (
        <div className={`mb-14 flex flex-col gap-8 lg:mb-20 lg:flex-row lg:items-end lg:justify-between ${className}`}>
            <div className="max-w-4xl">
                <Reveal y={16}>
                    <p className={`eyebrow mb-6 ${onDark ? 'text-bone/50' : ''}`}>
                        // {number} — {label}
                    </p>
                </Reveal>
                <h2 className="display text-[13vw] sm:text-7xl lg:text-8xl">
                    <MaskText
                        lines={[
                            <>
                                {head}{' '}
                                <span className={`accent-text ${onDark ? 'text-[#d0714c]' : 'text-accent'}`}>{accentWord}</span>
                            </>,
                        ]}
                    />
                </h2>
            </div>
            {aside && <Reveal delay={0.2} className="shrink-0">{aside}</Reveal>}
        </div>
    );
}
