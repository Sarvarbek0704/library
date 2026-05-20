import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api";

interface Category {
  id: number;
  categoryName: string;
  desc: string;
}

interface CategoriesState {
  data: Category[];
  loading: boolean;
}

const initialState: CategoriesState = {
  data: [],
  loading: false,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    return await getCategories();
  },
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (category: Omit<Category, "id">) => {
    return await createCategory(category);
  },
);

export const editCategory = createAsyncThunk(
  "categories/editCategory",
  async ({ id, data }: { id: number; data: Partial<Category> }) => {
    return await updateCategory(id, data);
  },
);

export const removeCategory = createAsyncThunk(
  "categories/removeCategory",
  async (id: number) => {
    await deleteCategory(id);
    return id;
  },
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        const index = state.data.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.data = state.data.filter((c) => c.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;
