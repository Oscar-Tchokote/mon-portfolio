<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Blog;
use App\Models\BlogComment;
use App\Models\Contact;
use App\Models\CvEvent;
use App\Models\PageView;
use App\Models\Project;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $since = now()->subDays(29)->startOfDay();

        $daily = PageView::query()
            ->where('created_at', '>=', $since)
            ->selectRaw('date(created_at) as day, count(*) as views, count(distinct ip_hash) as visitors')
            ->groupBy('day')
            ->get()
            ->keyBy('day');

        $chart = collect(range(29, 0))->map(function (int $daysAgo) use ($daily): array {
            $day = Carbon::today()->subDays($daysAgo)->toDateString();

            return [
                'day' => $day,
                'views' => (int) ($daily[$day]->views ?? 0),
                'visitors' => (int) ($daily[$day]->visitors ?? 0),
            ];
        })->values();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'views_today' => PageView::query()->where('created_at', '>=', today())->count(),
                'views_30d' => PageView::query()->where('created_at', '>=', $since)->count(),
                'visitors_30d' => PageView::query()->where('created_at', '>=', $since)->distinct()->count('ip_hash'),
                'unread_messages' => Contact::query()->whereNull('read_at')->count(),
                'pending_comments' => BlogComment::query()->where('is_approved', false)->count(),
                'projects' => Project::query()->count(),
                'posts' => Blog::query()->where('status', 'published')->count(),
            ],
            'chart' => $chart,
            'cv' => CvEvent::query()
                ->where('created_at', '>=', $since)
                ->selectRaw('action, count(*) as total')
                ->groupBy('action')
                ->pluck('total', 'action'),
            'topPages' => PageView::query()
                ->where('created_at', '>=', $since)
                ->selectRaw('path, count(*) as total')
                ->groupBy('path')
                ->orderByDesc('total')
                ->limit(8)
                ->get(),
            'devices' => PageView::query()
                ->where('created_at', '>=', $since)
                ->selectRaw('device, count(*) as total')
                ->groupBy('device')
                ->pluck('total', 'device'),
            'topProjects' => Project::query()->orderByDesc('views')->limit(5)->get(['id', 'title', 'views']),
            'latestMessages' => Contact::query()->latest()->limit(5)->get(['id', 'name', 'subject', 'read_at', 'created_at']),
            'latestActivity' => ActivityLog::query()->with('user:id,name')->latest('created_at')->limit(6)->get(),
        ]);
    }
}
