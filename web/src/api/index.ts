export const API_BASE = 'https://library-api-3cn1.onrender.com'

export function getToken() {
  return localStorage.getItem('token') || ''
}

export function authHeaders(): HeadersInit {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Global 401 handler ──────────────────────────────────────────────────────
// Called whenever any request returns 401. Clears the token and notifies the
// app so it can redirect to /login without needing React context here.
function handleUnauthorized() {
  if (!localStorage.getItem('token')) return // already logged out
  localStorage.removeItem('token')
  window.dispatchEvent(new Event('auth:logout'))
  window.dispatchEvent(new Event('auth:changed'))
}

export async function http<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
      ...authHeaders(),
    } as HeadersInit,
  })

  if (!res.ok) {
    if (res.status === 401) handleUnauthorized()

    let msg = `HTTP ${res.status}`
    try {
      const body = await res.json()
      msg = body?.message || body?.error || msg
    } catch {
      msg = await res.text().catch(() => msg)
    }
    throw new Error(msg)
  }

  const text = await res.text()
  return text ? (JSON.parse(text) as T) : ({} as T)
}

// ─── FormData fetch helper (for file uploads) ─────────────────────────────────
// Mirrors http() but without Content-Type (browser sets multipart boundary).
export async function httpForm<T = unknown>(path: string, method: 'POST' | 'PATCH', body: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: authHeaders() as HeadersInit,
    body,
  })
  if (!res.ok) {
    if (res.status === 401) handleUnauthorized()
    const b = await res.json().catch(() => ({}))
    throw new Error(b?.message || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

// Auth
export const authApi = {
  login: (body: { phone: string; password: string }) =>
    http<{ access_token: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  sendOtp: (phone: string) =>
    http('/api/auth/otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  register: (body: { phone: string; password: string; firstName: string; otp: string }) =>
    http('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
}

// Books
export const booksApi = {
  list: (params?: Record<string, string | number | undefined>) => {
    const entries = Object.entries(params ?? {}).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])
    const q = entries.length ? '?' + new URLSearchParams(entries).toString() : ''
    return http<{ data: Book[]; total: number; page: number; limit: number }>(`/api/book${q}`)
  },
  get: (id: number) => http<Book>(`/api/book/${id}`),
  create: (body: FormData) => httpForm(`/api/book`, 'POST', body),
  update: (id: number, body: FormData) => httpForm(`/api/book/${id}`, 'PATCH', body),
  delete: (id: number) => http(`/api/book/${id}`, { method: 'DELETE' }),
}

// Authors
export const authorsApi = {
  list: (page = 1, limit = 20) => http<{ data: Author[]; total: number }>(`/api/author?page=${page}&limit=${limit}`),
  create: (body: FormData) => httpForm(`/api/author`, 'POST', body),
  update: (id: number, body: FormData) => httpForm(`/api/author/${id}`, 'PATCH', body),
  delete: (id: number) => http(`/api/author/${id}`, { method: 'DELETE' }),
}

// Categories
export const categoriesApi = {
  list: () => http<Category[]>('/api/category'),
  create: (body: { name: string }) => http<Category>('/api/category', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: number, body: { name: string }) => http<Category>(`/api/category/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id: number) => http(`/api/category/${id}`, { method: 'DELETE' }),
}

// Libraries
export const librariesApi = {
  list: () => http<Library[]>('/api/library'),
  create: (body: Partial<Library>) => http<Library>('/api/library', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: number, body: Partial<Library>) => http<Library>(`/api/library/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id: number) => http(`/api/library/${id}`, { method: 'DELETE' }),
}

// Users
export const usersApi = {
  list: (page = 1, limit = 20, search?: string, role?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set('search', search)
    if (role) params.set('role', role)
    return http<{ data: UserProfile[]; total: number }>(`/api/user?${params}`)
  },
  me: () => http<UserProfile>('/api/user/me'),
  update: (id: number, body: { firstName?: string; lastName?: string }) =>
    http<UserProfile>(`/api/user/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
}

// Members
export const membersApi = {
  list: (page = 1, limit = 20, search?: string, status?: string, membershipId?: number) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    if (membershipId) params.set('membershipId', String(membershipId))
    return http<{ data: Member[]; total: number }>(`/api/member?${params}`)
  },
  /** GET /member/my — current user's active membership */
  myMember: () => http<Member>('/api/member/my'),
  update: (id: number, body: Partial<Member>) => http<Member>(`/api/member/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
}

// Memberships
export const membershipsApi = {
  list: () => http<Membership[]>('/api/membership'),
  create: (body: Partial<Membership>) => http<Membership>('/api/membership', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: number, body: Partial<Membership>) => http<Membership>(`/api/membership/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id: number) => http(`/api/membership/${id}`, { method: 'DELETE' }),
}

// Payments
export const paymentsApi = {
  list: (page = 1, limit = 20, search?: string, status?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    return http<{ data: Payment[]; total: number }>(`/api/payment?${params}`)
  },
  /** GET /payment/my — current user's own payment history */
  myList: (page = 1, limit = 10) =>
    http<{ data: Payment[]; total: number }>(`/api/payment/my?page=${page}&limit=${limit}`),
  create: (body: { membershipId: number; method?: string }) =>
    http<{ message: string; status: string }>('/api/payment', { method: 'POST', body: JSON.stringify(body) }),
  updateStatus: (id: number, body: { status: string }) => http<Payment>(`/api/payment/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
}

// MemberState
export const memberStatsApi = {
  list: (page = 1, limit = 20, search?: string, status?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    return http<{ data: MemberState[]; total: number }>(`/api/member-stats?${params}`)
  },
  /** GET /member-stats/current — user's borrow/book history */
  myCurrent: () => http<MemberState[]>('/api/member-stats/current'),
  borrow: (body: { memberId: number; bookId: number; status: string; quantity: number }) =>
    http('/api/book-manage', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: number, body: { status: string }) => http(`/api/member-stats/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
}

// Return Requests
export const returnRequestsApi = {
  list: (page = 1, limit = 20, search?: string, status?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    return http<{ data: any[]; total: number }>(`/api/return-request?${params}`)
  },
  findByPhone: (phone: string) => http<any[]>('/api/return-request/phone', { method: 'POST', body: JSON.stringify({ phone }) }),
  create: (body: { memberId: number; bookId: number }) => http('/api/return-request', { method: 'POST', body: JSON.stringify(body) }),
  accept: (id: number, body?: { note?: string }) => http(`/api/return-request/${id}/accept`, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  reject: (id: number, body?: { note?: string }) => http(`/api/return-request/${id}/reject`, { method: 'POST', body: JSON.stringify(body ?? {}) }),
}

// Saved Books
export const savedBooksApi = {
  /** GET /saved-books/my — current user's saved books with book data */
  list: () => http<SavedBook[]>('/api/saved-books/my'),
  /** POST /saved-books — server-side toggle (add if not saved, remove if saved) */
  toggle: (bookId: number) =>
    http<{ saved: boolean }>('/api/saved-books', { method: 'POST', body: JSON.stringify({ bookId }) }),
}

// Reviews
export const reviewsApi = {
  forBook: (bookId: number) => http<BookReviews>(`/api/review/book/${bookId}`),
  create: (body: { bookId: number; rating: number; comment?: string }) => http('/api/review', { method: 'POST', body: JSON.stringify(body) }),
  delete: (id: number) => http(`/api/review/${id}`, { method: 'DELETE' }),
}

// Notifications
export const notificationsApi = {
  list: () => http<{ notifications: AppNotification[]; unreadCount: number }>('/api/notification'),
  markRead: (id: number) => http(`/api/notification/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => http('/api/notification/read-all', { method: 'PATCH' }),
  clearAll: () => http('/api/notification', { method: 'DELETE' }),
}

// Waitlist
export const waitlistApi = {
  join: (bookId: number) => http('/api/waitlist', { method: 'POST', body: JSON.stringify({ bookId }) }),
  leave: (bookId: number) => http(`/api/waitlist/${bookId}`, { method: 'DELETE' }),
  mine: () => http<WaitlistEntry[]>('/api/waitlist/my'),
}

// Analytics
export const analyticsApi = {
  dashboard: () => http<AnalyticsDashboard>('/api/analytics/dashboard'),
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: number; firstName: string; lastName?: string; phone: string
  role: string; score: number; isDemo?: boolean; createdAt: string
}

export interface Book {
  id: number; title: string; description?: string; pages?: number
  quantity: number; status: string; authorId: number; categoryId: number; libraryId: number
  author?: Author; category?: Category; library?: Library
  images?: { url: string; path?: string }[]; createdAt: string
}

export interface Author { id: number; name: string; desc?: string; bookCount?: number; images?: { id: number; url: string; filename: string }[] }
export interface Category { id: number; name: string }
export interface Library { id: number; name: string; address?: string; contact?: string; location?: string; lat?: number; lon?: number }

export interface Membership {
  id: number; name: string; price: number; durationDays: number
  limitBorrow: number; limitBook: number; description?: string
}

export interface Member {
  id: number; userId: number; membershipId: number
  startDate: string; endDate: string; status: string; isPaid: boolean
  user?: UserProfile; membership?: Membership
}

export interface Payment {
  id: number; userId: number; membershipId: number; amount: number
  status: string; createdAt: string; user?: UserProfile; membership?: Membership
}

export interface MemberState {
  id: number; memberId: number; bookId: number
  startDate: string; endDate?: string; status: string
  book?: Book; member?: Member & { user?: UserProfile }
}

export interface ReturnRequest {
  id: number; memberId: number; bookId: number
  status: string; note?: string; createdAt: string; decidedAt?: string
  book?: Book; member?: Member & { user?: UserProfile }
}

export interface SavedBook { id: number; bookId: number; book?: Book }

export interface BookReviews {
  avgRating: number; total: number
  ratingDist: Record<string, number>; reviews: Review[]
}

export interface Review {
  id: number; userId: number; bookId: number
  rating: number; comment?: string; createdAt: string; user?: UserProfile
}

export interface AppNotification {
  id: number; userId: number; type: string; title: string
  body: string; isRead: boolean; createdAt: string
}

export interface WaitlistEntry {
  id: number; bookId: number; status: string; createdAt: string; book?: Book
}

export interface AnalyticsDashboard {
  overview: {
    totalBooks: number; totalUsers: number; totalMembers: number; activeMembers: number
    totalRevenue: number; thisMonthRevenue: number; lastMonthRevenue: number; revenueGrowth: number
    thisMonthPayments: number; borrowedNow: number; bookedNow: number
    overdueCount: number; pendingReturns: number; totalReviews: number; avgRating: number
  }
  revenueByMonth: { month: string; revenue: number }[]
  topBorrowed: { book?: Book; borrowCount: number }[]
  topUsers: UserProfile[]
  membershipStats: { name: string; count: number }[]
  recentBorrows: { id: number; bookTitle: string; userName: string; status: string; startDate: string; endDate?: string }[]
}
