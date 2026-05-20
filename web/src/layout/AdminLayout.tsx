import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, BookOpen, Users, UserCheck, CreditCard,
  RotateCcw, BarChart3, Tag, Building2, PenSquare,
  LogOut, Menu, X, BookMarked, ChevronLeft, ChevronRight,
  Sun, Moon,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/user/user.slice'
import { useTheme } from '../contexts/ThemeContext'
import { cn } from '@/lib/utils'

interface NavItem { to: string; label: string; icon: React.ElementType }

const adminNav: NavItem[] = [
  { to: '/admin',               label: 'Dashboard',        icon: LayoutDashboard },
  { to: '/admin/books',         label: 'Kitoblar',         icon: BookOpen },
  { to: '/admin/authors',       label: 'Mualliflar',       icon: PenSquare },
  { to: '/admin/categories',    label: 'Kategoriyalar',    icon: Tag },
  { to: '/admin/libraries',     label: 'Kutubxonalar',     icon: Building2 },
  { to: '/admin/users',         label: 'Foydalanuvchilar', icon: Users },
  { to: '/admin/members',       label: "A'zolar",          icon: UserCheck },
  { to: '/admin/memberships',   label: "A'zoliklar",       icon: BookMarked },
  { to: '/admin/payments',      label: "To'lovlar",        icon: CreditCard },
  { to: '/admin/member-stats',  label: 'Holat',            icon: BarChart3 },
  { to: '/admin/return_requests', label: 'Qaytarish',      icon: RotateCcw },
]

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() =>
    localStorage.getItem('sidebar-collapsed') === 'true'
  )
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(s => s.user.user)
  const { theme, toggleTheme } = useTheme()

  function handleLogout() {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  function toggleCollapsed() {
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', String(next))
      return next
    })
  }

  const sidebarW = collapsed ? 'w-14' : 'w-56'
  const mainML  = collapsed ? 'lg:ml-14' : 'lg:ml-56'

  return (
    <div className="flex min-h-screen bg-app">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col border-r border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] transition-all duration-200 ease-in-out',
        sidebarW,
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className={cn(
          'flex h-14 items-center border-b border-[rgb(var(--border-subtle))] shrink-0',
          collapsed ? 'justify-center px-0' : 'gap-2.5 px-4'
        )}>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--primary))]">
            <BookOpen className="h-3.5 w-3.5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-[rgb(var(--text))] tracking-tight truncate">
              Kutubxona
            </span>
          )}
          {/* Mobile close */}
          {!collapsed && (
            <button className="ml-auto lg:hidden" onClick={() => setMobileOpen(false)}>
              <X className="h-4 w-4 text-[rgb(var(--text-muted))]" />
            </button>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 space-y-0.5">
          {adminNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : undefined}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-lg py-2 text-sm transition-colors',
                collapsed ? 'justify-center px-0' : 'px-3',
                isActive
                  ? 'bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text))]'
                  : 'text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--bg-elevated))] hover:text-[rgb(var(--text))]'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: user + collapse toggle */}
        <div className="border-t border-[rgb(var(--border-subtle))] p-2 space-y-1 shrink-0">
          {/* User row */}
          {collapsed ? (
            <div
              title={user?.firstName}
              className="flex justify-center py-2"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgb(var(--primary))] text-xs font-semibold text-white">
                {user?.firstName?.[0]?.toUpperCase() ?? 'A'}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--primary))] text-xs font-semibold text-white">
                {user?.firstName?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-[rgb(var(--text))]">{user?.firstName ?? 'Admin'}</p>
                <p className="text-xs text-[rgb(var(--text-muted))] capitalize">{user?.role ?? 'admin'}</p>
              </div>
              <button onClick={handleLogout} title="Chiqish" className="text-[rgb(var(--text-faint))] hover:text-red-400 transition-colors">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={toggleCollapsed}
            title={collapsed ? 'Kengaytirish' : 'Yig\'ish'}
            className={cn(
              'hidden lg:flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--bg-elevated))] hover:text-[rgb(var(--text))] transition-colors',
              collapsed && 'justify-center px-0'
            )}
          >
            {collapsed
              ? <ChevronRight className="h-4 w-4" />
              : <><ChevronLeft className="h-4 w-4" /><span>Yig'ish</span></>
            }
          </button>
        </div>
      </aside>

      {/* Main content — min-w-0 prevents flex child from expanding past viewport */}
      <div className={cn('flex min-w-0 flex-1 flex-col transition-all duration-200', mainML)}>
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-[rgb(var(--border-subtle))] glass px-4">
          {/* Mobile menu toggle */}
          <button
            className="rounded-lg p-1.5 text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--bg-elevated))] lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim'}
            className="rounded-lg p-2 text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--bg-elevated))] hover:text-[rgb(var(--text))] transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* Logout (visible when collapsed) */}
          {collapsed && (
            <button
              onClick={handleLogout}
              title="Chiqish"
              className="rounded-lg p-2 text-[rgb(var(--text-muted))] hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </header>

        <main className="flex-1 overflow-x-hidden p-5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
