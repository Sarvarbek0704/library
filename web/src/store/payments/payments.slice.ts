import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../../api";

interface Payment {
  id: string;
  userId: string;
  membershipId: string;
  method: string;
  amount: number;
  status: string;
}

interface PaymentsState {
  data: Payment[];
  loading: boolean;
}

const initialState: PaymentsState = {
  data: [],
  loading: false,
};

export const fetchPayments = createAsyncThunk(
  "payments/fetchPayments",
  async () => {
    return await getPayments();
  }
);

export const addPayment = createAsyncThunk(
  "payments/addPayment",
  async (payment: Omit<Payment, "id">) => {
    return await createPayment(payment);
  }
);

export const editPayment = createAsyncThunk(
  "payments/editPayment",
  async ({ id, data }: { id: string; data: Partial<Payment> }) => {
    return await updatePayment(id, data);
  }
);

export const removePayment = createAsyncThunk(
  "payments/removePayment",
  async (id: string) => {
    await deletePayment(id);
    return id;
  }
);

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPayments.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(editPayment.fulfilled, (state, action) => {
        const index = state.data.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(removePayment.fulfilled, (state, action) => {
        state.data = state.data.filter((p) => p.id !== action.payload);
      });
  },
});

export default paymentsSlice.reducer;
