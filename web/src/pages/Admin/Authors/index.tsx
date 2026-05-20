import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { UserRound, Search, Plus, Pencil, Trash2, Image as ImageIcon, X } from 'lucide-react'

import { authorsApi, type Author } from '@/api'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/skeleton'

interface AuthorFormValues { name: string; desc: string }
const LIMIT = 20

function Pagination({ page, total, limit, onPageChange }: { page: number; total: number; limit: number; onPageChange: (p: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-1 pt-4">
      <p className="text-sm text-[rgb(var(--text-muted))]">{(page - 1) * limit + 1}–{Math.min(page * limit, total)} / {total} ta</p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>← Oldingi</Button>
        <span className="text-sm text-[rgb(var(--text-muted))]">{page} / {totalPages}</span>
        <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Keyingi →</Button>
      </div>
    </div>
  )
}

export default function AuthorsAdmin() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Author | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AuthorFormValues>()

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-authors', page],
    queryFn: () => authorsApi.list(page, LIMIT),
    placeholderData: (prev) => prev,
  })

  const allAuthors: Author[] = data?.data ?? []
  const total: number = data?.total ?? 0

  const filteredAuthors = search
    ? allAuthors.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    : allAuthors

  const createMutation = useMutation({
    mutationFn: (fd: FormData) => authorsApi.create(fd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-authors'] })
      queryClient.invalidateQueries({ queryKey: ['authors-list'] })
      toast.success("Muallif muvaffaqiyatli qo'shildi")
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, fd }: { id: number; fd: FormData }) => authorsApi.update(id, fd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-authors'] })
      queryClient.invalidateQueries({ queryKey: ['authors-list'] })
      toast.success('Muallif muvaffaqiyatli yangilandi')
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => authorsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-authors'] })
      toast.success("Muallif o'chirildi")
      setDeleteTarget(null)
    },
    onError: (e: Error) => { toast.error(e.message); setDeleteTarget(null) },
  })

  function openCreate() {
    setEditingAuthor(null); setImageFile(null); setImagePreview(null)
    reset({ name: '', desc: '' }); setModalOpen(true)
  }

  function openEdit(author: Author) {
    setEditingAuthor(author); setImageFile(null)
    setImagePreview(author.images?.[0]?.url ?? null)
    reset({ name: author.name, desc: author.desc ?? '' }); setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false); setEditingAuthor(null)
    setImageFile(null); setImagePreview(null); reset()
  }

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function onSubmit(values: AuthorFormValues) {
    const fd = new FormData()
    fd.append('name', values.name)
    if (values.desc) fd.append('desc', values.desc)
    if (imageFile) fd.append('avatar', imageFile)

    if (editingAuthor) updateMutation.mutate({ id: editingAuthor.id, fd })
    else createMutation.mutate(fd)
  }

  const handleSearch = () => { setSearch(searchInput.trim()); setPage(1) }
  const handleClear = () => { setSearch(''); setSearchInput(''); setPage(1) }
  const isMutating = createMutation.isPending || updateMutation.isPending

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mualliflar"
        description="Barcha mualliflarni boshqarish"
        action={<Button onClick={openCreate}><Plus className="h-4 w-4" />Muallif qo'shish</Button>}
      />

      {/* Filter bar */}
      <div className="flex items-center gap-3 max-w-lg">
        <Input
          placeholder="Muallif ismi bo'yicha qidiring..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} loading={isFetching && !isLoading}>Qidirish</Button>
        {search && <Button variant="ghost" onClick={handleClear}>Tozalash</Button>}
      </div>

      {!isLoading && (
        <p className="text-sm text-[rgb(var(--text-muted))]">
          Jami <span className="font-semibold text-[rgb(var(--text))]">{total}</span> ta muallif
          {search && <span> · "<span className="text-violet-400">{search}</span>" bo'yicha {filteredAuthors.length} ta natija</span>}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <Table className="min-w-[500px]">
          <TableHead>
            <tr>
              <TableHeader className="w-14">ID</TableHeader>
              <TableHeader className="w-48">Muallif</TableHeader>
              <TableHeader>Tavsif</TableHeader>
              <TableHeader className="w-20">Kitoblar</TableHeader>
              <TableHeader className="w-20 text-right">Amallar</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton rows={8} cols={5} />
            ) : filteredAuthors.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-[rgb(var(--text-muted))]">
                    <UserRound className="h-8 w-8 text-[rgb(var(--text-faint))]" />
                    <p>Muallif topilmadi</p>
                    {search && <p className="text-sm">"<span className="text-violet-400">{search}</span>" bo'yicha hech narsa topilmadi</p>}
                  </div>
                </td>
              </tr>
            ) : (
              filteredAuthors.map((author) => (
                <TableRow key={author.id}>
                  <TableCell className="text-[rgb(var(--text-faint))] font-mono text-xs">#{author.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {author.images?.[0]?.url ? (
                        <img src={author.images[0].url} alt={author.name} className="h-10 w-10 rounded-full object-cover flex-shrink-0 border border-[rgb(var(--border))]" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                          <UserRound className="h-5 w-5 text-violet-400" />
                        </div>
                      )}
                      <span className="font-semibold text-[rgb(var(--text))]">{author.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[rgb(var(--text-muted))] max-w-xs">
                    <p className="line-clamp-2 text-sm">{author.desc || '—'}</p>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-xs font-medium">
                      {(author as any).books?.length ?? 0} ta kitob
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(author)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="danger" size="icon" onClick={() => setDeleteTarget(author)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {!search && <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Muallifni o'chirish"
        description={`"${deleteTarget?.name}" muallifini o'chirmoqchimisiz? Avval muallifning barcha kitoblarini o'chirish kerak.`}
        confirmLabel="O'chirish"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
      />

      <Modal open={modalOpen} onClose={closeModal} title={editingAuthor ? 'Muallifni tahrirlash' : "Muallif qo'shish"} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image picker */}
          <div className="flex items-center gap-4">
            <div
              className="h-20 w-20 rounded-full border-2 border-dashed border-[rgb(var(--border))] flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0 hover:border-violet-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-8 w-8 text-[rgb(var(--text-faint))]" />
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onImageChange} />
            <div className="flex flex-col gap-1.5">
              <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="h-3.5 w-3.5" />
                {imagePreview ? "Rasmni o'zgartirish" : 'Rasm yuklash'}
              </Button>
              {imageFile && (
                <Button type="button" variant="ghost" size="sm" onClick={() => { setImageFile(null); setImagePreview(editingAuthor?.images?.[0]?.url ?? null) }}>
                  <X className="h-3.5 w-3.5" />Bekor qilish
                </Button>
              )}
              <p className="text-xs text-[rgb(var(--text-faint))]">JPG, PNG, WEBP · Ixtiyoriy</p>
            </div>
          </div>

          <Input
            label="Ismi *"
            placeholder="Masalan: Leo Tolstoy"
            error={errors.name?.message}
            {...register('name', { required: 'Ism kiritish shart', minLength: { value: 2, message: 'Kamida 2 ta harf' } })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[rgb(var(--text-muted))]">Tavsif (ixtiyoriy)</label>
            <textarea
              placeholder="Muallif haqida qisqacha ma'lumot..."
              rows={3}
              {...register('desc')}
              className="w-full rounded-[10px] border border-[rgb(var(--border))] bg-[rgb(var(--bg-elevated))] px-3.5 py-2.5 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-faint))] focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Bekor qilish</Button>
            <Button type="submit" loading={isMutating}>{editingAuthor ? 'Saqlash' : "Qo'shish"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
