import { cn } from '@/lib/utils'
import type { Role } from '@/shared/types/common'

interface RoleSwitcherProps {
  currentRole: Role
  onChange: (role: Role) => void
}

export function RoleSwitcher({ currentRole, onChange }: RoleSwitcherProps) {
  return (
    <div className="flex rounded-lg border bg-muted p-1 gap-1">
      <button
        onClick={() => onChange('preclient')}
        className={cn(
          'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
          currentRole === 'preclient'
            ? 'bg-white text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        Precliente
      </button>
      <button
        onClick={() => onChange('advisor')}
        className={cn(
          'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
          currentRole === 'advisor'
            ? 'bg-white text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        Asesor de crédito
      </button>
    </div>
  )
}
