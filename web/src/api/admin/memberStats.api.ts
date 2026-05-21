export const API_BASE = "https://library-api-3cn1.onrender.com/api";

export type StatusType = "AVAILABLE" | "BOOKED" | "BORROWED" | "RETURNED";

export type MemberStat = {
  id: number;
  memberId: number;
  bookId: number;
  startDate: string;
  endDate: string;
  status: StatusType;

  member?: any;
  book?: any;
};

export type MemberStatCreate = {
  memberId: number;
  bookId: number;
  status: StatusType;
};

export type MemberStatUpdate = Partial<MemberStatCreate>;

export type ApiBook = {
  id: number;
  name?: string;
  title?: string;
  img?: string;
  status?: string;
  author?: any;
  isbn?: string;
};

export type ApiUser = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  phone?: string;
  role?: string;
};

export type ApiMember = {
  id: number;
  userId?: number | string;
  membershipId?: number;
  status?: string;
  isPaid?: boolean;
  user?: ApiUser;
};

export type ListParams = {
  page?: number;
  limit?: number;
  q?: string;
};

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function toArray<T>(raw: any): T[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw?.result)) return raw.result;
  if (Array.isArray(raw?.users)) return raw.users;
  if (Array.isArray(raw?.members)) return raw.members;
  if (Array.isArray(raw?.books)) return raw.books;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;

  return [];
}

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

function withQuery(path: string, params?: Record<string, any>) {
  if (!params) return path;
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `${path}?${qs}` : path;
}

async function request<T>(
  path: string,
  init?: RequestInit,
  params?: Record<string, any>,
): Promise<T> {
  const url = `${API_BASE}${withQuery(path, params)}`;

  const res = await fetch(url, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers || {}) },
  });

  if (!res.ok) {
    const body = await safeJson(res);
    throw new Error(
      body?.message
        ? String(body.message)
        : `HTTP ${res.status} ${res.statusText}`,
    );
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function apiGetMemberStats(): Promise<MemberStat[]> {
  const res = await request<any>("/member-stats");
  return toArray<MemberStat>(res).map((x: any) => ({
    ...x,
    id: Number(x.id),
    memberId: Number(x.memberId),
    bookId: Number(x.bookId),
  }));
}

export async function apiCreateMemberStat(
  payload: MemberStatCreate,
): Promise<MemberStat> {
  return request<MemberStat>("/book-manage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateMemberStat(
  id: number,
  payload: MemberStatUpdate,
): Promise<MemberStat> {
  return request<MemberStat>(`/member-stats/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteMemberStat(id: number): Promise<void> {
  return request<void>(`/member-stats/${id}`, { method: "DELETE" });
}

export async function apiGetMembers(
  params: ListParams = {},
): Promise<ApiMember[]> {
  const res = await request<any>("/member", undefined, params);
  return toArray<ApiMember>(res).map((m: any) => ({
    ...m,
    id: Number(m.id),
    userId: m.userId == null ? undefined : Number(m.userId),
  }));
}

export async function apiGetBooks(params: ListParams = {}): Promise<ApiBook[]> {
  const res = await request<any>("/book", undefined, params);
  return toArray<ApiBook>(res).map((b: any) => ({
    ...b,
    id: Number(b.id),
  }));
}

export async function apiGetUsers(params: ListParams = {}): Promise<ApiUser[]> {
  const res = await request<any>("/user", undefined, params);
  return toArray<ApiUser>(res).map((u: any) => ({
    ...u,
    id: Number(u.id),
  }));
}

export function formatMemberLabel(m?: ApiMember) {
  if (!m) return "-";
  const u = m.user;
  if (u) {
    const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ");
    return fullName || u.username || u.email || u.phone || `User #${u.id}`;
  }
  return `Member #${m.id}`;
}

export function formatMemberShort(m?: ApiMember) {
  if (!m) return "-";
  const u = m.user;
  if (u) {
    return (
      [u.firstName, u.lastName].filter(Boolean).join(" ") ||
      u.username ||
      `Member #${m.id}`
    );
  }
  return `Member #${m.id}`;
}

export function formatBookLabel(b?: ApiBook) {
  if (!b) return "-";
  const title = b.title ?? b.name ?? "";
  if (!title) return `Book #${b.id}`;

  let authorText = "";
  const a = b.author;
  if (a) {
    if (typeof a === "string") authorText = ` — ${a}`;
    else if (typeof a === "object") {
      const nm = [a.firstName, a.lastName].filter(Boolean).join(" ");
      if (nm) authorText = ` — ${nm}`;
      else if (a.name) authorText = ` — ${a.name}`;
    }
  }

  return `${title}${authorText}`;
}
