<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\BlogComment;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CommentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Comments', [
            'comments' => BlogComment::query()
                ->with('blog:id,title,slug')
                ->orderBy('is_approved')
                ->latest()
                ->paginate(30)
                ->through(fn (BlogComment $comment): array => [
                    ...$comment->toArray(),
                    'email' => $comment->email,
                ]),
        ]);
    }

    public function toggle(BlogComment $comment): RedirectResponse
    {
        $comment->update(['is_approved' => ! $comment->is_approved]);
        ActivityLog::record($comment->is_approved ? 'Commentaire approuvé' : 'Commentaire masqué', $comment->name);

        return back()->with('success', $comment->is_approved ? 'Commentaire approuvé et publié.' : 'Commentaire masqué.');
    }

    public function destroy(BlogComment $comment): RedirectResponse
    {
        ActivityLog::record('Commentaire supprimé', $comment->name);
        $comment->delete();

        return back()->with('success', 'Commentaire supprimé.');
    }
}
