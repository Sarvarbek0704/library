import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { CreditCard, Plus, Pencil, Trash2, Clock, BookOpen, Repeat } from 'lucide-react'

import { membershipsApi, type Membership } from '@/api'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { formatCurrency } from '@/lib/utils'

interface MembershipFormValues {
  name: string
  price: string
  durationDays: string
  limitBorrow: string
  limitBook: string
  description: string
}

export default function MembershipsAdmin() {
  const queryClient = useQueryClient()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Membership | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MembershipFormValues>()

  const { data: membershipsRaw, isLoading } = useQuery({
    queryKey: ['admin-memberships'],
    queryFn: () => membershipsApi.list(),
  })

  const memberships: Membership[] = Array.isArray(membershipsRaw) ? membershipsRaw : []

  const createMutation = useMutation({
    mutationFn: (body: Partial<Membership>) => membershipsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-memberships'] })
      toast.success("Membership muvaffaqiyatli qo'shildi")
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<Membership> }) =>
      membershipsApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-memberships'] })
      toast.success('Membership muvaffaqiyatli yangilandi')
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => membershipsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-memberships'] })
      toast.success("Membership o'chirildi")
      setDeleteTarget(null)
    },
    onError: (e: Error) => { toast.error(e.message); setDeleteTarget(null) },
  })

  function openCreate() {
    setEditingMembership(null)
    reset({ name: '', price: '', durationDays: '', limitBorrow: '', limitBook: '', description: '' })
    setModalOpen(true)
  }

  function openEdit(membership: Membership) {
    setEditingMembership(membership)
    reset({
      name: membership.name,
      price: String(membership.price),
      durationDays: String(membership.durationDays),
      limitBorrow: String(membership.limitBorrow),
      limitBook: String(membership.limitBook),
      description: membership.description ?? '',
    })
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingMembership(null)
    reset()
  }

  function onSubmit(values: MembershipFormValues) {
    const body: Partial<Membership> = {
      name: values.name,
      price: Number(values.price),
      durationDays: Number(values.durationDays),
      limitBorrow: Number(values.limitBorrow),
      limitBook: Number(values.limitBook),
      description: values.description || undefined,
    }
    if (editingMembership) {
      updateMutation.mutate({ id: editingMembership.id, body })
    } else {
      createMutation.mutate(body)
    }
  }

  function handleDelete(membership: Membership) {
    setDeleteTarget(membership)
  }

  const isMutating = createMutation.isPending || updateMutation.isPending

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Membershiplar"
        description="Obuna rejalarini boshqarish"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Membership qo'shish
          </Button>
        }
      />

      {/* Cards grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : memberships.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))]">
          <CreditCard className="h-14 w-14 text-[rgb(var(--text-faint))]" />
          <p className="text-[rgb(var(--text-muted))]">Ma'lumot topilmadi</p>
          <Button variant="outline" size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Birinchi membership qo'shish
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {memberships.map((m) => (
            <MembershipCard
              key={m.id}
              membership={m}
              onEdit={() => openEdit(m)}
              onDelete={() => handleDelete(m)}
              isDeleting={deleteMutation.isPending && deleteMutation.variables === m.id}
            />
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Membershipni o'chirish"
        description={`"${deleteTarget?.name}" membershipni o'chirmoqchimisiz?`}
        confirmLabel="O'chirish"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
      />

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingMembership ? 'Membershipni tahrirlash' : "Membership qo'shish"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nomi *"
            placeholder="Masalan: Premium"
            error={errors.name?.message}
            {...register('name', { required: 'Nom kiritish shart' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Narxi (so'm) *"
              type="number"
              min={0}
              placeholder="15000"
              error={errors.price?.message}
              {...register('price', { required: 'Narx kiritish shart', min: { value: 0, message: "0 dan katta bo'lsin" } })}
            />
            <Input
              label="Davomiyligi (kun) *"
              type="number"
              min={1}
              placeholder="30"
              error={errors.durationDays?.message}
              {...register('durationDays', { required: 'Davomiylik shart', min: { value: 1, message: "1 dan katta bo'lsin" } })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Olish limiti *"
              type="number"
              min={1}
              placeholder="3"
              error={errors.limitBorrow?.message}
              {...register('limitBorrow', { required: 'Olish limiti shart', min: { value: 1, message: "1 dan katta bo'lsin" } })}
            />
            <Input
              label="Kitob limiti *"
              type="number"
              min={1}
              placeholder="10"
              error={errors.limitBook?.message}
              {...register('limitBook', { required: 'Kitob limiti shart', min: { value: 1, message: "1 dan katta bo'lsin" } })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[rgb(var(--text-muted))]">Tavsif</label>
            <textarea
              rows={3}
              placeholder="Membership haqida qisqacha..."
              className="w-full rounded-[10px] border border-[rgb(var(--border))] bg-[rgb(var(--bg-elevated))] px-3.5 py-2.5 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-faint))] focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition-colors resize-none"
              {...register('description')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Bekor qilish</Button>
            <Button type="submit" loading={isMutating}>
              {editingMembership ? 'Saqlash' : "Qo'shish"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

interface MembershipCardProps {
  membership: Membership
  onEdit: () => void
  onDelete: () => void
  isDeleting: boolean
}

function MembershipCard({ membership: m, onEdit, onDelete, isDeleting }: MembershipCardProps) {
  return (
    <div className="relative flex flex-col rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-5 gap-4 hover:border-[rgb(var(--border))] transition-colors group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500/15 flex items-center justify-center flex-shrink-0">
            <CreditCard className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-[rgb(var(--text))] leading-tight">{m.name}</h3>
            <p className="text-lg font-bold text-violet-400 mt-0.5">{formatCurrency(m.price)}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <StatPill icon={<Clock className="h-3.5 w-3.5" />} label={`${m.durationDays} kun`} />
        <StatPill icon={<Repeat className="h-3.5 w-3.5" />} label={`${m.limitBorrow} olish`} />
        <StatPill icon={<BookOpen className="h-3.5 w-3.5" />} label={`${m.limitBook} kitob`} />
      </div>

      {/* Description */}
      {m.description && (
        <p className="text-sm text-[rgb(var(--text-muted))] leading-relaxed line-clamp-2">
          {m.description}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 mt-auto border-t border-[rgb(var(--border-subtle))]">
        <Button variant="ghost" size="sm" className="flex-1" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
          Tahrirlash
        </Button>
        <Button variant="danger" size="sm" className="flex-1" loading={isDeleting} onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
          O'chirish
        </Button>
      </div>
    </div>
  )
}

function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-[rgb(var(--bg-elevated))] px-2.5 py-1.5">
      <span className="text-[rgb(var(--text-faint))]">{icon}</span>
      <span className="text-xs text-[rgb(var(--text-muted))] font-medium truncate">{label}</span>
    </div>
  )
}

