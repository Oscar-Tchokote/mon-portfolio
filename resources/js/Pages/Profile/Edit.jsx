import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout title="Mon compte">
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="card p-6 sm:p-8">
                    <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} className="max-w-xl" />
                </div>
                <div className="card p-6 sm:p-8">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
