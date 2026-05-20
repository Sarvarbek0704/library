import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { booksApi, categoriesApi, authorsApi } from '@/api'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge, statusBadgeVariant } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { statusLabel } from '@/lib/utils'
import { Search, BookOpen, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'

const LIMIT = 18

export default function Books() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [authorId, setAuthorId] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)

  const params = {
    page, limit: LIMIT,
    ...(search && { search }),
    ...(categoryId && { categoryId: Number(categoryId) }),
    ...(authorId && { authorId: Number(authorId) }),
  }

  const { data, isLoading } = useQuery({
    queryKey: ['books', params],
    queryFn: () => booksApi.list(params),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
  })

  const { data: authorsData } = useQuery({
    queryKey: ['authors-select'],
    queryFn: () => authorsApi.list(1, 100),
  })

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0

  function handleSearch(val: string) {
    setSearch(val)
    setPage(1)
  }

  const books = data?.data ?? []

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--text))]">Kitoblar</h1>
          <p className="text-sm text-[rgb(var(--text-muted))]">
            {data ? `Jami ${data.total} ta kitob` : 'Yuklanmoqda...'}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowFilters(o => !o)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filterlar
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Kitob nomi bo'yicha qidiring..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-4 animate-in">
          <Select
            placeholder="Kategoriya tanlang"
            label="Kategoriya"
            value={categoryId || '__all__'}
            onValueChange={v => { setCategoryId(v === '__all__' ? '' : v); setPage(1) }}
            options={[
              { value: '__all__', label: 'Barchasi' },
              ...(categories ?? []).map(c => ({ value: String(c.id), label: c.name })),
            ]}
          />
          <Select
            placeholder="Muallif tanlang"
            label="Muallif"
            value={authorId || '__all__'}
            onValueChange={v => { setAuthorId(v === '__all__' ? '' : v); setPage(1) }}
            options={[
              { value: '__all__', label: 'Barchasi' },
              ...(authorsData?.data ?? []).map(a => ({ value: String(a.id), label: a.name })),
            ]}
          />
          <div className="flex items-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSearch(''); setCategoryId(''); setAuthorId(''); setPage(1) }}
            >
              Tozalash
            </Button>
          </div>
        </div>
      )}

      {/* Books grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[3/4] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[rgb(var(--bg-elevated))]">
            <BookOpen className="h-8 w-8 text-[rgb(var(--text-faint))]" />
          </div>
          <div className="text-center">
            <p className="font-medium text-[rgb(var(--text))]">Kitob topilmadi</p>
            <p className="text-sm text-[rgb(var(--text-muted))]">Boshqa kalit so'z bilan qidiring</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {books.map(book => {
            const imgPath = book.images?.[0]?.url ?? book.images?.[0]?.path
            return (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="group flex flex-col rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] overflow-hidden hover:border-violet-500/40 transition-all hover:shadow-lg hover:shadow-violet-500/5"
              >
                <div className="aspect-[3/4] bg-[rgb(var(--bg-elevated))] relative overflow-hidden">
                  {imgPath ? (
                    <img
                      src={imgPath}
                      alt={book.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="h-10 w-10 text-[rgb(var(--text-faint))]" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={statusBadgeVariant(book.status)}>
                      {statusLabel(book.status)}
                    </Badge>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm text-[rgb(var(--text))] line-clamp-2 leading-snug">{book.title}</p>
                  {book.author && (
                    <p className="mt-1 text-xs text-[rgb(var(--text-muted))] truncate">{book.author.name}</p>
                  )}
                  {book.category && (
                    <p className="mt-1 text-xs text-violet-400 truncate">{book.category.name}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              const p = i + 1
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-xl text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-[rgb(var(--primary))] text-white'
                      : 'text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--bg-elevated))] hover:text-[rgb(var(--text))]'
                  }`}
                >
                  {p}
                </button>
              )
            })}
          </div>

          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

