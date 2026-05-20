import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BookOpen, Search, Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react'

import {
  booksApi,
  authorsApi,
  categoriesApi,
  librariesApi,
  type Book,
  type Author,
  type Category,
  type Library,
} from '@/api'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Badge, statusBadgeVariant } from '@/components/ui/badge'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/skeleton'
import { statusLabel } from '@/lib/utils'

interface BookFormValues {
  title: string
  authorId: string
  categoryId: string
  libraryId: string
  description: string
  pages: string
  quantity: string
  status: string
}

const BOOK_STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Mavjud' },
  { value: 'NOTAVAILABLE', label: 'Mavjud emas' },
  { value: 'BOOKED', label: 'Band qilingan' },
  { value: 'BORROWED', label: 'Olingan' },
]

const LIMIT = 15

export default function BooksAdmin() {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterAuthor, setFilterAuthor] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<BookFormValues>()

  // Queries
  const { data: booksData, isLoading: booksLoading } = useQuery({
    queryKey: ['admin-books', page, search, filterCategory, filterAuthor],
    queryFn: () =>
      booksApi.list({
        page,
        limit: LIMIT,
        ...(search ? { search } : {}),
        ...(filterCategory ? { categoryId: Number(filterCategory) } : {}),
        ...(filterAuthor ? { authorId: Number(filterAuthor) } : {}),
      }),
  })

  const { data: authorsData } = useQuery({
    queryKey: ['authors-list'],
    queryFn: () => authorsApi.list(1, 100),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories-list'],
    queryFn: () => categoriesApi.list(),
  })

  const { data: librariesData } = useQuery({
    queryKey: ['libraries-list'],
    queryFn: () => librariesApi.list(),
  })

  const books: Book[] = booksData?.data ?? []
  const total: number = booksData?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  const authors: Author[] = authorsData?.data ?? []
  const categories: Category[] = Array.isArray(categoriesData) ? categoriesData : []
  const libraries: Library[] = Array.isArray(librariesData) ? librariesData : []

  // Mutations
  const createMutation = useMutation({
    mutationFn: (fd: FormData) => booksApi.create(fd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] })
      toast.success("Kitob muvaffaqiyatli qo'shildi")
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, fd }: { id: number; fd: FormData }) => booksApi.update(id, fd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] })
      toast.success('Kitob muvaffaqiyatli yangilandi')
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => booksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] })
      toast.success("Kitob o'chirildi")
      setDeleteTarget(null)
    },
    onError: (e: Error) => {
      toast.error(e.message)
      setDeleteTarget(null)
    },
  })

  function openCreate() {
    setEditingBook(null)
    setImageFile(null)
    setImagePreview(null)
    reset({ title: '', authorId: '', categoryId: '', libraryId: '', description: '', pages: '', quantity: '', status: 'AVAILABLE' })
    setModalOpen(true)
  }

  function openEdit(book: Book) {
    setEditingBook(book)
    setImageFile(null)
    const imgPath = book.images?.[0]?.url ?? book.images?.[0]?.path
    setImagePreview(imgPath ?? null)
    reset({
      title: book.title,
      authorId: String(book.authorId),
      categoryId: String(book.categoryId),
      libraryId: String(book.libraryId),
      description: book.description ?? '',
      pages: String(book.pages ?? ''),
      quantity: String(book.quantity ?? ''),
      status: book.status ?? 'AVAILABLE',
    })
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingBook(null)
    setImageFile(null)
    setImagePreview(null)
    reset()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function onSubmit(values: BookFormValues) {
    const fd = new FormData()
    fd.append('title', values.title)
    fd.append('authorId', values.authorId)
    fd.append('categoryId', values.categoryId)
    fd.append('libraryId', values.libraryId)
    fd.append('status', values.status || 'AVAILABLE')
    if (values.description) fd.append('description', values.description)
    if (values.pages) fd.append('page', values.pages)
    if (values.quantity) fd.append('quantity', values.quantity)
    if (imageFile) fd.append('avatar', imageFile)

    if (editingBook) {
      updateMutation.mutate({ id: editingBook.id, fd })
    } else {
      createMutation.mutate(fd)
    }
  }

  function handleDelete(book: Book) {
    setDeleteTarget(book)
  }

  const isMutating = createMutation.isPending || updateMutation.isPending

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Kitoblar"
        description="Barcha kitoblarni boshqarish"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Kitob qo'shish
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="w-64">
          <Input
            placeholder="Kitob qidirish..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="w-48">
          <Select
            placeholder="Kategoriya"
            value={filterCategory}
            onValueChange={(v) => { setFilterCategory(v === '__all__' ? '' : v); setPage(1) }}
            options={[
              { value: '__all__', label: 'Barchasi' },
              ...categories.map((c) => ({ value: String(c.id), label: c.name })),
            ]}
          />
        </div>
        <div className="w-48">
          <Select
            placeholder="Muallif"
            value={filterAuthor}
            onValueChange={(v) => { setFilterAuthor(v === '__all__' ? '' : v); setPage(1) }}
            options={[
              { value: '__all__', label: 'Barchasi' },
              ...authors.map((a) => ({ value: String(a.id), label: a.name })),
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <Table className="min-w-[680px]">
        <TableHead>
          <tr>
            <TableHeader className="w-14">Muqova</TableHeader>
            <TableHeader>Sarlavha</TableHeader>
            <TableHeader className="w-28">Muallif</TableHeader>
            <TableHeader className="w-28">Kategoriya</TableHeader>
            <TableHeader className="w-24">Holat</TableHeader>
            <TableHeader className="w-16">Miqdor</TableHeader>
            <TableHeader className="w-20 text-right">Amallar</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {booksLoading ? (
            <TableSkeleton rows={8} cols={7} />
          ) : books.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <BookOpen className="h-12 w-12 text-[rgb(var(--text-faint))]" />
                  <p className="text-[rgb(var(--text-muted))]">Ma'lumot topilmadi</p>
                </div>
              </td>
            </tr>
          ) : (
            books.map((book) => {
              const imgSrc = book.images?.[0]?.url ?? book.images?.[0]?.path ?? null
              const authorName = book.author?.name ?? authors.find((a) => a.id === book.authorId)?.name ?? '—'
              const categoryName = book.category?.name ?? categories.find((c) => c.id === book.categoryId)?.name ?? '—'
              return (
                <TableRow key={book.id}>
                  <TableCell>
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={book.title}
                        className="h-10 w-8 rounded object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <div className="h-10 w-8 rounded bg-[rgb(var(--bg-elevated))] flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-[rgb(var(--text-faint))]" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-[rgb(var(--text))] line-clamp-2">{book.title}</span>
                  </TableCell>
                  <TableCell className="text-[rgb(var(--text-muted))] truncate">{authorName}</TableCell>
                  <TableCell className="text-[rgb(var(--text-muted))] truncate">{categoryName}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(book.status)}>{statusLabel(book.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-[rgb(var(--text-muted))]">{book.quantity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(book)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="icon"
                        onClick={() => handleDelete(book)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[rgb(var(--text-muted))]">
            Jami {total} ta kitob
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Oldingi
            </Button>
            <span className="text-sm text-[rgb(var(--text-muted))]">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Keyingi
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Kitobni o'chirish"
        description={`"${deleteTarget?.title}" kitobini o'chirmoqchimisiz?`}
        confirmLabel="O'chirish"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingBook ? 'Kitobni tahrirlash' : "Kitob qo'shish"}
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Sarlavha *"
            placeholder="Kitob nomi"
            error={errors.title?.message}
            {...register('title', { required: 'Sarlavha kiritish shart' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="authorId"
              control={control}
              rules={{ required: 'Muallif tanlang' }}
              render={({ field }) => (
                <div>
                  <Select
                    label="Muallif *"
                    placeholder="Muallif tanlang"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={authors.map((a) => ({ value: String(a.id), label: a.name }))}
                  />
                  {errors.authorId && <p className="mt-1 text-xs text-red-400">{errors.authorId.message}</p>}
                </div>
              )}
            />

            <Controller
              name="categoryId"
              control={control}
              rules={{ required: 'Kategoriya tanlang' }}
              render={({ field }) => (
                <div>
                  <Select
                    label="Kategoriya *"
                    placeholder="Kategoriya tanlang"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
                  />
                  {errors.categoryId && <p className="mt-1 text-xs text-red-400">{errors.categoryId.message}</p>}
                </div>
              )}
            />
          </div>

          <Controller
            name="libraryId"
            control={control}
            rules={{ required: 'Kutubxona tanlang' }}
            render={({ field }) => (
              <div>
                <Select
                  label="Kutubxona *"
                  placeholder="Kutubxona tanlang"
                  value={field.value}
                  onValueChange={field.onChange}
                  options={libraries.map((l) => ({ value: String(l.id), label: l.name }))}
                />
                {errors.libraryId && <p className="mt-1 text-xs text-red-400">{errors.libraryId.message}</p>}
              </div>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Sahifalar soni"
              type="number"
              min={1}
              placeholder="300"
              {...register('pages')}
            />
            <Input
              label="Miqdori"
              type="number"
              min={0}
              placeholder="10"
              {...register('quantity')}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  label="Holat"
                  value={field.value}
                  onValueChange={field.onChange}
                  options={BOOK_STATUS_OPTIONS}
                  placeholder="Holat"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[rgb(var(--text-muted))]">Tavsif</label>
            <textarea
              rows={3}
              placeholder="Kitob haqida qisqacha..."
              className="w-full rounded-[10px] border border-[rgb(var(--border))] bg-[rgb(var(--bg-elevated))] px-3.5 py-2.5 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-faint))] focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition-colors resize-none"
              {...register('description')}
            />
          </div>

          {/* Image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[rgb(var(--text-muted))]">Muqova rasmi</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="h-20 w-14 rounded-lg object-cover border border-[rgb(var(--border))]" />
              ) : (
                <div className="h-20 w-14 rounded-lg bg-[rgb(var(--bg-elevated))] border border-[rgb(var(--border-subtle))] flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-[rgb(var(--text-faint))]" />
                </div>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  Rasm tanlash
                </Button>
                <p className="mt-1 text-xs text-[rgb(var(--text-faint))]">JPG/PNG, max 5MB</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Bekor qilish</Button>
            <Button type="submit" loading={isMutating}>
              {editingBook ? 'Saqlash' : "Qo'shish"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
