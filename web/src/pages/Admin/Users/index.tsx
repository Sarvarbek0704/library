import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Search, Users, Star, Calendar, Pencil, Eye, EyeOff, X } from 'lucide-react'

import { PageHeader } from '@/components/PageHeader'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Select } from '@/components/ui/select'
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/skeleton'
import { usersApi, type UserProfile } from '@/api'
import { formatDate } from '@/lib/utils'

type EditForm = {
  firstName: string
  lastName: string
  phone: string
  password: string
}

const LIMIT = 20

const ROLE_OPTIONS = [
  { value: 'USER', label: 'Foydalanuvchi' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPER_ADMIN', label: 'Superadmin' },
]

type RoleBadgeVariant = 'default' | 'info' | 'danger' | 'muted'

function roleBadgeVariant(role: string): RoleBadgeVariant {
  const map: Record<string, RoleBadgeVariant> = {
    SUPER_ADMIN: 'danger',
    SUPERADMIN: 'danger',
    ADMIN: 'info',
    USER: 'muted',
  }
  return map[role?.toUpperCase()] ?? 'muted'
}

function roleLabel(role: string): string {
  const map: Record<string, string> = {
    SUPER_ADMIN: 'Superadmin',
    SUPERADMIN: 'Superadmin',
    ADMIN: 'Admin',
    USER: 'Foydalanuvchi',
  }
  return map[role?.toUpperCase()] ?? role
}

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

export default function UsersPage() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [editTarget, setEditTarget] = useState<UserProfile | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const editForm = useForm<EditForm>()

  const hasFilters = !!search || !!roleFilter

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['admin-users', page, search, roleFilter],
    queryFn: () => usersApi.list(page, LIMIT, search || undefined, roleFilter || undefined),
    placeholderData: (prev) => prev,
  })

  const users: UserProfile[] = data?.data ?? []
  const total = data?.total ?? 0

  const editMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<EditForm> }) =>
      usersApi.update(id, body),
    onSuccess: () => {
      toast.success('Foydalanuvchi yangilandi')
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      setEditTarget(null)
      editForm.reset()
      setShowPassword(false)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  function openEdit(user: UserProfile) {
    setEditTarget(user)
    setShowPassword(false)
    editForm.reset({
      firstName: user.firstName,
      lastName: user.lastName ?? '',
      phone: user.phone ?? '',
      password: '',
    })
  }

  function closeEdit() {
    setEditTarget(null)
    editForm.reset()
    setShowPassword(false)
  }

  function onEditSubmit(values: EditForm) {
    if (!editTarget) return
    const body: Partial<EditForm> = {
      firstName: values.firstName,
      lastName: values.lastName || undefined,
      phone: values.phone || undefined,
    }
    if (values.password) body.password = values.password
    editMutation.mutate({ id: editTarget.id, body })
  }

  const applyFilters = () => {
    setSearch(searchInput.trim())
    setPage(1)
  }

  const clearFilters = () => {
    setSearch('')
    setSearchInput('')
    setRoleFilter('')
    setPage(1)
  }

  const getInitials = (user: UserProfile): string => {
    const first = user.firstName?.[0] ?? ''
    const last = user.lastName?.[0] ?? ''
    return (first + last).toUpperCase() || 'U'
  }

  const scoreColor = (score: number): string => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 50) return 'text-amber-400'
    return 'text-[rgb(var(--text-muted))]'
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Foydalanuvchilar"
        description="Tizimga ro'yxatdan o'tgan barcha foydalanuvchilar"
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
        <div className="w-44">
          <Select
            value={roleFilter}
            onValueChange={(v) => { setRoleFilter(v === roleFilter ? '' : v); setPage(1) }}
            options={ROLE_OPTIONS}
            placeholder="Rol bo'yicha"
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
          <span className="text-xs text-[rgb(var(--text-faint))]">Faol filtrlar:</span>
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-400 text-xs border border-violet-500/20">
              "{search}"
              <button onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }} className="ml-0.5 hover:text-violet-300">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {roleFilter && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs border border-blue-500/20">
              {roleLabel(roleFilter)}
              <button onClick={() => { setRoleFilter(''); setPage(1) }} className="ml-0.5 hover:text-blue-300">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Result count */}
      {!isLoading && (
        <p className="text-sm text-[rgb(var(--text-muted))]">
          Jami <span className="font-semibold text-[rgb(var(--text))]">{total}</span> ta foydalanuvchi
          {hasFilters && <span className="text-[rgb(var(--text-faint))]"> (filtr bo'yicha)</span>}
        </p>
      )}

      {/* Table */}
      <div className="flex flex-col gap-3">
        <Table className="min-w-[680px]">
          <TableHead>
            <tr>
              <TableHeader className="w-14">ID</TableHeader>
              <TableHeader>Foydalanuvchi</TableHeader>
              <TableHeader className="w-36">Telefon</TableHeader>
              <TableHeader className="w-28">Rol</TableHeader>
              <TableHeader className="w-16">Ball</TableHeader>
              <TableHeader className="w-28">Ro'yxatdan</TableHeader>
              <TableHeader className="w-12 text-right">Amal</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton rows={8} cols={7} />
            ) : isError ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-[rgb(var(--text-muted))]">
                    <Users className="h-8 w-8 text-red-400" />
                    <p>Ma'lumotlarni yuklashda xatolik yuz berdi</p>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-[rgb(var(--text-muted))]">
                    <Users className="h-8 w-8 text-[rgb(var(--text-faint))]" />
                    <p>Ma'lumot topilmadi</p>
                    {hasFilters && (
                      <p className="text-sm text-[rgb(var(--text-faint))]">
                        Filtrlarni o'chirib ko'ring
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-[rgb(var(--text-muted))] font-mono text-xs">#{user.id}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500/30 to-blue-500/30 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-violet-300">{getInitials(user)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-[rgb(var(--text))]">
                          {user.firstName}{user.lastName ? ` ${user.lastName}` : ''}
                        </p>
                        {user.isDemo && <span className="text-xs text-amber-400">Demo</span>}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-[rgb(var(--text-muted))]">{user.phone || '—'}</TableCell>

                  <TableCell>
                    <Badge variant={roleBadgeVariant(user.role)}>{roleLabel(user.role)}</Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Star className={`h-3.5 w-3.5 ${scoreColor(user.score ?? 0)}`} />
                      <span className={`font-semibold text-sm ${scoreColor(user.score ?? 0)}`}>
                        {user.score ?? 0}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-[rgb(var(--text-muted))]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(user.createdAt)}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(user)}>
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
        title="Foydalanuvchini tahrirlash"
        size="sm"
      >
        {editTarget && (
          <div className="space-y-4">
            {/* User info header */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgb(var(--bg-elevated))] border border-[rgb(var(--border-subtle))]">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500/30 to-blue-500/30 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-violet-300">{getInitials(editTarget)}</span>
              </div>
              <div>
                <p className="font-medium text-[rgb(var(--text))]">
                  {editTarget.firstName} {editTarget.lastName ?? ''}
                </p>
                <p className="text-xs text-[rgb(var(--text-muted))]">{editTarget.phone}</p>
              </div>
              <Badge variant={roleBadgeVariant(editTarget.role)} className="ml-auto">
                {roleLabel(editTarget.role)}
              </Badge>
            </div>

            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Ism *"
                  placeholder="Ism"
                  error={editForm.formState.errors.firstName?.message}
                  {...editForm.register('firstName', { required: 'Ism kiritish shart' })}
                />
                <Input
                  label="Familiya"
                  placeholder="Familiya"
                  {...editForm.register('lastName')}
                />
              </div>

              <Input
                label="Telefon raqam"
                placeholder="+998901234567"
                {...editForm.register('phone')}
              />

              <div className="relative">
                <Input
                  label="Yangi parol (ixtiyoriy)"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Yangilash uchun kiriting..."
                  {...editForm.register('password', {
                    minLength: { value: 6, message: 'Kamida 6 ta belgi' },
                  })}
                  error={editForm.formState.errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-[34px] text-[rgb(var(--text-faint))] hover:text-[rgb(var(--text-muted))] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={closeEdit}>
                  Bekor qilish
                </Button>
                <Button type="submit" loading={editMutation.isPending}>
                  Saqlash
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  )
}
