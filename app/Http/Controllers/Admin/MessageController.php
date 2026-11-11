<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MessageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Messages', [
            'messages' => Contact::query()->latest()->paginate(20),
        ]);
    }

    public function markRead(Contact $message): RedirectResponse
    {
        $message->update(['read_at' => $message->read_at ? null : now()]);

        return back()->with('success', $message->read_at ? 'Message marqué comme lu.' : 'Message marqué comme non lu.');
    }

    public function attachment(Contact $message): StreamedResponse
    {
        abort_unless($message->attachment && Storage::disk('local')->exists($message->attachment), 404);

        return Storage::disk('local')->download($message->attachment, $message->attachment_name ?? basename($message->attachment));
    }

    public function destroy(Contact $message): RedirectResponse
    {
        if ($message->attachment) {
            Storage::disk('local')->delete($message->attachment);
        }

        ActivityLog::record('Suppression d\'un message', "{$message->name} — {$message->subject}");
        $message->delete();

        return back()->with('success', 'Message supprimé.');
    }
}
