### 超級抽獎模擬器

此專案為「超級抽獎模擬器」，使用 Next.js + React + Redux + MUI 開發，模擬遊戲內的抽獎機制，並且支援 Vercel 部署。網站呈現了多種抽獎模式與免費重抽等功能，讓使用者能夠體驗遊戲抽獎的樂趣，並提供了豐富的視覺互動效果。

## 功能特色

### 1. 單抽與十抽

- 提供「單抽」及「十抽」兩種選擇，每種抽獎對應的消耗點券不同。
- 利用預先設定的機率參數，模擬抽到稀有獎勵的可變機率，並即時顯示結果。

### 2. 免費重抽

- 使用者可以從歷史紀錄中挑選已抽到的獎勵（以 3 的倍數計）換取免費抽獎機會，體驗「不花點券也能抽」的樂趣。
- 若不想重複確認，可勾選「不再提醒」，透過 localStorage 儲存偏好設定，下次自動略過確認視窗。

### 3. 抽獎歷史

- 以卡片方式展示使用者歷來的抽獎紀錄，包括獲得的獎勵名稱與圖片。
- 提供「發送到信箱」或「兌換抽獎」等操作，使管理獎勵更加便利(純前端所以暫時只有刪除掉的功能)。

### 4. 印記收集機制

- 若抽到「印記」獎勵，會自動累積至使用者的印記計數，一旦收集滿特定數量便能領取限定造型或特別功能。
- 畫面上會顯示印記的收集進度，鼓勵玩家不斷挑戰並累積。

### 5. 即時對話框與動畫效果

- 付費抽獎和免費重抽時，皆會彈出確認對話框，並在抽獎完成後顯示抽到的獎勵列表。
- 部分動畫效果增強了視覺體驗，讓抽獎過程更加生動有趣。

## 專案結構

`/components`：包含各個可複用的元件，如 ConfirmDialog、ResultDialog、HistoryDialog、FancyButton 等。
`/store`：使用 Redux 進行狀態管理，包括 userSlice、rewardHistorySlice、sealSlice 等。
`/pages`（或 /app 依據 Next.js 版本）：對應主要的頁面組件，如 page.tsx（首頁抽獎邏輯）和其他路由。
`/public/images`：放置專案所需的靜態資源，如背景、獎勵圖示及印記圖示。

## 主要技術

- **Next.js**：建立 SSR/CSR 的 React 應用並支援快速部署。
- **React** + Redux：實現抽獎機率、歷史紀錄和印記等狀態的集中管理。
- **MUI**：提供 UI 元件與主題切換，快速構建一致化的介面。
- **Local Storage**：儲存「不再提醒」或介面偏好設定，方便用戶重訪。
- **Vercel**：部署此 Next.js 專案至雲端，提供自動化 CI/CD 與網域管理功能。

## 部署方式

- 將此專案推送至 GitHub 或相關 Git 儲存庫後，於 Vercel 後台新增專案並選擇此儲存庫。
- Vercel 會自動偵測 Next.js 並進行編譯與部署，每次推送新程式碼即自動更新正式環境。

- 盡情在「超級抽獎模擬器」中體驗抽獎的樂趣吧！若對此專案有任何疑問或建議，歡迎於 Issue 或 Pull Request 中提出，一起改進與優化抽獎體驗。祝大家歐氣滿滿，抽獎一發入魂！
