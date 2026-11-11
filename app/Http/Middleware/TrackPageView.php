<?php

namespace App\Http\Middleware;

use App\Models\PageView;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class TrackPageView
{
    private const BOT_PATTERN = '/bot|crawl|spider|slurp|facebookexternalhit|whatsapp|preview|curl|wget|python|headless/i';

    /**
     * Record anonymous page views for the admin analytics (IP is hashed, never stored raw).
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($this->shouldTrack($request, $response)) {
            try {
                $agent = (string) $request->userAgent();
                $referrer = (string) $request->headers->get('referer', '');

                PageView::query()->create([
                    'path' => '/'.ltrim($request->path(), '/'),
                    'ip_hash' => hash('sha256', $request->ip().config('app.key')),
                    'referrer' => $referrer !== '' && ! Str::startsWith($referrer, config('app.url')) ? mb_substr($referrer, 0, 250) : null,
                    'device' => preg_match('/mobile|android|iphone/i', $agent) ? 'mobile' : (preg_match('/ipad|tablet/i', $agent) ? 'tablet' : 'desktop'),
                ]);
            } catch (Throwable $exception) {
                report($exception);
            }
        }

        return $response;
    }

    private function shouldTrack(Request $request, Response $response): bool
    {
        return $request->isMethod('GET')
            && $response->isSuccessful()
            && ! $request->user()?->is_admin
            && ! $request->header('X-Inertia-Partial-Data')
            && ! preg_match(self::BOT_PATTERN, (string) $request->userAgent());
    }
}
