import { CalendarIcon, ChevronRightIcon, TrendingUpIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { StatusBadge } from '@/shared/components/status-badge'
import { formatCurrency, formatDate } from '@/shared/lib/formatters'
import type { CreditApplication } from '@/data/mock-applications'

interface ApplicationCardProps {
  application: CreditApplication
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Link
      to="/advisor/$applicationId"
      params={{ applicationId: application.id }}
      className="block rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {application.preclientName}
            </h3>
            <StatusBadge status={application.status} />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{application.economicActivity}</p>
        </div>
        <ChevronRightIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      </div>

      <div className="mt-3 flex flex-wrap gap-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUpIcon className="h-3.5 w-3.5" />
          <span>
            Solicita <span className="font-medium text-foreground">{formatCurrency(application.requestedAmount)}</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>{formatDate(application.submittedAt)}</span>
        </div>
      </div>

      {application.alerts.length > 0 && (
        <div className="mt-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-700">
            {application.alerts.length} {application.alerts.length === 1 ? 'alerta' : 'alertas'}
          </span>
        </div>
      )}
    </Link>
  )
}
