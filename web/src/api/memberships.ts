import { api } from "./api";

export interface Membership {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  description: string;
  limitBorrow: number;
  limitBook: number;
}

export interface MembershipCreate {
  name: string;
  price: number;
  durationDays: number;
  description: string;
  limitBorrow: number;
  limitBook: number;
}

export interface MembershipUpdate {
  name?: string;
  price?: number;
  durationDays?: number;
  description?: string;
  limitBorrow?: number;
  limitBook?: number;
}

const unwrap = <T>(payload: any): T => {
  return (payload?.data ?? payload?.membership ?? payload) as T;
};

export async function apiFetchMemberships(): Promise<Membership[]> {
  const res = await api.get("/membership");
  return unwrap<Membership[]>(res.data);
}

export async function apiCreateMembership(
  body: MembershipCreate,
): Promise<Membership> {
  const res = await api.post("/membership", body);
  return unwrap<Membership>(res.data);
}

export async function apiUpdateMembership(
  id: number,
  body: MembershipUpdate,
): Promise<Membership> {
  const res = await api.patch(`/membership/${id}`, body);
  return unwrap<Membership>(res.data);
}

export async function apiDeleteMembership(id: number): Promise<any> {
  const res = await api.delete(`/membership/${id}`);
  return res.data;
}
