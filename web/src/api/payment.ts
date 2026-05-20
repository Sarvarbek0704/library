import { api } from "./api";

export type PaymentMethod = "CARD";
export type PaymentStatus = "SUCCESS" | "PENDING" | "FAILED";

export type PaymentBody = {
  userId: number;
  membershipId: number;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
};

export type PaymentResponse = {
  id?: number;
  userId?: number;
  membershipId?: number;
  method?: PaymentMethod;
  amount?: number | string;
  status?: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
  message?: any;
};

export async function apiCreatePayment(
  body: PaymentBody,
): Promise<PaymentResponse> {
  const res = await api.post("/payment", body);
  return res.data?.data ?? res.data;
}
