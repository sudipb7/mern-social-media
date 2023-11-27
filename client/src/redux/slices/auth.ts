import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/lib/types";

type State = {
  user: User | null;
  token: string | null;
};

const initialState: State = {
  user: null,
  token: null,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setLogout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setAuth, setUser, setLogout } = userSlice.actions;
export default userSlice.reducer;
