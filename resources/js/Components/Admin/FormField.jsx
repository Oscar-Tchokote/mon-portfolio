import { ImagePlus, Trash2, Upload, X } from 'lucide-react';
import { useState } from 'react';
import Markdown from '@/Components/Site/Markdown';

export function FieldWrapper({ field, error, children }) {
    return (
        <div>
            {field.type !== 'checkbox' && <label className="label" htmlFor={`f-${field.name}`}>{field.label}{field.required && <span className="text-accent"> *</span>}</label>}
            {children}
            {field.help && <p className="mt-1.5 text-xs text-muted">{field.help}</p>}
            {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}

function MarkdownInput({ field, value, onChange }) {
    const [preview, setPreview] = useState(false);

    return (
        <div className="overflow-hidden rounded-xl border border-line">
            <div className="flex border-b border-line bg-line/30 text-xs font-medium">
                {['Écrire', 'Aperçu'].map((label, index) => (
                    <button
                        key={label}
                        type="button"
                        onClick={() => setPreview(index === 1)}
                        className={`px-4 py-2 ${preview === (index === 1) ? 'bg-surface text-fg' : 'text-muted hover:text-fg'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>
            {preview ? (
                <div className="min-h-[12rem] bg-surface p-4">
                    {value ? <Markdown>{value}</Markdown> : <p className="text-sm text-muted">Rien à afficher.</p>}
                </div>
            ) : (
                <textarea
                    id={`f-${field.name}`}
                    rows={field.rows ?? 8}
                    value={value ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="block w-full border-0 bg-surface font-mono text-sm text-fg focus:ring-0"
                />
            )}
        </div>
    );
}

function ImageInput({ field, value, currentUrl, removed, onChange, onRemove }) {
    const previewUrl = value ? URL.createObjectURL(value) : removed ? null : currentUrl;

    return (
        <div className="flex items-center gap-4">
            <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-line/30">
                {previewUrl ? <img src={previewUrl} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-6 w-6 text-muted" />}
            </div>
            <div className="flex flex-wrap gap-2">
                <label className="btn-ghost cursor-pointer px-3 py-2 text-xs">
                    <Upload className="h-3.5 w-3.5" /> {previewUrl ? 'Remplacer' : 'Choisir'}
                    <input
                        id={`f-${field.name}`}
                        type="file"
                        accept={field.accept ?? 'image/*'}
                        className="sr-only"
                        onChange={(e) => onChange(e.target.files[0] ?? null)}
                    />
                </label>
                {previewUrl && (
                    <button type="button" onClick={onRemove} className="btn px-3 py-2 text-xs text-red-600 hover:bg-red-500/10">
                        <Trash2 className="h-3.5 w-3.5" /> Retirer
                    </button>
                )}
            </div>
        </div>
    );
}

function GalleryInput({ existing = [], newFiles, removedIds, onAdd, onRemoveNew, onToggleExisting }) {
    return (
        <div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {existing.map((image) => {
                    const removed = removedIds.includes(image.id);
                    return (
                        <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg border border-line">
                            <img src={image.url} alt="" className={`h-full w-full object-cover ${removed ? 'opacity-25 grayscale' : ''}`} />
                            <button
                                type="button"
                                onClick={() => onToggleExisting(image.id)}
                                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
                                title={removed ? 'Annuler' : 'Supprimer'}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    );
                })}
                {newFiles.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-accent">
                        <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => onRemoveNew(index)} className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white">
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line text-xs text-muted hover:border-fg/40 hover:text-fg">
                    <ImagePlus className="h-5 w-5" /> Ajouter
                    <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onAdd(Array.from(e.target.files))} />
                </label>
            </div>
        </div>
    );
}

export default function FormField({ field, data, setData, errors, item }) {
    const value = data[field.name];
    const error = errors[field.name] || errors[`${field.name}.0`];
    const set = (next) => setData(field.name, next);

    let input;
    switch (field.type) {
        case 'textarea':
            input = <textarea id={`f-${field.name}`} rows={field.rows ?? 3} className="field" value={value ?? ''} onChange={(e) => set(e.target.value)} />;
            break;
        case 'markdown':
            input = <MarkdownInput field={field} value={value} onChange={set} />;
            break;
        case 'select':
            input = (
                <select id={`f-${field.name}`} className="field" value={value ?? ''} onChange={(e) => set(e.target.value)}>
                    {!field.required && <option value="">—</option>}
                    {Object.entries(field.options).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                </select>
            );
            break;
        case 'checkbox':
            input = (
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3">
                    <input id={`f-${field.name}`} type="checkbox" checked={Boolean(value)} onChange={(e) => set(e.target.checked)} className="h-4 w-4 rounded border-line text-accent focus:ring-accent" />
                    <span className="text-sm font-medium">{field.label}</span>
                </label>
            );
            break;
        case 'number':
        case 'price':
            input = (
                <div className="relative">
                    <input id={`f-${field.name}`} type="number" min="0" step="1" inputMode="numeric" className="field" value={value ?? ''} onChange={(e) => set(e.target.value)} />
                    {field.type === 'price' && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">FCFA</span>}
                </div>
            );
            break;
        case 'lines':
            input = <textarea id={`f-${field.name}`} rows={4} className="field" value={value ?? ''} onChange={(e) => set(e.target.value)} />;
            break;
        case 'datetime':
            input = <input id={`f-${field.name}`} type="datetime-local" className="field" value={value ?? ''} onChange={(e) => set(e.target.value)} />;
            break;
        case 'image':
        case 'file':
            input = (
                <ImageInput
                    field={field}
                    value={value}
                    removed={Boolean(data[`remove_${field.name}`])}
                    currentUrl={item?.[`${field.name.replace(/_image$/, '')}_url`] ?? item?.[`${field.name}_url`]}
                    onChange={(file) => setData((current) => ({ ...current, [field.name]: file, [`remove_${field.name}`]: false }))}
                    onRemove={() => setData((current) => ({ ...current, [field.name]: null, [`remove_${field.name}`]: true }))}
                />
            );
            break;
        case 'gallery':
            input = (
                <GalleryInput
                    existing={item?.images}
                    newFiles={value ?? []}
                    removedIds={data.remove_images ?? []}
                    onAdd={(files) => set([...(value ?? []), ...files])}
                    onRemoveNew={(index) => set(value.filter((_, i) => i !== index))}
                    onToggleExisting={(id) => setData('remove_images', (data.remove_images ?? []).includes(id)
                        ? data.remove_images.filter((x) => x !== id)
                        : [...(data.remove_images ?? []), id])}
                />
            );
            break;
        default:
            input = <input id={`f-${field.name}`} type={field.type === 'url' ? 'url' : 'text'} className="field" value={value ?? ''} onChange={(e) => set(e.target.value)} />;
    }

    return <FieldWrapper field={field} error={error}>{input}</FieldWrapper>;
}
