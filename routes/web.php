<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\CommentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\ResourceController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CvController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SitemapController;
use App\Http\Middleware\TrackPageView;
use App\Support\AdminResources;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public portfolio
|--------------------------------------------------------------------------
*/
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

/*
| Former standalone pages now live as sections of the one-page landing.
*/
foreach (['a-propos', 'services', 'contact', 'projets'] as $section) {
    Route::get("/{$section}", fn () => redirect()->to(route('home')."#{$section}", 301));
}

Route::middleware(TrackPageView::class)->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/projets/{slug}', [ProjectController::class, 'show'])->name('projects.show');
    Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
    Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');
});

Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,1')->name('contact.store');
Route::post('/blog/{slug}/commentaires', [BlogController::class, 'comment'])->middleware('throttle:5,1')->name('blog.comment');
Route::post('/blog/{slug}/like', [BlogController::class, 'like'])->middleware('throttle:20,1')->name('blog.like');

Route::get('/cv', [CvController::class, 'show'])->name('cv.show');
Route::get('/cv/telecharger', [CvController::class, 'download'])->name('cv.download');
Route::post('/cv/track', [CvController::class, 'track'])->middleware('throttle:20,1')->name('cv.track');

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profil-site', [SettingController::class, 'edit'])->name('admin.settings.edit');
    Route::post('/profil-site', [SettingController::class, 'update'])->name('admin.settings.update');

    Route::get('/messages', [MessageController::class, 'index'])->name('admin.messages.index');
    Route::patch('/messages/{message}/lu', [MessageController::class, 'markRead'])->name('admin.messages.read');
    Route::get('/messages/{message}/piece-jointe', [MessageController::class, 'attachment'])->name('admin.messages.attachment');
    Route::delete('/messages/{message}', [MessageController::class, 'destroy'])->name('admin.messages.destroy');

    Route::get('/commentaires', [CommentController::class, 'index'])->name('admin.comments.index');
    Route::patch('/commentaires/{comment}', [CommentController::class, 'toggle'])->name('admin.comments.toggle');
    Route::delete('/commentaires/{comment}', [CommentController::class, 'destroy'])->name('admin.comments.destroy');

    Route::get('/journal', [ActivityLogController::class, 'index'])->name('admin.activity.index');

    Route::get('/compte', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/compte', [ProfileController::class, 'update'])->name('profile.update');

    $resources = array_keys(AdminResources::all());
    Route::get('/contenu/{resource}', [ResourceController::class, 'index'])->whereIn('resource', $resources)->name('admin.resource.index');
    Route::post('/contenu/{resource}', [ResourceController::class, 'store'])->whereIn('resource', $resources)->name('admin.resource.store');
    Route::post('/contenu/{resource}/{id}', [ResourceController::class, 'update'])->whereIn('resource', $resources)->whereNumber('id')->name('admin.resource.update');
    Route::delete('/contenu/{resource}/{id}', [ResourceController::class, 'destroy'])->whereIn('resource', $resources)->whereNumber('id')->name('admin.resource.destroy');
});

require __DIR__.'/auth.php';
