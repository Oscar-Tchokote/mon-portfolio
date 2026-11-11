<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

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

        Contact::query()->create($validated);

        return back()->with('success', 'message_sent');
    }
}
