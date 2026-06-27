import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeftIcon, PhoneIcon, BriefcaseIcon, DollarSignIcon } from 'lucide-react'
import { FinancialSummary } from '../components/financial-summary'
import { EvidenceReviewPanel } from '../components/evidence-review-panel'
import { RiskAlerts } from '../components/risk-alerts'
import { AdvisorNotes } from '../components/advisor-notes'
import { StatusBadge } from '@/shared/components/status-badge'
import { formatCurrency, formatDateTime } from '@/shared/lib/formatters'
import { getApplicationById, updateApplicationStatus, updateAdvisorNotes } from '../services/advisor.mock-service'
import type { ApplicationStatus } from '@/shared/types/common'

const STATUS_OPTIONS: ApplicationStatus[] = [
  'Pendiente',
  'En revisión',
  'Observado',
  'Listo para análisis',
]

export function ApplicationDetailPage() {
  const { applicationId } = useParams({ from: '/advisor/$applicationId' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: application, isLoading, isError } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => getApplicationById(applicationId),
  })

  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null)

  const statusMutation = useMutation({
    mutationFn: (status: ApplicationStatus) => updateApplicationStatus(applicationId, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(['application', applicationId], updated)
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      setSelectedStatus(null)
    },
  })

  const notesMutation = useMutation({
    mutationFn: (notes: string) => updateAdvisorNotes(applicationId, notes),
    onSuccess: (updated) => {
      queryClient.setQueryData(['application', applicationId], updated)
    },
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

  const currentStatus = selectedStatus ?? application.status

  return (
    <div className="space-y-6">
      {/* Back button */}
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
              Solicitud {application.id} · Enviada el {formatDateTime(application.submittedAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Monto solicitado</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(application.requestedAmount)}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-sm">
            <PhoneIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{application.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{application.economicActivity}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">Solicita {formatCurrency(application.requestedAmount)}</span>
          </div>
        </div>

        {application.businessDescription && (
          <div className="mt-3 border-t pt-3">
            <p className="text-xs font-medium text-muted-foreground">Descripción del negocio</p>
            <p className="mt-1 text-sm text-foreground">{application.businessDescription}</p>
          </div>
        )}
      </div>

      {/* Financial Summary */}
      <FinancialSummary summary={application.summary} />

      {/* Evidence */}
      <EvidenceReviewPanel evidences={application.evidences} />

      {/* Alerts */}
      <RiskAlerts alerts={application.alerts} />

      {/* Advisor Notes */}
      <AdvisorNotes
        initialNotes={application.advisorNotes}
        onSave={(notes) => notesMutation.mutate(notes)}
      />

      {/* Status change */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Cambiar estado de la solicitud
        </h2>
        <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  currentStatus === status
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground'
                }`}
              >
                {status}
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
    </div>
  )
}
