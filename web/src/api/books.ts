import { api } from "./api";

const API_BASE = "http://localhost:3000";

function resolveImageUrl(v?: string): string {
  const s = String(v || "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return `${API_BASE}${s}`;
  return `${API_BASE}/${s}`;
}

export type BookStatus = "AVAILABLE" | "BOOKED" | "BORROWED" | "RETURNED";

export type BookCreateBody = {
  libraryId: number;
  categoryId: number;
  authorId: number;
  title: string;
  status: BookStatus;
  description?: string;
  img?: string;

  page: number;
  quantity: number;
};

export type BooksResponse = {
  data: any[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
};

const isFormData = (v: any): v is FormData =>
  typeof FormData !== "undefined" && v instanceof FormData;

const toNum = (v: any): number | undefined => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

export async function apiFetchBooks(
  page = 1,
  limit = 10,
): Promise<BooksResponse> {
  const res = await api.get(`/book?page=${page}&limit=${limit}`);
  const raw = res.data;

  const list = Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw)
      ? raw
      : [];

  const normalized = list.map((b: any) => {
    const id = b?.id ?? b?._id;
    const imgFromImages = b?.images?.[0]?.url || "";
    const img = resolveImageUrl(imgFromImages || b?.img || b?.avatar);

    const pages = toNum(b?.page);
    const quantity = toNum(b?.quantity);
    const qty = typeof quantity === "number" ? Math.trunc(quantity) : 0;

    return { ...b, id, img, page: pages, quantity: qty };
  });

  const meta = raw?.meta ?? {};
  return { data: normalized, meta };
}

export async function apiFetchBookById(id: number): Promise<any | null> {
  const res = await api.get(`/book/${id}`);
  const raw = res.data?.data ?? res.data;

  if (!raw) return null;

  const imgFromImages = raw?.images?.[0]?.url || "";
  const img = resolveImageUrl(imgFromImages || raw?.img || raw?.avatar);
  const pages = toNum(raw?.page);
  const quantity = toNum(raw?.quantity);
  const qty = typeof quantity === "number" ? Math.trunc(quantity) : 0;

  return {
    ...raw,
    id: raw?.id ?? raw?._id ?? id,
    img,
    page: pages,
    quantity: qty,
  };
}

const toIntPositive = (v: any): number | null => {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const i = Math.trunc(n);
  if (i <= 0) return null;
  return i;
};

const toIntNonNeg = (v: any): number | null => {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const i = Math.trunc(n);
  if (i < 0) return null;
  return i;
};

const setFDInt = (
  fd: FormData,
  key: string,
  v: any,
  mode: "positive" | "nonneg",
) => {
  const i = mode === "positive" ? toIntPositive(v) : toIntNonNeg(v);
  if (i === null) return;
  fd.set(key, String(i));
};

export async function apiCreateBook(payload: any) {
  if (isFormData(payload)) {
    setFDInt(payload, "page", payload.get("page"), "positive");
    setFDInt(payload, "quantity", payload.get("quantity"), "nonneg");

    const res = await api.post("/book", payload);
    return res.data?.data ?? res.data;
  }

  const safePayload: any = { ...payload };

  const p = toIntPositive(safePayload.page);
  if (p === null) delete safePayload.page;
  else safePayload.page = p;

  const q = toIntNonNeg(safePayload.quantity);
  if (q === null) delete safePayload.quantity;
  else safePayload.quantity = q;

  const imgRaw = String(safePayload?.img || "").trim();
  if (!imgRaw || imgRaw.startsWith("data:image/")) delete safePayload.img;

  const res = await api.post("/book", safePayload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data?.data ?? res.data;
}

export async function apiUpdateBook(id: number, payload: any) {
  const isFD = typeof FormData !== "undefined" && payload instanceof FormData;

  if (isFD) {
    setFDInt(payload, "page", payload.get("page"), "positive");
    setFDInt(payload, "quantity", payload.get("quantity"), "nonneg");

    const res = await api.patch(`/book/${id}`, payload);
    return res.data?.data ?? res.data;
  }

  const safePayload: any = { ...payload };
  const p = toIntPositive(safePayload.page);
  if (p === null) delete safePayload.page;
  else safePayload.page = p;

  const q = toIntNonNeg(safePayload.quantity);
  if (q === null) delete safePayload.quantity;
  else safePayload.quantity = q;

  const imgRaw = String(safePayload?.img || "").trim();
  if (!imgRaw || imgRaw.startsWith("data:image/")) delete safePayload.img;

  const res = await api.patch(`/book/${id}`, safePayload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data?.data ?? res.data;
}

export async function apiDeleteBook(id: number) {
  const res = await api.delete(`/book/${id}`);
  return res.data?.data ?? res.data;
}
