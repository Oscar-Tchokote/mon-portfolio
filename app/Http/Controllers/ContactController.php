<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessageReceived;
use App\Models\Contact;
use App\Support\SiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        // Honeypot: bots fill the hidden "website" field, humans don't.
        if (filled($request->input('website'))) {
            return back()->with('success', 'message_sent');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'subject' => ['nullable', 'string', 'max:150'],
            'budget' => ['nullable', 'string', 'max:60'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            'attachment' => ['nullable', 'file', 'mimes:pdf,doc,docx,png,jpg,jpeg,zip', 'max:2048'],
        ]);

        $file = $request->file('attachment');
        if ($file instanceof UploadedFile) {
            $validated['attachment_name'] = mb_substr($file->getClientOriginalName(), 0, 200);
            $validated['attachment'] = $file->store('contact-attachments', 'local');
        }

        $contact = Contact::query()->create($validated);

        $this->forwardToInbox($contact);

        return back()->with('success', 'message_sent');
    }

    /**
     * Email the message to the address shown on the site. A mail failure must not
     * lose the message: it stays in the admin inbox and the error is logged.
     */
    private function forwardToInbox(Contact $contact): void
    {
        $recipient = SiteSettings::values()['email'] ?? null;

        if (! filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
            return;
        }

        try {
            Mail::to($recipient)->send(new ContactMessageReceived($contact));
        } catch (Throwable $exception) {
            report($exception);
        }
    }
}
