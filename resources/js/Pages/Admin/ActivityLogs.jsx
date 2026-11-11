import Pagination from '@/Components/Site/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatDate } from '@/lib/format';

export default function ActivityLogs({ logs }) {
    return (
        <AuthenticatedLayout title="Journal d'activité">
            <div className="card overflow-hidden">
                {logs.data.length === 0 ? (
                    <p className="p-12 text-center text-muted">Aucune activité enregistrée.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-line bg-line/30 text-xs uppercase tracking-wide text-muted">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Date</th>
                                    <th className="px-4 py-3 font-semibold">Action</th>
                                    <th className="px-4 py-3 font-semibold">Élément</th>
                                    <th className="px-4 py-3 font-semibold">Utilisateur</th>
                                    <th className="px-4 py-3 font-semibold">IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {logs.data.map((log) => (
                                    <tr key={log.id}>
                                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">
                                            {formatDate(log.created_at, 'fr', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-4 py-3 font-medium">{log.action}</td>
                                        <td className="px-4 py-3 text-muted">{log.subject ?? '—'}</td>
                                        <td className="px-4 py-3">{log.user?.name ?? '—'}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-muted">{log.ip_address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Pagination links={logs.links} />
        </AuthenticatedLayout>
    );
}
