import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { EASE_EXPO } from '@/lib/motion';

const DEFAULT_STACK = ['Laravel', 'React', 'PHP', 'Tailwind', 'MySQL', 'Inertia'];

/**
 * Small syntax-highlighted snippet rendered as real text (sharp at any resolution).
 */
function CodeLines({ name, location, stack }) {
    const k = 'text-[#d0714c]';
    const s = 'text-[#9fbf7f]';
    const c = 'text-bone/35';

    return (
        <pre className="overflow-hidden whitespace-pre font-mono text-[12.5px] leading-[1.75] text-bone/85 xl:text-[13.5px]">
            <span className={c}>{'// developer.ts'}</span>{'\n'}
            <span className={k}>const</span> dev = {'{'}{'\n'}
            {'  '}name: <span className={s}>&quot;{name}&quot;</span>,{'\n'}
            {'  '}base: <span className={s}>&quot;{location}&quot;</span>,{'\n'}
            {'  '}stack: [{stack.slice(0, 2).map((tech, index) => (
                <span key={tech}><span className={s}>&quot;{tech}&quot;</span>{index < 1 ? ', ' : ''}</span>
            ))}, <span className={c}>...</span>],{'\n'}
            {'  '}mobileFirst: <span className={k}>true</span>,{'\n'}
            {'}'};{'\n'}
            {'\n'}
            <span className={k}>export default</span> ship(dev);<span className="ml-0.5 inline-block h-[1.1em] w-[7px] translate-y-[3px] animate-blink bg-[#d0714c] motion-reduce:animate-none" />
        </pre>
    );
}

function Badge({ children, className, depth, delay, x, y }) {
    return (
        <motion.span
            className={`absolute whitespace-nowrap rounded-full border border-fg/10 bg-surface/90 px-3.5 py-1.5 font-mono text-[11px] text-fg shadow-[0_12px_30px_-12px_rgb(0_0_0/0.35)] backdrop-blur ${className}`}
            style={{ left: x, top: y, z: depth }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay, ease: EASE_EXPO }}
        >
            <motion.span
                className="block"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4 + depth / 40, repeat: Infinity, ease: 'easeInOut', delay: delay * 2 }}
            >
                {children}
            </motion.span>
        </motion.span>
    );
}

/**
 * Hero 3D composition: a floating editor window that tilts with the mouse,
 * surrounded by tech badges at different depths and a rotating orbit ring.
 */
export default function HeroScene({ name, location, stack = [], delay = 0 }) {
    const reduceMotion = useReducedMotion();
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const spring = { stiffness: 60, damping: 18, mass: 0.8 };
    const rotateY = useSpring(useTransform(mx, [-1, 1], [-22, -6]), spring);
    const rotateX = useSpring(useTransform(my, [-1, 1], [16, 4]), spring);
    const items = (stack.length ? stack : DEFAULT_STACK).slice(0, 6);

    useEffect(() => {
        if (reduceMotion) {
            return undefined;
        }
        const onMove = (event) => {
            mx.set((event.clientX / window.innerWidth) * 2 - 1);
            my.set((event.clientY / window.innerHeight) * 2 - 1);
        };
        window.addEventListener('pointermove', onMove);
        return () => window.removeEventListener('pointermove', onMove);
    }, [mx, my, reduceMotion]);

    const positions = [
        { x: '1%', y: '0%', depth: 120 },
        { x: '64%', y: '-5%', depth: 70 },
        { x: '82%', y: '36%', depth: 150 },
        { x: '-2%', y: '58%', depth: 90 },
        { x: '40%', y: '95%', depth: 130 },
        { x: '6%', y: '92%', depth: 50 },
    ];

    return (
        <div className="pointer-events-none relative aspect-[5/4] w-full select-none" style={{ perspective: 1400 }} aria-hidden="true">
            <motion.div
                className="absolute inset-0 [transform-style:preserve-3d]"
                style={reduceMotion ? { transform: 'rotateY(-14deg) rotateX(10deg)' } : { rotateX, rotateY }}
                initial={reduceMotion ? false : { opacity: 0, z: -300 }}
                animate={{ opacity: 1, z: 0 }}
                transition={{ duration: 1.8, delay, ease: EASE_EXPO }}
            >
                <motion.div
                    className="absolute left-[-9%] top-[-9%] h-[118%] w-[118%] rounded-full border border-dashed border-accent/30"
                    style={{ z: -120, rotateX: 70 }}
                    animate={reduceMotion ? undefined : { rotateZ: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                />
                <div
                    className="absolute inset-[22%] rounded-full bg-accent/30 blur-[90px]"
                    style={{ transform: 'translateZ(-80px)' }}
                />

                <div
                    className="absolute inset-[6%] overflow-hidden rounded-2xl border border-white/10 bg-[#141412] shadow-[0_60px_120px_-30px_rgb(0_0_0/0.6)] [transform-style:preserve-3d]"
                    style={{ transform: 'translateZ(0px)' }}
                >
                    <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                        <span className="ml-3 font-mono text-[11px] text-bone/40">~/portfolio — developer.ts</span>
                    </div>
                    <div className="flex">
                        <div className="select-none border-r border-white/5 px-3 py-4 text-right font-mono text-[12.5px] leading-[1.75] text-bone/20 xl:text-[13.5px]">
                            {Array.from({ length: 11 }, (_, index) => <div key={index}>{index + 1}</div>)}
                        </div>
                        <div className="px-4 py-4">
                            <CodeLines name={name} location={location} stack={items} />
                        </div>
                    </div>
                </div>

                <div
                    className="absolute -bottom-[2%] right-[2%] rounded-xl border border-white/10 bg-[#0e0e0c] px-4 py-3 font-mono text-[11px] text-bone/70 shadow-2xl"
                    style={{ transform: 'translateZ(90px)' }}
                >
                    <span className="text-[#28c840]">✓</span> build passed <span className="text-bone/35">· 0 errors</span>
                </div>

                {items.map((tech, index) => (
                    <Badge key={tech} x={positions[index].x} y={positions[index].y} depth={positions[index].depth} delay={delay + 0.4 + index * 0.08}>
                        {tech}
                    </Badge>
                ))}
            </motion.div>
        </div>
    );
}
