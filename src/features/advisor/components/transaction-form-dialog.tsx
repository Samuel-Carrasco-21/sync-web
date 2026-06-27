import { useState } from 'react'
import { XIcon } from 'lucide-react'
import type { Transaction } from '@/shared/types/application'

export type TransactionFormValues = {
  transaction_type: string
  amount: string
  description: string | null
  transaction_date: string | null
  payment_method: string
}

interface TransactionFormDialogProps {
  open: boolean
  mode: 'add' | 'edit'
  initial?: Transaction | null
  submitting?: boolean
  onClose: () => void
  onSubmit: (values: TransactionFormValues) => void
}

const TYPE_OPTIONS = [
  { value: 'income', label: 'Ingreso' },
  { value: 'expense', label: 'Gasto' },
]

const METHOD_OPTIONS = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'qr', label: 'QR' },
  { value: 'transfer', label: 'Transferencia' },
]

export function TransactionFormDialog({
  open,
  mode,
  initial,
  submitting,
  onClose,
  onSubmit,
}: TransactionFormDialogProps) {
  // The parent passes a `key` that changes whenever the dialog opens or its target
  // changes, so these initializers re-run with fresh values (no effect needed).
  const [type, setType] = useState(initial?.transactionType ?? 'income')
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [date, setDate] = useState(initial?.transactionDate ?? '')
  const [method, setMethod] = useState(initial?.paymentMethod ?? 'cash')
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleSubmit = () => {
    const numeric = Number(amount)
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setError('Ingresá un monto válido mayor a 0.')
      return
    }
    onSubmit({
      transaction_type: type,
      amount: numeric.toFixed(2),
      description: description.trim() ? description.trim() : null,
      transaction_date: date ? date : null,
      payment_method: method,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            {mode === 'add' ? 'Agregar transacción' : 'Editar transacción'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Monto (Bs)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ej: 1200.00"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Descripción</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Pago QR cliente"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Método de pago</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {METHOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-40"
          >
            {submitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
