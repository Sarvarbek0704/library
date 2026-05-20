
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMembers, createMember, updateMember, deleteMember } from "../../api";

interface Member {
  id: string;
  userId: string;
  membershipId: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface MembersState {
  data: Member[];
  loading: boolean;
}

const initialState: MembersState = {
  data: [],
  loading: false,
};

function unwrapList<T>(x: any): T[] {
  if (Array.isArray(x)) return x;
  const keys = ["data", "items", "rows", "results", "list"];
  for (const k of keys) if (Array.isArray(x?.[k])) return x[k];
  for (const k of keys) if (Array.isArray(x?.data?.[k])) return x.data[k];
  return [];
}

export const fetchMembers = createAsyncThunk("members/fetchMembers", async () => {
  return await getMembers();
});

export const addMember = createAsyncThunk(
  "members/addMember",
  async (member: Omit<Member, "id">) => {
    return await createMember(member);
  }
);

export const editMember = createAsyncThunk(
  "members/editMember",
  async ({ id, data }: { id: string; data: Partial<Member> }) => {
    return await updateMember(id, data);
  }
);

export const removeMember = createAsyncThunk("members/removeMember", async (id: string) => {
  await deleteMember(id);
  return id;
});

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = unwrapList<Member>(action.payload);
      })
      .addCase(fetchMembers.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(editMember.fulfilled, (state, action) => {
        const index = state.data.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.data = state.data.filter((m) => m.id !== action.payload);
      });
  },
});

export default membersSlice.reducer;
