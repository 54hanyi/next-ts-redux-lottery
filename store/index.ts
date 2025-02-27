import { configureStore } from "@reduxjs/toolkit"
import rewardHistoryReducer from "./rewardHistorySlice";
import userReducer from "./userSlice";
import sealReducer from "./sealSlice";

export const store = configureStore({
  reducer: {
    rewardHistory: rewardHistoryReducer, // 註冊 slice
    user: userReducer,
    seal: sealReducer,
  },
});

// 這些型別是用來在 React 中使用 useSelector/useDispatch 時取得型別提示
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;