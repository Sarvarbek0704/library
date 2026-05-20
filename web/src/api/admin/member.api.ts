export const API_BASE = "http://localhost:3000/api";

export type MemberStatus = "ACTIVE" | "NOTACTIVE";

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
};

export type ApiMember = {
  id: number;
  userId: number;
  membershipId: number;
  startDate: string;
  endDate: string;
  status: MemberStatus;
  isPaid: boolean;

  user?: ApiUser;
  membership?: ApiMembership;
};

export type MemberCreate = Omit<ApiMember, "id" | "user" | "membership">;
export type MemberUpdate = Partial<MemberCreate>;

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
    console.error("API ERROR", {
      url,
      method: init?.method ?? "GET",
      status: res.status,
      body,
    });
    throw new Error(
      `HTTP ${res.status} ${res.statusText} | ${path} | ${JSON.stringify(body)}`,
    );
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
function unwrapList<T>(x: any): T[] {
  if (Array.isArray(x)) return x;

  const keys = ["data", "items", "rows", "results", "list"];
  for (const k of keys) {
    if (Array.isArray(x?.[k])) return x[k];
  }
  for (const k of keys) {
    if (Array.isArray(x?.data?.[k])) return x.data[k];
  }
  return [];
}

export const apiGetMembers = async (): Promise<ApiMember[]> => {
  const res = await request<any>("/member");
  return unwrapList<ApiMember>(res);
};

export const apiCreateMember = (payload: MemberCreate) =>
  request<ApiMember>("/member", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiUpdateMember = (id: number, payload: MemberUpdate) =>
  request<ApiMember>(`/member/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const apiDeleteMember = (id: number) =>
  request<void>(`/member/${id}`, { method: "DELETE" });

export const apiGetUsers = async (): Promise<ApiUser[]> => {
  const res = await request<any>("/user");
  return unwrapList<ApiUser>(res);
};

export const apiGetMemberships = async (): Promise<ApiMembership[]> => {
  const res = await request<any>("/membership");
  return unwrapList<ApiMembership>(res);
};
