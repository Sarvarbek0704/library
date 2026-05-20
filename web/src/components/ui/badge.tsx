import * as React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'

const variants: Record<Variant, string> = {
  default: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  danger:  'bg-red-500/15 text-red-400 border-red-500/25',
  info:    'bg-blue-500/15 text-blue-400 border-blue-500/25',
  muted:   'bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-muted))] border-[rgb(var(--border))]',
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export function statusBadgeVariant(status: string): Variant {
  const map: Record<string, Variant> = {
    ACTIVE: 'success', INACTIVE: 'danger', EXPIRED: 'danger', NOTACTIVE: 'danger',
    OVERDUE: 'danger',
    AVAILABLE: 'success', NOTAVAILABLE: 'danger',
    BORROWED: 'info', BOOKED: 'warning', RETURNED: 'muted',
    PENDING: 'warning', ACCEPTED: 'success', REJECTED: 'danger',
    SUCCESS: 'success', FAILED: 'danger',
    WAITING: 'warning', NOTIFIED: 'info', CANCELLED: 'muted',
  }
  return map[status] ?? 'muted'
}
