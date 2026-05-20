import axios from "axios";

export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";

export type AnyUser = Record<string, any> & {
  id?: string | number;
  userId?: string | number;
  _id?: string | number;

  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;

  img?: string;
  avatar?: string;
  image?: string;

  images?: Array<string | { url?: string; path?: string }>;
};

export interface ApiUser {
  id: string | number;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;

  isActive?: boolean;
  avatar?: string;
  images?: Array<string | { url?: string; path?: string }>;
}

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getLoginPhone(): string {
  return (
    localStorage.getItem("phone") ||
    localStorage.getItem("userPhone") ||
    localStorage.getItem("loginPhone") ||
    ""
  );
}

const API_BASE = "http://localhost:3000";

export function resolveImageUrl(url?: string): string {
  if (!url) return "";
  const s = String(url).trim();
  if (!s) return "";
  if (s.startsWith("blob:")) return s;
  if (s.startsWith("data:image/")) return s;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return `${API_BASE}${s}`;
  return `${API_BASE}/${s}`;
}

function pickAnyAvatar(u: AnyUser): string {
  const direct = u.img || u.avatar || u.image;
  if (direct) return resolveImageUrl(direct);

  const img0 = u.images?.[0];
  if (!img0) return "";

  if (typeof img0 === "string") return resolveImageUrl(img0);

  return resolveImageUrl(img0.url || img0.path);
}

/* =======================
   GET: My user
======================= */
export async function fetchMyUser(): Promise<AnyUser | null> {
  const userId = localStorage.getItem("userId");
  if (!userId) return null;

  try {
    const res = await api.get(`/user/${userId}`);
    const u = res.data as AnyUser;
    return { ...u, img: pickAnyAvatar(u) || u.img };
  } catch (e) {
    console.error("fetchMyUser error:", e);
    return null;
  }
}

/* =======================
   PATCH: Update MY profile
   (ProfileModal uchun)
======================= */
export async function updateUser(
  id: string | number,
  data: Partial<AnyUser>,
  avatarFile?: File | null,
): Promise<AnyUser> {
  const fd = new FormData();

  if (data.firstName != null) fd.append("firstName", String(data.firstName));
  if (data.lastName != null) fd.append("lastName", String(data.lastName));

  // phone backend ruxsat bersa ishlaydi, bermasa 403 bo‘lishi mumkin
  if (data.phone != null) fd.append("phone", String(data.phone));

  if (avatarFile) fd.append("avatar", avatarFile);

  const res = await api.patch(`/user/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const u = res.data as AnyUser;
  const img = pickAnyAvatar(u);
  return { ...u, img };
}

/* =======================
   GET: Users list
======================= */
type UsersListResponse = {
  data: ApiUser[];
  total?: number;
  meta?: { total?: number; page?: number; limit?: number };
};

export type UsersQuery = { page?: number; limit?: number };

export async function getUsers(params: UsersQuery = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const res = await api.get<UsersListResponse>("/user/alluser", {
    params: { page, limit },
  });

  const users = Array.isArray(res.data?.data) ? res.data.data : [];
  const total = res.data?.total ?? res.data?.meta?.total ?? users.length;

  return { users, total, page, limit };
}

/* =======================
   (ixtiyoriy) CREATE user
   agar hali kerak bo‘lsa
======================= */
export type UserUpsertBody = {
  firstName: string;
  lastName: string;
  phone: string;
  role?: UserRole;
  password?: string;
  avatar?: File | null;
};

function toFormData(body: UserUpsertBody) {
  const fd = new FormData();
  fd.append("firstName", body.firstName);
  fd.append("lastName", body.lastName);
  fd.append("phone", body.phone);
  if (body.role) fd.append("role", body.role);
  if (body.password) fd.append("password", body.password);
  if (body.avatar) fd.append("avatar", body.avatar);
  return fd;
}

export async function createUser(body: UserUpsertBody) {
  const fd = toFormData(body);
  const res = await api.post<ApiUser>("/user", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
