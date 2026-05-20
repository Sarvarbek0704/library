import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import {
  apiCreateMembership,
  apiDeleteMembership,
  apiFetchMemberships,
  apiUpdateMembership,
  type Membership,
  type MembershipCreate,
  type MembershipUpdate,
} from "../../api/memberships";
import { getApiErrorMessage } from "../../api/api";

type MembershipsState = {
  data: Membership[];
  loading: boolean;
  saving: boolean;
  error: string | null;
};

const initialState: MembershipsState = {
  data: [],
  loading: false,
  saving: false,
  error: null,
};

export const fetchMemberships = createAsyncThunk<
  Membership[],
  void,
  { rejectValue: string }
>("memberships/fetch", async (_, { rejectWithValue }) => {
  try {
    return await apiFetchMemberships();
  } catch (err: any) {
    return rejectWithValue(getApiErrorMessage(err));
  }
});

export const addMembership = createAsyncThunk<
  Membership,
  MembershipCreate,
  { rejectValue: string }
>("memberships/add", async (body, { rejectWithValue }) => {
  try {
    return await apiCreateMembership(body);
  } catch (err: any) {
    return rejectWithValue(getApiErrorMessage(err));
  }
});

export const editMembership = createAsyncThunk<
  Membership,
  { id: number; data: MembershipUpdate },
  { rejectValue: string }
>("memberships/edit", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await apiUpdateMembership(id, data);
  } catch (err: any) {
    return rejectWithValue(getApiErrorMessage(err));
  }
});

export const removeMembership = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("memberships/remove", async (id, { rejectWithValue }) => {
  try {
    await apiDeleteMembership(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(getApiErrorMessage(err));
  }
});

const membershipsSlice = createSlice({
  name: "memberships",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder.addCase(fetchMemberships.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMemberships.fulfilled, (state, action: PayloadAction<Membership[]>) => {
      state.loading = false;
      state.data = action.payload || [];
    });
    builder.addCase(fetchMemberships.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch memberships";
    });

    // add
    builder.addCase(addMembership.pending, (state) => {
      state.saving = true;
      state.error = null;
    });
    builder.addCase(addMembership.fulfilled, (state, action: PayloadAction<Membership>) => {
      state.saving = false;
      // UI darhol yangilansin
      state.data.unshift(action.payload);
    });
    builder.addCase(addMembership.rejected, (state, action) => {
      state.saving = false;
      state.error = action.payload || "Failed to add membership";
    });

    // edit
    builder.addCase(editMembership.pending, (state) => {
      state.saving = true;
      state.error = null;
    });
    builder.addCase(editMembership.fulfilled, (state, action: PayloadAction<Membership>) => {
      state.saving = false;
      const idx = state.data.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) state.data[idx] = action.payload;
    });
    builder.addCase(editMembership.rejected, (state, action) => {
      state.saving = false;
      state.error = action.payload || "Failed to update membership";
    });

    // remove
    builder.addCase(removeMembership.pending, (state) => {
      state.saving = true;
      state.error = null;
    });
    builder.addCase(removeMembership.fulfilled, (state, action: PayloadAction<number>) => {
      state.saving = false;
      state.data = state.data.filter((m) => m.id !== action.payload);
    });
    builder.addCase(removeMembership.rejected, (state, action) => {
      state.saving = false;
      state.error = action.payload || "Failed to delete membership";
    });
  },
});

export default membershipsSlice.reducer;

// selectorlar (ixtiyoriy)
export const selectMemberships = (state: RootState) => state.memberships.data;
export const selectMembershipsLoading = (state: RootState) => state.memberships.loading;
export const selectMembershipsSaving = (state: RootState) => state.memberships.saving;
export const selectMembershipsError = (state: RootState) => state.memberships.error;
