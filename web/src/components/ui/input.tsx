import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, type, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[rgb(var(--text-muted))]">{label}</label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-faint))]">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full rounded-[10px] border border-[rgb(var(--border))] bg-[rgb(var(--bg-elevated))]',
              'px-3.5 py-2.5 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-faint))]',
              'focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40',
              'transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-faint))]">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
