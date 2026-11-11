import { motion, useReducedMotion } from 'framer-motion';
import { EASE_EXPO } from '@/lib/motion';

/**
 * Lines slide up from behind an invisible mask, one after the other.
 *
 * @param {{ lines: import('react').ReactNode[], className?: string, lineClassName?: string, delay?: number, immediate?: boolean, as?: string }} props
 */
export default function MaskText({ lines, className = '', lineClassName = '', delay = 0, immediate = false, as = 'span' }) {
    const reduceMotion = useReducedMotion();
    const Wrapper = as;

    return (
        <Wrapper className={className}>
            {lines.map((line, index) => (
                <span key={index} className={`block overflow-hidden pb-[0.08em] [perspective:900px] ${lineClassName}`}>
                    {reduceMotion ? (
                        <span className="block">{line}</span>
                    ) : (
                        <motion.span
                            className="block origin-[50%_100%] will-change-transform"
                            initial={{ y: '110%', rotateX: -65 }}
                            {...(immediate ? { animate: { y: '0%', rotateX: 0 } } : { whileInView: { y: '0%', rotateX: 0 }, viewport: { once: true, margin: '0px 0px -10% 0px' } })}
                            transition={{ duration: 1.4, delay: delay + index * 0.09, ease: EASE_EXPO }}
                        >
                            {line}
                        </motion.span>
                    )}
                </span>
            ))}
        </Wrapper>
    );
}
