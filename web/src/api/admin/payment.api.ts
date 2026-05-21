export const API_BASE = "https://library-api-3cn1.onrender.com/api";

export type PaymentMethod = "CARD";
export type PaymentStatus = "SUCCESS" | "FAILED";

export type ApiPayment = {
  id: number;
  userId: number;
  membershipId: number;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;

  user?: any;
  membership?: any;
};

export type PaymentCreate = Omit<
  ApiPayment,
  "id" | "createdAt" | "updatedAt" | "user" | "membership"
>;
export type PaymentUpdate = Partial<PaymentCreate>;

export type ApiUser = {
  id: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  username?: string;
};

export type ApiMembership = {
  id: number;
  name?: string;
  price?: number;
  durationDays?: number;
  description?: string;
  limit?: number;
};

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers || {}) },
  });

  if (!res.ok) {
    const body = await safeJson(res);
    console.error("API ERROR", { url, status: res.status, body });
    throw new Error(
      `HTTP ${res.status} ${res.statusText} | ${path} | ${JSON.stringify(body)}`,
    );
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiGetPayments = () => request<ApiPayment[]>("/payment");
export const apiCreatePayment = (payload: PaymentCreate) =>
  request<ApiPayment>("/payment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const apiUpdatePayment = (id: number, payload: PaymentUpdate) =>
  request<ApiPayment>(`/payment/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
export const apiDeletePayment = (id: number) =>
  request<void>(`/payment/${id}`, { method: "DELETE" });

export const apiGetUsers = () => request<ApiUser[]>("/user");
export const apiGetMemberships = () => request<ApiMembership[]>("/membership");

export function formatUserLabel(u?: ApiUser) {
  if (!u) return "-";
  const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ");
  const phone = u.phone ? ` (${u.phone})` : "";
  return (fullName || u.username || u.email || `User #${u.id}`) + phone;
}

export function formatMembershipLabel(m?: ApiMembership) {
  if (!m) return "-";
  return m.name || "Membership";
}
