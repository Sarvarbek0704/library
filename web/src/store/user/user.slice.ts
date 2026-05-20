import { createSlice, type PayloadAction, } from "@reduxjs/toolkit";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string; 
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");
      localStorage.removeItem("phone");
      localStorage.removeItem("userPhone");
      localStorage.removeItem("loginPhone");
      localStorage.removeItem("role");
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
