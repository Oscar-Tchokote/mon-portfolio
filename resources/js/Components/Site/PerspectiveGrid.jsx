/**
 * Receding 3D grid floor (pure CSS, so it stays crisp at any resolution).
 * The lines scroll toward the viewer; the animation stops for reduced motion.
 */
export default function PerspectiveGrid({ className = '' }) {
    return (
        <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 h-[45%] overflow-hidden [perspective:420px] ${className}`}>
            <div
                className="absolute inset-x-[-50%] bottom-[-10%] h-[160%] origin-bottom animate-grid-flow motion-reduce:animate-none"
                style={{
                    transform: 'rotateX(68deg)',
                    backgroundImage:
                        'linear-gradient(to right, rgb(var(--accent) / 0.22) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--accent) / 0.22) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                    maskImage: 'linear-gradient(to top, black 10%, transparent 75%)',
                    WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 75%)',
                }}
            />
        </div>
    );
}
