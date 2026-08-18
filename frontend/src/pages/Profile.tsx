import { useAuth } from '../context/AuthContext';
import { type UserRole } from '../types';

const ROLE_LABELS: Record<UserRole, string> = {
    employee: 'Employé',
    manager: 'Manger',
    accounting: 'Comptabilité', 
};

export default function Profile() {
    const { user } = useAuth();
    if (!user) return null; 

    const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

    return (
        <div className="mx-auto max-w-xl">
            <h1 className="mb-6 text-2xl font-bold text-slate-800">Mon profil</h1>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-xl font-bold text-white">
                        {initials}
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-slate-800">
                            {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-slate-500">{ROLE_LABELS[user.role]}</p>
                    </div>
                </div>
                <dl className="divide-y divide-slate-100 text-sm">
                    <div className="flex justify-between py-3">
                        <dt className="text-slate-500">Email</dt>
                        <dd className="font-medium text-slate-800">{user.email}</dd>
                    </div>
                    <div className="flex justify-between py-3">
                        <dt className="text-slate-500">Rôle</dt>
                        <dd className="font-medium text-slate-800">{ROLE_LABELS[user.role]}</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
} 