import { RoleSwitcher } from '@/shared/components/role-switcher'
import type { Role } from '@/shared/types/common'

interface AppHeaderProps {
  currentRole: Role
  onRoleChange: (role: Role) => void
}

export function AppHeader({ currentRole, onRoleChange }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-primary-foreground">S</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">Sync</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">· Caja Inteligente Bolivia</span>
        </div>
        <RoleSwitcher currentRole={currentRole} onChange={onRoleChange} />
      </div>
    </header>
  )
}
