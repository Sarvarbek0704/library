import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import MainLayout from '../layout/MainLayout'
import AdminLayout from '../layout/AdminLayout'
import SuperadminLayout from '../layout/Superadmin/SuperadminLayout'
import { getRoleFromToken } from '../utils'
import { Spinner } from '@/components/Spinner'

// User pages
const Home           = lazy(() => import('../pages/Home'))
const Books          = lazy(() => import('../pages/Books'))
const BookDetails    = lazy(() => import('../pages/BookDetails'))
const ReadingHistory = lazy(() => import('../pages/Reading_History'))
const SavedBooks     = lazy(() => import('../pages/Saved_Books'))
const Membership     = lazy(() => import('../pages/Membership'))
const UserProfile    = lazy(() => import('../pages/UserProfile'))
const Notifications  = lazy(() => import('../pages/Notifications'))
const Payment        = lazy(() => import('../pages/Payment'))

// Auth pages
const Login    = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const OTP      = lazy(() => import('../pages/OTP'))

// Admin pages
const AdminHome          = lazy(() => import('../pages/Admin'))
const BooksAdmin         = lazy(() => import('../pages/Admin/BooksAdmin'))
const AuthorsAdmin       = lazy(() => import('../pages/Admin/Authors'))
const CategoriesAdmin    = lazy(() => import('../pages/Admin/Categories'))
const LibrariesAdmin     = lazy(() => import('../pages/Admin/Libraries'))
const UsersAdmin         = lazy(() => import('../pages/Admin/Users'))
const MembersAdmin       = lazy(() => import('../pages/Admin/Members'))
const MembershipsAdmin   = lazy(() => import('../pages/Admin/Memberships'))
const PaymentsAdmin      = lazy(() => import('../pages/Admin/Payments'))
const MemberStatsAdmin   = lazy(() => import('../pages/Admin/MemberStats'))
const ReturnRequestAdmin = lazy(() => import('../pages/Admin/ReturnRequest'))

// Superadmin pages
const SuperadminHome  = lazy(() => import('../pages/Superadmin'))
const AdminSuperadmin = lazy(() => import('../pages/Superadmin/Admin'))

function PageLoader() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

const AppRouter: React.FC = () => {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  )

  useEffect(() => {
    const sync = () => setToken(localStorage.getItem('token'))
    window.addEventListener('auth:changed', sync)
    window.addEventListener('storage', (e) => { if (e.key === 'token') sync() })
    return () => {
      window.removeEventListener('auth:changed', sync)
    }
  }, [])

  const roleFromToken = useMemo(() => {
    const r = getRoleFromToken(token)
    return r ? String(r).toLowerCase() : null
  }, [token])

  const AdminGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    if (!token) return <Navigate to="/login" replace />
    if (roleFromToken === 'admin' || roleFromToken === 'superadmin') return children
    return <Navigate to="/" replace />
  }

  const SuperadminGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    if (!token) return <Navigate to="/login" replace />
    if (roleFromToken === 'superadmin') return children
    return <Navigate to="/" replace />
  }

  const adminRoutes = (base: string) => (
    <>
      <Route index element={<AdminHome />} />
      <Route path="books"           element={<BooksAdmin />} />
      <Route path="authors"         element={<AuthorsAdmin />} />
      <Route path="categories"      element={<CategoriesAdmin />} />
      <Route path="libraries"       element={<LibrariesAdmin />} />
      <Route path="users"           element={<UsersAdmin />} />
      <Route path="members"         element={<MembersAdmin />} />
      <Route path="memberships"     element={<MembershipsAdmin />} />
      <Route path="payments"        element={<PaymentsAdmin />} />
      <Route path="member-stats"    element={<MemberStatsAdmin />} />
      <Route path="return_requests" element={<ReturnRequestAdmin />} />
      {base === 'superadmin' && <Route path="admin" element={<AdminSuperadmin />} />}
    </>
  )

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp"      element={<OTP />} />
        <Route path="/payment"  element={<Payment />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="books"           element={<Books />} />
          <Route path="books/:id"       element={<BookDetails />} />
          <Route path="reading_history" element={<ReadingHistory />} />
          <Route path="saved_books"     element={<SavedBooks />} />
          <Route path="membership"      element={<Membership />} />
          <Route path="profile"         element={<UserProfile />} />
          <Route path="notifications"   element={<Notifications />} />
        </Route>

        <Route
          path="/admin"
          element={<AdminGuard><AdminLayout /></AdminGuard>}
        >
          {adminRoutes('admin')}
        </Route>

        <Route
          path="/superadmin"
          element={<SuperadminGuard><SuperadminLayout /></SuperadminGuard>}
        >
          <Route index element={<SuperadminHome />} />
          {adminRoutes('superadmin')}
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRouter
