import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary-hover))]',
        secondary:
          'bg-[rgb(var(--bg-elevated))] border border-[rgb(var(--border-subtle))] text-[rgb(var(--text))] hover:border-[rgb(var(--border))] hover:bg-[rgb(var(--border-subtle))]',
        ghost:
          'text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--bg-elevated))]',
        danger:
          'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15',
        success:
          'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15',
        outline:
          'border border-[rgb(var(--border))] text-[rgb(var(--text))] hover:bg-[rgb(var(--bg-elevated))]',
      },
      size: {
        sm:   'h-8  px-3 text-xs',
        md:   'h-9  px-4 text-sm',
        lg:   'h-10 px-5 text-sm',
        icon: 'h-9  w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'
