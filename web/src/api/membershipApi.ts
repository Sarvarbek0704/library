import type { Membership } from "../types/membership";

export async function fetchMemberships(): Promise<Membership[]> {
    const res = await fetch("http://localhost:3000/api/membership");

    if (!res.ok) throw new Error("Membershiplarni yuklashda xatolik!");

    const json = await res.json();
    if (Array.isArray(json)) return json as Membership[];
    if (Array.isArray(json.data)) return json.data as Membership[];

    return [];
}
