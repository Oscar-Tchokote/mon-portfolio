<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Support\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless(SiteSettings::values()['show_blog'], 404);

        $search = trim((string) $request->query('q', ''));
        $tag = trim((string) $request->query('tag', ''));

        $posts = Blog::query()->published()
            ->when($search !== '', fn ($q) => $q->where(fn ($inner) => $inner
                ->where('title', 'like', "%{$search}%")
                ->orWhere('excerpt', 'like', "%{$search}%")))
            ->when($tag !== '', fn ($q) => $q->where('tags', 'like', '%"'.str_replace(['%', '_', '"'], '', $tag).'"%'))
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Blog $post) => $post->makeHidden('content'));

        $tags = Blog::query()->published()->pluck('tags')->flatten()->filter()->countBy()->sortDesc()->keys()->take(15)->values();

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
            'tags' => $tags,
            'filters' => ['q' => $search, 'tag' => $tag],
        ]);
    }

    public function show(Request $request, string $slug): Response
    {
        abort_unless(SiteSettings::values()['show_blog'], 404);

        $post = Blog::query()->published()->where('slug', $slug)->firstOrFail();

        $sessionKey = "viewed_post_{$post->id}";
        if (! $request->session()->has($sessionKey)) {
            $post->increment('views');
            $request->session()->put($sessionKey, true);
        }

        return Inertia::render('Blog/Show', [
            'post' => $post,
            'comments' => $post->comments()->where('is_approved', true)->latest()->get(['id', 'name', 'content', 'created_at']),
            'liked' => $request->session()->has("liked_post_{$post->id}"),
            'related' => Blog::query()->published()->whereKeyNot($post->id)->limit(3)->get()->makeHidden('content'),
        ]);
    }

    public function like(Request $request, string $slug): RedirectResponse
    {
        $post = Blog::query()->published()->where('slug', $slug)->firstOrFail();
        $sessionKey = "liked_post_{$post->id}";

        if (! $request->session()->has($sessionKey)) {
            $post->increment('likes');
            $request->session()->put($sessionKey, true);
        }

        return back();
    }

    public function comment(Request $request, string $slug): RedirectResponse
    {
        $post = Blog::query()->published()->where('slug', $slug)->firstOrFail();

        if (filled($request->input('website'))) {
            return back()->with('success', 'comment_pending');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'email' => ['nullable', 'email', 'max:255'],
            'content' => ['required', 'string', 'min:3', 'max:2000'],
        ]);

        $post->comments()->create([
            ...$validated,
            'is_approved' => false,
            'ip_hash' => hash('sha256', $request->ip().config('app.key')),
        ]);

        return back()->with('success', 'comment_pending');
    }
}
