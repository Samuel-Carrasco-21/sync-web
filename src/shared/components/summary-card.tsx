import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface SummaryCardProps {
  title: string
  value: string
  icon?: ReactNode
  valueClassName?: string
  className?: string
}

export function SummaryCard({ title, value, icon, valueClassName, className }: SummaryCardProps) {
  return (
    <div className={cn('rounded-xl border bg-card p-4 shadow-sm', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <p className={cn('mt-1 text-xl font-semibold text-foreground', valueClassName)}>{value}</p>
    </div>
  )
}
