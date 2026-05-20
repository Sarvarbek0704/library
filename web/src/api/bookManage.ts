import { api } from "./api";

export type BookManageStatus =
  | "BOOKED"
  | "BORROWED"
  | "RETURNED"
  | "CANCELLED"
  | string;

export type BookManageCreateBody = {
  bookId: number;
  memberId: number;
  status: BookManageStatus; // sen aytgandek "BOOKED"
  quantity: number; // 1
};

export async function apiCreateBookManage(body: BookManageCreateBody) {
  const res = await api.post("/book-manage", body, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data?.data ?? res.data;
}

/**
 * ✅ MemberId-ni user profilidan topib olamiz (ACTIVE member)
 * Backendda userId tokendan olinmaydi bu endpointda, shuning uchun memberId kerak.
 */
export async function apiGetMyActiveMemberId(): Promise<number> {
  const userIdRaw = localStorage.getItem("userId");
  const userId = Number(userIdRaw || 0);
  if (!userId) throw new Error("userId topilmadi. Qayta login qiling.");

  const uRes = await api.get(`/user/${userId}`);
  const u = uRes.data?.data ?? uRes.data;

  const members = Array.isArray(u?.members) ? u.members : [];
  const active = members.find(
    (m: any) => String(m?.status || "").toUpperCase() === "ACTIVE",
  );

  const memberId = Number(active?.id || 0);
  if (!memberId)
    throw new Error(
      "Active membership topilmadi. Avval membership sotib oling.",
    );
  return memberId;
}
