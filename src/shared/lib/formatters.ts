export function formatCurrency(amount: number): string {
  return `Bs ${amount.toLocaleString('es-BO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
