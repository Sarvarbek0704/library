import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: { value: number; label?: string }
  color?: 'violet' | 'emerald' | 'amber' | 'blue' | 'red'
  className?: string
}

const colorMap = {
  violet: { bg: 'bg-violet-500/10', icon: 'text-violet-400', border: 'border-violet-500/20' },
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'border-emerald-500/20' },
  amber:  { bg: 'bg-amber-500/10',  icon: 'text-amber-400',  border: 'border-amber-500/20' },
  blue:   { bg: 'bg-blue-500/10',   icon: 'text-blue-400',   border: 'border-blue-500/20' },
  red:    { bg: 'bg-red-500/10',    icon: 'text-red-400',    border: 'border-red-500/20' },
}

export function StatCard({ title, value, icon: Icon, trend, color = 'violet', className }: StatCardProps) {
  const c = colorMap[color]
  return (
    <div
      className={cn(
        'rounded-2xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-5',
        'hover:border-[rgb(var(--border))] transition-colors',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[rgb(var(--text-muted))] uppercase tracking-wider">{title}</p>
          <p className="mt-2 text-2xl font-bold text-[rgb(var(--text))]">{value}</p>
          {trend && (
            <p className={cn('mt-1 text-xs', trend.value >= 0 ? 'text-emerald-400' : 'text-red-400')}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%{trend.label && ` ${trend.label}`}
            </p>
          )}
        </div>
        <div className={cn('rounded-xl p-3', c.bg, 'border', c.border)}>
          <Icon className={cn('h-5 w-5', c.icon)} />
        </div>
      </div>
    </div>
  )
}
