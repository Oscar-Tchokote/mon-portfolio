import { Link, router } from '@inertiajs/react';
import { Check, EyeOff, Trash2 } from 'lucide-react';
import Pagination from '@/Components/Site/Pagination';
import { confirmAction } from '@/Components/Admin/ConfirmDialog';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatDate } from '@/lib/format';

export default function Comments({ comments }) {
    const toggle = (comment) => router.patch(route('admin.comments.toggle', comment.id), {}, { preserveScroll: true });
    const destroy = (comment) => {
        confirmAction({
            title: 'Supprimer ce commentaire ?',
            message: `Le commentaire de ${comment.name} sera définitivement supprimé.`,
            confirmLabel: 'Supprimer',
        }).then((confirmed) => confirmed && router.delete(route('admin.comments.destroy', comment.id), { preserveScroll: true }));
    };

    return (
        <AuthenticatedLayout title="Commentaires">
            <div className="card divide-y divide-line overflow-hidden">
                {comments.data.length === 0 && <p className="p-12 text-center text-muted">Aucun commentaire.</p>}
                {comments.data.map((comment) => (
                    <div key={comment.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start">
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="font-semibold">{comment.name}</span>
                                {comment.email && <span className="text-muted">{comment.email}</span>}
                                <span className="font-mono text-xs text-muted">{formatDate(comment.created_at, 'fr', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                {comment.is_approved
                                    ? <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">Publié</span>
                                    : <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">En attente</span>}
                            </div>
                            {comment.blog && (
                                <Link href={route('blog.show', comment.blog.slug)} className="mt-1 block text-xs text-muted hover:text-accent">sur « {comment.blog.title} »</Link>
                            )}
                            <p className="mt-2 whitespace-pre-line text-sm">{comment.content}</p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                            <button type="button" onClick={() => toggle(comment)} className="btn-ghost px-3 py-1.5 text-xs">
                                {comment.is_approved ? <><EyeOff className="h-3.5 w-3.5" /> Masquer</> : <><Check className="h-3.5 w-3.5" /> Approuver</>}
                            </button>
                            <button type="button" onClick={() => destroy(comment)} className="btn px-3 py-1.5 text-xs text-red-600 hover:bg-red-500/10" aria-label="Supprimer">
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination links={comments.links} />
        </AuthenticatedLayout>
    );
}
