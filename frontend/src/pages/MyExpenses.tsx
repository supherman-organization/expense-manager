import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import ExpenseDetail from '../components/ExpenseDetail';
import { CATEGORY_LABELS } from '../utils/labels';
import { formatDate, formatAmount } from '../utils/format';
import type { ExpenseNote } from '../types';

export default function MyExpenses() {
  const { data: notes, loading, error } = useFetch<ExpenseNote[]>('/expenses/me');
  const [selected, setSelected] = useState<ExpenseNote | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Mes notes de frais</h1>
        <Link
          to="/nouvelle-note"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          + Nouvelle note
        </Link>
      </div>

      {loading && <p className="text-slate-500">Chargement…</p>}
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p>}

      {!loading && !error && notes && notes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-500">Vous n'avez pas encore de note de frais.</p>
          <Link
            to="/nouvelle-note"
            className="mt-2 inline-block font-medium text-slate-800 underline"
          >
            Créer ma première note
          </Link>
        </div>
      )}

      {!loading && !error && notes && notes.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Titre</th>
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
        {selected && <ExpenseDetail note={selected} />}
      </Modal>
    </div>
  );
}