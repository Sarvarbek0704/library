import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { usersApi, membersApi, memberStatsApi, paymentsApi } from '@/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setUser } from '../../store/user/user.slice'
import { PageHeader } from '@/components/PageHeader'
import { FullPageSpinner } from '@/components/Spinner'
import { Badge, statusBadgeVariant } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { formatDate, formatCurrency, statusLabel } from '@/lib/utils'
import {
  BookOpen, CreditCard, Star, Phone, Calendar,
  Pencil, CheckCircle, BookMarked, BookX, History,
} from 'lucide-react'

export default function UserProfilePage() {
  const authUser = useAppSelector(s => s.user.user)
  const dispatch = useAppDispatch()
  const qc = useQueryClient()

  const [editOpen, setEditOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const { data: me, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: usersApi.me,
    enabled: !!authUser,
  })

  const { data: member } = useQuery({
    queryKey: ['my-member'],
    queryFn: membersApi.myMember,
    enabled: !!authUser,
    retry: false,
  })

  const { data: allStats } = useQuery({
    queryKey: ['my-current-books'],
    queryFn: memberStatsApi.myCurrent,
    enabled: !!authUser,
    retry: false,
  })

  const { data: payments } = useQuery({
    queryKey: ['my-payments'],
    queryFn: () => paymentsApi.myList(1, 6),
    enabled: !!authUser,
    retry: false,
  })

  const updateMutation = useMutation({
    mutationFn: (body: { firstName: string; lastName: string }) =>
      usersApi.update(me!.id, body),
    onSuccess: (updated) => {
      toast.success('Profil yangilandi')
      qc.invalidateQueries({ queryKey: ['me'] })
      dispatch(setUser({
        id: String(updated.id),
        firstName: updated.firstName,
        lastName: updated.lastName ?? '',
        phone: updated.phone,
        role: updated.role.toLowerCase(),
      }))
      setEditOpen(false)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  function openEdit() {
    setFirstName(me?.firstName ?? '')
    setLastName(me?.lastName ?? '')
    setEditOpen(true)
  }

  if (isLoading) return <FullPageSpinner />

  const activeBooks = (allStats ?? []).filter(b => b.status === 'BORROWED' || b.status === 'BOOKED')
  const returnedBooks = (allStats ?? []).filter(b => b.status === 'RETURNED')
  const daysLeft = member?.endDate
    ? Math.max(0, Math.ceil((new Date(member.endDate).getTime() - Date.now()) / 86400000))
    : null

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-in">
      <div className="flex items-center justify-between">
        <PageHeader title="Mening profilim" />
        {!me?.isDemo && (
          <Button variant="secondary" size="sm" onClick={openEdit}>
            <Pencil className="h-3.5 w-3.5" /> Tahrirlash
          </Button>
        )}
      </div>

      {/* Profile card */}
      <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[rgb(var(--primary))] text-3xl font-bold text-white select-none">
            {(me?.firstName?.[0] ?? authUser?.firstName?.[0] ?? 'U').toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-[rgb(var(--text))]">
                {me?.firstName ?? authUser?.firstName} {me?.lastName ?? ''}
              </h2>
              {me?.isDemo && <Badge variant="warning">Demo</Badge>}
              <Badge variant="muted">{authUser?.role ?? 'user'}</Badge>
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm text-[rgb(var(--text-muted))]">
                <Phone className="h-3.5 w-3.5" />
                {me?.phone ?? authUser?.phone}
              </div>
              {me?.createdAt && (
                <div className="flex items-center gap-2 text-sm text-[rgb(var(--text-muted))]">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(me.createdAt)} dan beri a'zo
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <Star className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-xl font-bold text-[rgb(var(--text))]">{me?.score ?? 0}</p>
              <p className="text-xs text-[rgb(var(--text-muted))]">Ball</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-4 text-center">
          <BookOpen className="mx-auto h-5 w-5 text-violet-400 mb-2" />
          <p className="text-2xl font-bold text-[rgb(var(--text))]">{activeBooks.length}</p>
          <p className="text-xs text-[rgb(var(--text-muted))]">Hozirgi kitob</p>
        </div>
        <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-4 text-center">
          <History className="mx-auto h-5 w-5 text-emerald-400 mb-2" />
          <p className="text-2xl font-bold text-[rgb(var(--text))]">{returnedBooks.length}</p>
          <p className="text-xs text-[rgb(var(--text-muted))]">Qaytarilgan</p>
        </div>
        <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-4 text-center">
          <CreditCard className="mx-auto h-5 w-5 text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-[rgb(var(--text))]">{payments?.total ?? 0}</p>
          <p className="text-xs text-[rgb(var(--text-muted))]">To'lovlar</p>
        </div>
      </div>

      {/* Membership */}
      {member ? (
        <div className="rounded-xl border border-violet-500/20 bg-[rgb(var(--bg-card))] p-5">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[rgb(var(--text))]">
            <CheckCircle className="h-4 w-4 text-emerald-400" /> Faol a'zolik
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-[rgb(var(--text-muted))]">Reja</p>
              <p className="mt-1 font-semibold text-[rgb(var(--text))]">{member.membership?.name ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[rgb(var(--text-muted))]">Holat</p>
              <div className="mt-1">
                <Badge variant={statusBadgeVariant(member.status)}>{statusLabel(member.status)}</Badge>
              </div>
            </div>
            <div>
              <p className="text-xs text-[rgb(var(--text-muted))]">Tugash sanasi</p>
              <p className="mt-1 text-sm font-medium text-[rgb(var(--text))]">
                {formatDate(member.endDate)}
                {daysLeft !== null && (
                  <span className={`ml-2 text-xs ${daysLeft <= 5 ? 'text-red-400 font-semibold' : 'text-[rgb(var(--text-muted))]'}`}>
                    ({daysLeft} kun qoldi)
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-[rgb(var(--text-muted))]">Limitlar</p>
              <p className="mt-1 text-sm text-[rgb(var(--text))]">
                {member.membership?.limitBorrow ?? '—'} olish · {member.membership?.limitBook ?? '—'} bron
              </p>
            </div>
          </div>

          {/* Usage progress bars */}
          {member.membership && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[rgb(var(--text-muted))] flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> Kitob olish
                  </span>
                  <span className="text-xs font-semibold text-[rgb(var(--text))]">
                    {activeBooks.filter(b => b.status === 'BORROWED').length} / {member.membership.limitBorrow}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[rgb(var(--bg-elevated))]">
                  <div
                    className="h-2 rounded-full bg-violet-500 transition-all"
                    style={{ width: `${Math.min(100, (activeBooks.filter(b => b.status === 'BORROWED').length / member.membership!.limitBorrow) * 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[rgb(var(--text-muted))] flex items-center gap-1">
                    <BookMarked className="h-3 w-3" /> Bron qilish
                  </span>
                  <span className="text-xs font-semibold text-[rgb(var(--text))]">
                    {activeBooks.filter(b => b.status === 'BOOKED').length} / {member.membership.limitBook}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[rgb(var(--bg-elevated))]">
                  <div
                    className="h-2 rounded-full bg-amber-500 transition-all"
                    style={{ width: `${Math.min(100, (activeBooks.filter(b => b.status === 'BOOKED').length / member.membership!.limitBook) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {daysLeft !== null && daysLeft <= 5 && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
              <p className="text-sm text-red-400">A'zoligingiz {daysLeft} kundan keyin tugaydi!</p>
              <Link to="/membership" className="text-xs font-semibold text-red-400 hover:text-red-300 underline transition-colors">
                Yangilash →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[rgb(var(--border))] p-8 text-center">
          <BookX className="mx-auto h-10 w-10 text-[rgb(var(--text-faint))]" />
          <p className="mt-3 font-medium text-[rgb(var(--text))]">A'zoligingiz yo'q</p>
          <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">Kitob olish uchun a'zolik sotib oling</p>
          <Link
            to="/membership"
            className="mt-4 inline-block rounded-lg bg-[rgb(var(--primary))] px-4 py-2 text-sm font-medium text-white hover:bg-[rgb(var(--primary-hover))] transition-colors"
          >
            A'zolik rejalarini ko'rish
          </Link>
        </div>
      )}

      {/* Active books */}
      {activeBooks.length > 0 && (
        <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-semibold text-[rgb(var(--text))]">
              <BookOpen className="h-4 w-4 text-violet-400" /> Hozirgi kitoblar ({activeBooks.length})
            </h3>
            <Link to="/reading_history" className="text-xs text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors">
              Hammasi →
            </Link>
          </div>
          <div className="space-y-2">
            {activeBooks.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl bg-[rgb(var(--bg-elevated))] px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-sm text-[rgb(var(--text))]">{item.book?.title ?? '—'}</p>
                  <p className="text-xs text-[rgb(var(--text-muted))]">
                    {(item.book as any)?.author?.name}
                    {item.endDate ? ` · ${formatDate(item.endDate)} gacha` : ''}
                  </p>
                </div>
                <Badge variant={item.status === 'BORROWED' ? 'info' : 'warning'}>
                  {statusLabel(item.status)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent payments */}
      {payments && payments.data.length > 0 && (
        <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-5">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[rgb(var(--text))]">
            <CreditCard className="h-4 w-4 text-violet-400" /> To'lov tarixi
          </h3>
          <div className="space-y-2">
            {payments.data.map(pay => (
              <div key={pay.id} className="flex items-center justify-between gap-4 rounded-xl bg-[rgb(var(--bg-elevated))] px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-[rgb(var(--text))]">
                    {pay.membership?.name ?? `A'zolik #${pay.membershipId}`}
                  </p>
                  <p className="text-xs text-[rgb(var(--text-muted))]">{formatDate(pay.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm font-semibold text-[rgb(var(--text))]">{formatCurrency(pay.amount)}</span>
                  <Badge variant={statusBadgeVariant(pay.status)}>{statusLabel(pay.status)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Profilni tahrirlash" size="sm">
        <div className="space-y-4">
          <Input
            label="Ism"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="Ismingizni kiriting"
          />
          <Input
            label="Familiya"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder="Familiyangizni kiriting"
          />
          <div className="flex gap-3 pt-1">
            <Button variant="secondary" className="flex-1" onClick={() => setEditOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              className="flex-1"
              loading={updateMutation.isPending}
              disabled={!firstName.trim()}
              onClick={() => updateMutation.mutate({ firstName: firstName.trim(), lastName: lastName.trim() })}
            >
              Saqlash
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
