import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { booksApi, membersApi, memberStatsApi } from '@/api'
import { useAppSelector } from '../../store/hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge, statusBadgeVariant } from '@/components/ui/badge'
import { formatDate, statusLabel } from '@/lib/utils'
import { BookOpen, ChevronRight, BookMarked, Clock, Star } from 'lucide-react'

function BookCard({ book }: { book: { id: number; title: string; author?: { name: string }; status: string; quantity: number; images?: { path?: string; url?: string }[] } }) {
  const imgPath = book.images?.[0]?.url ?? book.images?.[0]?.path
  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex flex-col rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] overflow-hidden hover:border-[rgb(var(--border))] transition-colors"
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
        <p className="font-medium text-sm text-[rgb(var(--text))] line-clamp-2 leading-snug">{book.title}</p>
        {book.author && (
          <p className="mt-1 text-xs text-[rgb(var(--text-muted))] truncate">{book.author.name}</p>
        )}
      </div>
    </Link>
  )
}

export default function Home() {
  const user = useAppSelector(s => s.user.user)

  const { data: booksData, isLoading: booksLoading } = useQuery({
    queryKey: ['books-home'],
    queryFn: () => booksApi.list({ limit: 12, page: 1 }),
  })

  const { data: memberData } = useQuery({
    queryKey: ['my-member'],
    queryFn: membersApi.myMember,
    enabled: !!user,
    retry: false,
  })

  const { data: currentBooks } = useQuery({
    queryKey: ['my-current-books'],
    queryFn: memberStatsApi.myCurrent,
    enabled: !!memberData,
    retry: false,
  })

  const activeBooks = currentBooks?.filter(b => b.status === 'BORROWED' || b.status === 'BOOKED') ?? []
  const daysLeft = memberData?.endDate
    ? Math.max(0, Math.ceil((new Date(memberData.endDate).getTime() - Date.now()) / 86400000))
    : null

  return (
    <div className="space-y-8 pb-20 md:pb-0 animate-in">
      {/* Welcome header */}
      <div className="border-b border-[rgb(var(--border-subtle))] pb-6">
        <h1 className="text-2xl font-semibold text-[rgb(var(--text))]">
          {user ? `Xush kelibsiz, ${user.firstName}` : 'Kutubxona'}
        </h1>
        <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
          Minglab kitoblar sizni kutmoqda
        </p>
        {!user && (
          <div className="mt-4 flex gap-2">
            <Link
              to="/login"
              className="rounded-lg bg-[rgb(var(--primary))] px-4 py-2 text-sm font-medium text-white hover:bg-[rgb(var(--primary-hover))] transition-colors"
            >
              Kirish
            </Link>
            <Link
              to="/register"
              className="rounded-lg border border-[rgb(var(--border))] px-4 py-2 text-sm font-medium text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--bg-elevated))] transition-colors"
            >
              Ro'yxatdan o'tish
            </Link>
          </div>
        )}
      </div>

      {/* Membership info */}
      {user && memberData && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookMarked className="h-4 w-4 text-[rgb(var(--text-muted))]" />
              <span className="text-xs font-medium text-[rgb(var(--text-muted))] uppercase tracking-wide">A'zolik</span>
            </div>
            <p className="text-lg font-semibold text-[rgb(var(--text))]">{memberData.membership?.name ?? '—'}</p>
            <p className="mt-0.5 text-xs text-[rgb(var(--text-muted))]">{formatDate(memberData.endDate)} gacha</p>
          </div>
          <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-[rgb(var(--text-muted))]" />
              <span className="text-xs font-medium text-[rgb(var(--text-muted))] uppercase tracking-wide">Qolgan kunlar</span>
            </div>
            <p className="text-lg font-semibold text-[rgb(var(--text))]">{daysLeft} kun</p>
            <p className="mt-0.5 text-xs text-[rgb(var(--text-muted))]">
              {memberData.status === 'ACTIVE' ? 'Faol a\'zolik' : 'Nofaol'}
            </p>
          </div>
          <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-[rgb(var(--text-muted))]" />
              <span className="text-xs font-medium text-[rgb(var(--text-muted))] uppercase tracking-wide">Ball</span>
            </div>
            <p className="text-lg font-semibold text-[rgb(var(--text))]">{user.score ?? 0}</p>
            <p className="mt-0.5 text-xs text-[rgb(var(--text-muted))]">Kitob o'qib ball yig'ing</p>
          </div>
        </div>
      )}

      {/* Current books */}
      {activeBooks.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[rgb(var(--text))]">Hozirgi kitoblarim</h2>
            <Link
              to="/reading_history"
              className="flex items-center gap-1 text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors"
            >
              Hammasi <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {activeBooks.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-3.5"
              >
                <div className="flex h-10 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--bg-elevated))]">
                  <BookOpen className="h-4 w-4 text-[rgb(var(--text-faint))]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-[rgb(var(--text))]">{item.book?.title ?? '—'}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant={statusBadgeVariant(item.status)}>{statusLabel(item.status)}</Badge>
                    {item.endDate && (
                      <span className="text-xs text-[rgb(var(--text-muted))]">{formatDate(item.endDate)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Books catalog */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[rgb(var(--text))]">Barcha kitoblar</h2>
          <Link
            to="/books"
            className="flex items-center gap-1 text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors"
          >
            Ko'proq <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {booksLoading ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {booksData?.data.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
