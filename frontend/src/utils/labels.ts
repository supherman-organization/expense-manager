import type { ExpenseStatus } from '../types';

export const STATUS_LABELS: Record<ExpenseStatus, string> = {
  created: 'Créée',
  validated: 'Validée',
  refused: 'Refusée',
  processed: 'Traitée',
};

export const STATUS_STYLES: Record<ExpenseStatus, string> = {
  created: 'bg-slate-100 text-slate-700',
  validated: 'bg-green-100 text-green-700',
  refused: 'bg-red-100 text-red-700',
  processed: 'bg-blue-100 text-blue-700',
};

export const CATEGORY_LABELS: Record<string, string> = {
  meal: 'Repas',
  transport: 'Transport',
  accommodation: 'Hébergement',
  supplies: 'Fournitures',
  other: 'Autre',
};