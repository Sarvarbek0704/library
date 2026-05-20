import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Search, CheckCircle, XCircle, BookOpen, Clock, User, X, Filter } from 'lucide-react'

import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge, statusBadgeVariant } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/skeleton'
import { returnRequestsApi } from '@/api'
import { formatDate, statusLabel } from '@/lib/utils'

const LIMIT = 20

interface ReturnRequestItem {
  request: {
    id: number
    status: string
    note?: string
    createdAt: string
    decidedAt?: string
  }
  user: { firstName: string; phone: string }
  book: { id: number; title: string; image?: string }
  memberState: { startDate: string; endDate: string; status: string } | null
}

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Kutilmoqda' },
  { value: 'ACCEPTED', label: 'Qabul qilingan' },
  { value: 'REJECTED', label: 'Rad etilgan' },
]

function Pagination({ page, total, limit, onPageChange }: {
  page: number; total: number; limit: number; onPageChange: (p: number) => void
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-1 pt-4">
      <p className="text-sm text-[rgb(var(--text-muted))]">
        {(page - 1) * limit + 1}–{Math.min(page * limit, total)} / {total} ta
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>← Oldingi</Button>
        <span className="text-sm text-[rgb(var(--text-muted))]">{page} / {totalPages}</span>
        <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Keyingi →</Button>
      </div>
    </div>
  )
}

function DecisionModal({ open, onClose, action, item, onConfirm, loading }: {
  open: boolean
  onClose: () => void
  action: 'accept' | 'reject' | null
  item: ReturnRequestItem | null
  onConfirm: (note: string) => void
  loading: boolean
}) {
  const [note, setNote] = useState('')

  const handleConfirm = () => { onConfirm(note); setNote('') }
  const handleClose = () => { setNote(''); onClose() }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={action === 'accept' ? 'Qaytarishni qabul qilish' : 'Qaytarishni rad etish'}
      size="sm"
    >
      <div className="flex flex-col gap-4">
        {item && (
          <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-elevated))] p-4">
            <p className="text-sm font-medium text-[rgb(var(--text))]">{item.book.title}</p>
            <p className="mt-1 text-xs text-[rgb(var(--text-muted))]">
              {item.user.firstName} — {item.user.phone}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[rgb(var(--text-muted))]">Izoh (ixtiyoriy)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Izoh kiriting..."
            rows={3}
            className="w-full rounded-[10px] border border-[rgb(var(--border))] bg-[rgb(var(--bg-elevated))] px-3.5 py-2.5 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-faint))] focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition-colors resize-none"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleClose} disabled={loading}>Bekor qilish</Button>
          <Button
            variant={action === 'accept' ? 'success' : 'danger'}
            onClick={handleConfirm}
            loading={loading}
          >
            {action === 'accept' ? 'Qabul qilish' : 'Rad etish'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default function ReturnRequestPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [phoneInput, setPhoneInput] = useState('')
  const [phoneFilter, setPhoneFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [decisionModal, setDecisionModal] = useState<{
    open: boolean; action: 'accept' | 'reject' | null; item: ReturnRequestItem | null
  }>({ open: false, action: null, item: null })

  const hasFilters = !!phoneFilter || !!statusFilter

  // All requests (paginated, with optional status filter)
  const allQuery = useQuery({
    queryKey: ['return-requests-all', page, phoneFilter, statusFilter],
    queryFn: () => {
      if (phoneFilter) {
        return returnRequestsApi.findByPhone(phoneFilter) as Promise<ReturnRequestItem[]>
      }
      return returnRequestsApi.list(page, LIMIT, undefined, statusFilter || undefined) as Promise<{ data: ReturnRequestItem[]; total: number }>
    },
    placeholderData: (prev) => prev,
  })

  const isPhoneMode = !!phoneFilter
  const isLoading = allQuery.isLoading
  const isError = allQuery.isError
  const isFetching = allQuery.isFetching

  let items: ReturnRequestItem[] = []
  let total = 0

  if (isPhoneMode) {
    const raw = allQuery.data as ReturnRequestItem[] | undefined
    items = raw ?? []
    total = items.length
  } else {
    const raw = allQuery.data as { data: ReturnRequestItem[]; total: number } | undefined
    items = raw?.data ?? []
    total = raw?.total ?? 0
  }

  // Client-side status filter when in phone mode
  const displayItems = isPhoneMode && statusFilter
    ? items.filter((i) => i.request.status === statusFilter)
    : items

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['return-requests-all'] })
  }

  const acceptMutation = useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string }) =>
      returnRequestsApi.accept(id, { note }),
    onSuccess: () => {
      toast.success('Qaytarish qabul qilindi')
      invalidate()
      setDecisionModal({ open: false, action: null, item: null })
    },
    onError: (err: Error) => toast.error(err.message || 'Xatolik yuz berdi'),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string }) =>
      returnRequestsApi.reject(id, { note }),
    onSuccess: () => {
      toast.success('Qaytarish rad etildi')
      invalidate()
      setDecisionModal({ open: false, action: null, item: null })
    },
    onError: (err: Error) => toast.error(err.message || 'Xatolik yuz berdi'),
  })

  const applyPhoneFilter = () => {
    setPhoneFilter(phoneInput.trim())
    setPage(1)
  }

  const clearAllFilters = () => {
    setPhoneInput('')
    setPhoneFilter('')
    setStatusFilter('')
    setPage(1)
  }

  const openDecision = (item: ReturnRequestItem, action: 'accept' | 'reject') => {
    setDecisionModal({ open: true, action, item })
  }

  const handleDecisionConfirm = (note: string) => {
    if (!decisionModal.item) return
    const id = decisionModal.item.request.id
    if (decisionModal.action === 'accept') {
      acceptMutation.mutate({ id, note: note || undefined })
    } else {
      rejectMutation.mutate({ id, note: note || undefined })
    }
  }

  const isMutating = acceptMutation.isPending || rejectMutation.isPending

  const pendingCount = items.filter((i) => i.request.status === 'PENDING').length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Qaytarish So'rovlari"
        description="Barcha qaytarish so'rovlarini ko'ring va tasdiqlang"
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px] max-w-sm">
          <Input
            placeholder="Telefon raqam bo'yicha filtrlang..."
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            onKeyDown={(e) => e.key === 'Enter' && applyPhoneFilter()}
          />
        </div>
        <div className="w-52">
          <Select
            value={statusFilter}
            onValueChange={(v) => { setStatusFilter(v === statusFilter ? '' : v); setPage(1) }}
            options={STATUS_OPTIONS}
            placeholder="Holat bo'yicha"
          />
        </div>
        <Button onClick={applyPhoneFilter} loading={isFetching && !isLoading}>
          <Search className="h-4 w-4" />
          Qidirish
        </Button>
        {hasFilters && (
          <Button variant="ghost" onClick={clearAllFilters}>
            <X className="h-4 w-4" />
            Tozalash
          </Button>
        )}
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[rgb(var(--text-faint))] flex items-center gap-1">
            <Filter className="h-3 w-3" /> Faol filtrlar:
          </span>
          {phoneFilter && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-400 text-xs border border-violet-500/20">
              📞 {phoneFilter}
              <button onClick={() => { setPhoneFilter(''); setPhoneInput(''); setPage(1) }} className="ml-0.5 hover:text-violet-300">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {statusFilter && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs border border-blue-500/20">
              {statusLabel(statusFilter)}
              <button onClick={() => { setStatusFilter(''); setPage(1) }} className="ml-0.5 hover:text-blue-300">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      {!isLoading && (
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm text-[rgb(var(--text-muted))]">
            {hasFilters
              ? <><span className="font-semibold text-[rgb(var(--text))]">{displayItems.length}</span> ta natija topildi</>
              : <><span className="font-semibold text-[rgb(var(--text))]">{total}</span> ta so'rov</>
            }
          </p>
          {!hasFilters && pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
              ⏳ {pendingCount} ta kutilmoqda
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="flex flex-col gap-3">
        <Table className="min-w-[860px]">
          <TableHead>
            <tr>
              <TableHeader>Kitob</TableHeader>
              <TableHeader className="w-36">Foydalanuvchi</TableHeader>
              <TableHeader className="w-24">Holat</TableHeader>
              <TableHeader className="w-24">Olingan</TableHeader>
              <TableHeader className="w-24">Muddati</TableHeader>
              <TableHeader className="w-24">So'rov</TableHeader>
              <TableHeader className="w-24">Izoh</TableHeader>
              <TableHeader className="w-32 text-right">Amallar</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton rows={6} cols={8} />
            ) : isError ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-[rgb(var(--text-muted))]">
                    <XCircle className="h-8 w-8 text-red-400" />
                    <p>Ma'lumotlarni yuklashda xatolik yuz berdi</p>
                    {phoneFilter && <p className="text-sm text-[rgb(var(--text-faint))]">Bu raqam ro'yxatda yo'q bo'lishi mumkin</p>}
                  </div>
                </td>
              </tr>
            ) : displayItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-[rgb(var(--text-muted))]">
                    <BookOpen className="h-8 w-8 text-[rgb(var(--text-faint))]" />
                    <p>Ma'lumot topilmadi</p>
                    {hasFilters && (
                      <p className="text-sm text-[rgb(var(--text-faint))]">Filtrlarni o'chirib ko'ring</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              displayItems.map((item) => {
                const isPending = item.request.status === 'PENDING'
                return (
                  <TableRow key={item.request.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.book.image ? (
                          <img src={item.book.image} alt={item.book.title} className="h-10 w-8 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="h-10 w-8 rounded bg-[rgb(var(--bg-elevated))] flex items-center justify-center flex-shrink-0">
                            <BookOpen className="h-4 w-4 text-[rgb(var(--text-faint))]" />
                          </div>
                        )}
                        <span className="font-medium text-[rgb(var(--text))] line-clamp-2">
                          {item.book.title}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                          <User className="h-3.5 w-3.5 text-violet-400" />
                        </div>
                        <div>
                          <p className="font-medium text-[rgb(var(--text))]">{item.user.firstName}</p>
                          <p className="text-xs text-[rgb(var(--text-muted))]">{item.user.phone}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant={statusBadgeVariant(item.request.status)}>
                        {statusLabel(item.request.status)}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-[rgb(var(--text-muted))]">
                      {item.memberState ? formatDate(item.memberState.startDate) : '—'}
                    </TableCell>

                    <TableCell className="text-[rgb(var(--text-muted))]">
                      {item.memberState ? formatDate(item.memberState.endDate) : '—'}
                    </TableCell>

                    <TableCell className="text-[rgb(var(--text-muted))]">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(item.request.createdAt)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-[rgb(var(--text-muted))] line-clamp-2">
                        {item.request.note || '—'}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      {isPending ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => openDecision(item, 'accept')}
                            disabled={isMutating}
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Qabul
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => openDecision(item, 'reject')}
                            disabled={isMutating}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Rad
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-[rgb(var(--text-faint))]">
                          {item.request.decidedAt ? formatDate(item.request.decidedAt) : '—'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {!isPhoneMode && (
          <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
        )}
      </div>

      <DecisionModal
        open={decisionModal.open}
        onClose={() => setDecisionModal({ open: false, action: null, item: null })}
        action={decisionModal.action}
        item={decisionModal.item}
        onConfirm={handleDecisionConfirm}
        loading={isMutating}
      />
    </div>
  )
}
