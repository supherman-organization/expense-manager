import { useState } from 'react';
import type { ChangeEvent, DragEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { UploadCloud, FileText, X, Send } from 'lucide-react';
import api from '../services/api';
import Field from '../components/Field';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { CATEGORY_LABELS } from '../utils/labels';
import { inputClasses } from '../utils/styles';

// on affiche les libellés via CATEGORY_LABELS.
const CATEGORIES = ['meal', 'transport', 'accommodation', 'supplies', 'other'] as const;

const MAX_FILES = 5;
const MAX_SIZE = 5 * 1024 * 1024; 
const ACCEPTED = ['image/jpeg', 'image/png', 'application/pdf'];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function NewExpense() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('other');
  const [expenseDate, setExpenseDate] = useState(todayIso());
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Ajoute des fichiers en filtrant type/taille et en respectant le plafond.
  // Renvoie un message d'erreur si un fichier est rejeté, sinon null.
  function addFiles(incoming: File[]) {
    const accepted: File[] = [];
    for (const file of incoming) {
      if (!ACCEPTED.includes(file.type)) {
        setError(`« ${file.name} » : format non autorisé (JPEG, PNG ou PDF).`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        setError(`« ${file.name} » : dépasse la limite de 5 Mo.`);
        continue;
      }
      accepted.push(file);
    }
    setFiles((prev) => {
      const merged = [...prev, ...accepted];
      if (merged.length > MAX_FILES) {
        setError(`Maximum ${MAX_FILES} fichiers.`);
        return merged.slice(0, MAX_FILES);
      }
      return merged;
    });
  }

  function handleFilesChange(e: ChangeEvent<HTMLInputElement>) {
    setError(null);
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = ''; // permet de re-sélectionner le même fichier après retrait
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    setError(null);
    if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files));
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Le titre est requis.');
      return;
    }
    const amountNumber = Number(amount);
    if (!amount || Number.isNaN(amountNumber) || amountNumber < 0) {
      setError('Le montant doit être un nombre positif.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('amount', String(amountNumber));
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
      setError(axiosErr.response?.data?.message ?? 'La création a échoué. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Création d'une note de frais"
        subtitle="Remplissez les informations ci-dessous pour soumettre une nouvelle dépense."
      />

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Colonne gauche : informations */}
          <div className="lg:col-span-2">
            <Card className="space-y-5">
              <Field label="Titre de la dépense" htmlFor="title">
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex. : Déjeuner client, Billet de train…"
                  className={inputClasses}
                />
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Montant (€)" htmlFor="amount">
                  <input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={inputClasses}
                  />
                </Field>

                <Field label="Date de la dépense" htmlFor="expenseDate">
                  <input
                    id="expenseDate"
                    type="date"
                    required
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className={inputClasses}
                  />
                </Field>
              </div>

              <Field label="Catégorie" htmlFor="category">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
                  className={inputClasses}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Commentaire justificatif" htmlFor="comment">
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ajoutez des détails sur la nature de cette dépense (optionnel mais recommandé)…"
                  className={inputClasses}
                />
              </Field>
            </Card>
          </div>

          {/* Colonne droite */}
          <div>
            <Card>
              <h2 className="font-display text-base font-semibold text-primary">
                Pièces justificatives
              </h2>
              <p className="mt-1 text-sm text-muted">
                Joignez les reçus ou factures correspondants.
              </p>

              <label
                htmlFor="attachments"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
                  dragging
                    ? 'border-secondary bg-secondary/5'
                    : 'border-slate-300 hover:border-secondary hover:bg-slate-50'
                }`}
              >
                <UploadCloud size={30} className="text-secondary" />
                <p className="mt-2 text-sm font-medium text-slate-700">Glissez vos fichiers ici</p>
                <p className="text-xs text-muted">ou cliquez pour parcourir</p>
                <p className="mt-2 text-xs text-slate-400">
                  Formats : PDF, JPG, PNG · 5 Mo max · {MAX_FILES} fichiers max
                </p>
                <input
                  id="attachments"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFilesChange}
                  className="hidden"
                />
              </label>

              {files.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"
                    >
                      <FileText size={16} className="shrink-0 text-muted" />
                      <span className="min-w-0 flex-1 truncate text-slate-700">{file.name}</span>
                      <span className="shrink-0 text-xs text-slate-400">
                        {Math.round(file.size / 1024)} Ko
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        aria-label={`Retirer ${file.name}`}
                        className="shrink-0 rounded p-0.5 text-slate-400 transition hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>

        {/* Barre d'actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/')}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" icon={Send} disabled={submitting}>
            {submitting ? 'Soumission…' : 'Soumettre la note'}
          </Button>
        </div>
      </form>
    </div>
  );
}