import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  apiFetchBooks,
  apiCreateBook,
  apiUpdateBook,
  apiDeleteBook,
} from "../../api/books";

interface BooksState {
  data: any[];
  loading: boolean;
  meta: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  error: string | null;
}

const initialState: BooksState = {
  data: [],
  loading: false,
  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
  error: null,
};

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (arg?: { page?: number; limit?: number }) => {
    const page = arg?.page ?? 1;
    const limit = arg?.limit ?? 10;
    return await apiFetchBooks(page, limit); // { data, meta }
  },
);

export const addBook = createAsyncThunk(
  "books/addBook",
  async (payload: any) => {
    return await apiCreateBook(payload);
  },
);

export const editBook = createAsyncThunk(
  "books/editBook",
  async ({ id, data }: { id: number; data: any }) => {
    return await apiUpdateBook(id, data);
  },
);

export const removeBook = createAsyncThunk(
  "books/removeBook",
  async (id: number) => {
    await apiDeleteBook(id);
    return id;
  },
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchBooks.pending, (s) => {
      s.loading = true;
      s.error = null;
    });

    b.addCase(fetchBooks.fulfilled, (s, a) => {
      s.loading = false;

      const incoming = Array.isArray(a.payload?.data) ? a.payload.data : [];
      const meta = a.payload?.meta ?? {};
      const page = Number(meta.page ?? 1) || 1;
      const total = Number(meta.total ?? 0) || 0;

      // ✅ Admin pagination uchun eng to‘g‘risi: har safar REPLACE
      s.data = incoming;

      s.meta = { ...meta, total, page };
    });

    b.addCase(fetchBooks.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error?.message || "Failed to fetch books";
    });

    b.addCase(addBook.fulfilled, (s, a) => {
      // ✅ agar user page=1 da bo‘lsa ko‘rinsin, bo‘lmasa tegmang ham bo‘ladi
      s.data = [a.payload, ...(Array.isArray(s.data) ? s.data : [])];
      if (typeof s.meta.total === "number") s.meta.total = s.meta.total + 1;
    });

    b.addCase(editBook.fulfilled, (s, a) => {
      const updated = a.payload;
      s.data = (Array.isArray(s.data) ? s.data : []).map((x: any) =>
        String(x?.id) === String(updated?.id) ? updated : x,
      );
    });

    b.addCase(removeBook.fulfilled, (s, a) => {
      const id = a.payload;
      s.data = (Array.isArray(s.data) ? s.data : []).filter(
        (x: any) => String(x?.id) !== String(id),
      );
      if (typeof s.meta.total === "number" && s.meta.total > 0)
        s.meta.total = s.meta.total - 1;
    });
  },
});

export default booksSlice.reducer;
