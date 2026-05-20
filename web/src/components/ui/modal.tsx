import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

export function Modal({ open, onClose, title, description, children, className, size = 'md' }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2',
            'rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-card))] shadow-2xl',
            'focus:outline-none animate-in',
            sizeClasses[size],
            className
          )}
        >
          {(title || description) && (
            <div className="flex items-start justify-between border-b border-[rgb(var(--border-subtle))] px-6 py-5">
              <div>
                {title && (
                  <Dialog.Title className="text-lg font-semibold text-[rgb(var(--text))]">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="mt-1 text-sm text-[rgb(var(--text-muted))]">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <button
                onClick={onClose}
                className="ml-4 rounded-lg p-1.5 text-[rgb(var(--text-faint))] hover:bg-[rgb(var(--bg-elevated))] hover:text-[rgb(var(--text))] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
