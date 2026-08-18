import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, Wallet, FileUp, ChevronRight, type LucideIcon } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import Modal from '../components/Modal';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import ExpenseDetail from '../components/ExpenseDetail';
import { buttonClasses } from '../components/Button';
import { CATEGORY_LABELS } from '../utils/labels';
import { formatDate, formatAmount } from '../utils/format';
import type { ExpenseNote } from '../types';

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-primary">{value}</p>
        </div>
        <div className="rounded-lg bg-secondary/10 p-2 text-secondary">
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
}

// Deux dates sont-elles dans le même mois calendaire ?
function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export default function MyExpenses() {
  const { data: notes, loading, error } = useFetch<ExpenseNote[]>('/expenses/me');
  const [selected, setSelected] = useState<ExpenseNote | null>(null);

  // Valeurs dérivées calculées pendant le rendu (aucun state, aucun effet).
  const list = notes ?? [];
  const pendingTotal = list
    .filter((n) => n.status === 'created')
    .reduce((sum, n) => sum + n.amount, 0);
  const now = new Date();
  const reimbursedThisMonth = list
    .filter((n) => n.status === 'processed' && isSameMonth(new Date(n.createdAt), now))
    .reduce((sum, n) => sum + n.amount, 0);

  return (
    <div>
      <PageHeader
        title="Mes notes de frais"
        subtitle="Gérez et suivez vos déclarations de dépenses professionnelles."
        action={
          <Link to="/nouvelle-note" className={buttonClasses('primary')}>
            <Plus size={18} />
            Soumettre une dépense
          </Link>
        }
      />

      {loading && <p className="text-muted">Chargement…</p>}
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p>}

      {!loading && !error && notes && (
        <>
          {/* Cartes récapitulatives */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="En attente de validation"
              value={formatAmount(pendingTotal)}
              icon={Clock}
            />
            <StatCard
              label="Remboursé ce mois"
              value={formatAmount(reimbursedThisMonth)}
              icon={Wallet}
            />
            <Link
              to="/nouvelle-note"
              className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 text-center text-muted transition hover:border-secondary hover:text-secondary"
            >
              <FileUp size={26} />
              <span className="text-sm font-medium">Créer une note de frais</span>
              <span className="text-xs text-slate-400">Ajoutez un reçu pour démarrer</span>
            </Link>
          </div>

          {/* Historique */}
          <h2 className="mb-3 font-display text-lg font-semibold text-primary">Historique récent</h2>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-muted">Vous n'avez pas encore de note de frais.</p>
              <Link
                to="/nouvelle-note"
                className="mt-2 inline-block font-medium text-secondary hover:underline"
              >
                Créer ma première note
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-muted">
                    <tr>
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
        </>
      )}

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && <ExpenseDetail note={selected} />}
      </Modal>
    </div>
  );
}