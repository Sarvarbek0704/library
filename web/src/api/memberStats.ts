import { api } from "./api";

export type MemberStatStatus =
  | "BOOKED"
  | "BORROWED"
  | "RETURNED"
  | "CANCELED"
  | string;

export type MemberStatsItem = {
  id: number;
  memberId: number;
  bookId: number;
  startDate?: string;
  endDate?: string;
  status?: MemberStatStatus;
  updatedAt?: string;

  member?: any;
  book?: {
    id?: number;
    title?: string;
    description?: string;
    quantity?: number;
    pages?: number;
    status?: string;
  };
};

function normalizeArray(raw: any): MemberStatsItem[] {
  if (Array.isArray(raw)) return raw as any;
  if (Array.isArray(raw?.data)) return raw.data as any;
  return [];
}

export async function apiFetchMemberStats(): Promise<MemberStatsItem[]> {
  const res = await api.get("/member-stats");
  return normalizeArray(res.data);
}

export async function apiFetchMemberStatsById(
  id: number,
): Promise<MemberStatsItem | null> {
  const res = await api.get(`/member-stats/${id}`);
  const raw = res.data?.data ?? res.data;
  return raw ? (raw as MemberStatsItem) : null;
}
