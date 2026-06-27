import { useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { ApplicationCard } from './application-card'
import { EmptyState } from '@/shared/components/empty-state'
import type { CreditApplication } from '@/data/mock-applications'
import type { ApplicationStatus } from '@/shared/types/common'

const ALL_STATUSES = 'Todos'
const STATUS_OPTIONS: (ApplicationStatus | typeof ALL_STATUSES)[] = [
  ALL_STATUSES,
  'Pendiente',
  'En revisión',
  'Observado',
  'Listo para análisis',
]

interface ApplicationListProps {
  applications: CreditApplication[]
}

export function ApplicationList({ applications }: ApplicationListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | typeof ALL_STATUSES>(ALL_STATUSES)

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.preclientName.toLowerCase().includes(search.toLowerCase()) ||
      app.economicActivity.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === ALL_STATUSES || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nombre o actividad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-card px-10 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status as ApplicationStatus | typeof ALL_STATUSES)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === status
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="No se encontraron solicitudes que coincidan con los filtros aplicados."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  )
}
