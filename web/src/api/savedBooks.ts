import { api } from "./api";

export async function apiGetSavedBookRecords(userId: number): Promise<any[]> {
  const res = await api.get(`/saved-books/user/${userId}`);
  const raw = res.data;

  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

export async function apiSaveBook(bookId: number) {
  const res = await api.post(`/saved-books`, { bookId });
  return res.data?.data ?? res.data;
}

export async function apiDeleteSavedBook(bookId: number) {
  const res = await api.delete(`/saved-books/${bookId}`);
  return res.data?.data ?? res.data;
}
