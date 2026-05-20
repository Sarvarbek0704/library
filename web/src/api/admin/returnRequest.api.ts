import { http } from "./http";

export type ReturnRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type MemberStateStatus =
  | "BOOKED"
  | "BORROWED"
  | "RETURNED"
  | "NOTAVAILABLE"
  | "AVAILABLE";

export type ReturnRequestRow = {
  request: {
    id: number;
    status: ReturnRequestStatus;
    note: string | null;
    createdAt: string;
    decidedAt: string | null;
  };
  user: {
    firstName?: string;
    lastName?: string;
    phone: string;
  };
  book: {
    id: number;
    title?: string;
    image?: null | {
      id: number;
      filename: string;
      url: string;
      ownerId: number;
      ownerType: string;
      createdAt: string;
    };
  };
  memberState: {
    startDate?: string;
    endDate?: string;
    status?: MemberStateStatus;
  };
};

export type UserDto = {
  id: number;
  firstName?: string;
  lastName?: string;
  phone: string;
};

export type MemberDto = {
  id: number;
  userId: number;
  membershipId: number;
  startDate?: string;
  endDate?: string;
  status?: "ACTIVE" | "NOTACTIVE";
  isPaid?: boolean;
};

function normalizeList<T = any>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export async function apiSearchReturnRequestsByPhone(phone: string) {
  const res = await http.post("/api/return-request/phone", { phone });
  return normalizeList<ReturnRequestRow>(res.data);
}

// Swaggerda default GET yo‘q (faqat phone orqali) — shuning uchun defaultda ham phone bilan ishlaymiz
export async function apiGetReturnRequestsDefault() {
  const res = await http.post("/api/return-request/phone", { phone: "" });
  return normalizeList<ReturnRequestRow>(res.data);
}

export async function apiAcceptReturnRequest(params: {
  id: number;
  memberId: number;
  bookId: number;
  note: string;
}) {
  const { id, ...body } = params;
  const res = await http.post(`/api/return-request/${id}/accept`, body);
  return res.data;
}

export async function apiRejectReturnRequest(params: {
  id: number;
  memberId: number;
  bookId: number;
  note: string;
}) {
  const { id, ...body } = params;
  const res = await http.post(`/api/return-request/${id}/reject`, body);
  return res.data;
}

/* ===== memberId topish uchun helper APIlar ===== */

export async function apiFetchAllUsers(page = 1, limit = 200) {
  const res = await http.get(`/api/user/alluser?page=${page}&limit=${limit}`);
  return normalizeList<UserDto>(res.data);
}

export async function apiFetchMembers() {
  const res = await http.get("/api/member");
  return normalizeList<MemberDto>(res.data);
}

export function pickActiveMemberIdForUser(
  members: MemberDto[],
  userId: number,
): number | null {
  const list = members.filter((m) => Number(m.userId) === Number(userId));
  const active = list.find(
    (m) => String(m.status || "").toUpperCase() === "ACTIVE",
  );
  if (active?.id) return Number(active.id);
  if (list[0]?.id) return Number(list[0].id);
  return null;
}
