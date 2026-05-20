import { api } from "./api";

export type Member = {
  id: number;
  userId: number;
  membershipId: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "INACTIVE" | string;
  isPaid: boolean;
};

export type Payment = {
  id: number;
  userId: number;
  membershipId: number;
  method: "CARD" | string;
  amount: string;
  status: "SUCCESS" | "FAILED" | "PENDING" | string;
  paidAt: string;
  createdAt: string;
};

export type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  role: "USER" | "ADMIN" | "SUPERADMIN" | string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  score: number;
  members: Member[];
  payments: Payment[];
  bookHistory: any[];
  images: { id: number; url: string }[];
};

export async function apiGetUserById(id: number): Promise<UserProfile> {
  const res = await api.get(`/user/${id}`);
  return res.data?.data ?? res.data;
}
