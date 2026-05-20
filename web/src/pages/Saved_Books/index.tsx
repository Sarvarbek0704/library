import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { savedBooksApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Badge, statusBadgeVariant } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/PageHeader'
import { statusLabel } from '@/lib/utils'
import { BookOpen, Bookmark, BookmarkX } from 'lucide-react'

export default function SavedBooks() {
  const qc = useQueryClient()

  const { data: saved, isLoading } = useQuery({
    queryKey: ['saved-books'],
    queryFn: savedBooksApi.list,
  })

  const toggleMutation = useMutation({
    mutationFn: (bookId: number) => savedBooksApi.toggle(bookId),
    onSuccess: () => {
      toast.success('Saqlanganlardan olib tashlandi')
      qc.invalidateQueries({ queryKey: ['saved-books'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-in">
      <PageHeader
        title="Saqlangan kitoblar"
        description={saved ? `${saved.length} ta kitob` : ''}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[3/4] rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : !saved?.length ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[rgb(var(--bg-elevated))]">
            <Bookmark className="h-8 w-8 text-[rgb(var(--text-faint))]" />
          </div>
          <div>
            <p className="font-semibold text-[rgb(var(--text))]">Saqlangan kitoblar yo'q</p>
            <p className="text-sm text-[rgb(var(--text-muted))]">Kitoblar sahifasida saqlang</p>
          </div>
          <Link to="/books" className="rounded-lg bg-[rgb(var(--primary))] px-4 py-2 text-sm font-medium text-white hover:bg-[rgb(var(--primary-hover))] transition-colors">
            Kitoblarni ko'rish
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {saved.map(({ id, book, bookId }) => {
            if (!book) return null
            const imgPath = book.images?.[0]?.url ?? book.images?.[0]?.path
            return (
              <div key={id} className="group flex flex-col rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] overflow-hidden hover:border-violet-500/40 transition-all">
                <Link to={`/books/${bookId}`} className="flex-1">
                  <div className="aspect-[3/4] bg-[rgb(var(--bg-elevated))] relative overflow-hidden">
                    {imgPath ? (
                      <img src={imgPath} alt={book.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-10 w-10 text-[rgb(var(--text-faint))]" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant={statusBadgeVariant(book.status)}>{statusLabel(book.status)}</Badge>
                    </div>
                  </div>
                  <div className="p-3 pb-1">
                    <p className="font-semibold text-sm text-[rgb(var(--text))] line-clamp-2">{book.title}</p>
                    {book.author && <p className="mt-1 text-xs text-[rgb(var(--text-muted))] truncate">{book.author.name}</p>}
                  </div>
                </Link>
                <div className="p-3 pt-2">
                  <Button variant="danger" size="sm" className="w-full" loading={toggleMutation.isPending}
                    onClick={() => toggleMutation.mutate(bookId)}>
                    <BookmarkX className="h-3.5 w-3.5" /> Olib tashlash
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

