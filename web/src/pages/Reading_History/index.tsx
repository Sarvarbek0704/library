import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { memberStatsApi, returnRequestsApi, membersApi } from '@/api'
import { Badge, statusBadgeVariant } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/PageHeader'
import { formatDate, statusLabel } from '@/lib/utils'
import { BookOpen, RotateCcw, History, Clock, CheckCircle2 } from 'lucide-react'
import type { MemberState } from '@/api'
import { useAppSelector } from '../../store/hooks'

export default function ReadingHistory() {
  const qc = useQueryClient()
  const user = useAppSelector(s => s.user.user)
  const [returnItem, setReturnItem] = useState<MemberState | null>(null)

  const { data: member } = useQuery({
    queryKey: ['my-member'],
    queryFn: membersApi.myMember,
    enabled: !!user,
    retry: false,
  })

  const { data: history, isLoading } = useQuery({
    queryKey: ['my-current-books'],
    queryFn: memberStatsApi.myCurrent,
    enabled: !!user,
    retry: false,
  })

  const returnMutation = useMutation({
    mutationFn: ({ memberId, bookId }: { memberId: number; bookId: number }) =>
      returnRequestsApi.create({ memberId, bookId }),
    onSuccess: () => {
      toast.success("Qaytarish so'rovi yuborildi! Admin tasdiqlaydi.")
      qc.invalidateQueries({ queryKey: ['my-current-books'] })
      setReturnItem(null)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const books = history ?? []
  const active = books.filter(b => b.status === 'BORROWED' || b.status === 'BOOKED')
  const past = books.filter(b => b.status === 'RETURNED')

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <BookOpen className="h-12 w-12 text-[rgb(var(--text-faint))]" />
        <p className="font-semibold text-[rgb(var(--text))]">Tizimga kiring</p>
        <Link to="/login" className="rounded-lg bg-[rgb(var(--primary))] px-4 py-2 text-sm font-medium text-white">Kirish</Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PageHeader title="O'qish tarixi" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-4">
            <Skeleton className="h-20 w-14 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!member && books.length === 0) {
    return (
      <div className="space-y-6 pb-20 md:pb-0 animate-in">
        <PageHeader title="O'qish tarixi" />
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[rgb(var(--bg-elevated))]">
            <BookOpen className="h-8 w-8 text-[rgb(var(--text-faint))]" />
          </div>
          <div>
            <p className="font-semibold text-[rgb(var(--text))]">A'zoligingiz yo'q</p>
            <p className="text-sm text-[rgb(var(--text-muted))]">Kitob olish uchun avval a'zo bo'ling</p>
          </div>
          <Link to="/membership" className="rounded-lg bg-[rgb(var(--primary))] px-4 py-2 text-sm font-medium text-white hover:bg-[rgb(var(--primary-hover))] transition-colors">
            A'zolikni ko'rish
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-in">
      <PageHeader
        title="O'qish tarixi"
        description={books.length > 0 ? `${active.length} ta faol · ${past.length} ta qaytarilgan` : 'Hali kitob olmagansiz'}
      />

      {/* Summary cards */}
      {books.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-3 text-center">
            <Clock className="mx-auto h-4 w-4 text-violet-400 mb-1.5" />
            <p className="text-xl font-bold text-[rgb(var(--text))]">{active.filter(b => b.status === 'BORROWED').length}</p>
            <p className="text-xs text-[rgb(var(--text-muted))]">Olingan</p>
          </div>
          <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-3 text-center">
            <BookOpen className="mx-auto h-4 w-4 text-amber-400 mb-1.5" />
            <p className="text-xl font-bold text-[rgb(var(--text))]">{active.filter(b => b.status === 'BOOKED').length}</p>
            <p className="text-xs text-[rgb(var(--text-muted))]">Band qilingan</p>
          </div>
          <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-3 text-center">
            <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-400 mb-1.5" />
            <p className="text-xl font-bold text-[rgb(var(--text))]">{past.length}</p>
            <p className="text-xs text-[rgb(var(--text-muted))]">Qaytarilgan</p>
          </div>
        </div>
      )}

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[rgb(var(--bg-elevated))]">
            <BookOpen className="h-8 w-8 text-[rgb(var(--text-faint))]" />
          </div>
          <div>
            <p className="font-semibold text-[rgb(var(--text))]">Hali kitob olmagansiz</p>
            <p className="text-sm text-[rgb(var(--text-muted))]">Kutubxonadan kitob olib ko'ring</p>
          </div>
          <Link to="/books" className="rounded-lg bg-[rgb(var(--primary))] px-4 py-2 text-sm font-medium text-white hover:bg-[rgb(var(--primary-hover))] transition-colors">
            Kitoblarni ko'rish
          </Link>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-[rgb(var(--text))]">
                <Clock className="h-4 w-4 text-violet-400" /> Hozirda ({active.length})
              </h2>
              <div className="space-y-3">
                {active.map(item => {
                  const imgPath = (item.book as any)?.images?.[0]?.url ?? (item.book as any)?.images?.[0]?.path
                  const isOverdue = item.endDate && new Date(item.endDate) < new Date() && item.status === 'BORROWED'
                  return (
                    <div key={item.id} className="flex gap-4 rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-4 transition-colors hover:border-[rgb(var(--border))]">
                      <Link to={`/books/${item.bookId}`} className="flex h-20 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[rgb(var(--bg-elevated))] overflow-hidden">
                        {imgPath ? (
                          <img src={imgPath} alt={item.book?.title} className="h-full w-full object-cover" />
                        ) : (
                          <BookOpen className="h-6 w-6 text-[rgb(var(--text-faint))]" />
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/books/${item.bookId}`} className="font-semibold text-[rgb(var(--text))] hover:text-[rgb(var(--primary))] transition-colors line-clamp-1">
                          {item.book?.title ?? '—'}
                        </Link>
                        <p className="text-sm text-[rgb(var(--text-muted))]">{(item.book as any)?.author?.name}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge variant={isOverdue ? 'danger' : statusBadgeVariant(item.status)}>
                            {isOverdue ? "Muddati o'tgan" : statusLabel(item.status)}
                          </Badge>
                          <span className="text-xs text-[rgb(var(--text-muted))]">
                            {formatDate(item.startDate)} — {item.endDate ? formatDate(item.endDate) : '?'}
                          </span>
                        </div>
                      </div>
                      {item.status === 'BORROWED' && member && (
                        <div className="flex-shrink-0 flex items-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setReturnItem(item)}
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Qaytarish
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-[rgb(var(--text))]">
                <History className="h-4 w-4 text-emerald-400" /> Qaytarilgan ({past.length})
              </h2>
              <div className="space-y-3">
                {past.map(item => {
                  const imgPath = (item.book as any)?.images?.[0]?.url ?? (item.book as any)?.images?.[0]?.path
                  return (
                    <div key={item.id} className="flex gap-4 rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-4 opacity-75 hover:opacity-100 transition-opacity">
                      <Link to={`/books/${item.bookId}`} className="flex h-16 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--bg-elevated))] overflow-hidden">
                        {imgPath ? (
                          <img src={imgPath} alt={item.book?.title} className="h-full w-full object-cover" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-[rgb(var(--text-faint))]" />
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/books/${item.bookId}`} className="font-medium text-sm text-[rgb(var(--text))] hover:text-[rgb(var(--primary))] transition-colors line-clamp-1">
                          {item.book?.title ?? '—'}
                        </Link>
                        <p className="text-xs text-[rgb(var(--text-muted))]">{(item.book as any)?.author?.name}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <Badge variant="success">Qaytarilgan</Badge>
                          <span className="text-xs text-[rgb(var(--text-muted))]">
                            {formatDate(item.startDate)} — {item.endDate ? formatDate(item.endDate) : '?'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </>
      )}

      {/* Return confirmation modal */}
      <Modal open={!!returnItem} onClose={() => setReturnItem(null)} title="Kitob qaytarish" size="sm">
        {returnItem && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-elevated))] p-4">
              <p className="font-semibold text-[rgb(var(--text))]">{returnItem.book?.title}</p>
              <p className="text-sm text-[rgb(var(--text-muted))] mt-0.5">
                {(returnItem.book as any)?.author?.name}
              </p>
            </div>
            <p className="text-sm text-[rgb(var(--text-muted))]">
              Kitobni qaytarish so'rovi yuboriladi. Admin tasdiqlashini kuting.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setReturnItem(null)}>
                Bekor qilish
              </Button>
              <Button
                className="flex-1"
                loading={returnMutation.isPending}
                onClick={() => {
                  if (!member) { toast.error("A'zolik topilmadi"); return }
                  returnMutation.mutate({ memberId: member.id, bookId: returnItem.bookId })
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Tasdiqlash
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
