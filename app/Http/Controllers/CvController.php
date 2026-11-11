<?php

namespace App\Http\Controllers;

use App\Models\CvEvent;
use App\Support\SiteSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CvController extends Controller
{
    public function show(Request $request): StreamedResponse
    {
        $path = $this->path();
        $this->trackOnce($request, 'view');

        return Storage::disk('local')->response($path, $this->filename(), [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$this->filename().'"',
        ]);
    }

    public function download(Request $request): StreamedResponse
    {
        $path = $this->path();
        $this->trackOnce($request, 'download');

        return Storage::disk('local')->download($path, $this->filename());
    }

    public function track(Request $request): JsonResponse
    {
        $validated = $request->validate(['action' => ['required', 'in:share']]);
        $this->trackOnce($request, $validated['action']);

        return response()->json(['ok' => true]);
    }

    private function path(): string
    {
        $path = SiteSettings::values()['cv_pdf'];
        abort_unless($path && Storage::disk('local')->exists($path), 404);

        return $path;
    }

    private function filename(): string
    {
        return 'CV_'.Str::slug(SiteSettings::values()['name'], '_').'.pdf';
    }

    private function trackOnce(Request $request, string $action): void
    {
        if ($request->user()?->is_admin) {
            return;
        }

        $sessionKey = "cv_tracked_{$action}";
        if ($request->session()->has($sessionKey)) {
            return;
        }

        $request->session()->put($sessionKey, true);
        CvEvent::query()->create([
            'action' => $action,
            'ip_hash' => hash('sha256', $request->ip().config('app.key')),
        ]);
    }
}
