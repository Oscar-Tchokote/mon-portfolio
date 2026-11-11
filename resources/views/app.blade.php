<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Portfolio') }}</title>

        <script>
            (function () {
                try {
                    var theme = localStorage.getItem('theme');
                    var dark = theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (dark) { document.documentElement.classList.add('dark'); }
                    var lang = localStorage.getItem('lang');
                    if (lang) { document.documentElement.lang = lang; }
                } catch (e) {}
            })();
        </script>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..800&family=Geist+Mono:wght@300..700&display=swap" rel="stylesheet">

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans">
        @inertia
    </body>
</html>
