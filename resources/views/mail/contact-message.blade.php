<x-mail::message>
# Nouveau message depuis votre portfolio

**{{ $contact->name }}** vous a écrit via le formulaire de contact.

<x-mail::panel>
**Email :** {{ $contact->email }}<br>
@if ($contact->phone)
**Téléphone / WhatsApp :** {{ $contact->phone }}<br>
@endif
@if ($contact->budget)
**Budget estimé :** {{ $contact->budget }}<br>
@endif
@if ($contact->subject)
**Sujet :** {{ $contact->subject }}
@endif
</x-mail::panel>

{!! nl2br(e($contact->message)) !!}

@if ($contact->attachment_name)
*Pièce jointe : {{ $contact->attachment_name }}*
@endif

<x-mail::button :url="$adminUrl">
Voir dans l'administration
</x-mail::button>

Répondez directement à cet email : votre réponse partira vers {{ $contact->email }}.
</x-mail::message>
