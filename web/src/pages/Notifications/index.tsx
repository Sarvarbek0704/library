import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { notificationsApi } from '@/api'
import { useAppSelector } from '../../store/hooks'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import { Bell, BellOff, Check, CheckCheck, Trash2, BookOpen, Clock, RefreshCw, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const TYPE_ICONS: Record<string, React.ReactNode> = {
  BORROW_REMINDER: <Clock className="h-4 w-4 text-orange-400" />,
  BOOKING_EXPIRED: <BellOff className="h-4 w-4 text-red-400" />,
  WAITLIST_READY: <Check className="h-4 w-4 text-emerald-400" />,
  RETURN_ACCEPTED: <RefreshCw className="h-4 w-4 text-emerald-400" />,
  RETURN_REJECTED: <RefreshCw className="h-4 w-4 text-red-400" />,
  MEMBERSHIP_EXPIRY: <BookOpen className="h-4 w-4 text-amber-400" />,
  GENERAL: <Info className="h-4 w-4 text-blue-400" />,
}

export default function NotificationsPage() {
  const user = useAppSelector(s => s.user.user)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.list,
    enabled: !!user,
    refetchInterval: 30_000,
  })

  const markReadMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const markAllMutation = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      toast.success("Hammasi o'qildi deb belgilandi")
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const clearAllMutation = useMutation({
    mutationFn: notificationsApi.clearAll,
    onSuccess: () => {
      toast.success("Bildirishnomalar tozalandi")
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const notifications = data?.notifications ?? []
  const unreadCount = data?.unreadCount ?? 0

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-in">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <PageHeader
            title="Bildirishnomalar"
            description={unreadCount > 0 ? `${unreadCount} ta o'qilmagan` : 'Hammasi o\'qilgan'}
          />
        </div>
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                loading={markAllMutation.isPending}
                onClick={() => markAllMutation.mutate()}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Hammasini o'qildi
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              loading={clearAllMutation.isPending}
              onClick={() => clearAllMutation.mutate()}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Tozalash
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-4">
              <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[rgb(var(--bg-elevated))]">
            <Bell className="h-8 w-8 text-[rgb(var(--text-faint))]" />
          </div>
          <div>
            <p className="font-semibold text-[rgb(var(--text))]">Bildirishnomalar yo'q</p>
            <p className="text-sm text-[rgb(var(--text-muted))]">Yangi bildirishnomalar bu yerda ko'rinadi</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => { if (!n.isRead) markReadMutation.mutate(n.id) }}
              className={cn(
                'flex gap-3 rounded-xl border p-4 transition-all cursor-pointer',
                n.isRead
                  ? 'border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))]'
                  : 'border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/8'
              )}
            >
              <div className={cn(
                'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full',
                n.isRead ? 'bg-[rgb(var(--bg-elevated))]' : 'bg-violet-500/15'
              )}>
                {TYPE_ICONS[n.type] ?? <Bell className="h-4 w-4 text-[rgb(var(--text-muted))]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn(
                    'text-sm font-semibold leading-snug',
                    n.isRead ? 'text-[rgb(var(--text-muted))]' : 'text-[rgb(var(--text))]'
                  )}>
                    {n.title}
                  </p>
                  {!n.isRead && (
                    <span className="flex-shrink-0 h-2 w-2 rounded-full bg-violet-500 mt-1.5" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-[rgb(var(--text-muted))] leading-relaxed">{n.message}</p>
                <p className="mt-1.5 text-xs text-[rgb(var(--text-faint))]">{formatDate(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
