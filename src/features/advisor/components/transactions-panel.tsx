import { PlusIcon, PencilIcon, BanIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/shared/lib/formatters'
import type { Transaction } from '@/shared/types/application'

interface TransactionsPanelProps {
  transactions: Transaction[]
  onAdd: () => void
  onEdit: (transaction: Transaction) => void
  onReject: (transaction: Transaction) => void
  busyId?: string | null
}

function sourceBadgeClass(sourceType: string): string {
  return sourceType === 'ai'
    ? 'bg-violet-100 text-violet-700'
    : 'bg-slate-100 text-slate-700'
}

export function TransactionsPanel({
  transactions,
  onAdd,
  onEdit,
  onReject,
  busyId,
}: TransactionsPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Transacciones ({transactions.length})
        </h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Agregar
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          No hay transacciones. Agregá una manualmente o subí evidencias para extraerlas.
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => {
            const isRejected = tx.status === 'rejected'
            const isIncome = tx.transactionType === 'income'
            return (
              <div
                key={tx.id}
                className={cn(
                  'rounded-xl border bg-card p-3 shadow-sm',
                  isRejected && 'opacity-60',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          isRejected
                            ? 'text-muted-foreground line-through'
                            : isIncome
                              ? 'text-green-700'
                              : 'text-red-600',
                        )}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {tx.transactionTypeLabel}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          sourceBadgeClass(tx.sourceType),
                        )}
                      >
                        {tx.sourceTypeLabel}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                        {tx.statusLabel}
                      </span>
                    </div>
                    {tx.description && (
                      <p className="mt-1 truncate text-sm text-foreground">{tx.description}</p>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {tx.paymentMethodLabel}
                      {tx.transactionDate ? ` · ${tx.transactionDate}` : ''}
                      {tx.confidence != null
                        ? ` · ${Math.round(tx.confidence * 100)}% confianza`
                        : ''}
                    </p>
                  </div>

                  {!isRejected && (
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => onEdit(tx)}
                        disabled={busyId === tx.id}
                        title="Editar"
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onReject(tx)}
                        disabled={busyId === tx.id}
                        title="Rechazar"
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                      >
                        <BanIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
