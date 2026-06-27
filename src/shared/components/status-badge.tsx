import { cn } from '@/lib/utils'

const statusConfig: Record<string, string> = {
  Pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'En revisión': 'bg-blue-100 text-blue-800 border-blue-200',
  Observado: 'bg-orange-100 text-orange-800 border-orange-200',
  'Listo para análisis': 'bg-green-100 text-green-800 border-green-200',
}

const FALLBACK = 'bg-gray-100 text-gray-800 border-gray-200'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        statusConfig[status] ?? FALLBACK,
        className,
      )}
    >
      {status}
    </span>
  )
}
