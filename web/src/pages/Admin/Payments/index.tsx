import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { CreditCard, Pencil, User, Search, X, Filter } from 'lucide-react'

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
import { paymentsApi, type Payment } from '@/api'
import { formatDate, formatCurrency, statusLabel } from '@/lib/utils'

const LIMIT = 20

const STATUS_OPTIONS = [
  { value: 'SUCCESS', label: 'Muvaffaqiyatli' },
  { value: 'PENDING', label: 'Kutilmoqda' },
  { value: 'FAILED', label: 'Muvaffaqiyatsiz' },
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

export default function PaymentsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [editStatus, setEditStatus] = useState('PENDING')

  const hasFilters = !!search || !!statusFilter

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['admin-payments', page, search, statusFilter],
    queryFn: () => paymentsApi.list(page, LIMIT, search || undefined, statusFilter || undefined),
    placeholderData: (prev) => prev,
  })

  const payments: Payment[] = data?.data ?? []
  const total = data?.total ?? 0

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      paymentsApi.updateStatus(id, { status }),
    onSuccess: () => {
      toast.success("To'lov holati yangilandi")
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] })
      setSelectedPayment(null)
    },
    onError: (err: Error) => toast.error(err.message || "Yangilashda xatolik yuz berdi"),
  })

  const openModal = (payment: Payment) => {
    setSelectedPayment(payment)
    setEditStatus(payment.status)
  }

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

  // Summary counts
  const successCount = payments.filter((p) => p.status === 'SUCCESS').length
  const pendingCount = payments.filter((p) => p.status === 'PENDING').length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="To'lovlar"
        description="Barcha a'zolik to'lovlarini ko'ring va holatini boshqaring"
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px] max-w-sm">
          <Input
            placeholder="Ism yoki telefon bo'yicha qidiring..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          />
        </div>
        <div className="w-48">
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
      {!isLoading && !hasFilters && payments.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm text-[rgb(var(--text-muted))]">
            Jami <span className="font-semibold text-[rgb(var(--text))]">{total}</span> ta to'lov
          </p>
          {successCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
              ✓ {successCount} muvaffaqiyatli
            </span>
          )}
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
              ⏳ {pendingCount} kutilmoqda
            </span>
          )}
        </div>
      )}
      {!isLoading && hasFilters && (
        <p className="text-sm text-[rgb(var(--text-muted))]">
          <span className="font-semibold text-[rgb(var(--text))]">{total}</span> ta natija topildi
        </p>
      )}

      <div className="flex flex-col gap-3">
        <Table className="min-w-[680px]">
          <TableHead>
            <tr>
              <TableHeader className="w-14">ID</TableHeader>
              <TableHeader>Foydalanuvchi</TableHeader>
              <TableHeader className="w-28">A'zolik</TableHeader>
              <TableHeader className="w-24">Summa</TableHeader>
              <TableHeader className="w-24">Holat</TableHeader>
              <TableHeader className="w-24">Sana</TableHeader>
              <TableHeader className="w-24 text-right">Amal</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton rows={8} cols={7} />
            ) : isError ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-[rgb(var(--text-muted))]">
                    <CreditCard className="h-8 w-8 text-red-400" />
                    <p>Ma'lumotlarni yuklashda xatolik yuz berdi</p>
                  </div>
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-[rgb(var(--text-muted))]">
                    <CreditCard className="h-8 w-8 text-[rgb(var(--text-faint))]" />
                    <p>Ma'lumot topilmadi</p>
                    {hasFilters && <p className="text-sm text-[rgb(var(--text-faint))]">Filtrlarni o'chirib ko'ring</p>}
                  </div>
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="text-[rgb(var(--text-muted))] font-mono text-xs">#{payment.id}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                        <User className="h-3.5 w-3.5 text-violet-400" />
                      </div>
                      <div>
                        <p className="font-medium text-[rgb(var(--text))]">
                          {payment.user
                            ? `${payment.user.firstName}${payment.user.lastName ? ' ' + payment.user.lastName : ''}`
                            : `User #${payment.userId}`}
                        </p>
                        {payment.user?.phone && (
                          <p className="text-xs text-[rgb(var(--text-muted))]">{payment.user.phone}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-medium text-[rgb(var(--text))]">
                      {payment.membership?.name ?? `#${payment.membershipId}`}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold text-emerald-400">
                      {formatCurrency(payment.amount)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge variant={statusBadgeVariant(payment.status)}>
                      {statusLabel(payment.status)}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-[rgb(var(--text-muted))]">
                    {formatDate(payment.createdAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openModal(payment)}>
                      <Pencil className="h-3.5 w-3.5" />
                      Holat
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
      </div>

      {/* Edit status modal */}
      <Modal
        open={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="To'lov holatini yangilash"
        size="sm"
        key={selectedPayment?.id}
      >
        {selectedPayment && (
          <div className="flex flex-col gap-5">
            <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-elevated))] p-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[rgb(var(--text-faint))] uppercase tracking-wider">To'lov #{selectedPayment.id}</span>
                <Badge variant={statusBadgeVariant(selectedPayment.status)}>
                  {statusLabel(selectedPayment.status)}
                </Badge>
              </div>
              <p className="font-medium text-[rgb(var(--text))]">
                {selectedPayment.user
                  ? `${selectedPayment.user.firstName}${selectedPayment.user.lastName ? ' ' + selectedPayment.user.lastName : ''}`
                  : `User #${selectedPayment.userId}`}
              </p>
              {selectedPayment.user?.phone && (
                <p className="text-xs text-[rgb(var(--text-muted))]">{selectedPayment.user.phone}</p>
              )}
              <p className="text-xs text-[rgb(var(--text-muted))]">
                A'zolik: <span className="text-[rgb(var(--text))]">{selectedPayment.membership?.name ?? `#${selectedPayment.membershipId}`}</span>
              </p>
              <p className="text-sm font-semibold text-emerald-400 mt-1">
                {formatCurrency(selectedPayment.amount)}
              </p>
            </div>

            <Select
              label="Yangi holat"
              value={editStatus}
              onValueChange={setEditStatus}
              options={STATUS_OPTIONS}
              placeholder="Holat tanlang"
            />

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setSelectedPayment(null)} disabled={updateMutation.isPending}>
                Bekor qilish
              </Button>
              <Button
                onClick={() => updateMutation.mutate({ id: selectedPayment.id, status: editStatus })}
                loading={updateMutation.isPending}
              >
                Saqlash
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
