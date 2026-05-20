import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/api'
import { StatCard } from '@/components/StatCard'
import { PageHeader } from '@/components/PageHeader'
import { FullPageSpinner } from '@/components/Spinner'
import { Badge, statusBadgeVariant } from '@/components/ui/badge'
import { formatDate, formatCurrency, statusLabel } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { BookOpen, Users, UserCheck, TrendingUp, BookMarked, RotateCcw, AlertTriangle, Star } from 'lucide-react'

const COLORS = ['#7c3aed', '#a855f7', '#6366f1', '#8b5cf6', '#c084fc']

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-card))] px-4 py-3 shadow-xl text-sm">
        <p className="text-[rgb(var(--text-muted))] mb-1">{label}</p>
        <p className="font-semibold text-violet-400">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: analyticsApi.dashboard,
    refetchInterval: 60_000,
  })

  if (isLoading) return <FullPageSpinner />
  if (!data) return null

  const { overview, revenueByMonth, topBorrowed, topUsers, membershipStats, recentBorrows } = data

  return (
    <div className="animate-in space-y-6">
      <PageHeader title="Dashboard" description="Kutubxona umumiy ko'rsatkichlari" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Jami kitoblar"    value={overview.totalBooks}     icon={BookOpen}     color="violet" />
        <StatCard title="Foydalanuvchilar"  value={overview.totalUsers}    icon={Users}        color="blue" />
        <StatCard title="Faol a'zolar"     value={overview.activeMembers}  icon={UserCheck}    color="emerald" />
        <StatCard
          title="Bu oy daromad"
          value={formatCurrency(overview.thisMonthRevenue)}
          icon={TrendingUp}
          color="amber"
          trend={{ value: overview.revenueGrowth, label: "o'tgan oy" }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Olingan kitoblar"  value={overview.borrowedNow}    icon={BookMarked}    color="blue" />
        <StatCard title="Band qilingan"     value={overview.bookedNow}      icon={BookOpen}      color="amber" />
        <StatCard title="Muddati o'tgan"   value={overview.overdueCount}   icon={AlertTriangle} color="red" />
        <StatCard title="Qaytarish so'rov" value={overview.pendingReturns} icon={RotateCcw}     color="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-5">
          <h3 className="mb-4 text-base font-semibold text-[rgb(var(--text))]">Oylik daromad</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueByMonth} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(38,38,50)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'rgb(80,80,100)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgb(80,80,100)', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgb(24,24,30)' }} />
              <Bar dataKey="revenue" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.6} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-5">
          <h3 className="mb-4 text-base font-semibold text-[rgb(var(--text))]">A'zolik turlari</h3>
          {membershipStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={membershipStats} dataKey="count" nameKey="name" cx="50%" cy="50%"
                  innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {membershipStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgb(17,17,21)', border: '1px solid rgb(38,38,50)', borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'rgb(140,140,160)' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-[rgb(var(--text-muted))]">Ma'lumot yo'q</div>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-5">
          <h3 className="mb-4 text-base font-semibold text-[rgb(var(--text))]">Ko'p olingan kitoblar</h3>
          <div className="space-y-3">
            {topBorrowed.slice(0, 6).map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 text-xs font-bold text-[rgb(var(--text-faint))]">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm text-[rgb(var(--text))]">{item.book?.title ?? '—'}</p>
                  <p className="text-xs text-[rgb(var(--text-muted))]">{item.book?.author?.name}</p>
                </div>
                <Badge variant="info">{item.borrowCount} marta</Badge>
              </div>
            ))}
            {topBorrowed.length === 0 && <p className="text-sm text-[rgb(var(--text-muted))]">Ma'lumot yo'q</p>}
          </div>
        </div>

        <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-5">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-[rgb(var(--text))]">
            <Star className="h-4 w-4 text-amber-400" /> Top foydalanuvchilar
          </h3>
          <div className="space-y-3">
            {topUsers.map((u, i) => (
              <div key={u.id} className="flex items-center gap-3">
                <span className="w-6 text-xs font-bold text-[rgb(var(--text-faint))]">{i + 1}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--bg-elevated))] text-xs font-semibold text-[rgb(var(--text-muted))]">
                  {u.firstName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm text-[rgb(var(--text))]">{u.firstName} {u.lastName ?? ''}</p>
                  <p className="text-xs text-[rgb(var(--text-muted))]">{u.phone}</p>
                </div>
                <Badge variant="muted">{u.score} ball</Badge>
              </div>
            ))}
            {topUsers.length === 0 && <p className="text-sm text-[rgb(var(--text-muted))]">Ma'lumot yo'q</p>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] p-5">
        <h3 className="mb-4 text-base font-semibold text-[rgb(var(--text))]">So'nggi harakatlar</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgb(var(--border-subtle))]">
                {['Kitob', 'Foydalanuvchi', 'Holat', 'Sana', 'Tugash'].map(h => (
                  <th key={h} className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-faint))]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--border-subtle))]">
              {recentBorrows.map(r => (
                <tr key={r.id} className="hover:bg-[rgb(var(--bg-elevated))] transition-colors">
                  <td className="py-3 pr-4 font-medium text-[rgb(var(--text))]">{r.bookTitle}</td>
                  <td className="py-3 pr-4 text-[rgb(var(--text-muted))]">{r.userName}</td>
                  <td className="py-3 pr-4"><Badge variant={statusBadgeVariant(r.status)}>{statusLabel(r.status)}</Badge></td>
                  <td className="py-3 pr-4 text-[rgb(var(--text-muted))]">{formatDate(r.startDate)}</td>
                  <td className="py-3 text-[rgb(var(--text-muted))]">{formatDate(r.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentBorrows.length === 0 && (
            <p className="py-6 text-center text-sm text-[rgb(var(--text-muted))]">Ma'lumot yo'q</p>
          )}
        </div>
      </div>
    </div>
  )
}

