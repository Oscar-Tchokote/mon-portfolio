<?php

namespace App\Http\Middleware;

use App\Models\BlogComment;
use App\Models\Contact;
use App\Support\SiteSettings;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? $user->only(['id', 'name', 'email', 'is_admin']) : null,
            ],
            'site' => fn () => SiteSettings::public(),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'adminBadges' => fn () => $user?->is_admin ? [
                'messages' => Contact::query()->whereNull('read_at')->count(),
                'comments' => BlogComment::query()->where('is_approved', false)->count(),
            ] : null,
        ];
    }
}
