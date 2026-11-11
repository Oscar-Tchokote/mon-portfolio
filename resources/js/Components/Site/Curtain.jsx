import { router } from '@inertiajs/react';
import { useAnimate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { EASE_EXPO_IN_OUT } from '@/lib/motion';

/**
 * Module-level state survives the layout remounting between Inertia pages.
 */
let pendingReveal = false;
let bypassNextVisit = false;

const INTRO_KEY = 'intro_played';

function shouldTransition(visit) {
    if (bypassNextVisit || visit.method !== 'get' || visit.preserveState === true || visit.only?.length) {
        return false;
    }
    const target = new URL(visit.url, window.location.href);
    return target.pathname !== window.location.pathname;
}

function introAlreadyPlayed() {
    try {
        return sessionStorage.getItem(INTRO_KEY) === '1';
    } catch (e) {
        return true;
    }
}

function markIntroPlayed() {
    try {
        sessionStorage.setItem(INTRO_KEY, '1');
    } catch (e) {
        // Ignore storage errors.
    }
}

/**
 * Seconds a page's entrance animation should wait so it plays as the curtain lifts.
 * Must be called during render (before the curtain's effect consumes its state).
 */
export function entranceDelay() {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return 0;
    }
    if (pendingReveal) {
        return 0.6;
    }
    return introAlreadyPlayed() ? 0 : 2.1;
}

/**
 * Full-screen ink panel: plays a short intro on the first visit, then covers
 * the screen while Inertia swaps pages and lifts away once the new page is in.
 */
export default function Curtain({ brand }) {
    const [scope, animate] = useAnimate();
    const busy = useRef(false);

    useEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const panel = scope.current;
        const logo = panel.querySelector('[data-curtain-logo]');

        const reveal = async (withLogo = false) => {
            pendingReveal = false;
            if (withLogo) {
                await animate(logo, { y: ['120%', '0%'] }, { duration: 0.8, ease: EASE_EXPO_IN_OUT });
                await animate(logo, { y: '-120%' }, { duration: 0.5, ease: [0.55, 0, 1, 0.45], delay: 0.25 });
            }
            await animate(panel, { y: '-100%' }, { duration: 1, ease: EASE_EXPO_IN_OUT });
            panel.style.visibility = 'hidden';
            busy.current = false;
        };

        const cover = async () => {
            busy.current = true;
            panel.style.visibility = 'visible';
            animate(logo, { y: '120%' }, { duration: 0 });
            await animate(panel, { y: ['100%', '0%'] }, { duration: 0.75, ease: EASE_EXPO_IN_OUT });
        };

        if (reduceMotion) {
            panel.style.visibility = 'hidden';
        } else if (pendingReveal) {
            panel.style.visibility = 'visible';
            reveal();
        } else if (!introAlreadyPlayed()) {
            markIntroPlayed();
            panel.style.visibility = 'visible';
            reveal(true);
        } else {
            panel.style.visibility = 'hidden';
        }

        const offBefore = router.on('before', (event) => {
            const visit = event.detail.visit;
            if (reduceMotion || busy.current || !shouldTransition(visit)) {
                bypassNextVisit = false;
                return true;
            }

            event.preventDefault();
            cover().then(() => {
                pendingReveal = true;
                bypassNextVisit = true;
                router.visit(visit.url, {
                    method: visit.method,
                    data: visit.data,
                    replace: visit.replace,
                    preserveScroll: visit.preserveScroll,
                    headers: visit.headers,
                });
            });
            return false;
        });

        const offNavigate = router.on('navigate', () => {
            if (pendingReveal) {
                reveal();
            }
        });

        return () => {
            offBefore();
            offNavigate();
        };
    }, [animate, scope]);

    return (
        <div
            ref={scope}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-[#0e0e0c] text-[#eeebe5]"
            style={{ visibility: 'hidden' }}
        >
            <div className="overflow-hidden">
                <div data-curtain-logo className="display text-6xl sm:text-8xl">
                    {brand}
                </div>
            </div>
        </div>
    );
}
