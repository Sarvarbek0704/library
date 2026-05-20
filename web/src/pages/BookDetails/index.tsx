import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { booksApi, savedBooksApi, reviewsApi, membersApi, memberStatsApi, waitlistApi } from '@/api'
import { useAppSelector } from '../../store/hooks'
import { FullPageSpinner } from '@/components/Spinner'
import { Badge, statusBadgeVariant } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, statusLabel } from '@/lib/utils'
import {
  BookOpen, Bookmark, BookmarkCheck, Star, ArrowLeft, BookMarked,
  Hash, Building2, User, Clock, Users,
} from 'lucide-react'

export default function BookDetails() {
  const { id } = useParams<{ id: string }>()
  const bookId = Number(id)
  const qc = useQueryClient()
  const user = useAppSelector(s => s.user.user)
  const navigate = useNavigate()

  const [borrowModalOpen, setBorrowModalOpen] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => booksApi.get(bookId),
    enabled: !!bookId,
  })

  const { data: reviews } = useQuery({
    queryKey: ['reviews', bookId],
    queryFn: () => reviewsApi.forBook(bookId),
    enabled: !!bookId,
  })

  const { data: saved } = useQuery({
    queryKey: ['saved-books'],
    queryFn: savedBooksApi.list,
    enabled: !!user,
    retry: false,
  })

  const { data: member } = useQuery({
    queryKey: ['my-member'],
    queryFn: membersApi.myMember,
    enabled: !!user,
    retry: false,
  })

  const { data: myWaitlist } = useQuery({
    queryKey: ['my-waitlist'],
    queryFn: waitlistApi.mine,
    enabled: !!user,
    retry: false,
  })

  const isSaved = saved?.some(s => s.bookId === bookId) ?? false
  const isInWaitlist = myWaitlist?.some(w => w.bookId === bookId) ?? false

  const saveMutation = useMutation({
    mutationFn: () => savedBooksApi.toggle(bookId),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['saved-books'] })
      toast.success(res.saved ? 'Saqlandi!' : 'Saqlanganlardan olib tashlandi')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const borrowMutation = useMutation({
    mutationFn: (status: string) => {
      if (!member) throw new Error("A'zolik topilmadi")
      return memberStatsApi.borrow({ memberId: member.id, bookId, status, quantity: 1 })
    },
    onSuccess: (_, status) => {
      toast.success(status === 'BORROWED' ? 'Kitob muvaffaqiyatli olindi!' : 'Kitob band qilindi!')
      qc.invalidateQueries({ queryKey: ['book', bookId] })
      qc.invalidateQueries({ queryKey: ['my-current-books'] })
      qc.invalidateQueries({ queryKey: ['my-member'] })
      setBorrowModalOpen(false)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const waitlistMutation = useMutation({
    mutationFn: () =>
      isInWaitlist ? waitlistApi.leave(bookId) : waitlistApi.join(bookId),
    onSuccess: () => {
      toast.success(isInWaitlist ? 'Navbatdan chiqildingiz' : "Navbatga qo'shildingiz! Kitob bo'sh bo'lganda xabar beramiz.")
      qc.invalidateQueries({ queryKey: ['my-waitlist'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const reviewMutation = useMutation({
    mutationFn: () => reviewsApi.create({ bookId, rating: reviewRating, comment: reviewComment }),
    onSuccess: () => {
      toast.success('Izoh qoldirildi!')
      qc.invalidateQueries({ queryKey: ['reviews', bookId] })
      setReviewModalOpen(false)
      setReviewComment('')
      setReviewRating(5)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  if (isLoading) return <FullPageSpinner />
  if (!book) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <BookOpen className="h-12 w-12 text-[rgb(var(--text-faint))]" />
      <p className="text-[rgb(var(--text-muted))]">Kitob topilmadi</p>
      <Link to="/books" className="flex items-center gap-1.5 text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Kitoblarga qaytish
      </Link>
    </div>
  )

  const imgPath = book.images?.[0]?.url ?? book.images?.[0]?.path
  const isAvailable = book.status === 'AVAILABLE' && book.quantity > 0
  const isNotAvailable = !isAvailable

  return (
    <div className="animate-in pb-20 md:pb-0">
      <Link to="/books" className="mb-6 flex items-center gap-2 text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors">
        <ArrowLeft className="h-4 w-4" /> Kitoblarga qaytish
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Book cover */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="aspect-[3/4] w-full max-w-xs mx-auto lg:max-w-none rounded-xl bg-[rgb(var(--bg-elevated))] overflow-hidden shadow-2xl">
              {imgPath ? (
                <img src={imgPath} alt={book.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BookOpen className="h-16 w-16 text-[rgb(var(--text-faint))]" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Book info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap items-start gap-2 mb-3">
              <Badge variant={statusBadgeVariant(book.status)}>{statusLabel(book.status)}</Badge>
              {book.category && <Badge variant="muted">{book.category.name}</Badge>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(var(--text))] leading-snug">{book.title}</h1>

            {book.author && (
              <div className="mt-3 flex items-center gap-2 text-[rgb(var(--text-muted))]">
                <User className="h-4 w-4" />
                <span>{book.author.name}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {!!book.pages && (
              <div className="rounded-xl bg-[rgb(var(--bg-elevated))] p-4 text-center">
                <Hash className="mx-auto h-4 w-4 text-[rgb(var(--text-muted))] mb-1" />
                <p className="text-lg font-bold text-[rgb(var(--text))]">{book.pages}</p>
                <p className="text-xs text-[rgb(var(--text-muted))]">Sahifa</p>
              </div>
            )}
            <div className="rounded-xl bg-[rgb(var(--bg-elevated))] p-4 text-center">
              <BookOpen className="mx-auto h-4 w-4 text-[rgb(var(--text-muted))] mb-1" />
              <p className="text-lg font-bold text-[rgb(var(--text))]">{book.quantity}</p>
              <p className="text-xs text-[rgb(var(--text-muted))]">Nusxa</p>
            </div>
            {reviews && (
              <div className="rounded-xl bg-[rgb(var(--bg-elevated))] p-4 text-center">
                <Star className="mx-auto h-4 w-4 text-amber-400 mb-1" />
                <p className="text-lg font-bold text-[rgb(var(--text))]">{reviews.avgRating.toFixed(1)}</p>
                <p className="text-xs text-[rgb(var(--text-muted))]">{reviews.total} izoh</p>
              </div>
            )}
          </div>

          {/* Library */}
          {book.library && (
            <div className="flex items-center gap-2 text-sm text-[rgb(var(--text-muted))]">
              <Building2 className="h-4 w-4" />
              <span>{book.library.name}</span>
              {book.library.address && <span>· {book.library.address}</span>}
            </div>
          )}

          {/* Description */}
          {book.description && (
            <div>
              <h3 className="mb-2 font-semibold text-[rgb(var(--text))]">Kitob haqida</h3>
              <p className="text-sm text-[rgb(var(--text-muted))] leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Actions */}
          {user ? (
            <div className="flex flex-wrap gap-3">
              {/* Save */}
              <Button
                variant={isSaved ? 'secondary' : 'default'}
                onClick={() => saveMutation.mutate()}
                loading={saveMutation.isPending}
              >
                {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                {isSaved ? 'Saqlangan' : 'Saqlash'}
              </Button>

              {/* Borrow — only if has membership and book available */}
              {member && isAvailable && (
                <Button onClick={() => setBorrowModalOpen(true)}>
                  <BookMarked className="h-4 w-4" />
                  Olish / Band qilish
                </Button>
              )}

              {/* No membership hint */}
              {!member && isAvailable && (
                <Button variant="secondary" onClick={() => navigate('/membership')}>
                  <BookMarked className="h-4 w-4" />
                  A'zolik kerak
                </Button>
              )}

              {/* Waitlist — if not available */}
              {isNotAvailable && (
                <Button
                  variant={isInWaitlist ? 'secondary' : 'default'}
                  onClick={() => {
                    if (!member) { navigate('/membership'); return }
                    waitlistMutation.mutate()
                  }}
                  loading={waitlistMutation.isPending}
                >
                  {isInWaitlist ? (
                    <><Users className="h-4 w-4" /> Navbatdan chiqish</>
                  ) : (
                    <><Clock className="h-4 w-4" /> Navbatga qo'shilish</>
                  )}
                </Button>
              )}

              {/* Review */}
              <Button variant="ghost" onClick={() => setReviewModalOpen(true)}>
                <Star className="h-4 w-4" />
                Izoh qoldirish
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="rounded-lg bg-[rgb(var(--primary))] px-4 py-2 text-sm font-medium text-white hover:bg-[rgb(var(--primary-hover))] transition-colors">
                Kirish kerak
              </Link>
              <p className="text-sm text-[rgb(var(--text-muted))]">Kitob olish uchun tizimga kiring</p>
            </div>
          )}

          {/* Unavailable notice */}
          {isNotAvailable && book.status !== 'NOTAVAILABLE' && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
              <p className="text-sm text-amber-400">
                Bu kitob hozirda mavjud emas. Navbatga qo'shilib, bo'shaganda xabar olishingiz mumkin.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10 space-y-4">
        {reviews && reviews.total > 0 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[rgb(var(--text))]">Izohlar ({reviews.total})</h2>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-[rgb(var(--text))]">{reviews.avgRating.toFixed(1)}</span>
                <span className="text-sm text-[rgb(var(--text-muted))]">/ 5</span>
              </div>
            </div>
            <div className="space-y-3">
              {reviews.reviews.map(review => (
                <div key={review.id} className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(var(--bg-elevated))] text-sm font-semibold text-[rgb(var(--text-muted))]">
                        {review.user?.firstName?.[0] ?? 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[rgb(var(--text))]">{review.user?.firstName}</p>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-[rgb(var(--text-faint))]'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-[rgb(var(--text-faint))]">{formatDate(review.createdAt)}</span>
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-sm text-[rgb(var(--text-muted))] leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Borrow Modal */}
      <Modal open={borrowModalOpen} onClose={() => setBorrowModalOpen(false)} title="Kitob olish" size="sm">
        <div className="space-y-5">
          <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-elevated))] p-4">
            <p className="font-semibold text-[rgb(var(--text))]">{book.title}</p>
            {book.author && <p className="text-sm text-[rgb(var(--text-muted))] mt-0.5">{book.author.name}</p>}
          </div>
          <p className="text-sm text-[rgb(var(--text-muted))]">Qanday olishni tanlang:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => borrowMutation.mutate('BORROWED')}
              disabled={borrowMutation.isPending}
              className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 text-center hover:bg-violet-500/20 transition-colors disabled:opacity-50"
            >
              <BookMarked className="mx-auto h-6 w-6 text-violet-400 mb-2" />
              <p className="text-sm font-semibold text-violet-400">Olish</p>
              <p className="text-xs text-[rgb(var(--text-muted))] mt-1">20 kunga olib keting</p>
            </button>
            <button
              onClick={() => borrowMutation.mutate('BOOKED')}
              disabled={borrowMutation.isPending}
              className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center hover:bg-amber-500/20 transition-colors disabled:opacity-50"
            >
              <Bookmark className="mx-auto h-6 w-6 text-amber-400 mb-2" />
              <p className="text-sm font-semibold text-amber-400">Band qilish</p>
              <p className="text-xs text-[rgb(var(--text-muted))] mt-1">24 soat ichida oling</p>
            </button>
          </div>
          {borrowMutation.isPending && (
            <p className="text-center text-sm text-[rgb(var(--text-muted))]">Yuklanmoqda...</p>
          )}
          <Button variant="secondary" size="sm" className="w-full" onClick={() => setBorrowModalOpen(false)}>
            Bekor qilish
          </Button>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Izoh qoldirish" size="sm">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-[rgb(var(--text-muted))] mb-2">Baho</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setReviewRating(n)}>
                  <Star className={`h-7 w-7 transition-colors ${n <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-[rgb(var(--text-faint))]'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[rgb(var(--text-muted))] mb-1.5 block">Izoh (ixtiyoriy)</label>
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              rows={4}
              placeholder="Kitob haqida fikringizni yozing..."
              className="w-full rounded-[10px] border border-[rgb(var(--border))] bg-[rgb(var(--bg-elevated))] px-3.5 py-2.5 text-sm text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-faint))] focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setReviewModalOpen(false)}>Bekor</Button>
            <Button className="flex-1" loading={reviewMutation.isPending} onClick={() => reviewMutation.mutate()}>
              Yuborish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
