<?php

namespace App\Support;

use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

/**
 * Site-wide profile and configuration values, editable from the admin "Profil & site" page.
 */
class SiteSettings
{
    /**
     * Grouped field definitions with their default (placeholder) values.
     *
     * @return array<string, array{label: string, fields: list<array<string, mixed>>}>
     */
    public static function groups(): array
    {
        return [
            'identity' => ['label' => 'Identité', 'fields' => [
                ['name' => 'name', 'label' => 'Nom complet', 'type' => 'text', 'default' => 'Votre Nom'],
                ['name' => 'brand', 'label' => 'Nom de marque / surnom (logo)', 'type' => 'text', 'default' => 'VN.'],
                ['name' => 'title_fr', 'label' => 'Titre (FR)', 'type' => 'text', 'default' => 'Développeur Full Stack'],
                ['name' => 'title_en', 'label' => 'Titre (EN)', 'type' => 'text', 'default' => 'Full Stack Developer'],
                ['name' => 'location', 'label' => 'Localisation', 'type' => 'text', 'default' => 'Douala, Cameroun'],
                ['name' => 'is_available', 'label' => 'Disponible pour de nouveaux projets', 'type' => 'checkbox', 'default' => true],
                ['name' => 'photo', 'label' => 'Photo de profil', 'type' => 'image', 'default' => null],
            ]],
            'texts' => ['label' => 'Textes', 'fields' => [
                ['name' => 'hero_fr', 'label' => 'Phrase d\'accroche accueil (FR)', 'type' => 'textarea', 'default' => 'Je conçois et développe des applications web et mobiles fiables, pensées pour le marché africain.'],
                ['name' => 'hero_en', 'label' => 'Phrase d\'accroche accueil (EN)', 'type' => 'textarea', 'default' => 'I design and build reliable web and mobile applications, made for the African market.'],
                ['name' => 'bio_fr', 'label' => 'Biographie (FR, Markdown)', 'type' => 'markdown', 'default' => "Remplacez ce texte par votre parcours : d'où vous venez, ce que vous faites aujourd'hui et ce qui vous motive.\n\nCe paragraphe se modifie depuis **Admin → Profil & site**."],
                ['name' => 'bio_en', 'label' => 'Biographie (EN, Markdown)', 'type' => 'markdown', 'default' => "Replace this text with your story: where you come from, what you do today and what drives you.\n\nEdit it from **Admin → Profile & site**."],
                ['name' => 'meta_description_fr', 'label' => 'Description SEO (FR)', 'type' => 'textarea', 'default' => 'Portfolio — projets, services et contact.'],
                ['name' => 'meta_description_en', 'label' => 'Description SEO (EN)', 'type' => 'textarea', 'default' => 'Portfolio — projects, services and contact.'],
            ]],
            'contact' => ['label' => 'Contact & réseaux', 'fields' => [
                ['name' => 'email', 'label' => 'Email', 'type' => 'text', 'default' => 'vous@exemple.com'],
                ['name' => 'phone', 'label' => 'Téléphone (affiché)', 'type' => 'text', 'default' => '+237 6XX XX XX XX'],
                ['name' => 'whatsapp', 'label' => 'WhatsApp (chiffres uniquement, avec indicatif)', 'type' => 'text', 'default' => '', 'help' => 'Ex. : 2376XXXXXXXX. Vide = bouton WhatsApp masqué.'],
                ['name' => 'github', 'label' => 'GitHub (URL)', 'type' => 'text', 'default' => ''],
                ['name' => 'linkedin', 'label' => 'LinkedIn (URL)', 'type' => 'text', 'default' => ''],
                ['name' => 'twitter', 'label' => 'X / Twitter (URL)', 'type' => 'text', 'default' => ''],
            ]],
            'cv' => ['label' => 'CV', 'fields' => [
                ['name' => 'cv_pdf', 'label' => 'CV (PDF)', 'type' => 'file', 'default' => null],
            ]],
            'modules' => ['label' => 'Modules', 'fields' => [
                ['name' => 'show_blog', 'label' => 'Afficher le blog', 'type' => 'checkbox', 'default' => true],
                ['name' => 'show_packs', 'label' => 'Afficher les packs & tarifs', 'type' => 'checkbox', 'default' => true],
                ['name' => 'show_estimator', 'label' => 'Afficher l\'estimateur de devis', 'type' => 'checkbox', 'default' => true],
            ]],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function fields(): array
    {
        return array_merge(...array_map(fn (array $group): array => $group['fields'], array_values(static::groups())));
    }

    /**
     * Raw values merged over defaults.
     *
     * @return array<string, mixed>
     */
    public static function values(): array
    {
        $stored = Setting::allAsArray();
        $values = [];

        foreach (static::fields() as $field) {
            $values[$field['name']] = array_key_exists($field['name'], $stored) ? $stored[$field['name']] : $field['default'];
        }

        return $values;
    }

    /**
     * Values exposed to the public frontend (file paths resolved to URLs).
     *
     * @return array<string, mixed>
     */
    public static function public(): array
    {
        $values = static::values();
        $values['photo_url'] = $values['photo'] ? Storage::url($values['photo']) : null;
        $values['has_cv'] = (bool) $values['cv_pdf'];
        unset($values['photo'], $values['cv_pdf']);

        return $values;
    }
}
