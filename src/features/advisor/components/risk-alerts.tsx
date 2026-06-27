import type { AlertItem } from '@/shared/types/application'
import { AlertList } from './alert-list'

interface RiskAlertsProps {
  alerts: AlertItem[]
}

/**
 * General (management-level) alerts not tied to a specific evidence. Alerts that
 * refer to an evidence are shown inside that evidence's card (EvidenceReviewPanel),
 * so this section renders nothing when there are no general alerts.
 */
export function RiskAlerts({ alerts }: RiskAlertsProps) {
  if (alerts.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Alertas generales ({alerts.length})
      </h2>
      <AlertList alerts={alerts} />
    </div>
  )
}
