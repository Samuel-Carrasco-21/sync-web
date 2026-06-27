import { AlertTriangleIcon, InfoIcon, AlertCircleIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { AlertItem } from '@/shared/types/application'

export const alertLevelStyles: Record<
  string,
  { container: string; icon: ReactNode; text: string }
> = {
  info: {
    container: 'border-blue-200 bg-blue-50',
    icon: <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />,
    text: 'text-blue-800',
  },
  warning: {
    container: 'border-orange-200 bg-orange-50',
    icon: <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />,
    text: 'text-orange-800',
  },
  error: {
    container: 'border-red-200 bg-red-50',
    icon: <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />,
    text: 'text-red-800',
  },
}

const LEVEL_RANK: Record<string, number> = { info: 0, warning: 1, error: 2 }

/** Highest-severity level present in a set of alerts (error > warning > info). */
export function dominantAlertLevel(alerts: AlertItem[]): string {
  return alerts.reduce(
    (acc, a) => ((LEVEL_RANK[a.level] ?? 1) > (LEVEL_RANK[acc] ?? 1) ? a.level : acc),
    'info',
  )
}

interface AlertListProps {
  alerts: AlertItem[]
  /** Compact spacing/typography for embedding inside an evidence card. */
  dense?: boolean
  className?: string
}

export function AlertList({ alerts, dense = false, className }: AlertListProps) {
  return (
    <div className={cn(dense ? 'space-y-1.5' : 'space-y-2', className)}>
      {alerts.map((alert, index) => {
        const style = alertLevelStyles[alert.level] ?? alertLevelStyles.warning
        return (
          <div
            key={index}
            className={cn(
              'flex gap-2 border',
              dense ? 'rounded-lg p-2' : 'rounded-xl p-3',
              style.container,
            )}
          >
            {style.icon}
            <p className={cn(dense ? 'text-xs' : 'text-sm', style.text)}>{alert.message}</p>
          </div>
        )
      })}
    </div>
  )
}
