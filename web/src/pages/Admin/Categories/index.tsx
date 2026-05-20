import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Tag, Search, Plus, Pencil, Trash2 } from 'lucide-react'

import { categoriesApi, type Category } from '@/api'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/skeleton'

interface CategoryFormValues {
  name: string
}

export default function CategoriesAdmin() {
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>()

  const { data: categoriesRaw, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoriesApi.list(),
  })

  const categories: Category[] = Array.isArray(categoriesRaw) ? categoriesRaw : []

  const filtered = search
    ? categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : categories

  const createMutation = useMutation({
    mutationFn: (body: { name: string }) => categoriesApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories-list'] })
      toast.success("Kategoriya muvaffaqiyatli qo'shildi")
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: { name: string } }) =>
      categoriesApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories-list'] })
      toast.success('Kategoriya muvaffaqiyatli yangilandi')
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories-list'] })
      toast.success("Kategoriya o'chirildi")
      setDeleteTarget(null)
    },
    onError: (e: Error) => {
      toast.error(e.message)
      setDeleteTarget(null)
    },
  })

  function openCreate() {
    setEditingCategory(null)
    reset({ name: '' })
    setModalOpen(true)
  }

  function openEdit(category: Category) {
    setEditingCategory(category)
    reset({ name: category.name })
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingCategory(null)
    reset()
  }

  function onSubmit(values: CategoryFormValues) {
    const body = { name: values.name }
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, body })
    } else {
      createMutation.mutate(body)
    }
  }

  function handleDelete(category: Category) {
    setDeleteTarget(category)
  }

  const isMutating = createMutation.isPending || updateMutation.isPending

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Kategoriyalar"
        description="Barcha kategoriyalarni boshqarish"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Kategoriya qo'shish
          </Button>
        }
      />

      {/* Search */}
      <div className="w-64">
        <Input
          placeholder="Kategoriya qidirish..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <Table className="min-w-[400px]">
        <TableHead>
          <tr>
            <TableHeader className="w-16">ID</TableHeader>
            <TableHeader>Nomi</TableHeader>
            <TableHeader className="w-24 text-right">Amallar</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={8} cols={3} />
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan={3}>
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Tag className="h-12 w-12 text-[rgb(var(--text-faint))]" />
                  <p className="text-[rgb(var(--text-muted))]">Ma'lumot topilmadi</p>
                </div>
              </td>
            </tr>
          ) : (
            filtered.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="text-[rgb(var(--text-faint))] font-mono text-xs w-16">
                  #{category.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                      <Tag className="h-4 w-4 text-violet-400" />
                    </div>
                    <span className="font-medium text-[rgb(var(--text))]">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="icon"
                      onClick={() => handleDelete(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Count footer */}
      {!isLoading && categories.length > 0 && (
        <p className="text-sm text-[rgb(var(--text-muted))]">
          Jami {categories.length} ta kategoriya
          {filtered.length !== categories.length && `, ${filtered.length} ta ko'rsatilmoqda`}
        </p>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Kategoriyani o'chirish"
        description={`"${deleteTarget?.name}" kategoriyasini o'chirmoqchimisiz?`}
        confirmLabel="O'chirish"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
      />

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Kategoriyani tahrirlash' : "Kategoriya qo'shish"}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nomi *"
            placeholder="Masalan: Fantastika"
            error={errors.name?.message}
            {...register('name', { required: 'Nom kiritish shart' })}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Bekor qilish</Button>
            <Button type="submit" loading={isMutating}>
              {editingCategory ? 'Saqlash' : "Qo'shish"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
