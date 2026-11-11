<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function show(Request $request, string $slug): Response
    {
        $project = Project::query()->where('slug', $slug)->where('is_published', true)->with('images')->firstOrFail();

        $sessionKey = "viewed_project_{$project->id}";
        if (! $request->session()->has($sessionKey)) {
            $project->increment('views');
            $request->session()->put($sessionKey, true);
        }

        $others = Project::query()->published()->whereKeyNot($project->id)->limit(3)->get();

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'others' => $others,
        ]);
    }
}
