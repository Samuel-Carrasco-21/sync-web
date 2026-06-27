import { useQuery } from '@tanstack/react-query'
import { ApplicationList } from '../components/application-list'
import { getApplications } from '../services/advisor.mock-service'

export function AdvisorPage() {
  const { data: applications, isLoading, isError } = useQuery({
    queryKey: ['applications'],
    queryFn: getApplications,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Solicitudes de crédito</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisá y analizá las solicitudes enviadas por preclientes.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl border bg-card animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Error al cargar las solicitudes. Intentá de nuevo.
        </div>
      )}

      {applications && <ApplicationList applications={applications} />}
    </div>
  )
}
