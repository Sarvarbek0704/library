import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface CategoryType {
  id: number;
  categoryName: string;
  desc: string;
  books: any[];
}

interface CategoryState {
  data: CategoryType[];
  loading: boolean;
}

const initialState: CategoryState = {
  data: [],
  loading: false,
};

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async () => {
    const res = await axios.get(
      "http://localhost:3000/api/category"
    );
    return res.data;
  }
);

const categorySlice = createSlice({
  name: "category",
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
      });
  },
});

export default categorySlice.reducer;
