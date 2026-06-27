import {
  BookOpenIcon,
  QrCodeIcon,
  ReceiptIcon,
  FileTextIcon,
  PackageIcon,
  FileIcon,
  DownloadIcon,
  AlertCircleIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { mediaDownloadUrl } from '@/shared/api/client'
import { formatCurrency } from '@/shared/lib/formatters'
import type { AlertItem, Evidence } from '@/shared/types/application'
import { AlertList, alertLevelStyles, dominantAlertLevel } from './alert-list'

const documentTypeIcons: Record<string, ReactNode> = {
  sales_notebook: <BookOpenIcon className="h-4 w-4" />,
  qr_receipt: <QrCodeIcon className="h-4 w-4" />,
  purchase_receipt: <ReceiptIcon className="h-4 w-4" />,
  expense_note: <FileTextIcon className="h-4 w-4" />,
  mixed: <PackageIcon className="h-4 w-4" />,
}

const statusClasses: Record<string, string> = {
  uploaded: 'bg-gray-100 text-gray-700',
  processing: 'bg-blue-100 text-blue-700',
  processed: 'bg-green-100 text-green-700',
  review: 'bg-orange-100 text-orange-700',
  failed: 'bg-red-100 text-red-700',
}

interface EvidenceReviewPanelProps {
  evidences: Evidence[]
  /** All management alerts; those whose evidenceId matches an evidence are shown on its card. */
  alerts?: AlertItem[]
}

export function EvidenceReviewPanel({ evidences, alerts = [] }: EvidenceReviewPanelProps) {
  if (evidences.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Evidencias presentadas
        </h2>
        <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          No se subieron evidencias para esta solicitud.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Evidencias presentadas
      </h2>
      <div className="space-y-2">
        {evidences.map((ev) => {
          const icon = (ev.documentType && documentTypeIcons[ev.documentType]) ?? (
            <FileIcon className="h-4 w-4" />
          )
          const statusClass = statusClasses[ev.status] ?? 'bg-gray-100 text-gray-700'
          const evidenceAlerts = alerts.filter((a) => a.evidenceId === ev.id)
          const alertLevel = dominantAlertLevel(evidenceAlerts)
          const alertStyle = alertLevelStyles[alertLevel] ?? alertLevelStyles.warning
          return (
            <div key={ev.id} className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  {icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">{ev.name}</span>
                    <span
                      className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusClass)}
                    >
                      {ev.statusLabel}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{ev.documentTypeLabel}</p>

                  {ev.errorMessage && (
                    <div className="mt-2 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-2">
                      <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-red-800">
                          No se pudo procesar la evidencia
                        </p>
                        <p className="mt-0.5 wrap-break-word text-xs leading-relaxed text-red-700">
                          {ev.errorMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  {ev.detectedAmount !== undefined && (
                    <p className="mt-1 text-sm font-medium text-green-700">
                      Monto detectado: {formatCurrency(ev.detectedAmount)}
                    </p>
                  )}

                  {ev.confidence !== undefined && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            ev.confidence >= 0.85
                              ? 'bg-green-500'
                              : ev.confidence >= 0.7
                                ? 'bg-yellow-500'
                                : 'bg-red-500',
                          )}
                          style={{ width: `${ev.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(ev.confidence * 100)}% confianza
                      </span>
                    </div>
                  )}

                  {evidenceAlerts.length > 0 && (
                    <details className="mt-2" open={alertLevel === 'error'}>
                      <summary
                        className={cn(
                          'inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium',
                          alertStyle.text,
                        )}
                      >
                        {alertStyle.icon}
                        Ver {evidenceAlerts.length}{' '}
                        {evidenceAlerts.length === 1 ? 'alerta' : 'alertas'}
                      </summary>
                      <AlertList alerts={evidenceAlerts} dense className="mt-1.5" />
                    </details>
                  )}

                  {ev.extractedText && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
                        Ver texto extraído
                      </summary>
                      <pre className="mt-1.5 rounded-lg bg-muted p-2 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                        {ev.extractedText}
                      </pre>
                    </details>
                  )}

                  <a
                    href={mediaDownloadUrl(ev.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={ev.name}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
                  >
                    <DownloadIcon className="h-3.5 w-3.5" />
                    Descargar original
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
