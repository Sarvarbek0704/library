import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { membershipsApi, membersApi, paymentsApi, type Membership } from '@/api'
import { FullPageSpinner } from '@/components/Spinner'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { useAppSelector } from '../../store/hooks'
import { CheckCircle, BookOpen, Bookmark, Clock, Zap, CreditCard, Banknote, Smartphone } from 'lucide-react'

const METHODS = [
  { value: 'CARD',   label: 'Plastik karta',   icon: CreditCard },
  { value: 'CASH',   label: 'Naqd pul',         icon: Banknote },
  { value: 'ONLINE', label: 'Online to\'lov',   icon: Smartphone },
]

export default function MembershipPage() {
  const user = useAppSelector(s => s.user.user)
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<Membership | null>(null)
  const [method, setMethod] = useState<string>('CARD')

  const { data: memberships, isLoading } = useQuery({
    queryKey: ['memberships'],
    queryFn: membershipsApi.list,
  })

  const { data: myMember } = useQuery({
    queryKey: ['my-member'],
    queryFn: membersApi.myMember,
    enabled: !!user,
    retry: false,
  })

  const buyMutation = useMutation({
    mutationFn: ({ membershipId, method }: { membershipId: number; method: string }) =>
      paymentsApi.create({ membershipId, method } as any),
    onSuccess: () => {
      toast.success("To'lov so'rovi yuborildi! Admin tasdiqlashini kuting.")
      setSelectedPlan(null)
      navigate('/profile')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  if (isLoading) return <FullPageSpinner />

  const plans = memberships ?? []
  const currentMembershipId = myMember?.membershipId

  return (
    <div className="space-y-8 pb-20 md:pb-0 animate-in">
      <div>
        <h1 className="text-2xl font-semibold text-[rgb(var(--text))]">A'zolik rejalari</h1>
        <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
          O'zingizga mos rejani tanlang
        </p>
      </div>

      {myMember && (
        <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-5 max-w-md mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-[rgb(var(--text-muted))] mb-2">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Faol a'zolik</span>
          </div>
          <p className="text-[rgb(var(--text))]">{myMember.membership?.name}</p>
          <p className="text-sm text-[rgb(var(--text-muted))] mt-1">
            {new Date(myMember.endDate).toLocaleDateString('uz-UZ')} gacha
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((plan, i) => {
          const isCurrent = plan.id === currentMembershipId && myMember?.status === 'ACTIVE'
          const isPopular = i === 1

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-xl border p-5 transition-all ${
                isPopular
                  ? 'border-[rgb(var(--primary)/0.4)] bg-[rgb(var(--bg-card))]'
                  : 'border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))]'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-[rgb(var(--primary))] px-3 py-0.5 text-xs font-medium text-white">
                    Mashhur
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isPopular ? 'bg-[rgb(var(--primary))]' : 'bg-[rgb(var(--bg-elevated))]'
                }`}>
                  <Zap className={`h-5 w-5 ${isPopular ? 'text-white' : 'text-[rgb(var(--text-muted))]'}`} />
                </div>
                {isCurrent && <Badge variant="success">Hozirgi</Badge>}
              </div>

              <h3 className="text-xl font-bold text-[rgb(var(--text))]">{plan.name}</h3>
              {plan.description && (
                <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">{plan.description}</p>
              )}

              <div className="my-5">
                <span className="text-3xl font-bold text-[rgb(var(--text))]">{formatCurrency(plan.price)}</span>
                <span className="text-sm text-[rgb(var(--text-muted))]"> / {plan.durationDays} kun</span>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                <li className="flex items-center gap-2.5 text-sm text-[rgb(var(--text))]">
                  <BookOpen className="h-4 w-4 text-violet-400 flex-shrink-0" />
                  {plan.limitBorrow} ta kitob olish
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[rgb(var(--text))]">
                  <Bookmark className="h-4 w-4 text-violet-400 flex-shrink-0" />
                  {plan.limitBook} ta kitob band qilish
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[rgb(var(--text))]">
                  <Clock className="h-4 w-4 text-violet-400 flex-shrink-0" />
                  {plan.durationDays} kun muddat
                </li>
              </ul>

              <Button
                variant={isPopular ? 'default' : 'secondary'}
                size="lg"
                className="w-full"
                disabled={isCurrent}
                onClick={() => {
                  if (!user) { navigate('/login'); return }
                  setSelectedPlan(plan)
                  setMethod('CARD')
                }}
              >
                {isCurrent ? "Faol rejangiz" : "Tanlash"}
              </Button>
            </div>
          )
        })}
      </div>

      {/* Payment method modal */}
      <Modal
        open={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        title="To'lov usulini tanlang"
        size="sm"
      >
        {selectedPlan && (
          <div className="space-y-5">
            {/* Plan summary */}
            <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-elevated))] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[rgb(var(--text))]">{selectedPlan.name}</p>
                  <p className="text-xs text-[rgb(var(--text-muted))] mt-0.5">{selectedPlan.durationDays} kun muddat</p>
                </div>
                <p className="text-lg font-bold text-violet-400">{formatCurrency(selectedPlan.price)}</p>
              </div>
            </div>

            {/* Method selector */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-[rgb(var(--text-muted))]">To'lov usuli</p>
              <div className="grid grid-cols-3 gap-2">
                {METHODS.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setMethod(m.value)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-all ${
                      method === m.value
                        ? 'border-violet-500 bg-violet-500/10 text-violet-400'
                        : 'border-[rgb(var(--border-subtle))] text-[rgb(var(--text-muted))] hover:border-[rgb(var(--border))] hover:text-[rgb(var(--text))]'
                    }`}
                  >
                    <m.icon className="h-5 w-5" />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-[rgb(var(--text-faint))] text-center">
              So'rovingiz admin tomonidan tasdiqlanganidan so'ng a'zolik faollashadi.
            </p>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setSelectedPlan(null)}>
                Bekor qilish
              </Button>
              <Button
                className="flex-1"
                loading={buyMutation.isPending}
                onClick={() => buyMutation.mutate({ membershipId: selectedPlan.id, method })}
              >
                So'rov yuborish
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

