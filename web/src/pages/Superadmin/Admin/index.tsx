import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Plus, Trash2, ShieldCheck, Pencil, Search, X } from 'lucide-react'
import { http, usersApi } from '@/api'
import type { UserProfile } from '@/api'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

type CreateForm = { firstName: string; lastName: string; phone: string; password: string }
type EditForm = { firstName: string; lastName: string; phone: string; password: string }

export default function AdminsPage() {
  const qc = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<UserProfile | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserProfile | null>(null)
  const [showCreatePwd, setShowCreatePwd] = useState(false)
  const [showEditPwd, setShowEditPwd] = useState(false)
  const [search, setSearch] = useState('')
  const [page] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['superadmin-admins', page],
    queryFn: () => usersApi.list(page, 100, undefined, 'ADMIN'),
  })

  const allAdmins = data?.data ?? []
  const admins = search
    ? allAdmins.filter((u) => {
        const q = search.toLowerCase()
        return (
          u.firstName?.toLowerCase().includes(q) ||
          u.lastName?.toLowerCase().includes(q) ||
          u.phone?.includes(q)
        )
      })
    : allAdmins

  const createForm = useForm<CreateForm>()
  const editForm = useForm<EditForm>()

  const createMutation = useMutation({
    mutationFn: (body: CreateForm) =>
      http('/api/user', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => {
      toast.success('Admin yaratildi!')
      qc.invalidateQueries({ queryKey: ['superadmin-admins'] })
      setCreateOpen(false)
      createForm.reset()
      setShowCreatePwd(false)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const editMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<EditForm> }) =>
      http(`/api/user/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    onSuccess: () => {
      toast.success('Admin yangilandi!')
      qc.invalidateQueries({ queryKey: ['superadmin-admins'] })
      setEditTarget(null)
      editForm.reset()
      setShowEditPwd(false)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => http(`/api/user/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success("O'chirildi!")
      qc.invalidateQueries({ queryKey: ['superadmin-admins'] })
      setDeleteTarget(null)
    },
    onError: (e: Error) => { toast.error(e.message); setDeleteTarget(null) },
  })

  function openEdit(user: UserProfile) {
    setEditTarget(user)
    setShowEditPwd(false)
    editForm.reset({ firstName: user.firstName, lastName: user.lastName ?? '', phone: user.phone, password: '' })
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

  return (
    <div className="animate-in space-y-6">
      <PageHeader
        title="Adminlarni boshqarish"
        description="Tizim adminlarini ko'rish va boshqarish"
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> Yangi admin
          </Button>
        }
      />

      {/* Search */}
      <div className="flex items-center gap-3 max-w-sm">
        <Input
          placeholder="Ism yoki telefon bo'yicha..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
        {search && (
          <Button variant="ghost" size="sm" onClick={() => setSearch('')}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!isLoading && (
        <p className="text-sm text-[rgb(var(--text-muted))]">
          Jami <span className="font-semibold text-[rgb(var(--text))]">{allAdmins.length}</span> ta admin
          {search && (
            <span> · <span className="text-violet-400">{admins.length}</span> ta ko'rsatilmoqda</span>
          )}
        </p>
      )}

      <Table className="min-w-[500px]">
        <TableHead>
          <tr>
            <TableHeader className="w-14">ID</TableHeader>
            <TableHeader>Admin</TableHeader>
            <TableHeader className="w-36">Telefon</TableHeader>
            <TableHeader className="w-24">Rol</TableHeader>
            <TableHeader className="w-24">Amallar</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={5} cols={5} />
          ) : admins.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <ShieldCheck className="h-10 w-10 text-[rgb(var(--text-faint))]" />
                  <p className="text-sm text-[rgb(var(--text-muted))]">
                    {search ? `"${search}" bo'yicha admin topilmadi` : 'Admin topilmadi'}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            admins.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-[rgb(var(--text-faint))] text-xs font-mono">#{user.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20 text-sm font-bold text-violet-400">
                      {user.firstName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[rgb(var(--text))]">
                        {user.firstName} {user.lastName ?? ''}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-[rgb(var(--text-muted))]">{user.phone}</TableCell>
                <TableCell>
                  <Badge variant="info">ADMIN</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(user)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="danger" size="icon" onClick={() => setDeleteTarget(user)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); createForm.reset(); setShowCreatePwd(false) }}
        title="Yangi admin yaratish"
        size="sm"
      >
        <form onSubmit={createForm.handleSubmit((v) => createMutation.mutate(v))} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Ism *"
              placeholder="Ism"
              error={createForm.formState.errors.firstName?.message}
              {...createForm.register('firstName', { required: 'Ism kiritish shart', minLength: { value: 2, message: 'Kamida 2 ta belgi' } })}
            />
            <Input
              label="Familiya *"
              placeholder="Familiya"
              error={createForm.formState.errors.lastName?.message}
              {...createForm.register('lastName', { required: 'Familiya kiritish shart', minLength: { value: 2, message: 'Kamida 2 ta belgi' } })}
            />
          </div>
          <Input
            label="Telefon *"
            type="tel"
            placeholder="+998901234567"
            error={createForm.formState.errors.phone?.message}
            {...createForm.register('phone', { required: 'Telefon kiritish shart' })}
          />
          <div className="relative">
            <Input
              label="Parol *"
              type={showCreatePwd ? 'text' : 'password'}
              placeholder="Kamida 6 ta belgi"
              error={createForm.formState.errors.password?.message}
              {...createForm.register('password', { required: 'Parol kiritish shart', minLength: { value: 6, message: 'Kamida 6 ta belgi' } })}
            />
            <button
              type="button"
              onClick={() => setShowCreatePwd((v) => !v)}
              className="absolute right-3 top-[34px] text-[rgb(var(--text-faint))] hover:text-[rgb(var(--text-muted))] transition-colors"
              tabIndex={-1}
            >
              {showCreatePwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex gap-3 mt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => { setCreateOpen(false); createForm.reset() }}>
              Bekor
            </Button>
            <Button type="submit" className="flex-1" loading={createMutation.isPending}>
              Yaratish
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editTarget}
        onClose={() => { setEditTarget(null); editForm.reset(); setShowEditPwd(false) }}
        title="Adminni tahrirlash"
        size="sm"
      >
        {editTarget && (
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="flex flex-col gap-4">
            {/* Header info */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgb(var(--bg-elevated))] border border-[rgb(var(--border-subtle))]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20 text-sm font-bold text-violet-400 flex-shrink-0">
                {editTarget.firstName?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-[rgb(var(--text))]">{editTarget.firstName} {editTarget.lastName ?? ''}</p>
                <p className="text-xs text-[rgb(var(--text-muted))]">{editTarget.phone}</p>
              </div>
              <Badge variant="info" className="ml-auto">ADMIN</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Ism *"
                placeholder="Ism"
                error={editForm.formState.errors.firstName?.message}
                {...editForm.register('firstName', { required: 'Ism kiritish shart', minLength: { value: 2, message: 'Kamida 2 ta belgi' } })}
              />
              <Input
                label="Familiya"
                placeholder="Familiya"
                {...editForm.register('lastName')}
              />
            </div>

            <Input
              label="Telefon raqam"
              type="tel"
              placeholder="+998901234567"
              {...editForm.register('phone')}
            />

            <div className="relative">
              <Input
                label="Yangi parol (ixtiyoriy)"
                type={showEditPwd ? 'text' : 'password'}
                placeholder="Yangilash uchun kiriting..."
                error={editForm.formState.errors.password?.message}
                {...editForm.register('password', {
                  minLength: { value: 6, message: 'Kamida 6 ta belgi' },
                })}
              />
              <button
                type="button"
                onClick={() => setShowEditPwd((v) => !v)}
                className="absolute right-3 top-[34px] text-[rgb(var(--text-faint))] hover:text-[rgb(var(--text-muted))] transition-colors"
                tabIndex={-1}
              >
                {showEditPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex gap-3 mt-1">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => { setEditTarget(null); editForm.reset(); setShowEditPwd(false) }}
              >
                Bekor
              </Button>
              <Button type="submit" className="flex-1" loading={editMutation.isPending}>
                Saqlash
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Adminni o'chirish"
        description={`"${deleteTarget?.firstName} ${deleteTarget?.lastName ?? ''}" adminni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.`}
        confirmLabel="O'chirish"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
