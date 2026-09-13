import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AxiosError } from 'axios';
import { UserPlus, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import Field from '../components/Field';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { inputClasses } from '../utils/styles';
import { ROLE_LABELS } from '../utils/labels';
import type { UserRole } from '../types';

export default function CreateAccount() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [error, setError] = useState<string | null>(null);
  // On stocke l'email + le mot de passe temporaire renvoyés après création.
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function resetForm() {
    setEmail('');
    setFirstName('');
    setLastName('');
    setRole('employee');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCreated(null);

    if (!email.trim() || !firstName.trim() || !lastName.trim()) {
      setError('Tous les champs sont requis.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/users', {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role,
      });
      // Le backend renvoie le mot de passe temporaire EN CLAIR, une seule fois.
      setCreated({ email: email.trim(), password: res.data.temporaryPassword });
      resetForm();
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message ?? 'La création du compte a échoué.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Gestion des utilisateurs"
        subtitle="Ajoutez de nouveaux membres à l'organisation et attribuez-leur un rôle."
      />

      <div className="mx-auto max-w-2xl">
        <Card>
          <h2 className="flex items-center gap-2 font-display text-base font-semibold text-primary">
            <UserPlus size={18} className="text-secondary" />
            Créer un compte
          </h2>
          <p className="mt-1 text-sm text-muted">
            Un mot de passe temporaire sera généré : communiquez-le au nouvel utilisateur, qui
            devra le changer lors de sa première connexion.
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          {created && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={18} className="shrink-0" />
                Compte créé pour {created.email}
              </div>
              <p className="mt-2">
                Communiquez ces identifiants au nouvel utilisateur. Ce mot de passe temporaire
                <strong> ne sera plus affiché après avoir quitté cette page.</strong>
              </p>
              <div className="mt-2 rounded-md bg-white px-3 py-2 font-mono text-sm text-slate-800">
                {created.password}
              </div>
              <p className="mt-2 text-xs text-green-700">
                Il devra le changer lors de sa première connexion.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Prénom" htmlFor="firstName">
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClasses}
                />
              </Field>
              <Field label="Nom" htmlFor="lastName">
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClasses}
                />
              </Field>
            </div>

            <Field label="Adresse email" htmlFor="email">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collaborateur@entreprise.com"
                className={inputClasses}
              />
            </Field>

            <Field label="Rôle assigné" htmlFor="role">
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className={inputClasses}
              >
                {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </Field>

            <Button type="submit" variant="primary" icon={UserPlus} disabled={submitting}>
              {submitting ? 'Création…' : 'Créer le compte'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}