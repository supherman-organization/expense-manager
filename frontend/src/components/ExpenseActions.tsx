import { useState } from 'react';
import type { AxiosError } from 'axios';
import api from '../services/api';
import type { ExpenseNote, UserRole } from '../types';

interface Props {
  note: ExpenseNote;
  role: UserRole;
  onDone: () => void;
}

type Action = 'validate' | 'refuse' | 'process';

export default function ExpenseActions({ note, role, onDone }: Props) {
  const [decisionComment, setDecisionComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Dérivé du rôle et du statut 
  const canDecide = role === 'manager' && note.status === 'created';
  const canProcess = role === 'accounting' && note.status === 'validated';

  // Aucune action disponible pour ce rôle sur cette note, on n'affiche rien.
  if (!canDecide && !canProcess) return null;

  // Action utilisateur, gestionnaire d'événement.
  async function runAction(action: Action) {
    setError(null);
    setSubmitting(true);
    try {
      const body = action === 'process' ? {} : { decisionComment: decisionComment.trim() };
      await api.patch(`/expenses/${note._id}/${action}`, body);
      onDone(); 
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message ?? "L'action a échoué. Réessayez.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-5 border-t border-slate-200 pt-5">
      {error && (
        <div className="mb-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
      )}

      {canDecide && (
        <div className="space-y-3">
          <div>
            <label htmlFor="decisionComment" className="block text-sm font-medium text-slate-700">
              Commentaire (optionnel)
            </label>
            <textarea
              id="decisionComment"
              rows={2}
              value={decisionComment}
              onChange={(e) => setDecisionComment(e.target.value)}
              placeholder="Motif de validation ou de refus…"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => runAction('validate')}
              disabled={submitting}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'En cours…' : 'Valider'}
            </button>
            <button
              onClick={() => runAction('refuse')}
              disabled={submitting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'En cours…' : 'Refuser'}
            </button>
          </div>
        </div>
      )}

      {canProcess && (
        <button
          onClick={() => runAction('process')}
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'En cours…' : 'Marquer comme traitée'}
        </button>
      )}
    </div>
  );
}