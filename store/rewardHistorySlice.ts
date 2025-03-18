import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface RewardItem {
  id: string;
  name: string;
  image: string;
};

interface rewardHistoryStates {
  history: RewardItem[];
};

const initialState: rewardHistoryStates = {
  history: [],
};

const rewardHistorySlice = createSlice({
  name: "rewardHistory",
  initialState,
  reducers: {
    // 新增獎勵
    addRewards: (state, action: PayloadAction<RewardItem[]>) => {
      state.history = [...state.history, ...action.payload];
    },
    // 刪除指定 ID 的獎勵
    removeRewards: (state, action: PayloadAction<string[]>) => {
      const idsToRemove = action.payload;
      state.history = state.history.filter(
        (item) => !idsToRemove.includes(item.id)
      );
    },
  },

})

export const { addRewards, removeRewards } = rewardHistorySlice.actions;
export default rewardHistorySlice.reducer;