import { BookOpenIcon, QrCodeIcon, ReceiptIcon, FileTextIcon, PackageIcon, FileIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/shared/lib/formatters'
import type { Evidence } from '@/data/mock-applications'
import type { EvidenceType, EvidenceStatus } from '@/shared/types/common'

const evidenceIcons: Record<EvidenceType, React.ReactNode> = {
  'Cuaderno de ventas': <BookOpenIcon className="h-4 w-4" />,
  'Comprobante QR': <QrCodeIcon className="h-4 w-4" />,
  Recibo: <ReceiptIcon className="h-4 w-4" />,
  Factura: <FileTextIcon className="h-4 w-4" />,
  Inventario: <PackageIcon className="h-4 w-4" />,
  Otro: <FileIcon className="h-4 w-4" />,
}

const evidenceStatusConfig: Record<EvidenceStatus, { label: string; className: string }> = {
  Cargado: { label: 'Cargado', className: 'bg-gray-100 text-gray-700' },
  Procesado: { label: 'Procesado', className: 'bg-green-100 text-green-700' },
  Revisar: { label: 'Revisar', className: 'bg-orange-100 text-orange-700' },
}

interface EvidenceReviewPanelProps {
  evidences: Evidence[]
}

export function EvidenceReviewPanel({ evidences }: EvidenceReviewPanelProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Evidencias presentadas
      </h2>
      <div className="space-y-2">
        {evidences.map((ev) => {
          const statusCfg = evidenceStatusConfig[ev.status]
          return (
            <div key={ev.id} className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  {evidenceIcons[ev.type]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">{ev.name}</span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        statusCfg.className,
                      )}
                    >
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{ev.type}</p>

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
                            ev.confidence >= 0.85 ? 'bg-green-500' : ev.confidence >= 0.70 ? 'bg-yellow-500' : 'bg-red-500',
                          )}
                          style={{ width: `${ev.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(ev.confidence * 100)}% confianza
                      </span>
                    </div>
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
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
