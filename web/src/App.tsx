import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppRouter from './Router/AppRouter'
import { getRoleFromToken } from './utils'
import { useAppDispatch } from './store/hooks'
import { setUser } from './store/user/user.slice'
import { http } from './api'
import type { UserProfile } from './api'

function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const dispatch = useAppDispatch()

  // ── Global 401 listener: token expired/invalid anywhere in the app ──────────
  useEffect(() => {
    const handleLogout = () => {
      navigate('/login', { replace: true })
    }
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [navigate])

  // ── Auth check on route change ───────────────────────────────────────────────
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('token')
      const publicRoutes = ['/login', '/register', '/otp']
      const isPublic = publicRoutes.includes(pathname) || pathname.startsWith('/books')

      if (!token) {
        if (!isPublic) navigate('/login', { replace: true })
        return
      }

      const roleFromJwt = getRoleFromToken(token)

      if (roleFromJwt) {
        const role = roleFromJwt.toLowerCase()

        // Verify token is still valid on the server
        try {
          const me = await http<UserProfile>('/api/user/me')
          dispatch(setUser({
            id: String(me.id),
            firstName: me.firstName,
            lastName: me.lastName ?? '',
            phone: me.phone,
            role,
          }))
        } catch {
          // /me returned 401 → handleUnauthorized() already cleared token and
          // dispatched auth:logout → the listener above will navigate to /login.
          // Nothing else to do here.
          return
        }

        // Don't redirect away from public routes — let Login/Register handle that
        if (isPublic) return

        if (role === 'admin' && !pathname.startsWith('/admin')) return navigate('/admin')
        if (role === 'superadmin' && !pathname.startsWith('/superadmin')) return navigate('/superadmin')
        if (role === 'user' && (pathname.startsWith('/admin') || pathname.startsWith('/superadmin'))) return navigate('/')
      } else {
        // JWT decode failed (malformed token)
        localStorage.removeItem('token')
        window.dispatchEvent(new Event('auth:changed'))
        if (!isPublic) navigate('/login', { replace: true })
      }
    }

    checkAuth()
  }, [navigate, pathname, dispatch])

  return <AppRouter />
}

export default App
