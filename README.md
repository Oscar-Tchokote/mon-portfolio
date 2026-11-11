# Portfolio — Laravel + Inertia + React

Portfolio personnel bilingue (FR/EN) avec back-office complet.

**Stack** : Laravel 13 · Inertia.js 2 · React 18 · Tailwind CSS 3 · Framer Motion · SQLite (local) / MySQL (prod)

## Fonctionnalités

- Accueil, À propos (parcours, compétences), Projets (filtres, galerie), Services, Packs, Estimateur de devis (FCFA), Blog (recherche, tags, likes, commentaires modérés), Contact (pièce jointe, anti-spam)
- CV en modal (aperçu, téléchargement, partage), bouton WhatsApp flottant, thème clair/sombre, FR/EN
- Admin (`/admin`) : tableau de bord statistiques (visites, CV, appareils), CRUD de tous les contenus, messages, modération des commentaires, réglages du profil, journal d'activité
- SEO : balises meta/Open Graph, `sitemap.xml`

## Installation locale

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed      # crée l'admin + du contenu d'exemple
php artisan storage:link
npm run build                   # ou: npm run dev
php artisan serve --port=8010
```

Le seeder affiche l'email et le mot de passe admin. Pour fixer vos propres identifiants, renseignez `ADMIN_EMAIL` / `ADMIN_PASSWORD` dans `.env` avant le seed, ou utilisez :

```bash
php artisan portfolio:admin vous@exemple.com --password=MotDePasseSolide
```

## Personnaliser

Tout se fait depuis l'admin, sans toucher au code :

1. **Profil & site** : nom, titre, bio, photo, CV PDF, contacts, WhatsApp, modules visibles
2. **Projets / Articles / Services / Packs / Parcours / Compétences**
3. **Estimateur** : saisissez vos prix en FCFA — une option sans prix reste invisible publiquement

Les textes d'interface (menus, boutons) sont dans `resources/js/lib/i18n.jsx`, les couleurs dans `resources/css/app.css`.

## Tests

```bash
php artisan test
```

## Production

- `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL` = votre domaine
- MySQL : changez `DB_CONNECTION` et les accès dans `.env`
- `php artisan migrate --force && php artisan storage:link && npm run build && php artisan optimize`
- Les CV et pièces jointes de contact sont stockés hors du dossier public (`storage/app/private`) : sauvegardez ce dossier.
