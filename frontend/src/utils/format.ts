export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}