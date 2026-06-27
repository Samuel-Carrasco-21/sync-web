import { TrendingUpIcon, TrendingDownIcon, ScaleIcon, ActivityIcon, FileTextIcon, ShieldIcon } from 'lucide-react'
import { SummaryCard } from '@/shared/components/summary-card'
import { formatCurrency } from '@/shared/lib/formatters'
import type { CreditApplication } from '@/shared/types/application'

interface FinancialSummaryProps {
  summary: CreditApplication['summary']
}

// Risk: low is good (green), high is bad (red).
const riskColors: Record<string, string> = {
  Bajo: 'text-green-700',
  Moderado: 'text-yellow-700',
  Media: 'text-yellow-700',
  Alto: 'text-red-700',
  Alta: 'text-red-700',
}

// Frequency / documentary evidence: high is good (green), low is bad (red).
const levelColors: Record<string, string> = {
  Alta: 'text-green-700',
  Media: 'text-yellow-700',
  Baja: 'text-red-700',
  Bajo: 'text-red-700',
}

export function FinancialSummary({ summary }: FinancialSummaryProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Resumen financiero detectado
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryCard
          title="Ingresos detectados"
          value={formatCurrency(summary.detectedIncome)}
          icon={<TrendingUpIcon className="h-4 w-4 text-green-600" />}
          valueClassName="text-green-700"
        />
        <SummaryCard
          title="Gastos detectados"
          value={formatCurrency(summary.detectedExpenses)}
          icon={<TrendingDownIcon className="h-4 w-4 text-red-500" />}
          valueClassName="text-red-600"
        />
        <SummaryCard
          title="Saldo neto estimado"
          value={formatCurrency(summary.estimatedNetBalance)}
          icon={<ScaleIcon className="h-4 w-4" />}
          valueClassName={summary.estimatedNetBalance >= 0 ? 'text-green-700' : 'text-red-600'}
        />
        <SummaryCard
          title="Frecuencia de ventas"
          value={summary.salesFrequency}
          icon={<ActivityIcon className="h-4 w-4" />}
          valueClassName={levelColors[summary.salesFrequency]}
        />
        <SummaryCard
          title="Evidencia documental"
          value={summary.documentaryEvidence}
          icon={<FileTextIcon className="h-4 w-4" />}
          valueClassName={levelColors[summary.documentaryEvidence]}
        />
        <SummaryCard
          title="Riesgo preliminar"
          value={summary.preliminaryRisk}
          icon={<ShieldIcon className="h-4 w-4" />}
          valueClassName={riskColors[summary.preliminaryRisk]}
        />
      </div>
    </div>
  )
}
