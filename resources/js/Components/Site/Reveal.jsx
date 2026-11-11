import { motion, useReducedMotion } from 'framer-motion';
import { EASE_EXPO } from '@/lib/motion';

/**
 * Fade + rise on scroll. With `stagger`, each direct child animates in turn.
 */
export default function Reveal({ children, delay = 0, className = '', as = 'div', y = 40, stagger = 0, immediate = false }) {
    const reduceMotion = useReducedMotion();
    const Component = motion[as] ?? motion.div;

    if (reduceMotion) {
        const Plain = as;
        return <Plain className={className}>{children}</Plain>;
    }

    const trigger = immediate
        ? { initial: 'hidden', animate: 'visible' }
        : { initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '0px 0px -12% 0px' } };

    if (stagger) {
        return (
            <Component
                className={className}
                {...trigger}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
            >
                {children}
            </Component>
        );
    }

    return (
        <Component
            className={className}
            {...trigger}
            variants={{
                hidden: { opacity: 0, y },
                visible: { opacity: 1, y: 0, transition: { duration: 1.2, delay, ease: EASE_EXPO } },
            }}
        >
            {children}
        </Component>
    );
}

/**
 * Child item for a staggered <Reveal stagger>.
 */
export function RevealItem({ children, className = '', as = 'div', y = 40 }) {
    const reduceMotion = useReducedMotion();
    const Component = motion[as] ?? motion.div;

    if (reduceMotion) {
        const Plain = as;
        return <Plain className={className}>{children}</Plain>;
    }

    return (
        <Component
            className={className}
            variants={{
                hidden: { opacity: 0, y },
                visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE_EXPO } },
            }}
        >
            {children}
        </Component>
    );
}
