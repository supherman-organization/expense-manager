import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';
import Modal from '../components/Modal';
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

  function handleActionDone() {
    setSelected(null);
    reload();
  }

  const subtitle =
    user?.role === 'accounting'
      ? 'Notes validées et traitées'
      : 'Notes de tous les employés';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Toutes les notes de frais</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      {loading && <p className="text-slate-500">Chargement…</p>}
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p>}

      {!loading && !error && notes && notes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Aucune note à afficher pour le moment.
        </div>
      )}

      {!loading && !error && notes && notes.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Employé</th>
                <th className="px-4 py-3 font-medium">Montant</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Catégorie</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notes.map((note) => (
                <tr
                  key={note._id}
                  onClick={() => setSelected(note)}
                  className="cursor-pointer transition hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">{note.title}</td>
                  <td className="px-4 py-3 text-slate-600">{ownerEmail(note.owner)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatAmount(note.amount)}</td>
                  <td className="hidden px-4 py-3 text-slate-700 sm:table-cell">
                    {CATEGORY_LABELS[note.category] ?? note.category}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={note.status} />
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                    {formatDate(note.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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