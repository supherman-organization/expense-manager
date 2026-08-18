import { Mail, Shield, BadgeCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import { ROLE_LABELS } from '../utils/labels';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

  return (
    <div>
      <PageHeader
        title="Mon profil"
        subtitle="Consultez vos informations personnelles et votre rôle."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Colonne gauche : carte identité */}
        <div>
          <Card className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary font-display text-2xl font-bold text-white">
              {initials}
            </div>
            <p className="mt-4 font-display text-lg font-semibold text-primary">
              {user.firstName} {user.lastName}
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
              <BadgeCheck size={14} />
              {ROLE_LABELS[user.role]}
            </span>
          </Card>
        </div>

        {/* Colonne droite : détails du compte */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-primary">
              <Shield size={18} className="text-secondary" />
              Informations du compte
            </h2>

            <dl className="mt-4 divide-y divide-slate-100 text-sm">
              <div className="flex items-center gap-3 py-3">
                <Mail size={18} className="shrink-0 text-muted" />
                <dt className="text-muted">Adresse email</dt>
                <dd className="ml-auto font-medium text-slate-800">{user.email}</dd>
              </div>
              <div className="flex items-center gap-3 py-3">
                <Shield size={18} className="shrink-0 text-muted" />
                <dt className="text-muted">Rôle</dt>
                <dd className="ml-auto font-medium text-slate-800">{ROLE_LABELS[user.role]}</dd>
              </div>
            </dl>

            <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-xs text-muted">
              Pour toute modification de vos informations, contactez votre manager.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}