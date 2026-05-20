import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getMemberStats,
  createMemberStat,
  updateMemberStat,
  deleteMemberStat,
} from "../../api";

interface MemberStat {
  id: string;
  memberId: string;
  libraryId: string;
  bookId: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface MemberStatsState {
  data: MemberStat[];
  loading: boolean;
}

const initialState: MemberStatsState = {
  data: [],
  loading: false,
};

export const fetchMemberStats = createAsyncThunk(
  "memberStats/fetchMemberStats",
  async () => {
    return await getMemberStats();
  }
);

export const addMemberStat = createAsyncThunk(
  "memberStats/addMemberStat",
  async (memberStat: Omit<MemberStat, "id">) => {
    return await createMemberStat(memberStat);
  }
);

export const editMemberStat = createAsyncThunk(
  "memberStats/editMemberStat",
  async ({ id, data }: { id: string; data: Partial<MemberStat> }) => {
    return await updateMemberStat(id, data);
  }
);

export const removeMemberStat = createAsyncThunk(
  "memberStats/removeMemberStat",
  async (id: string) => {
    await deleteMemberStat(id);
    return id;
  }
);

const memberStatsSlice = createSlice({
  name: "memberStats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemberStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMemberStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMemberStats.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addMemberStat.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(editMemberStat.fulfilled, (state, action) => {
        const index = state.data.findIndex((ms) => ms.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(removeMemberStat.fulfilled, (state, action) => {
        state.data = state.data.filter((ms) => ms.id !== action.payload);
      });
  },
});

export default memberStatsSlice.reducer;
