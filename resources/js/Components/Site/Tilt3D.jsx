import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

function useFinePointer() {
    const [fine, setFine] = useState(false);
    useEffect(() => {
        setFine(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    }, []);
    return fine;
}

/**
 * Card that tilts in 3D toward the pointer, with a moving light glare.
 * Children can pop out of the surface with `style={{ transform: 'translateZ(40px)' }}`.
 * Inactive on touch screens and when the visitor prefers reduced motion.
 */
export default function Tilt3D({ children, className = '', max = 10, glare = true, scale = 1.02, perspective = 1100, as = 'div', fill = false }) {
    const reduceMotion = useReducedMotion();
    const finePointer = useFinePointer();
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    const hover = useMotionValue(0);
    const spring = { stiffness: 220, damping: 22, mass: 0.6 };
    const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
    const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
    const lift = useSpring(useTransform(hover, [0, 1], [1, scale]), spring);
    const glareX = useTransform(px, [0, 1], ['0%', '100%']);
    const glareY = useTransform(py, [0, 1], ['0%', '100%']);
    const glareOpacity = useSpring(useTransform(hover, [0, 1], [0, 1]), spring);
    const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.28), transparent 55%)`;

    const Component = motion[as] ?? motion.div;

    if (reduceMotion || !finePointer) {
        const Plain = as;
        return <Plain className={`relative ${className}`}>{children}</Plain>;
    }

    const onMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        px.set((event.clientX - rect.left) / rect.width);
        py.set((event.clientY - rect.top) / rect.height);
    };

    const onLeave = () => {
        px.set(0.5);
        py.set(0.5);
        hover.set(0);
    };

    return (
        <div style={{ perspective }} className={`${fill ? 'h-full' : ''} [transform-style:preserve-3d]`}>
            <Component
                className={`relative [transform-style:preserve-3d] will-change-transform ${className}`}
                style={{ rotateX, rotateY, scale: lift }}
                onPointerMove={onMove}
                onPointerEnter={() => hover.set(1)}
                onPointerLeave={onLeave}
            >
                {children}
                {glare && (
                    <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] mix-blend-overlay"
                        style={{ background: glareBackground, opacity: glareOpacity }}
                    />
                )}
            </Component>
        </div>
    );
}
