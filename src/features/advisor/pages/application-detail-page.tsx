import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  PhoneIcon,
  BriefcaseIcon,
  UploadCloudIcon,
  BadgeIcon,
} from 'lucide-react'
import { FinancialSummary } from '../components/financial-summary'
import { EvidenceReviewPanel } from '../components/evidence-review-panel'
import { RiskAlerts } from '../components/risk-alerts'
import { AdvisorNotes } from '../components/advisor-notes'
import { TransactionsPanel } from '../components/transactions-panel'
import {
  TransactionFormDialog,
  type TransactionFormValues,
} from '../components/transaction-form-dialog'
import { StatusBadge } from '@/shared/components/status-badge'
import { formatCurrency, formatDateTime } from '@/shared/lib/formatters'
import { MANAGEMENT_STATUSES } from '@/shared/types/common'
import type { Transaction } from '@/shared/types/application'
import {
  addEvidence,
  createManualTransaction,
  getApplicationById,
  rejectTransaction,
  updateAdvisorNotes,
  updateApplicationStatus,
  updateTransaction,
} from '../services/advisor.service'

type DialogState = { open: boolean; mode: 'add' | 'edit'; editing: Transaction | null }

export function ApplicationDetailPage() {
  const { applicationId } = useParams({ from: '/advisor/$applicationId' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [dialog, setDialog] = useState<DialogState>({ open: false, mode: 'add', editing: null })

  const {
    data: application,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => getApplicationById(applicationId),
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['application', applicationId] })
    queryClient.invalidateQueries({ queryKey: ['applications'] })
  }

  const statusMutation = useMutation({
    mutationFn: (rawStatus: string) => updateApplicationStatus(applicationId, rawStatus),
    onSuccess: () => {
      invalidate()
      setSelectedStatus(null)
    },
  })

  const notesMutation = useMutation({
    mutationFn: (notes: string) => updateAdvisorNotes(applicationId, notes),
    onSuccess: invalidate,
  })

  const addTxMutation = useMutation({
    mutationFn: (values: TransactionFormValues) =>
      createManualTransaction(applicationId, values),
    onSuccess: () => {
      invalidate()
      setDialog({ open: false, mode: 'add', editing: null })
    },
  })

  const editTxMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: TransactionFormValues }) =>
      updateTransaction(id, values),
    onSuccess: () => {
      invalidate()
      setDialog({ open: false, mode: 'add', editing: null })
    },
  })

  const rejectTxMutation = useMutation({
    mutationFn: (id: string) => rejectTransaction(id),
    onSuccess: invalidate,
  })

  const evidenceMutation = useMutation({
    mutationFn: (files: File[]) => addEvidence(applicationId, files),
    onSuccess: invalidate,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 rounded animate-pulse bg-muted" />
        <div className="h-32 rounded-xl bg-muted animate-pulse" />
        <div className="h-48 rounded-xl bg-muted animate-pulse" />
      </div>
    )
  }

  if (isError || !application) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        No se encontró la solicitud. Puede que haya sido eliminada o el ID es incorrecto.
      </div>
    )
  }

  const currentStatus = selectedStatus ?? application.rawStatus

  const handleDialogSubmit = (values: TransactionFormValues) => {
    if (dialog.mode === 'edit' && dialog.editing) {
      editTxMutation.mutate({ id: dialog.editing.id, values })
    } else {
      addTxMutation.mutate(values)
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate({ to: '/advisor' })}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Volver a solicitudes
      </button>

      {/* Header */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold text-foreground">{application.preclientName}</h1>
              <StatusBadge status={application.status} />
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Solicitud {application.applicationCode} · Enviada el{' '}
              {formatDateTime(application.submittedAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Monto solicitado</p>
            <p className="text-xl font-bold text-foreground">
              {formatCurrency(application.requestedAmount)}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-sm">
            <PhoneIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{application.phone || '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{application.economicActivity || '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BadgeIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">NIT {application.nit || '—'}</span>
          </div>
        </div>

        {application.businessDescription && (
          <div className="mt-3 border-t pt-3">
            <p className="text-xs font-medium text-muted-foreground">Descripción del negocio</p>
            <p className="mt-1 text-sm text-foreground">{application.businessDescription}</p>
          </div>
        )}
      </div>

      <FinancialSummary summary={application.summary} />

      {/* Transactions */}
      <TransactionsPanel
        transactions={application.transactions}
        onAdd={() => setDialog({ open: true, mode: 'add', editing: null })}
        onEdit={(tx) => setDialog({ open: true, mode: 'edit', editing: tx })}
        onReject={(tx) => rejectTxMutation.mutate(tx.id)}
        busyId={rejectTxMutation.isPending ? rejectTxMutation.variables : null}
      />

      {/* Evidence + add evidence */}
      <div className="space-y-3">
        <EvidenceReviewPanel evidences={application.evidences} />
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files
              if (files && files.length > 0) evidenceMutation.mutate(Array.from(files))
              e.target.value = ''
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={evidenceMutation.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
          >
            <UploadCloudIcon className="h-3.5 w-3.5" />
            {evidenceMutation.isPending ? 'Procesando…' : 'Agregar evidencia'}
          </button>
          {evidenceMutation.isError && (
            <p className="mt-1.5 text-xs text-destructive">
              No se pudo procesar la evidencia. Verificá que sean imágenes válidas.
            </p>
          )}
        </div>
      </div>

      <RiskAlerts alerts={application.alerts} />

      <AdvisorNotes
        initialNotes={application.advisorNotes ?? ''}
        onSave={(notes) => notesMutation.mutate(notes)}
      />

      {/* Status change */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Cambiar estado de la solicitud
        </h2>
        <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
          <div className="flex flex-wrap gap-2">
            {MANAGEMENT_STATUSES.map((option) => (
              <button
                key={option.raw}
                onClick={() => setSelectedStatus(option.raw)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  currentStatus === option.raw
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              if (selectedStatus) statusMutation.mutate(selectedStatus)
            }}
            disabled={!selectedStatus || statusMutation.isPending}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-40"
          >
            {statusMutation.isPending ? 'Guardando...' : 'Confirmar cambio de estado'}
          </button>
          {statusMutation.isSuccess && (
            <p className="text-xs text-green-700">Estado actualizado correctamente.</p>
          )}
        </div>
      </div>

      <TransactionFormDialog
        key={`${dialog.mode}-${dialog.editing?.id ?? 'new'}-${dialog.open}`}
        open={dialog.open}
        mode={dialog.mode}
        initial={dialog.editing}
        submitting={addTxMutation.isPending || editTxMutation.isPending}
        onClose={() => setDialog({ open: false, mode: 'add', editing: null })}
        onSubmit={handleDialogSubmit}
      />
    </div>
  )
}
