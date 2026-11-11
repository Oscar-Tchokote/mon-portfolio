<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/ActivityLogs', [
            'logs' => ActivityLog::query()->with('user:id,name')->latest('created_at')->paginate(40),
        ]);
    }
}
