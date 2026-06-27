import { createRootRoute, Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppHeader } from '@/shared/components/app-header'
import type { Role } from '@/shared/types/common'

const queryClient = new QueryClient()

function RootComponent() {
  const navigate = useNavigate()
  const location = useLocation()

  const currentRole: Role = location.pathname.startsWith('/advisor') ? 'advisor' : 'preclient'

  const handleRoleChange = (role: Role) => {
    navigate({ to: role === 'advisor' ? '/advisor' : '/preclient' })
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <AppHeader currentRole={currentRole} onRoleChange={handleRoleChange} />
        <main className="container mx-auto px-4 py-6 max-w-5xl">
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  )
}

export const Route = createRootRoute({ component: RootComponent })
