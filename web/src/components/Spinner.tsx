import { cn } from '@/lib/utils'

export function Spinner({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' }
  return (
    <span
      className={cn(
        'block rounded-full border-2 border-[rgb(var(--border))] border-t-violet-500 animate-spin',
        s[size],
        className
      )}
    />
  )
}

export function FullPageSpinner() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}
