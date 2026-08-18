import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import ExpenseDetail from '../components/ExpenseDetail';
import ExpenseActions from '../components/ExpenseActions';
import { CATEGORY_LABELS } from '../utils/labels';
import { formatDate, formatAmount } from '../utils/format';
import type { ExpenseNote, User } from '../types';

function ownerEmail(owner: string | User): string {
  return typeof owner === 'object' ? owner.email : '—';
}

export default function AllExpenses() {
  const { user } = useAuth();
  const { data: notes, loading, error, reload } = useFetch<ExpenseNote[]>('/expenses');
  const [selected, setSelected] = useState<ExpenseNote | null>(null);

  // Succès d'une action : on referme la modale et on recharge la liste.
  function handleActionDone() {
    setSelected(null);
    reload();
  }

  const subtitle =
    user?.role === 'accounting'
      ? 'Notes validées et traitées, prêtes pour le remboursement.'
      : 'Consultez, validez ou refusez les notes de tous les employés.';

  const list = notes ?? [];

  return (
    <div>
      <PageHeader title="Administration des notes" subtitle={subtitle} />

      {loading && <p className="text-muted">Chargement…</p>}
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p>}

      {!loading && !error && notes && list.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-muted">
          Aucune note à afficher pour le moment.
        </div>
      )}

      {!loading && !error && list.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Employé</th>
                  <th className="px-4 py-3 font-medium">Titre</th>
                  <th className="px-4 py-3 font-medium">Montant</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Catégorie</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">Date</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((note) => (
                  <tr
                    key={note._id}
                    onClick={() => setSelected(note)}
                    className="cursor-pointer transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-slate-600">{ownerEmail(note.owner)}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{note.title}</td>
                    <td className="px-4 py-3 text-slate-700">{formatAmount(note.amount)}</td>
                    <td className="hidden px-4 py-3 text-slate-700 sm:table-cell">
                      {CATEGORY_LABELS[note.category] ?? note.category}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={note.status} />
                    </td>
                    <td className="hidden px-4 py-3 text-muted md:table-cell">
                      {formatDate(note.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 font-medium text-secondary">
                        Détails
                        <ChevronRight size={14} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && (
          <>
            <ExpenseDetail note={selected} />
            {user && (
              <ExpenseActions note={selected} role={user.role} onDone={handleActionDone} />
            )}
          </>
        )}
      </Modal>
    </div>
  );
}