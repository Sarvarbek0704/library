import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Search, Users, Calendar, Pencil, X, Filter } from 'lucide-react'

import { PageHeader } from '@/components/PageHeader'
import { Input } from '@/components/ui/input'
import { Badge, statusBadgeVariant } from '@/components/ui/badge'
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { membersApi, type Member } from '@/api'
import { formatDate, statusLabel } from '@/lib/utils'

const LIMIT = 20

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Faol' },
  { value: 'INACTIVE', label: 'Faol emas' },
  { value: 'EXPIRED', label: 'Muddati tugagan' },
]

const PAID_OPTIONS = [
  { value: 'true', label: "To'langan" },
  { value: 'false', label: "To'lanmagan" },
]

type EditForm = { status: string; isPaid: string }

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

export default function MembersPage() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [editTarget, setEditTarget] = useState<Member | null>(null)

  const editForm = useForm<EditForm>()

  const hasFilters = !!search || !!statusFilter

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['admin-members', page, search, statusFilter],
    queryFn: () => membersApi.list(page, LIMIT, search || undefined, statusFilter || undefined),
    placeholderData: (prev) => prev,
  })

  const members: Member[] = data?.data ?? []
  const total = data?.total ?? 0

  const editMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<Member> }) =>
      membersApi.update(id, body),
    onSuccess: () => {
      toast.success("A'zo holati yangilandi")
      qc.invalidateQueries({ queryKey: ['admin-members'] })
      setEditTarget(null)
      editForm.reset()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  function openEdit(member: Member) {
    setEditTarget(member)
    editForm.reset({
      status: member.status,
      isPaid: member.isPaid ? 'true' : 'false',
    })
  }

  function closeEdit() {
    setEditTarget(null)
    editForm.reset()
  }

  function onEditSubmit(values: EditForm) {
    if (!editTarget) return
    editMutation.mutate({
      id: editTarget.id,
      body: {
        status: values.status,
        isPaid: values.isPaid === 'true',
      },
    })
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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="A'zolar"
        description="Barcha kutubxona a'zolarini ko'ring va boshqaring"
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px] max-w-sm">
          <Input
            placeholder="Ism, familiya yoki telefon..."
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

      {/* Count */}
      {!isLoading && (
        <p className="text-sm text-[rgb(var(--text-muted))]">
          Jami <span className="font-semibold text-[rgb(var(--text))]">{total}</span> ta a'zo
          {hasFilters && <span className="text-[rgb(var(--text-faint))]"> (filtr bo'yicha)</span>}
        </p>
      )}

      {/* Table */}
      <div className="flex flex-col gap-3">
        <Table className="min-w-[760px]">
          <TableHead>
            <tr>
              <TableHeader className="w-12">ID</TableHeader>
              <TableHeader>Foydalanuvchi</TableHeader>
              <TableHeader className="w-28">A'zolik</TableHeader>
              <TableHeader className="w-24">Boshlanish</TableHeader>
              <TableHeader className="w-24">Tugash</TableHeader>
              <TableHeader className="w-24">Holat</TableHeader>
              <TableHeader className="w-24">To'lov</TableHeader>
              <TableHeader className="w-12 text-right">Amal</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton rows={8} cols={8} />
            ) : isError ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-[rgb(var(--text-muted))]">
                    <Users className="h-8 w-8 text-red-400" />
                    <p>Ma'lumotlarni yuklashda xatolik yuz berdi</p>
                  </div>
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-[rgb(var(--text-muted))]">
                    <Users className="h-8 w-8 text-[rgb(var(--text-faint))]" />
                    <p>Ma'lumot topilmadi</p>
                    {hasFilters && (
                      <p className="text-sm text-[rgb(var(--text-faint))]">Filtrlarni o'chirib ko'ring</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="text-[rgb(var(--text-muted))] font-mono text-xs">#{member.id}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-violet-400">
                          {(member.user?.firstName ?? 'U')[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-[rgb(var(--text))]">
                          {member.user
                            ? `${member.user.firstName}${member.user.lastName ? ' ' + member.user.lastName : ''}`
                            : `User #${member.userId}`}
                        </p>
                        {member.user?.phone && (
                          <p className="text-xs text-[rgb(var(--text-muted))]">{member.user.phone}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-medium text-[rgb(var(--text))]">
                      {member.membership?.name ?? `#${member.membershipId}`}
                    </span>
                  </TableCell>

                  <TableCell className="text-[rgb(var(--text-muted))]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(member.startDate)}
                    </div>
                  </TableCell>

                  <TableCell className="text-[rgb(var(--text-muted))]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(member.endDate)}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={statusBadgeVariant(member.status)}>
                      {statusLabel(member.status)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={member.isPaid ? 'success' : 'danger'}>
                      {member.isPaid ? "To'langan" : "To'lanmagan"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(member)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
      </div>

      {/* Edit Modal */}
      <Modal
        open={!!editTarget}
        onClose={closeEdit}
        title="A'zo holatini tahrirlash"
        size="sm"
      >
        {editTarget && (
          <div className="space-y-4">
            {/* Member info */}
            <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-elevated))] p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[rgb(var(--text-faint))] uppercase tracking-wider">A'zo #{editTarget.id}</span>
                <Badge variant={statusBadgeVariant(editTarget.status)}>{statusLabel(editTarget.status)}</Badge>
              </div>
              <p className="font-medium text-[rgb(var(--text))]">
                {editTarget.user
                  ? `${editTarget.user.firstName}${editTarget.user.lastName ? ' ' + editTarget.user.lastName : ''}`
                  : `User #${editTarget.userId}`}
              </p>
              {editTarget.user?.phone && (
                <p className="text-xs text-[rgb(var(--text-muted))]">{editTarget.user.phone}</p>
              )}
              <p className="text-xs text-[rgb(var(--text-muted))]">
                A'zolik: <span className="text-[rgb(var(--text))]">{editTarget.membership?.name ?? `#${editTarget.membershipId}`}</span>
              </p>
              <p className="text-xs text-[rgb(var(--text-muted))]">
                Muddati: {formatDate(editTarget.startDate)} – {formatDate(editTarget.endDate)}
              </p>
            </div>

            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-3">
              <Select
                label="Holat"
                value={editForm.watch('status')}
                onValueChange={(v) => editForm.setValue('status', v)}
                options={STATUS_OPTIONS}
                placeholder="Holat tanlang"
              />

              <Select
                label="To'lov holati"
                value={editForm.watch('isPaid')}
                onValueChange={(v) => editForm.setValue('isPaid', v)}
                options={PAID_OPTIONS}
                placeholder="To'lov holati"
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={closeEdit}>Bekor qilish</Button>
                <Button type="submit" loading={editMutation.isPending}>Saqlash</Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  )
}
