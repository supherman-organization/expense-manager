import { useState } from 'react';
import type { AxiosError } from 'axios';
import { Check, X, CircleDollarSign } from 'lucide-react';
import api from '../services/api';
import Button from './Button';
import Field from './Field';
import { inputClasses } from '../utils/styles';
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

  const canDecide = role === 'manager' && note.status === 'created';
  const canProcess = role === 'accounting' && note.status === 'validated';

  if (!canDecide && !canProcess) return null;

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
          <Field label="Commentaire (optionnel)" htmlFor="decisionComment">
            <textarea
              id="decisionComment"
              rows={2}
              value={decisionComment}
              onChange={(e) => setDecisionComment(e.target.value)}
              placeholder="Motif de validation ou de refus…"
              className={inputClasses}
            />
          </Field>
          <div className="flex gap-3">
            <Button
              variant="success"
              icon={Check}
              disabled={submitting}
              onClick={() => runAction('validate')}
            >
              {submitting ? 'En cours…' : 'Valider'}
            </Button>
            <Button
              variant="danger"
              icon={X}
              disabled={submitting}
              onClick={() => runAction('refuse')}
            >
              {submitting ? 'En cours…' : 'Refuser'}
            </Button>
          </div>
        </div>
      )}

      {canProcess && (
        <Button
          variant="secondary"
          icon={CircleDollarSign}
          disabled={submitting}
          onClick={() => runAction('process')}
        >
          {submitting ? 'En cours…' : 'Marquer comme traitée'}
        </Button>
      )}
    </div>
  );
}