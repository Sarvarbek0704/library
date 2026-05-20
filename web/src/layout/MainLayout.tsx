import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Home, BookOpen, History, Bookmark, User,
  LogOut, Menu, X, BookMarked, ChevronDown, Sun, Moon, Bell,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/user/user.slice'
import { useTheme } from '../contexts/ThemeContext'
import { useQuery } from '@tanstack/react-query'
import { notificationsApi } from '@/api'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/',                label: 'Asosiy',    icon: Home },
  { to: '/books',           label: 'Kitoblar',  icon: BookOpen },
  { to: '/reading_history', label: 'Tarix',     icon: History },
  { to: '/saved_books',     label: 'Saqlangan', icon: Bookmark },
  { to: '/membership',      label: "A'zolik",   icon: BookMarked },
]

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(s => s.user.user)
  const { theme, toggleTheme } = useTheme()

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.list,
    enabled: !!user,
    refetchInterval: 60_000,
    retry: false,
  })
  const unreadCount = notifData?.unreadCount ?? 0

  function handleLogout() {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [])

  return (
    <div className="min-h-screen bg-app">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-[rgb(var(--border-subtle))] glass">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgb(var(--primary))]">
              <BookOpen className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="hidden text-sm font-semibold text-[rgb(var(--text))] sm:block tracking-tight">Kutubxona</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex ml-4">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => cn(
                  'rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'text-[rgb(var(--text))] bg-[rgb(var(--bg-elevated))]'
                    : 'text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--bg-elevated))]'
                )}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim'}
              className="rounded-lg p-2 text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--bg-elevated))] hover:text-[rgb(var(--text))] transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Notifications bell */}
            {user && (
              <NavLink
                to="/notifications"
                className={({ isActive }) => cn(
                  'relative rounded-lg p-2 transition-colors',
                  isActive
                    ? 'text-[rgb(var(--text))] bg-[rgb(var(--bg-elevated))]'
                    : 'text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--bg-elevated))] hover:text-[rgb(var(--text))]'
                )}
                title="Bildirishnomalar"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </NavLink>
            )}

            {/* User menu */}
            {user ? (
              <div className="relative ml-1">
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2 rounded-lg border border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-elevated))] px-2.5 py-1.5 text-sm text-[rgb(var(--text))] hover:border-[rgb(var(--border))] transition-colors"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgb(var(--primary))] text-xs font-semibold text-white">
                    {user.firstName?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm">{user.firstName}</span>
                  <ChevronDown className="h-3 w-3 text-[rgb(var(--text-faint))]" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full z-20 mt-1.5 w-48 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-card))] shadow-xl animate-in py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--bg-elevated))] transition-colors"
                      >
                        <User className="h-3.5 w-3.5" />
                        Profil
                      </Link>
                      <Link
                        to="/notifications"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between gap-2.5 px-3 py-2.5 text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--bg-elevated))] transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Bell className="h-3.5 w-3.5" />
                          Bildirishnomalar
                        </span>
                        {unreadCount > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white px-1">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                      <div className="my-1 border-t border-[rgb(var(--border-subtle))]" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/8 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Chiqish
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-[rgb(var(--primary))] px-3.5 py-1.5 text-sm font-medium text-white hover:bg-[rgb(var(--primary-hover))] transition-colors ml-1"
              >
                Kirish
              </Link>
            )}

            {/* Mobile menu btn */}
            <button
              className="ml-1 rounded-lg p-2 text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--bg-elevated))] md:hidden"
              onClick={() => setMenuOpen(o => !o)}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {menuOpen && (
          <div className="border-t border-[rgb(var(--border-subtle))] bg-[rgb(var(--bg-card))] px-4 py-2 md:hidden">
            <nav className="space-y-0.5 pb-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'text-[rgb(var(--text))] bg-[rgb(var(--bg-elevated))]'
                      : 'text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--bg-elevated))]'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
              {user && (
                <>
                  <NavLink
                    to="/notifications"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => cn(
                      'flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                      isActive
                        ? 'text-[rgb(var(--text))] bg-[rgb(var(--bg-elevated))]'
                        : 'text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--bg-elevated))]'
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Bell className="h-4 w-4" /> Bildirishnomalar
                    </span>
                    {unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white px-1">
                        {unreadCount}
                      </span>
                    )}
                  </NavLink>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--bg-elevated))] transition-colors"
                  >
                    <User className="h-4 w-4" /> Profil
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout() }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/8 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Chiqish
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      {/* Bottom nav (mobile) — 5 items */}
      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-[rgb(var(--border-subtle))] glass md:hidden">
        <div className="flex items-center justify-around px-1 py-1">
          <NavLink to="/" end className={({ isActive }) => cn('flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] transition-colors', isActive ? 'text-[rgb(var(--text))]' : 'text-[rgb(var(--text-faint))]')}>
            <Home className="h-5 w-5" /><span>Asosiy</span>
          </NavLink>
          <NavLink to="/books" className={({ isActive }) => cn('flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] transition-colors', isActive ? 'text-[rgb(var(--text))]' : 'text-[rgb(var(--text-faint))]')}>
            <BookOpen className="h-5 w-5" /><span>Kitoblar</span>
          </NavLink>
          <NavLink to="/reading_history" className={({ isActive }) => cn('flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] transition-colors', isActive ? 'text-[rgb(var(--text))]' : 'text-[rgb(var(--text-faint))]')}>
            <History className="h-5 w-5" /><span>Tarix</span>
          </NavLink>
          <NavLink to="/notifications" className={({ isActive }) => cn('relative flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] transition-colors', isActive ? 'text-[rgb(var(--text))]' : 'text-[rgb(var(--text-faint))]')}>
            <span className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-violet-500 text-[8px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </span>
            <span>Xabarnoma</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => cn('flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] transition-colors', isActive ? 'text-[rgb(var(--text))]' : 'text-[rgb(var(--text-faint))]')}>
            <User className="h-5 w-5" /><span>Profil</span>
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
