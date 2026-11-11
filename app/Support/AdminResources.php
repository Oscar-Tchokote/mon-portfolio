<?php

namespace App\Support;

use App\Models\Blog;
use App\Models\EstimatorOption;
use App\Models\Experience;
use App\Models\Pack;
use App\Models\Project;
use App\Models\Service;
use App\Models\Skill;
use Illuminate\Validation\Rule;

/**
 * Declarative definition of every content type editable from the admin.
 *
 * Field types: text, textarea, markdown, number, price, checkbox, select,
 * tags (comma separated list), lines (one item per line), image, gallery, datetime, url.
 */
class AdminResources
{
    public const SERVICE_ICONS = [
        'code', 'smartphone', 'server', 'palette', 'shopping-cart', 'rocket',
        'database', 'cloud', 'shield', 'bar-chart', 'layout', 'wrench', 'bot', 'truck',
    ];

    /**
     * @return array<string, array{model: class-string, label: string, singular: string, columns: list<string>, order: array{0: string, 1: string}, title: string, slugFrom?: string, fields: list<array<string, mixed>>}>
     */
    public static function all(): array
    {
        return [
            'projects' => [
                'model' => Project::class,
                'label' => 'Projets',
                'singular' => 'projet',
                'columns' => ['title', 'category', 'is_featured', 'is_published', 'views'],
                'order' => ['sort_order', 'asc'],
                'title' => 'title',
                'slugFrom' => 'title',
                'fields' => [
                    ['name' => 'title', 'label' => 'Titre', 'type' => 'text', 'required' => true],
                    ['name' => 'slug', 'label' => 'Slug (URL)', 'type' => 'text', 'help' => 'Laisser vide pour le générer depuis le titre.'],
                    ['name' => 'category', 'label' => 'Catégorie', 'type' => 'select', 'required' => true, 'options' => [
                        'web' => 'Application web', 'mobile' => 'Mobile', 'api' => 'API / Backend', 'design' => 'UI / Design', 'other' => 'Autre',
                    ]],
                    ['name' => 'client', 'label' => 'Client / contexte', 'type' => 'text'],
                    ['name' => 'year', 'label' => 'Année', 'type' => 'text', 'max' => 10],
                    ['name' => 'summary_fr', 'label' => 'Résumé (FR)', 'type' => 'textarea', 'max' => 500, 'required' => true],
                    ['name' => 'summary_en', 'label' => 'Résumé (EN)', 'type' => 'textarea', 'max' => 500],
                    ['name' => 'description_fr', 'label' => 'Description détaillée (FR, Markdown)', 'type' => 'markdown'],
                    ['name' => 'description_en', 'label' => 'Description détaillée (EN, Markdown)', 'type' => 'markdown'],
                    ['name' => 'technologies', 'label' => 'Technologies', 'type' => 'tags', 'help' => 'Séparées par des virgules : Laravel, React, MySQL'],
                    ['name' => 'github_url', 'label' => 'Lien GitHub', 'type' => 'url'],
                    ['name' => 'demo_url', 'label' => 'Lien démo / site', 'type' => 'url'],
                    ['name' => 'cover_image', 'label' => 'Image de couverture', 'type' => 'image'],
                    ['name' => 'images', 'label' => 'Galerie', 'type' => 'gallery'],
                    ['name' => 'is_featured', 'label' => 'Mis en avant sur l\'accueil', 'type' => 'checkbox'],
                    ['name' => 'is_published', 'label' => 'Publié', 'type' => 'checkbox', 'default' => true],
                    ['name' => 'sort_order', 'label' => 'Ordre d\'affichage', 'type' => 'number', 'default' => 0],
                ],
            ],

            'services' => [
                'model' => Service::class,
                'label' => 'Services',
                'singular' => 'service',
                'columns' => ['title_fr', 'icon', 'is_active', 'sort_order'],
                'order' => ['sort_order', 'asc'],
                'title' => 'title_fr',
                'fields' => [
                    ['name' => 'title_fr', 'label' => 'Titre (FR)', 'type' => 'text', 'required' => true],
                    ['name' => 'title_en', 'label' => 'Titre (EN)', 'type' => 'text'],
                    ['name' => 'description_fr', 'label' => 'Description (FR)', 'type' => 'textarea'],
                    ['name' => 'description_en', 'label' => 'Description (EN)', 'type' => 'textarea'],
                    ['name' => 'icon', 'label' => 'Icône', 'type' => 'select', 'options' => array_combine(self::SERVICE_ICONS, self::SERVICE_ICONS), 'default' => 'code'],
                    ['name' => 'features', 'label' => 'Points clés', 'type' => 'lines', 'help' => 'Un point par ligne.'],
                    ['name' => 'is_active', 'label' => 'Visible', 'type' => 'checkbox', 'default' => true],
                    ['name' => 'sort_order', 'label' => 'Ordre', 'type' => 'number', 'default' => 0],
                ],
            ],

            'packs' => [
                'model' => Pack::class,
                'label' => 'Packs & tarifs',
                'singular' => 'pack',
                'columns' => ['name_fr', 'price', 'is_highlighted', 'is_active'],
                'order' => ['sort_order', 'asc'],
                'title' => 'name_fr',
                'fields' => [
                    ['name' => 'name_fr', 'label' => 'Nom (FR)', 'type' => 'text', 'required' => true],
                    ['name' => 'name_en', 'label' => 'Nom (EN)', 'type' => 'text'],
                    ['name' => 'tagline_fr', 'label' => 'Accroche (FR)', 'type' => 'text'],
                    ['name' => 'tagline_en', 'label' => 'Accroche (EN)', 'type' => 'text'],
                    ['name' => 'price', 'label' => 'Prix (FCFA)', 'type' => 'price', 'help' => 'Laisser vide pour afficher « Sur devis ».'],
                    ['name' => 'price_note_fr', 'label' => 'Mention sous le prix (FR)', 'type' => 'text', 'help' => 'Ex. : à partir de, par mois…'],
                    ['name' => 'price_note_en', 'label' => 'Mention sous le prix (EN)', 'type' => 'text'],
                    ['name' => 'features', 'label' => 'Inclus', 'type' => 'lines', 'help' => 'Un élément par ligne.'],
                    ['name' => 'is_highlighted', 'label' => 'Pack recommandé', 'type' => 'checkbox'],
                    ['name' => 'is_active', 'label' => 'Visible', 'type' => 'checkbox', 'default' => true],
                    ['name' => 'sort_order', 'label' => 'Ordre', 'type' => 'number', 'default' => 0],
                ],
            ],

            'experiences' => [
                'model' => Experience::class,
                'label' => 'Parcours',
                'singular' => 'étape de parcours',
                'columns' => ['title_fr', 'organization', 'type', 'period'],
                'order' => ['sort_order', 'asc'],
                'title' => 'title_fr',
                'fields' => [
                    ['name' => 'type', 'label' => 'Type', 'type' => 'select', 'required' => true, 'options' => [
                        'work' => 'Expérience', 'education' => 'Formation', 'certification' => 'Certification',
                    ], 'default' => 'work'],
                    ['name' => 'title_fr', 'label' => 'Intitulé (FR)', 'type' => 'text', 'required' => true],
                    ['name' => 'title_en', 'label' => 'Intitulé (EN)', 'type' => 'text'],
                    ['name' => 'organization', 'label' => 'Entreprise / école', 'type' => 'text', 'required' => true],
                    ['name' => 'location', 'label' => 'Lieu', 'type' => 'text'],
                    ['name' => 'period', 'label' => 'Période', 'type' => 'text', 'required' => true, 'help' => 'Ex. : 2023 — aujourd\'hui'],
                    ['name' => 'description_fr', 'label' => 'Description (FR)', 'type' => 'textarea'],
                    ['name' => 'description_en', 'label' => 'Description (EN)', 'type' => 'textarea'],
                    ['name' => 'sort_order', 'label' => 'Ordre (0 = en haut)', 'type' => 'number', 'default' => 0],
                ],
            ],

            'skills' => [
                'model' => Skill::class,
                'label' => 'Compétences',
                'singular' => 'compétence',
                'columns' => ['name', 'category', 'sort_order'],
                'order' => ['sort_order', 'asc'],
                'title' => 'name',
                'fields' => [
                    ['name' => 'name', 'label' => 'Nom', 'type' => 'text', 'required' => true],
                    ['name' => 'category', 'label' => 'Catégorie', 'type' => 'select', 'required' => true, 'options' => [
                        'frontend' => 'Frontend', 'backend' => 'Backend', 'mobile' => 'Mobile', 'devops' => 'DevOps & Cloud',
                        'data' => 'Données & IA', 'tools' => 'Outils', 'soft' => 'Gestion & soft skills',
                    ]],
                    ['name' => 'sort_order', 'label' => 'Ordre', 'type' => 'number', 'default' => 0],
                ],
            ],

            'estimator' => [
                'model' => EstimatorOption::class,
                'label' => 'Estimateur de devis',
                'singular' => 'option d\'estimation',
                'columns' => ['label_fr', 'group', 'price', 'is_active'],
                'order' => ['sort_order', 'asc'],
                'title' => 'label_fr',
                'fields' => [
                    ['name' => 'group', 'label' => 'Groupe', 'type' => 'select', 'required' => true, 'options' => [
                        'type' => 'Type de projet (choix unique, prix de base)',
                        'feature' => 'Fonctionnalité (cumulable)',
                        'support' => 'Accompagnement (cumulable)',
                    ], 'default' => 'feature'],
                    ['name' => 'label_fr', 'label' => 'Libellé (FR)', 'type' => 'text', 'required' => true],
                    ['name' => 'label_en', 'label' => 'Libellé (EN)', 'type' => 'text'],
                    ['name' => 'price', 'label' => 'Prix (FCFA)', 'type' => 'price', 'help' => 'Une option sans prix n\'apparaît pas dans l\'estimateur public.'],
                    ['name' => 'is_active', 'label' => 'Active', 'type' => 'checkbox', 'default' => true],
                    ['name' => 'sort_order', 'label' => 'Ordre', 'type' => 'number', 'default' => 0],
                ],
            ],

            'blogs' => [
                'model' => Blog::class,
                'label' => 'Articles',
                'singular' => 'article',
                'columns' => ['title', 'lang', 'status', 'published_at', 'views'],
                'order' => ['created_at', 'desc'],
                'title' => 'title',
                'slugFrom' => 'title',
                'fields' => [
                    ['name' => 'title', 'label' => 'Titre', 'type' => 'text', 'required' => true],
                    ['name' => 'slug', 'label' => 'Slug (URL)', 'type' => 'text', 'help' => 'Laisser vide pour le générer depuis le titre.'],
                    ['name' => 'lang', 'label' => 'Langue', 'type' => 'select', 'required' => true, 'options' => ['fr' => 'Français', 'en' => 'English'], 'default' => 'fr'],
                    ['name' => 'excerpt', 'label' => 'Chapô', 'type' => 'textarea', 'max' => 500],
                    ['name' => 'content', 'label' => 'Contenu (Markdown)', 'type' => 'markdown', 'rows' => 18],
                    ['name' => 'tags', 'label' => 'Tags', 'type' => 'tags'],
                    ['name' => 'cover_image', 'label' => 'Image de couverture', 'type' => 'image'],
                    ['name' => 'status', 'label' => 'Statut', 'type' => 'select', 'required' => true, 'options' => ['draft' => 'Brouillon', 'published' => 'Publié'], 'default' => 'draft'],
                    ['name' => 'published_at', 'label' => 'Date de publication', 'type' => 'datetime', 'help' => 'Vide = maintenant, au moment de publier.'],
                ],
            ],
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function find(string $key): ?array
    {
        return static::all()[$key] ?? null;
    }

    /**
     * Build validation rules for a resource.
     *
     * @param  array<string, mixed>  $resource
     * @return array<string, mixed>
     */
    public static function rules(array $resource, ?int $ignoreId = null): array
    {
        $rules = [];
        $table = (new $resource['model'])->getTable();

        foreach ($resource['fields'] as $field) {
            $name = $field['name'];
            $base = ! empty($field['required']) ? ['required'] : ['nullable'];

            $rules[$name] = match ($field['type']) {
                'text' => [...$base, 'string', 'max:'.($field['max'] ?? 255)],
                'textarea' => [...$base, 'string', 'max:'.($field['max'] ?? 5000)],
                'markdown' => [...$base, 'string', 'max:100000'],
                'url' => [...$base, 'url', 'max:255'],
                'number' => [...$base, 'integer', 'min:0', 'max:100000'],
                'price' => [...$base, 'integer', 'min:0', 'max:10000000000'],
                'checkbox' => ['boolean'],
                'select' => [...$base, Rule::in(array_keys($field['options']))],
                'tags', 'lines' => [...$base, 'array', 'max:50'],
                'datetime' => [...$base, 'date'],
                'image' => ['nullable', 'image', 'max:4096'],
                'gallery' => ['nullable', 'array', 'max:20'],
            };

            if (in_array($field['type'], ['tags', 'lines'], true)) {
                $rules[$name.'.*'] = ['nullable', 'string', 'max:255'];
            }

            if ($field['type'] === 'image') {
                $rules['remove_'.$name] = ['nullable', 'boolean'];
            }

            if ($field['type'] === 'gallery') {
                $rules[$name.'.*'] = ['image', 'max:4096'];
                $rules['remove_'.$name] = ['nullable', 'array'];
                $rules['remove_'.$name.'.*'] = ['integer'];
            }

            if ($name === 'slug') {
                $rules['slug'][] = 'alpha_dash';
                $rules['slug'][] = Rule::unique($table, 'slug')->ignore($ignoreId);
            }
        }

        return $rules;
    }
}
