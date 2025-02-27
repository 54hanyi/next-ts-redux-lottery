import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  coupons: number;
};

const initialState: UserState = {
  coupons: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    spendCoupons: (state, action: PayloadAction<number>) => {
      if(state.coupons >= action.payload) {
        state.coupons -= action.payload;
      }
    },
    addCoupons: (state, action: PayloadAction<number>) => {
      state.coupons += action.payload;
    },
  },
});

export const { spendCoupons, addCoupons } = userSlice.actions;
export default userSlice.reducer;