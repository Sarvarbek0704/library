import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  label?: string
  options: { value: string; label: string }[]
  className?: string
  disabled?: boolean
}

export function Select({ value, onValueChange, placeholder, label, options, className, disabled }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[rgb(var(--text-muted))]">{label}</label>}
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          className={cn(
            'flex w-full items-center justify-between rounded-[10px] border border-[rgb(var(--border))]',
            'bg-[rgb(var(--bg-elevated))] px-3.5 py-2.5 text-sm text-[rgb(var(--text))]',
            'focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40',
            'disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
            !value && 'text-[rgb(var(--text-faint))]',
            className
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 text-[rgb(var(--text-faint))]" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="z-50 overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-card))] shadow-xl"
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1.5">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    'relative flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-[rgb(var(--text))]',
                    'focus:bg-[rgb(var(--bg-elevated))] focus:outline-none select-none transition-colors',
                    'data-[state=checked]:text-violet-400'
                  )}
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-3">
                    <Check className="h-3.5 w-3.5" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  )
}
