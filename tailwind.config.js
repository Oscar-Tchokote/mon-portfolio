import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                bg: token('bg'),
                surface: token('surface'),
                fg: token('fg'),
                muted: token('muted'),
                line: token('line'),
                accent: token('accent'),
                'accent-fg': token('accent-fg'),
                ink: token('ink'),
                bone: token('bone'),
            },
            fontFamily: {
                sans: ['Geist', ...defaultTheme.fontFamily.sans],
                mono: ['"Geist Mono"', ...defaultTheme.fontFamily.mono],
            },
            maxWidth: {
                site: '90rem',
            },
            transitionTimingFunction: {
                expo: 'cubic-bezier(0.19, 1, 0.22, 1)',
            },
            keyframes: {
                marquee: {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-50%)' },
                },
                'scroll-cue': {
                    '0%': { transformOrigin: 'top', transform: 'scaleY(0)' },
                    '45%': { transformOrigin: 'top', transform: 'scaleY(1)' },
                    '55%': { transformOrigin: 'bottom', transform: 'scaleY(1)' },
                    '100%': { transformOrigin: 'bottom', transform: 'scaleY(0)' },
                },
                blink: {
                    '0%, 49%': { opacity: '1' },
                    '50%, 100%': { opacity: '0' },
                },
                'grid-flow': {
                    from: { backgroundPosition: '0 0' },
                    to: { backgroundPosition: '0 64px' },
                },
            },
            animation: {
                marquee: 'marquee 40s linear infinite',
                'scroll-cue': 'scroll-cue 2.4s cubic-bezier(0.19, 1, 0.22, 1) infinite',
                blink: 'blink 1.1s step-end infinite',
                'grid-flow': 'grid-flow 3s linear infinite',
            },
        },
    },

    plugins: [forms, typography],
};
