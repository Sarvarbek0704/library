import { Button } from './button'

interface ConfirmDialogProps {
  open: boolean
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
  variant?: 'danger' | 'default'
}

export function ConfirmDialog({
  open,
  title = 'Tasdiqlash',
  description,
  confirmLabel = "O'chirish",
  cancelLabel = 'Bekor qilish',
  onConfirm,
  onCancel,
  loading,
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-card))] p-6 shadow-2xl animate-in">
        <h2 className="text-base font-semibold text-[rgb(var(--text))]">{title}</h2>
        {description && (
          <p className="mt-1.5 text-sm text-[rgb(var(--text-muted))]">{description}</p>
        )}
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} size="sm" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
