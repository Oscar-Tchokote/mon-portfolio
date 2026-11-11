<?php

namespace App\Mail;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Forwards a message sent from the portfolio contact form to the owner's inbox.
 * "Reply" in the mail client answers the visitor directly.
 */
class ContactMessageReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Contact $contact) {}

    public function envelope(): Envelope
    {
        $subject = $this->contact->subject
            ? "Portfolio — {$this->contact->subject}"
            : "Portfolio — nouveau message de {$this->contact->name}";

        return new Envelope(
            replyTo: [new Address($this->contact->email, $this->contact->name)],
            subject: Str::limit($subject, 120),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.contact-message',
            with: [
                'adminUrl' => route('admin.messages.index'),
            ],
        );
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        if (! $this->contact->attachment || ! Storage::disk('local')->exists($this->contact->attachment)) {
            return [];
        }

        return [
            Attachment::fromStorageDisk('local', $this->contact->attachment)
                ->as($this->contact->attachment_name ?? basename($this->contact->attachment)),
        ];
    }
}
