<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Project;
use App\Support\SiteSettings;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $urls = collect([
            ['loc' => route('home'), 'lastmod' => null],
        ]);

        Project::query()->published()->get(['slug', 'updated_at'])->each(
            fn (Project $project) => $urls->push(['loc' => route('projects.show', $project->slug), 'lastmod' => $project->updated_at])
        );

        if (SiteSettings::values()['show_blog']) {
            $urls->push(['loc' => route('blog.index'), 'lastmod' => null]);
            Blog::query()->published()->get(['slug', 'updated_at'])->each(
                fn (Blog $post) => $urls->push(['loc' => route('blog.show', $post->slug), 'lastmod' => $post->updated_at])
            );
        }

        return response()->view('sitemap', ['urls' => $urls], 200, ['Content-Type' => 'application/xml']);
    }
}
