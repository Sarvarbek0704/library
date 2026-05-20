import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getLibraries,
  createLibrary,
  updateLibrary,
  deleteLibrary,
} from "../../api";

interface Library {
  id: string;
  name: string;
  contact: string;
  address: string;
  location: string;
  lat: number;
  lon: number;
}

interface LibrariesState {
  data: Library[];
  loading: boolean;
}

const initialState: LibrariesState = {
  data: [],
  loading: false,
};

export const fetchLibraries = createAsyncThunk(
  "libraries/fetchLibraries",
  async () => {
    return await getLibraries();
  }
);

export const addLibrary = createAsyncThunk(
  "libraries/addLibrary",
  async (library: Omit<Library, "id">) => {
    return await createLibrary(library);
  }
);

export const editLibrary = createAsyncThunk(
  "libraries/editLibrary",
  async ({ id, data }: { id: string; data: Partial<Library> }) => {
    return await updateLibrary(id, data);
  }
);

export const removeLibrary = createAsyncThunk(
  "libraries/removeLibrary",
  async (id: string) => {
    await deleteLibrary(id);
    return id;
  }
);

const librariesSlice = createSlice({
  name: "libraries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLibraries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLibraries.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLibraries.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addLibrary.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(editLibrary.fulfilled, (state, action) => {
        const index = state.data.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(removeLibrary.fulfilled, (state, action) => {
        state.data = state.data.filter((l) => l.id !== action.payload);
      });
  },
});

export default librariesSlice.reducer;
