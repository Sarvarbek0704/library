import { api } from "./api";

export type ReturnRequestCreateBody = {
  memberId: number;
  bookId: number;
};

export type ReturnRequestResponse = {
  id: number;
  memberId: number;
  bookId: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  note: string | null;
  createdAt: string;
  decidedAt: string | null;
};

export async function apiCreateReturnRequest(
  body: ReturnRequestCreateBody,
): Promise<ReturnRequestResponse> {
  const res = await api.post("/return-request", body, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data?.data ?? res.data;
}
