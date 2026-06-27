import { cn } from '@/lib/utils'
import type { ApplicationStatus } from '@/shared/types/common'

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  Pendiente: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  'En revisión': {
    label: 'En revisión',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  Observado: {
    label: 'Observado',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  'Listo para análisis': {
    label: 'Listo para análisis',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
}

interface StatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
