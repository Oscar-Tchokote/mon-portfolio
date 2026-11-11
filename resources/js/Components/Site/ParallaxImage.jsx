import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { EASE_EXPO, EASE_EXPO_IN_OUT } from '@/lib/motion';

/**
 * Image uncovered by a rising clip-path, then drifting slowly with the scroll.
 */
export default function ParallaxImage({ src, alt = '', className = '', speed = 10, delay = 0, children }) {
    const ref = useRef(null);
    const reduceMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], [`-${speed}%`, `${speed}%`]);

    if (reduceMotion) {
        return (
            <div className={`relative overflow-hidden bg-line ${className}`}>
                {src ? <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" /> : children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            className={`relative overflow-hidden bg-line ${className}`}
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.5, delay, ease: EASE_EXPO_IN_OUT }}
        >
            <motion.div className="absolute inset-0" style={{ y }}>
                {src ? (
                    <motion.img
                        src={src}
                        alt={alt}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover will-change-transform"
                        initial={{ scale: 1.35 }}
                        whileInView={{ scale: 1.15 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2.2, delay, ease: EASE_EXPO }}
                    />
                ) : (
                    <div className="absolute inset-0 scale-[1.15]">{children}</div>
                )}
            </motion.div>
        </motion.div>
    );
}
