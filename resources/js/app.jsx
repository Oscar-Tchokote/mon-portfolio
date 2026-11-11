import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './lib/i18n';

createInertiaApp({
    title: (title) => title || 'Portfolio',
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(
            <LanguageProvider>
                <App {...props} />
            </LanguageProvider>,
        );
    },
    progress: {
        color: '#b5532f',
    },
});
