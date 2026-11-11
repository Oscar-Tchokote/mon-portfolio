import { useForm } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import FormField from '@/Components/Admin/FormField';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Settings({ groups, values, files }) {
    const initial = {};
    Object.values(groups).forEach((group) => group.fields.forEach((field) => {
        if (['image', 'file'].includes(field.type)) {
            initial[field.name] = null;
            initial[`remove_${field.name}`] = false;
        } else if (field.type === 'checkbox') {
            initial[field.name] = Boolean(values[field.name]);
        } else {
            initial[field.name] = values[field.name] ?? '';
        }
    }));

    const { data, setData, post, processing, errors } = useForm(initial);
    const fileItem = { photo_url: files.photo, cv_pdf_url: null };

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.settings.update'), { forceFormData: true, preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            title="Profil & site"
            actions={<button type="submit" form="settings-form" disabled={processing} className="btn-primary px-4 py-2">{processing ? 'Enregistrement…' : 'Enregistrer'}</button>}
        >
            <form id="settings-form" onSubmit={submit} className="mx-auto max-w-3xl space-y-6">
                {Object.entries(groups).map(([key, group]) => (
                    <section key={key} className="card p-6 sm:p-8">
                        <h2 className="mb-6 text-lg font-bold">{group.label}</h2>
                        <div className="grid gap-5 sm:grid-cols-2">
                            {group.fields.map((field) => (
                                <div key={field.name} className={['textarea', 'markdown', 'image', 'file'].includes(field.type) ? 'sm:col-span-2' : ''}>
                                    {field.type === 'file' ? (
                                        <div>
                                            <label className="label">{field.label}</label>
                                            <div className="flex flex-wrap items-center gap-3">
                                                {files.cv_pdf && !data.remove_cv_pdf && (
                                                    <a href={files.cv_pdf} target="_blank" rel="noopener" className="btn-ghost px-3 py-2 text-xs">
                                                        <FileText className="h-4 w-4" /> Voir le CV actuel
                                                    </a>
                                                )}
                                                <label className="btn-ghost cursor-pointer px-3 py-2 text-xs">
                                                    {data.cv_pdf ? data.cv_pdf.name : files.cv_pdf ? 'Remplacer le PDF' : 'Choisir un PDF'}
                                                    <input type="file" accept="application/pdf" className="sr-only" onChange={(e) => setData((c) => ({ ...c, cv_pdf: e.target.files[0] ?? null, remove_cv_pdf: false }))} />
                                                </label>
                                                {files.cv_pdf && (
                                                    <label className="flex items-center gap-2 text-xs text-muted">
                                                        <input type="checkbox" checked={data.remove_cv_pdf} onChange={(e) => setData('remove_cv_pdf', e.target.checked)} className="rounded border-line text-accent focus:ring-accent" />
                                                        Supprimer le CV
                                                    </label>
                                                )}
                                            </div>
                                            <p className="mt-1.5 text-xs text-muted">PDF, 8 Mo maximum. Le fichier est servi via /cv (non exposé dans le dossier public).</p>
                                            {errors.cv_pdf && <p className="mt-1.5 text-sm text-red-600">{errors.cv_pdf}</p>}
                                        </div>
                                    ) : (
                                        <FormField field={field} data={data} setData={setData} errors={errors} item={fileItem} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
                <div className="flex justify-end">
                    <button type="submit" disabled={processing} className="btn-primary">{processing ? 'Enregistrement…' : 'Enregistrer'}</button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
