import { createSlice } from "@reduxjs/toolkit";

interface sealState {
  sealsCollected: number;
}

const initialState: sealState = {
  sealsCollected: 5
};

const sealSlice = createSlice({
  name: "seal",
  initialState,
  reducers: {
    incrementSeal: (state) => {
      if(state.sealsCollected < 5) {
        state.sealsCollected += 1;
      }
    },
    resetSeals: (state) => {
      state.sealsCollected = 0; // 重置印記數量
    },
  },
});

export const { incrementSeal, resetSeals } = sealSlice.actions;
export default sealSlice.reducer;
