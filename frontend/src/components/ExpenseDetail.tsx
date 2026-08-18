import type { ExpenseNote } from '../types';
import StatusBadge from './StatusBadge';
import { CATEGORY_LABELS } from '../utils/labels';
import { formatDate, formatAmount } from '../utils/format';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';
const API_ORIGIN = API_BASE.endsWith('/api') ? API_BASE.slice(0, -4) : API_BASE;

export default function ExpenseDetail({ note }: {note: ExpenseNote}) {
    return (
        <div className="space-y-4 text-sm">
            <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={note.status} />
                <span className="font-semibold text-slate-800">{formatAmount(note.amount)}</span>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                    <dt className="text-slate-500">Categorie</dt>
                    <dd className='text-slate-800'>{CATEGORY_LABELS[note.category] ?? note.category}</dd>
                </div>
                <div>
                    <dt className="text-slate-500">Date de la dépense</dt>
                    <dd className="text-slate-800">{formatDate(note.expenseDate)}</dd>
                </div>
                <div>
                    <dt className="text-slate-500">Date de soumission</dt>
                    <dd className="text-slate-800">{formatDate(note.createdAt)}</dd> 
                </div>
            </dl>

            {note.comment &&(
                <div>
                    <p className="text-slate-500">Commentaire</p>
                    <p className="whitespace-pre-wrap text-slate-800">{note.comment}</p>
                </div>
            )}

            {note.decisionComment && (
                <div>
                    <p className="text-slate-500">Commentaire du manager</p>
                    <p className="whitespace-pre-wrap text-slate-800">{note.decisionComment}</p>
                </div>
            )}

            <div>
                <p className="mb-1 text-slate-500">Pièces justificatives</p>
                {note.attachments.length === 0 ? ( <p className="text-slate-400">Aucune pièce jointe.</p>
                ): (
                    <ul className="space-y-1">{note.attachments.map((file) => (
                        <li key={file}>
                            <a  href={API_ORIGIN + '/uploads/' + file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-700 underline hover:text-slate-900"
                            >
                                {file}
                            </a>
                        </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}