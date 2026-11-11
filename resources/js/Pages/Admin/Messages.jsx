import { router } from '@inertiajs/react';
import { Mail, MailOpen, Paperclip, Phone, Trash2, Wallet } from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/Components/Site/Pagination';
import { WhatsappIcon } from '@/Components/Site/BrandIcons';
import { confirmAction } from '@/Components/Admin/ConfirmDialog';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatDate } from '@/lib/format';

export default function Messages({ messages }) {
    const [openId, setOpenId] = useState(null);

    const toggle = (message) => {
        setOpenId(openId === message.id ? null : message.id);
        if (!message.read_at && openId !== message.id) {
            router.patch(route('admin.messages.read', message.id), {}, { preserveScroll: true, preserveState: true });
        }
    };

    const destroy = (message) => {
        confirmAction({
            title: 'Supprimer ce message ?',
            message: `Le message de ${message.name} et sa pièce jointe seront définitivement supprimés.`,
            confirmLabel: 'Supprimer',
        }).then((confirmed) => confirmed && router.delete(route('admin.messages.destroy', message.id), { preserveScroll: true }));
    };

    const phoneDigits = (phone) => (phone || '').replace(/\D/g, '');

    return (
        <AuthenticatedLayout title="Messages">
            <div className="card divide-y divide-line overflow-hidden">
                {messages.data.length === 0 && <p className="p-12 text-center text-muted">Aucun message pour l'instant.</p>}
                {messages.data.map((message) => {
                    const open = openId === message.id;
                    return (
                        <article key={message.id} className={open ? 'bg-line/20' : ''}>
                            <button type="button" onClick={() => toggle(message)} className="flex w-full items-start gap-4 px-5 py-4 text-left hover:bg-line/20">
                                <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${message.read_at ? 'bg-transparent' : 'bg-accent'}`} />
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                                        <p className={`truncate ${message.read_at ? 'font-medium' : 'font-bold'}`}>{message.name}</p>
                                        <p className="shrink-0 font-mono text-xs text-muted">{formatDate(message.created_at, 'fr', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <p className="truncate text-sm text-muted">
                                        {message.subject || '(sans sujet)'} — {message.message}
                                    </p>
                                </div>
                                {message.attachment && <Paperclip className="mt-1 h-4 w-4 shrink-0 text-muted" />}
                            </button>

                            {open && (
                                <div className="px-5 pb-5 pl-11">
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <a href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject ?? ''}`)}`} className="btn-ghost px-3 py-1.5 text-xs"><Mail className="h-3.5 w-3.5" /> {message.email}</a>
                                        {message.phone && (
                                            <>
                                                <a href={`tel:${message.phone}`} className="btn-ghost px-3 py-1.5 text-xs"><Phone className="h-3.5 w-3.5" /> {message.phone}</a>
                                                {phoneDigits(message.phone).length >= 8 && (
                                                    <a href={`https://wa.me/${phoneDigits(message.phone)}`} target="_blank" rel="noopener noreferrer" className="btn-ghost px-3 py-1.5 text-xs"><WhatsappIcon className="h-3.5 w-3.5" /> WhatsApp</a>
                                                )}
                                            </>
                                        )}
                                        {message.budget && <span className="chip gap-1"><Wallet className="h-3.5 w-3.5" /> {message.budget}</span>}
                                    </div>
                                    <p className="mt-4 whitespace-pre-line leading-relaxed">{message.message}</p>
                                    <div className="mt-5 flex flex-wrap items-center gap-2">
                                        {message.attachment && (
                                            <a href={route('admin.messages.attachment', message.id)} className="btn-ghost px-3 py-1.5 text-xs">
                                                <Paperclip className="h-3.5 w-3.5" /> {message.attachment_name || 'Pièce jointe'}
                                            </a>
                                        )}
                                        <button type="button" onClick={() => router.patch(route('admin.messages.read', message.id), {}, { preserveScroll: true })} className="btn px-3 py-1.5 text-xs text-muted hover:text-fg">
                                            {message.read_at ? <><Mail className="h-3.5 w-3.5" /> Marquer non lu</> : <><MailOpen className="h-3.5 w-3.5" /> Marquer lu</>}
                                        </button>
                                        <button type="button" onClick={() => destroy(message)} className="btn ml-auto px-3 py-1.5 text-xs text-red-600 hover:bg-red-500/10">
                                            <Trash2 className="h-3.5 w-3.5" /> Supprimer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
            <Pagination links={messages.links} />
        </AuthenticatedLayout>
    );
}
