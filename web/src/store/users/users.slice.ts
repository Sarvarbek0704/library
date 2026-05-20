import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ApiUser, UserUpsertBody, UsersQuery } from "../../api/user";
import { getUsers, createUser } from "../../api/user";

interface UsersState {
  data: ApiUser[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  error?: string;
}

const initialState: UsersState = {
  data: [],
  loading: false,
  page: 1,
  limit: 10,
  total: 0,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (params: UsersQuery | undefined) => {
    return await getUsers(params);
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (user: UserUpsertBody) => {
    return await createUser(user);
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.users;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load users";
      })

      // add
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [action.payload, ...state.data];
        state.total += 1;
      })
      .addCase(addUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default usersSlice.reducer;
