import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { BookOpen, RotateCcw, User, Search, X, Filter } from 'lucide-react'

import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge, statusBadgeVariant } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/skeleton'
import { memberStatsApi, type MemberState } from '@/api'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { formatDate, statusLabel } from '@/lib/utils'

const LIMIT = 20

const STATUS_OPTIONS = [
  { value: 'BORROWED', label: 'Olingan' },
  { value: 'BOOKED', label: 'Band qilingan' },
  { value: 'RETURNED', label: 'Qaytarilgan' },
  { value: 'OVERDUE', label: "Muddati o'tgan" },
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

export default function MemberStatsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [confirmStat, setConfirmStat] = useState<MemberState | null>(null)
  const [returningId, setReturningId] = useState<number | null>(null)

  const hasFilters = !!search || !!statusFilter

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['admin-member-stats', page, search, statusFilter],
    queryFn: () => memberStatsApi.list(page, LIMIT, search || undefined, statusFilter || undefined),
    placeholderData: (prev) => prev,
  })

  const stats: MemberState[] = data?.data ?? []
  const total = data?.total ?? 0

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      memberStatsApi.update(id, { status }),
    onSuccess: () => {
      toast.success("Holat muvaffaqiyatli yangilandi")
      queryClient.invalidateQueries({ queryKey: ['admin-member-stats'] })
      setReturningId(null)
    },
    onError: (err: Error) => {
      toast.error(err.message || "Yangilashda xatolik yuz berdi")
      setReturningId(null)
    },
  })

  const applyFilters = () => {
    setSearch(searchInput.trim())
    setPage(1)
  }

  const clearFilters = () => {
    setSearch('')
    setSearchInput('')
    setStatusFilter('')
    setPage(1)
  }

  const confirmReturn = () => {
    if (!confirmStat) return
    setReturningId(confirmStat.id)
    updateMutation.mutate({ id: confirmStat.id, status: 'RETURNED' })
    setConfirmStat(null)
  }

  // Active stats counts
  const borrowedCount = stats.filter((s) => s.status === 'BORROWED').length
  const overdueCount = stats.filter((s) => s.status === 'OVERDUE').length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Kitob Holatlari"
        description="A'zolar olingan va qaytarilgan kitoblarning hozirgi holatini ko'ring"
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px] max-w-sm">
          <Input
            placeholder="Kitob nomi yoki foydalanuvchi..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
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
        <Button onClick={applyFilters} loading={isFetching && !isLoading}>
          <Search className="h-4 w-4" />
          Qidirish
        </Button>
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters}>
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
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-400 text-xs border border-violet-500/20">
              "{search}"
              <button onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }} className="ml-0.5 hover:text-violet-300">
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

      {/* Quick stats */}
      {!isLoading && (
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm text-[rgb(var(--text-muted))]">
            Jami <span className="font-semibold text-[rgb(var(--text))]">{total}</span> ta yozuv
            {hasFilters && <span className="text-[rgb(var(--text-faint))]"> (filtr bo'yicha)</span>}
          </p>
          {!hasFilters && borrowedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
              📚 {borrowedCount} olingan
            </span>
          )}
          {!hasFilters && overdueCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
              ⚠ {overdueCount} muddati o'tgan
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Table className="min-w-[720px]">
          <TableHead>
            <tr>
              <TableHeader className="w-12">ID</TableHeader>
              <TableHeader className="w-40">Foydalanuvchi</TableHeader>
              <TableHeader>Kitob</TableHeader>
              <TableHeader className="w-24">Holat</TableHeader>
              <TableHeader className="w-24">Boshlanish</TableHeader>
              <TableHeader className="w-24">Tugash</TableHeader>
              <TableHeader className="w-28 text-right">Amal</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton rows={8} cols={7} />
            ) : isError ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-[rgb(var(--text-muted))]">
                    <BookOpen className="h-8 w-8 text-red-400" />
                    <p>Ma'lumotlarni yuklashda xatolik yuz berdi</p>
                  </div>
                </td>
              </tr>
            ) : stats.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-[rgb(var(--text-muted))]">
                    <BookOpen className="h-8 w-8 text-[rgb(var(--text-faint))]" />
                    <p>Ma'lumot topilmadi</p>
                    {hasFilters && <p className="text-sm text-[rgb(var(--text-faint))]">Filtrlarni o'chirib ko'ring</p>}
                  </div>
                </td>
              </tr>
            ) : (
              stats.map((stat) => {
                const user = stat.member?.user
                const isReturned = stat.status === 'RETURNED'
                const isOverdue = stat.status === 'OVERDUE'
                const isProcessing = returningId === stat.id

                return (
                  <TableRow key={stat.id}>
                    <TableCell className="text-[rgb(var(--text-muted))] font-mono text-xs">#{stat.id}</TableCell>

                    <TableCell>
                      {user ? (
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                            <User className="h-3.5 w-3.5 text-violet-400" />
                          </div>
                          <div>
                            <p className="font-medium text-[rgb(var(--text))]">
                              {user.firstName}{user.lastName ? ` ${user.lastName}` : ''}
                            </p>
                            {user.phone && (
                              <p className="text-xs text-[rgb(var(--text-muted))]">{user.phone}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[rgb(var(--text-muted))]">A'zo #{stat.memberId}</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {stat.book ? (
                        <div className="flex items-center gap-3">
                          {stat.book.images?.[0]?.url ? (
                            <img
                              src={stat.book.images[0].url}
                              alt={stat.book.title}
                              className="h-10 w-8 rounded object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="h-10 w-8 rounded bg-[rgb(var(--bg-elevated))] flex items-center justify-center flex-shrink-0">
                              <BookOpen className="h-4 w-4 text-[rgb(var(--text-faint))]" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-[rgb(var(--text))] line-clamp-2">
                              {stat.book.title}
                            </p>
                            {stat.book.author && (
                              <p className="text-xs text-[rgb(var(--text-muted))]">{stat.book.author.name}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[rgb(var(--text-muted))]">Kitob #{stat.bookId}</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge variant={isOverdue ? 'danger' : statusBadgeVariant(stat.status)}>
                        {statusLabel(stat.status)}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-[rgb(var(--text-muted))]">
                      {formatDate(stat.startDate)}
                    </TableCell>

                    <TableCell className="text-[rgb(var(--text-muted))]">
                      {stat.endDate ? (
                        <span className={isOverdue ? 'text-red-400 font-medium' : ''}>
                          {formatDate(stat.endDate)}
                        </span>
                      ) : '—'}
                    </TableCell>

                    <TableCell className="text-right">
                      {!isReturned ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setConfirmStat(stat)}
                          loading={isProcessing}
                          disabled={updateMutation.isPending}
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Qaytarildi
                        </Button>
                      ) : (
                        <span className="text-xs text-[rgb(var(--text-faint))]">✓ Qaytarilgan</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
      </div>

      <ConfirmDialog
        open={!!confirmStat}
        title="Kitobni qaytarilgan deb belgilash"
        description={`"${confirmStat?.book?.title ?? `Kitob #${confirmStat?.bookId}`}" ni qaytarilgan deb belgilaysizmi?`}
        confirmLabel="Tasdiqlash"
        onConfirm={confirmReturn}
        onCancel={() => setConfirmStat(null)}
        loading={updateMutation.isPending}
        variant="default"
      />
    </div>
  )
}
