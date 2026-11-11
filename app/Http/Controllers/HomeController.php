<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\EstimatorOption;
use App\Models\Experience;
use App\Models\Pack;
use App\Models\Project;
use App\Models\Service;
use App\Models\Skill;
use App\Support\SiteSettings;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * One-page landing: hero, about, projects, services, blog and contact sections.
     */
    public function index(): Response
    {
        $settings = SiteSettings::values();
        $skills = Skill::query()->orderBy('sort_order')->get(['name', 'category']);

        return Inertia::render('Home', [
            'projects' => Project::query()->published()->get(),
            'services' => Service::query()->where('is_active', true)->orderBy('sort_order')->get(),
            'packs' => $settings['show_packs']
                ? Pack::query()->where('is_active', true)->orderBy('sort_order')->get()
                : [],
            'estimator' => $settings['show_estimator']
                ? EstimatorOption::query()->where('is_active', true)->whereNotNull('price')->orderBy('sort_order')->get()->groupBy('group')
                : [],
            'experiences' => Experience::query()->orderBy('sort_order')->get(),
            'skills' => $skills->pluck('name'),
            'skillGroups' => $skills->groupBy('category'),
            'posts' => $settings['show_blog']
                ? Blog::query()->published()->limit(3)->get(['id', 'title', 'slug', 'excerpt', 'lang', 'cover_image', 'content', 'published_at'])->makeHidden('content')
                : [],
        ]);
    }
}
