import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  Building2, Search, Plus, Pencil, Trash2, MapPin, Phone,
  Navigation, ExternalLink, X, Map as MapIcon,
} from 'lucide-react'

import { librariesApi, type Library } from '@/api'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/skeleton'

interface LibraryFormValues {
  name: string
  address: string
  contact: string
  lat: string
  lon: string
}

export default function LibrariesAdmin() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLibrary, setEditingLibrary] = useState<Library | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Library | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)

  const {
    register, handleSubmit, reset, formState: { errors }, setValue, watch,
  } = useForm<LibraryFormValues>()

  const watchLat = watch('lat')
  const watchLon = watch('lon')

  const { data: librariesRaw, isLoading } = useQuery({
    queryKey: ['admin-libraries'],
    queryFn: () => librariesApi.list(),
  })

  const libraries: Library[] = Array.isArray(librariesRaw) ? librariesRaw : []

  const filtered = search
    ? libraries.filter(
        (l) =>
          l.name.toLowerCase().includes(search.toLowerCase()) ||
          (l.address ?? '').toLowerCase().includes(search.toLowerCase()) ||
          (l.contact ?? '').toLowerCase().includes(search.toLowerCase()),
      )
    : libraries

  const createMutation = useMutation({
    mutationFn: (body: Partial<Library>) => librariesApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-libraries'] })
      queryClient.invalidateQueries({ queryKey: ['libraries-list'] })
      toast.success("Kutubxona muvaffaqiyatli qo'shildi")
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<Library> }) =>
      librariesApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-libraries'] })
      queryClient.invalidateQueries({ queryKey: ['libraries-list'] })
      toast.success('Kutubxona muvaffaqiyatli yangilandi')
      closeModal()
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => librariesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-libraries'] })
      queryClient.invalidateQueries({ queryKey: ['libraries-list'] })
      toast.success("Kutubxona o'chirildi")
      setDeleteTarget(null)
    },
    onError: (e: Error) => { toast.error(e.message); setDeleteTarget(null) },
  })

  function openCreate() {
    setEditingLibrary(null)
    reset({ name: '', address: '', contact: '', lat: '', lon: '' })
    setModalOpen(true)
  }

  function openEdit(library: Library) {
    setEditingLibrary(library)
    reset({
      name: library.name,
      address: library.address ?? '',
      contact: library.contact ?? '',
      lat: library.lat != null ? String(library.lat) : '',
      lon: library.lon != null ? String(library.lon) : '',
    })
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingLibrary(null)
    reset()
  }

  function getMyLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation qo'llab-quvvatlanmaydi")
      return
    }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue('lat', pos.coords.latitude.toFixed(6))
        setValue('lon', pos.coords.longitude.toFixed(6))
        setGeoLoading(false)
        toast.success('Joylashuv muvaffaqiyatli aniqlandi!')
      },
      () => {
        toast.error("Joylashuvni aniqlab bo'lmadi. Ruxsat bering.")
        setGeoLoading(false)
      },
    )
  }

  function onSubmit(values: LibraryFormValues) {
    const body: Partial<Library> = {
      name: values.name,
      address: values.address || undefined,
      contact: values.contact || undefined,
      lat: values.lat && !isNaN(parseFloat(values.lat)) ? parseFloat(values.lat) : undefined,
      lon: values.lon && !isNaN(parseFloat(values.lon)) ? parseFloat(values.lon) : undefined,
    }
    if (editingLibrary) updateMutation.mutate({ id: editingLibrary.id, body })
    else createMutation.mutate(body)
  }

  const isMutating = createMutation.isPending || updateMutation.isPending

  const parsedLat = watchLat ? parseFloat(watchLat) : NaN
  const parsedLon = watchLon ? parseFloat(watchLon) : NaN
  const hasValidCoords = !isNaN(parsedLat) && !isNaN(parsedLon) && watchLat && watchLon

  const mapPreviewUrl = hasValidCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${parsedLon - 0.005},${parsedLat - 0.005},${parsedLon + 0.005},${parsedLat + 0.005}&layer=mapnik&marker=${parsedLat},${parsedLon}`
    : null

  const librariesWithCoords = filtered.filter((l) => l.lat != null && l.lon != null)
  const librariesWithoutCoords = filtered.filter((l) => l.lat == null || l.lon == null)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Kutubxonalar"
        description="Barcha kutubxonalarni boshqarish va joylashuvlarini belgilash"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Kutubxona qo'shish
          </Button>
        }
      />

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Nomi yoki manzil bo'yicha qidiring..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        {search && (
          <Button variant="ghost" size="sm" onClick={() => setSearch('')}>
            <X className="h-4 w-4" /> Tozalash
          </Button>
        )}
      </div>

      {/* Stats row */}
      {!isLoading && (
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-sm text-[rgb(var(--text-muted))]">
            Jami{' '}
            <span className="font-semibold text-[rgb(var(--text))]">{libraries.length}</span> ta kutubxona
            {search && (
              <span>
                {' '}·{' '}
                <span className="text-violet-400 font-medium">{filtered.length}</span> ta natija
              </span>
            )}
          </p>
          {librariesWithCoords.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
              <MapPin className="h-3 w-3" />
              {librariesWithCoords.length} ta lokatsiyasi bor
            </span>
          )}
          {librariesWithoutCoords.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
              {librariesWithoutCoords.length} ta lokatsiyasiz
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="flex flex-col gap-3">
        <Table className="min-w-[620px]">
          <TableHead>
            <tr>
              <TableHeader className="w-14">ID</TableHeader>
              <TableHeader>Nomi</TableHeader>
              <TableHeader className="w-48">Manzil</TableHeader>
              <TableHeader className="w-32">Telefon</TableHeader>
              <TableHeader className="w-24">Lokatsiya</TableHeader>
              <TableHeader className="w-20 text-right">Amallar</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton rows={6} cols={6} />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Building2 className="h-12 w-12 text-[rgb(var(--text-faint))]" />
                    <p className="text-[rgb(var(--text-muted))]">
                      {search ? `"${search}" bo'yicha kutubxona topilmadi` : "Ma'lumot topilmadi"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((library) => {
                const hasCoords = library.lat != null && library.lon != null
                return (
                  <TableRow key={library.id}>
                    <TableCell className="text-[rgb(var(--text-faint))] font-mono text-xs">
                      #{library.id}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-4 w-4 text-violet-400" />
                        </div>
                        <span className="font-semibold text-[rgb(var(--text))]">{library.name}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {library.address ? (
                        <div className="flex items-center gap-1.5 text-[rgb(var(--text-muted))]">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-violet-400" />
                          <span className="text-sm">{library.address}</span>
                        </div>
                      ) : (
                        <span className="text-[rgb(var(--text-faint))]">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {library.contact ? (
                        <div className="flex items-center gap-1.5 text-[rgb(var(--text-muted))]">
                          <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="text-sm">{library.contact}</span>
                        </div>
                      ) : (
                        <span className="text-[rgb(var(--text-faint))]">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {hasCoords ? (
                        <a
                          href={`https://www.google.com/maps?q=${library.lat},${library.lon}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="secondary" size="sm" className="gap-1.5">
                            <MapIcon className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Xaritada ko'rish</span>
                            <ExternalLink className="h-3 w-3 text-emerald-400 opacity-60" />
                          </Button>
                        </a>
                      ) : (
                        <span className="text-xs text-[rgb(var(--text-faint))] italic">Belgilanmagan</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(library)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="icon"
                          onClick={() => setDeleteTarget(library)}
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
      </div>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Kutubxonani o'chirish"
        description={`"${deleteTarget?.name}" kutubxonasini o'chirmoqchimisiz?`}
        confirmLabel="O'chirish"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingLibrary ? 'Kutubxonani tahrirlash' : "Kutubxona qo'shish"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nomi *"
            placeholder="Masalan: Alisher Navoiy kutubxonasi"
            error={errors.name?.message}
            {...register('name', { required: 'Nom kiritish shart' })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Manzil"
              placeholder="Ko'cha, tuman, viloyat..."
              leftIcon={<MapPin className="h-4 w-4" />}
              {...register('address')}
            />
            <Input
              label="Telefon / Aloqa"
              placeholder="+998 XX XXX XX XX"
              leftIcon={<Phone className="h-4 w-4" />}
              {...register('contact')}
            />
          </div>

          {/* Location section */}
          <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-elevated))] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[rgb(var(--text))]">GPS Joylashuv</p>
                <p className="text-xs text-[rgb(var(--text-faint))]">Xaritada ko'rsatish uchun koordinatalarni kiriting</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={getMyLocation}
                loading={geoLoading}
              >
                <Navigation className="h-3.5 w-3.5" />
                Mening joylashuvim
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Kenglik (Latitude)"
                placeholder="41.299496"
                {...register('lat', {
                  validate: (v) => !v || !isNaN(parseFloat(v)) || "To'g'ri son kiriting",
                })}
                error={errors.lat?.message}
              />
              <Input
                label="Uzunlik (Longitude)"
                placeholder="69.240073"
                {...register('lon', {
                  validate: (v) => !v || !isNaN(parseFloat(v)) || "To'g'ri son kiriting",
                })}
                error={errors.lon?.message}
              />
            </div>

            {/* Map preview */}
            {mapPreviewUrl && (
              <div className="space-y-1.5">
                <p className="text-xs text-[rgb(var(--text-faint))]">Ko'rinish (OpenStreetMap)</p>
                <iframe
                  src={mapPreviewUrl}
                  className="w-full h-44 rounded-xl border border-[rgb(var(--border))]"
                  title="Lokatsiya ko'rinishi"
                  loading="lazy"
                />
                <a
                  href={`https://www.google.com/maps?q=${parsedLat},${parsedLon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Google Mapsda ko'rish
                </a>
              </div>
            )}

            {watchLat && watchLon && !hasValidCoords && (
              <p className="text-xs text-red-400">Noto'g'ri koordinatalar</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Bekor qilish
            </Button>
            <Button type="submit" loading={isMutating}>
              {editingLibrary ? 'Saqlash' : "Qo'shish"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
