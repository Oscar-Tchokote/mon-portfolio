import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Desktop-only cursor: a small dot (difference blend) that grows over links
 * and shows a label over elements carrying `data-cursor="Label"`.
 */
export default function CustomCursor() {
    const [enabled, setEnabled] = useState(false);
    const [visible, setVisible] = useState(false);
    const [label, setLabel] = useState('');
    const [hovering, setHovering] = useState(false);
    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
    const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

    useEffect(() => {
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!finePointer || reduceMotion) {
            return undefined;
        }

        setEnabled(true);
        document.documentElement.classList.add('has-custom-cursor');

        const onMove = (event) => {
            x.set(event.clientX);
            y.set(event.clientY);
            setVisible(true);
        };
        const onOver = (event) => {
            const labelled = event.target.closest?.('[data-cursor]');
            setLabel(labelled ? labelled.dataset.cursor : '');
            setHovering(Boolean(event.target.closest?.('a, button, [role="button"], label, select')));
        };
        const onLeave = () => setVisible(false);

        window.addEventListener('mousemove', onMove);
        document.addEventListener('mouseover', onOver);
        document.documentElement.addEventListener('mouseleave', onLeave);

        return () => {
            document.documentElement.classList.remove('has-custom-cursor');
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseover', onOver);
            document.documentElement.removeEventListener('mouseleave', onLeave);
        };
    }, [x, y]);

    if (!enabled) {
        return null;
    }

    const size = label ? 88 : hovering ? 44 : 12;

    return (
        <motion.div
            aria-hidden="true"
            className={`pointer-events-none fixed left-0 top-0 z-[100] ${label ? '' : 'mix-blend-difference'}`}
            style={{ x: springX, y: springY }}
            animate={{ opacity: visible ? 1 : 0 }}
        >
            <motion.div
                className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${label ? 'bg-accent text-accent-fg' : 'bg-white'}`}
                animate={{ width: size, height: size }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
                {label && <span className="px-2 text-center font-mono text-[10px] uppercase leading-tight tracking-[0.15em]">{label}</span>}
            </motion.div>
        </motion.div>
    );
}
