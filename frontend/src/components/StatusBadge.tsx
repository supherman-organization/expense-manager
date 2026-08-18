import type { ExpenseStatus } from '../types';
import { STATUS_LABELS, STATUS_STYLES } from '../utils/labels';

export default function StatusBadge({ status }: { status: ExpenseStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}