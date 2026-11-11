<?php

use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\PostTooLargeException;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Middleware\ValidatePostSize;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Check the POST size once the session is started, so the error can be flashed back to the form.
        $middleware->remove(ValidatePostSize::class);

        $middleware->web(append: [
            ValidatePostSize::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin' => EnsureUserIsAdmin::class,
        ]);

        $middleware->redirectUsersTo(fn () => route('dashboard'));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Uploads above PHP's post_max_size: show a form error instead of a raw 413 page.
        $exceptions->render(function (PostTooLargeException $exception, Request $request) {
            if ($request->expectsJson() && ! $request->header('X-Inertia')) {
                return null;
            }

            return back()->withErrors([
                'attachment' => 'Fichier trop lourd. Réduisez sa taille (2 Mo max pour une pièce jointe) ou envoyez-le via WhatsApp.',
            ]);
        });

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
