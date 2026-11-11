import { router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { confirmAction } from '@/Components/Admin/ConfirmDialog';
import FormField from '@/Components/Admin/FormField';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatDate, formatFcfa } from '@/lib/format';

function toLocalDatetime(value) {
    if (!value) {
        return '';
    }
    const date = new Date(value);
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function initialData(fields, item) {
    const data = {};
    fields.forEach((field) => {
        const raw = item?.[field.name];
        switch (field.type) {
            case 'checkbox':
                data[field.name] = item ? Boolean(raw) : Boolean(field.default);
                break;
            case 'tags':
                data[field.name] = (raw ?? []).join(', ');
                break;
            case 'lines':
                data[field.name] = (raw ?? []).join('\n');
                break;
            case 'datetime':
                data[field.name] = toLocalDatetime(raw);
                break;
            case 'image':
                data[field.name] = null;
                data[`remove_${field.name}`] = false;
                break;
            case 'gallery':
                data[field.name] = [];
                data.remove_images = [];
                break;
            default:
                data[field.name] = raw ?? field.default ?? '';
        }
    });
    return data;
}

function Cell({ field, value }) {
    if (!field) {
        return <span>{String(value ?? '')}</span>;
    }
    if (field.type === 'checkbox') {
        return value
            ? <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">Oui</span>
            : <span className="rounded-full bg-line/70 px-2 py-0.5 text-xs font-semibold text-muted">Non</span>;
    }
    if (field.type === 'price') {
        return value ? <span className="font-mono text-xs">{formatFcfa(value)}</span> : <span className="text-xs text-muted">Sur devis / non défini</span>;
    }
    if (field.type === 'select') {
        return <span className="chip">{field.options[value] ?? value}</span>;
    }
    if (field.type === 'datetime') {
        return <span className="text-xs text-muted">{value ? formatDate(value, 'fr', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>;
    }
    return <span>{value}</span>;
}

function Drawer({ open, onClose, resourceKey, resource, item }) {
    const fields = resource.fields;
    const editing = Boolean(item);
    const { data, setData, post, processing, errors, transform, clearErrors } = useForm(initialData(fields, item));

    useEffect(() => {
        const onKey = (event) => event.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    transform((current) => {
        const payload = { ...current };
        fields.forEach((field) => {
            if (field.type === 'tags') {
                payload[field.name] = (current[field.name] || '').split(',').map((s) => s.trim()).filter(Boolean);
            }
            if (field.type === 'lines') {
                payload[field.name] = (current[field.name] || '').split('\n').map((s) => s.trim()).filter(Boolean);
            }
            if (['number', 'price'].includes(field.type) && current[field.name] === '') {
                payload[field.name] = null;
            }
        });
        return payload;
    });

    const submit = (event) => {
        event.preventDefault();
        clearErrors();
        const url = editing
            ? route('admin.resource.update', { resource: resourceKey, id: item.id })
            : route('admin.resource.store', resourceKey);
        post(url, { forceFormData: true, preserveScroll: true, onSuccess: onClose });
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div className="fixed inset-0 z-40 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
                    <motion.form
                        onSubmit={submit}
                        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-line bg-bg"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.25 }}
                    >
                        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
                            <h2 className="font-bold">{editing ? `Modifier : ${item[resource.title]}` : `Nouveau ${resource.singular}`}</h2>
                            <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-line/60" aria-label="Fermer"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="flex-1 space-y-5 overflow-y-auto p-6">
                            {fields.map((field) => (
                                <FormField key={field.name} field={field} data={data} setData={setData} errors={errors} item={item} />
                            ))}
                        </div>
                        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-line px-6 py-4">
                            {Object.keys(errors).length > 0 && <p className="mr-auto text-sm text-red-600">Vérifiez les champs en erreur.</p>}
                            <button type="button" onClick={onClose} className="btn-ghost">Annuler</button>
                            <button type="submit" disabled={processing} className="btn-primary">{processing ? 'Enregistrement…' : 'Enregistrer'}</button>
                        </div>
                    </motion.form>
                </>
            )}
        </AnimatePresence>
    );
}

export default function ResourceIndex({ resourceKey, resource, items }) {
    const [drawer, setDrawer] = useState({ open: false, item: null, key: 0 });
    const [query, setQuery] = useState('');
    const fieldsByName = useMemo(() => Object.fromEntries(resource.fields.map((field) => [field.name, field])), [resource]);

    useEffect(() => setDrawer({ open: false, item: null, key: 0 }), [resourceKey]);

    const filtered = query
        ? items.filter((item) => String(item[resource.title] ?? '').toLowerCase().includes(query.toLowerCase()))
        : items;

    const open = (item = null) => setDrawer((current) => ({ open: true, item, key: current.key + 1 }));
    const close = () => setDrawer((current) => ({ ...current, open: false }));

    const destroy = (item) => {
        confirmAction({
            title: `Supprimer « ${item[resource.title]} » ?`,
            message: 'Cette action est définitive.',
            confirmLabel: 'Supprimer',
        }).then((confirmed) => confirmed && router.delete(route('admin.resource.destroy', { resource: resourceKey, id: item.id }), { preserveScroll: true }));
    };

    return (
        <AuthenticatedLayout
            title={resource.label}
            actions={(
                <button type="button" onClick={() => open()} className="btn-primary px-4 py-2">
                    <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Ajouter</span>
                </button>
            )}
        >
            <div className="mb-5 flex items-center justify-between gap-4">
                <div className="relative w-full max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filtrer…" className="field py-2 pl-9" />
                </div>
                <p className="shrink-0 text-sm text-muted">{filtered.length} élément(s)</p>
            </div>

            <div className="card overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-muted">Aucun élément.</p>
                        <button type="button" onClick={() => open()} className="btn-ghost mt-4"><Plus className="h-4 w-4" /> Ajouter un {resource.singular}</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-line bg-line/30 text-xs uppercase tracking-wide text-muted">
                                <tr>
                                    {resource.columns.map((column) => (
                                        <th key={column} className="whitespace-nowrap px-4 py-3 font-semibold">{fieldsByName[column]?.label ?? (column === 'views' ? 'Vues' : column)}</th>
                                    ))}
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-line/20">
                                        {resource.columns.map((column, index) => (
                                            <td key={column} className={`px-4 py-3 ${index === 0 ? 'font-semibold' : ''}`}>
                                                {index === 0 ? (
                                                    <button type="button" onClick={() => open(item)} className="text-left hover:text-accent">
                                                        <Cell field={fieldsByName[column]} value={item[column]} />
                                                    </button>
                                                ) : (
                                                    <Cell field={fieldsByName[column]} value={item[column]} />
                                                )}
                                            </td>
                                        ))}
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <button type="button" onClick={() => open(item)} className="rounded-lg p-2 text-muted hover:bg-line/60 hover:text-fg" aria-label="Modifier"><Pencil className="h-4 w-4" /></button>
                                            <button type="button" onClick={() => destroy(item)} className="rounded-lg p-2 text-muted hover:bg-red-500/10 hover:text-red-600" aria-label="Supprimer"><Trash2 className="h-4 w-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Drawer key={drawer.key} open={drawer.open} onClose={close} resourceKey={resourceKey} resource={resource} item={drawer.item} />
        </AuthenticatedLayout>
    );
}
