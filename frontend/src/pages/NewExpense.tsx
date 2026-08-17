import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import api from '../services/api';
import { CATEGORY_LABELS } from '../utils/labels';

const CATEGORIES = ['meal', 'transport', 'accommodation', 'supplies', 'other'];

// Date du jour au format YYYY-MM-DD pour l'attribut max de l'input date
const TODAY = new Date().toISOString().split('T')[0];

export default function NewExpense() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('other');
  const [expenseDate, setExpenseDate] = useState(TODAY);
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ⚡ Action utilisateur → gestionnaire d'événement, PAS un Effect.
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Validation côté client (retour immédiat ; le backend revalide via Zod).
    if (title.trim().length === 0) {
      setError('Le titre est requis.');
      return;
    }
    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
      setError('Le montant doit être un nombre positif.');
      return;
    }

    // Construction du corps multipart : on N'ENVOIE PAS de JSON.
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('amount', String(parsedAmount));
    formData.append('category', category);
    formData.append('expenseDate', expenseDate);
    if (comment.trim()) {
      formData.append('comment', comment.trim());
    }
   
    files.forEach((file) => formData.append('attachments', file));

    setSubmitting(true);
    try {
      await api.post('/expenses', formData);
      navigate('/', { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message ?? "Impossible de créer la note.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500';

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Nouvelle note de frais</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">
            Titre
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. Déjeuner client"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700">
              Montant (€)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">
              Catégorie
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {CATEGORY_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="expenseDate" className="block text-sm font-medium text-slate-700">
            Date de la dépense
          </label>
          <input
            id="expenseDate"
            type="date"
            required
            max={TODAY}
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-slate-700">
            Commentaire <span className="text-slate-400">(optionnel)</span>
          </label>
          <textarea
            id="comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Contexte, détails…"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="attachments" className="block text-sm font-medium text-slate-700">
            Pièces justificatives <span className="text-slate-400">(JPEG, PNG, PDF — max 5 Mo)</span>
          </label>
          <input
            id="attachments"
            type="file"
            multiple
            accept="image/jpeg,image/png,application/pdf"
            onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
            className="mt-1 w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
          />
          {files.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {files.map((file) => (
                <li key={file.name}>
                  {file.name}{' '}
                  <span className="text-slate-400">
                    ({(file.size / 1024).toFixed(0)} Ko)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Enregistrement…' : 'Créer la note'}
          </button>
        </div>
      </form>
    </div>
  );
}