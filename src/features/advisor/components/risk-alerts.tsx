import { AlertTriangleIcon, InfoIcon, AlertCircleIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { AlertItem } from '@/shared/types/application'

interface RiskAlertsProps {
  alerts: AlertItem[]
}

const levelStyles: Record<string, { container: string; icon: ReactNode; text: string }> = {
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

export function RiskAlerts({ alerts }: RiskAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Alertas
        </h2>
        <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          Sin alertas detectadas.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Alertas ({alerts.length})
      </h2>
      <div className="space-y-2">
        {alerts.map((alert, index) => {
          const style = levelStyles[alert.level] ?? levelStyles.warning
          return (
            <div key={index} className={`flex gap-3 rounded-xl border p-3 ${style.container}`}>
              {style.icon}
              <p className={`text-sm ${style.text}`}>{alert.message}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
