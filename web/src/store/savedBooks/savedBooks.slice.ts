import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  apiDeleteSavedBook,
  apiGetSavedBookRecords,
  apiSaveBook,
} from "../../api/savedBooks";
import { apiFetchBookById } from "../../api/books";

export interface SavedBook {
  id: number; 
  name: string;
  title?: string;
  author: { name: string };
  category: { categoryName: string };
  library: { name: string };
  img?: string;
  savedDate?: string;
}

interface SavedBooksState {
  savedBooks: SavedBook[];
  loading: boolean;
  error: string | null;
}

const initialState: SavedBooksState = {
  savedBooks: [],
  loading: false,
  error: null,
};

const safe = (v: any) => String(v ?? "");

function normalizeFromBook(book: any, savedDate?: string): SavedBook {
  return {
    id: Number(book?.id ?? book?._id),
    name: book?.name || book?.title || "Book",
    title: book?.title,
    author: book?.author || { name: "—" },
    category: book?.category || { categoryName: "—" },
    library: book?.library || { name: "—" },
    img: book?.img,
    savedDate,
  };
}

export const fetchSavedBooks = createAsyncThunk(
  "savedBooks/fetchSavedBooks",
  async (userId: number, { getState }) => {
    const uid = Number(userId);
    if (!Number.isFinite(uid) || uid <= 0) throw new Error("userId xato");

    const records = await apiGetSavedBookRecords(uid);
    const recList = Array.isArray(records) ? records : [];

    const state: any = getState();
    const booksStore: any[] = Array.isArray(state?.books?.data)
      ? state.books.data
      : [];

    const result: SavedBook[] = [];

    for (const r of recList) {
      const bookId = Number(r?.bookId ?? r?.book?.id);
      if (!Number.isFinite(bookId)) continue;

      const savedDate =
        safe(r?.createdAt).slice(0, 10) ||
        new Date().toISOString().slice(0, 10);

      const fromStore = booksStore.find(
        (b: any) => Number(b?.id ?? b?._id) === bookId,
      );

      if (fromStore) {
        result.push(normalizeFromBook(fromStore, savedDate));
        continue;
      }

      const book = await apiFetchBookById(bookId);
      if (book) result.push(normalizeFromBook(book, savedDate));
    }

    return result;
  },
);

export const saveBookToBackend = createAsyncThunk(
  "savedBooks/saveBookToBackend",
  async (arg: { userId: number; bookId: number }, { dispatch }) => {
    const userId = Number(arg.userId);
    const bookId = Number(arg.bookId);

    if (!Number.isFinite(userId) || userId <= 0)
      throw new Error("userId topilmadi");
    if (!Number.isFinite(bookId)) throw new Error("bookId xato");

    await apiSaveBook(bookId);
    await dispatch(fetchSavedBooks(userId)).unwrap();

    return bookId;
  },
);

export const unsaveBookFromBackend = createAsyncThunk(
  "savedBooks/unsaveBookFromBackend",
  async (arg: { userId: number; bookId: number }, { dispatch }) => {
    const userId = Number(arg.userId);
    const bookId = Number(arg.bookId);

    if (!Number.isFinite(userId) || userId <= 0)
      throw new Error("userId topilmadi");
    if (!Number.isFinite(bookId)) throw new Error("bookId xato");

    await apiDeleteSavedBook(bookId);
    await dispatch(fetchSavedBooks(userId)).unwrap();

    return bookId;
  },
);

const savedBooksSlice = createSlice({
  name: "savedBooks",
  initialState,
  reducers: {
    saveBook: (state, action) => {
      const incoming: SavedBook = action.payload;
      const exists = state.savedBooks.some(
        (b) => String(b.id) === String(incoming?.id),
      );
      if (!exists) state.savedBooks.unshift(incoming);
    },
    unsaveBook: (state, action) => {
      const id = action.payload;
      state.savedBooks = state.savedBooks.filter(
        (b) => String(b.id) !== String(id),
      );
    },
    clearSavedBooks: (state) => {
      state.savedBooks = [];
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchSavedBooks.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchSavedBooks.fulfilled, (s, a) => {
      s.loading = false;
      s.savedBooks = Array.isArray(a.payload) ? a.payload : [];
    });
    b.addCase(fetchSavedBooks.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error?.message || "Failed to fetch saved books";
    });

    b.addCase(saveBookToBackend.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(saveBookToBackend.fulfilled, (s) => {
      s.loading = false;
    });
    b.addCase(saveBookToBackend.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error?.message || "Failed to save book";
    });

    b.addCase(unsaveBookFromBackend.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(unsaveBookFromBackend.fulfilled, (s) => {
      s.loading = false;
    });
    b.addCase(unsaveBookFromBackend.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error?.message || "Failed to unsave book";
    });
  },
});

export const { saveBook, unsaveBook, clearSavedBooks } =
  savedBooksSlice.actions;
export default savedBooksSlice.reducer;
