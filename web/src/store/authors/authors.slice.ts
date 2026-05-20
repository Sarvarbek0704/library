import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  apiFetchAuthors,
  apiCreateAuthor,
  apiUpdateAuthor,
  apiDeleteAuthor,
} from "../../api/authors";

export interface Author {
  id: string;
  name: string;
  img?: string;
  desc?: string;
}

interface AuthorsState {
  data: Author[];
  loading: boolean;
}

const initialState: AuthorsState = {
  data: [],
  loading: false,
};

// ===================== FETCH =====================
export const fetchAuthors = createAsyncThunk(
  "authors/fetch",
  async () => {
    const res = await apiFetchAuthors();
    return res;
  }
);

// ===================== CREATE =====================
export const addAuthor = createAsyncThunk(
  "authors/add",
  async (payload: any) => {
    const res = await apiCreateAuthor(payload);
    return res;
  }
);

// ===================== UPDATE =====================
export const editAuthor = createAsyncThunk(
  "authors/edit",
  async ({ id, data }: { id: string | number; data: any }) => {
    const res = await apiUpdateAuthor(id, data);
    return res;
  }
);

// ===================== DELETE =====================
export const removeAuthor = createAsyncThunk(
  "authors/remove",
  async (id: string | number) => {
    await apiDeleteAuthor(id);
    return id;
  }
);

const authorsSlice = createSlice({
  name: "authors",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b
      // fetch
      .addCase(fetchAuthors.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchAuthors.fulfilled, (s, a) => {
        s.loading = false;
        s.data = Array.isArray(a.payload) ? a.payload : [];
      })
      .addCase(fetchAuthors.rejected, (s) => {
        s.loading = false;
      })

      // add
      .addCase(addAuthor.fulfilled, (s, a) => {
        s.data.unshift(a.payload);
      })

      // edit
      .addCase(editAuthor.fulfilled, (s, a) => {
        const updated = a.payload;

        const updatedId = String(updated?.id);

        s.data = s.data.map((x) =>
          String(x.id) === updatedId ? updated : x
        );
      })


      // remove
      .addCase(removeAuthor.fulfilled, (s, a) => {
        s.data = s.data.filter((x) => x.id !== a.payload);
      });
  },
});

export default authorsSlice.reducer;
