import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '—'
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m'
}

export function getRoleFromToken(token: string | null): string | null {
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload?.role ?? null
  } catch {
    return null
  }
}

export function getTokenPayload(token?: string | null): Record<string, unknown> | null {
  const t = token ?? localStorage.getItem('token')
  if (!t) return null
  try {
    return JSON.parse(atob(t.split('.')[1]))
  } catch {
    return null
  }
}

export function daysUntil(date: string | Date | null | undefined): number {
  if (!date) return 0
  const diff = new Date(date).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: 'text-emerald-400',
    NOTACTIVE: 'text-red-400',
    AVAILABLE: 'text-emerald-400',
    NOTAVAILABLE: 'text-red-400',
    BORROWED: 'text-blue-400',
    BOOKED: 'text-amber-400',
    RETURNED: 'text-slate-400',
    PENDING: 'text-amber-400',
    ACCEPTED: 'text-emerald-400',
    REJECTED: 'text-red-400',
    SUCCESS: 'text-emerald-400',
    FAILED: 'text-red-400',
    WAITING: 'text-amber-400',
    NOTIFIED: 'text-blue-400',
    CANCELLED: 'text-slate-400',
  }
  return map[status] ?? 'text-slate-400'
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: 'Faol',
    INACTIVE: 'Nofaol',
    EXPIRED: 'Muddati tugagan',
    OVERDUE: "Muddati o'tgan",
    NOTACTIVE: 'Nofaol',
    AVAILABLE: 'Mavjud',
    NOTAVAILABLE: 'Mavjud emas',
    BORROWED: 'Olingan',
    BOOKED: 'Band',
    RETURNED: 'Qaytarilgan',
    PENDING: 'Kutilmoqda',
    ACCEPTED: 'Qabul qilindi',
    REJECTED: 'Rad etildi',
    SUCCESS: 'Muvaffaqiyatli',
    FAILED: 'Muvaffaqiyatsiz',
    WAITING: 'Navbatda',
    NOTIFIED: 'Xabar berildi',
    CANCELLED: 'Bekor qilindi',
  }
  return map[status] ?? status
}
