import { AlertTriangleIcon } from 'lucide-react'

interface RiskAlertsProps {
  alerts: string[]
}

export function RiskAlerts({ alerts }: RiskAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Alertas</h2>
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
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-xl border border-orange-200 bg-orange-50 p-3"
          >
            <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
            <p className="text-sm text-orange-800">{alert}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
