<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\EstimatorOption;
use App\Models\Experience;
use App\Models\Pack;
use App\Models\Project;
use App\Models\Service;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed an admin account and placeholder content to be replaced from the admin.
     */
    public function run(): void
    {
        $this->seedAdmin();

        if (Project::query()->exists()) {
            return;
        }

        $projects = [
            ['Projet exemple — Application web', 'web', 'Remplacez ce projet depuis Admin → Projets : décrivez le problème résolu et le résultat obtenu.', 'Replace this project from Admin → Projects: describe the problem and the outcome.', ['Laravel', 'React', 'MySQL'], true],
            ['Projet exemple — Application mobile', 'mobile', 'Exemple de fiche projet mobile. Ajoutez captures d\'écran, technologies et liens.', 'Sample mobile project. Add screenshots, technologies and links.', ['Flutter', 'Firebase'], true],
            ['Projet exemple — API', 'api', 'Exemple de projet backend : API REST, intégration mobile money, etc.', 'Sample backend project: REST API, mobile money integration, etc.', ['PHP', 'REST', 'Docker'], false],
        ];
        foreach ($projects as $index => [$title, $category, $summaryFr, $summaryEn, $technologies, $featured]) {
            Project::query()->create([
                'title' => $title,
                'slug' => Str::slug($title),
                'category' => $category,
                'summary_fr' => $summaryFr,
                'summary_en' => $summaryEn,
                'description_fr' => "## Contexte\n\nDécrivez le contexte du projet.\n\n## Solution\n\nCe que vous avez construit et comment.\n\n## Résultat\n\nL'impact concret.",
                'description_en' => "## Context\n\nDescribe the project context.\n\n## Solution\n\nWhat you built and how.\n\n## Outcome\n\nThe concrete impact.",
                'technologies' => $technologies,
                'year' => (string) now()->year,
                'is_featured' => $featured,
                'sort_order' => $index,
            ]);
        }

        $services = [
            ['Développement web', 'Web development', 'Sites et applications web sur mesure, rapides et sécurisés.', 'Custom, fast and secure websites and web apps.', 'code'],
            ['Applications mobiles', 'Mobile apps', 'Applications Android et iOS adaptées aux usages locaux.', 'Android and iOS apps built for local usage.', 'smartphone'],
            ['API & intégrations', 'APIs & integrations', 'Intégration mobile money (Orange Money, MTN MoMo), WhatsApp, services tiers.', 'Mobile money (Orange Money, MTN MoMo), WhatsApp and third-party integrations.', 'server'],
            ['Conseil & maintenance', 'Consulting & maintenance', 'Audit technique, hébergement, suivi et évolutions.', 'Technical audits, hosting, monitoring and improvements.', 'wrench'],
        ];
        foreach ($services as $index => [$titleFr, $titleEn, $descFr, $descEn, $icon]) {
            Service::query()->create([
                'title_fr' => $titleFr, 'title_en' => $titleEn,
                'description_fr' => $descFr, 'description_en' => $descEn,
                'icon' => $icon, 'sort_order' => $index,
            ]);
        }

        $packs = [
            ['Essentiel', 'Essential', 'Pour démarrer en ligne', 'To get online', ['Site vitrine', 'Formulaire de contact', 'Responsive mobile'], false],
            ['Business', 'Business', 'Pour vendre et gérer', 'To sell and manage', ['Tout l\'Essentiel', 'Espace d\'administration', 'Paiement mobile money'], true],
            ['Sur mesure', 'Custom', 'Pour les projets complexes', 'For complex projects', ['Cahier des charges dédié', 'Architecture évolutive', 'Accompagnement'], false],
        ];
        foreach ($packs as $index => [$nameFr, $nameEn, $tagFr, $tagEn, $features, $highlighted]) {
            Pack::query()->create([
                'name_fr' => $nameFr, 'name_en' => $nameEn,
                'tagline_fr' => $tagFr, 'tagline_en' => $tagEn,
                'price' => null,
                'features' => $features,
                'is_highlighted' => $highlighted,
                'sort_order' => $index,
            ]);
        }

        Experience::query()->create([
            'type' => 'work', 'title_fr' => 'Votre poste actuel', 'title_en' => 'Your current role',
            'organization' => 'Entreprise', 'location' => 'Douala', 'period' => '2024 — aujourd\'hui',
            'description_fr' => 'Décrivez vos responsabilités et réalisations.', 'description_en' => 'Describe your responsibilities and achievements.',
            'sort_order' => 0,
        ]);
        Experience::query()->create([
            'type' => 'education', 'title_fr' => 'Votre diplôme', 'title_en' => 'Your degree',
            'organization' => 'École / Université', 'location' => 'Yaoundé', 'period' => '2019 — 2022',
            'sort_order' => 1,
        ]);

        $skills = [
            'frontend' => ['React', 'Tailwind CSS', 'JavaScript'],
            'backend' => ['PHP', 'Laravel', 'MySQL'],
            'devops' => ['Git', 'Linux', 'Docker'],
        ];
        $position = 0;
        foreach ($skills as $category => $names) {
            foreach ($names as $name) {
                Skill::query()->create(['name' => $name, 'category' => $category, 'sort_order' => $position++]);
            }
        }

        $options = [
            ['type', 'Site vitrine', 'Showcase website'],
            ['type', 'Application web', 'Web application'],
            ['type', 'Application mobile', 'Mobile app'],
            ['feature', 'Paiement mobile money', 'Mobile money payment'],
            ['feature', 'Espace d\'administration', 'Admin dashboard'],
            ['feature', 'Site bilingue FR / EN', 'Bilingual FR / EN site'],
            ['support', 'Maintenance 3 mois', '3-month maintenance'],
        ];
        foreach ($options as $index => [$group, $labelFr, $labelEn]) {
            EstimatorOption::query()->create([
                'group' => $group, 'label_fr' => $labelFr, 'label_en' => $labelEn,
                'price' => null, 'sort_order' => $index,
            ]);
        }

        Blog::query()->create([
            'title' => 'Bienvenue sur mon blog',
            'slug' => 'bienvenue-sur-mon-blog',
            'lang' => 'fr',
            'excerpt' => 'Article d\'exemple : modifiez-le ou supprimez-le depuis Admin → Articles.',
            'content' => "Ceci est un **article d'exemple**.\n\nLe contenu s'écrit en *Markdown* :\n\n- listes\n- `code`\n- [liens](https://laravel.com)\n\n```php\nRoute::get('/', fn () => 'Bonjour Douala');\n```",
            'tags' => ['annonce'],
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    private function seedAdmin(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@example.com');
        $password = env('ADMIN_PASSWORD');

        if (User::query()->where('email', $email)->exists()) {
            return;
        }

        $generated = $password === null || $password === '';
        $password = $generated ? Str::password(16, symbols: false) : $password;

        $user = User::query()->create([
            'name' => 'Administrateur',
            'email' => $email,
            'password' => $password,
        ]);
        $user->forceFill(['is_admin' => true, 'email_verified_at' => now()])->save();

        $this->command?->info("Compte admin : {$email}");
        if ($generated) {
            $this->command?->warn("Mot de passe généré : {$password} (changez-le depuis Admin → Compte)");
        }
    }
}
