import { useState, useEffect } from "react";
import Image from "next/image";
import { Typography, Box, Stack, Checkbox, Button } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { removeRewards } from "@/store/rewardHistorySlice";
import LotteryDialog from "./LotteryDialog";
import ConfirmDialog from "./ConfirmDialog"; // 確認對話框

interface HistoryDialogProps {
  open: boolean;
  onClose: () => void;
  onRedraw: (count: number, isRedraw: boolean) => void; // ✅ 讓 `page.tsx` 的 `handleDraw` 可傳入
}

export default function HistoryDialog({ open, onClose, onRedraw }: HistoryDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { history } = useSelector((state: RootState) => state.rewardHistory);
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false); // 確認視窗
  const [redrawCount, setRedrawCount] = useState(0); // 記錄重抽次數

  const skipConfirm = typeof window !== "undefined" && localStorage.getItem("skipRedrawConfirm") === "true";

  useEffect(() => {
    if (!open) {
      setSelectedIds([]);
    }
  }, [open]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 快速選取 3 的倍數個獎勵（最多 30 個）
  const handleQuickSelect = () => {
    if (history.length === 0) return;

    const maxSelectable = Math.min(30, history.length);
    const validSelectionCount = maxSelectable - (maxSelectable % 3);
    const selected = history.slice(0, validSelectionCount).map((reward) => reward.id);
    setSelectedIds(selected);
  };

  // 兌換抽獎
  const handleRedeemForRedraw = () => {
    if (selectedIds.length % 3 !== 0) {
      alert("請選擇 3 的倍數個獎勵再抽獎！");
      return;
    }

    const count = selectedIds.length / 3;
    setRedrawCount(count);

    if (skipConfirm) {
      executeRedraw(count);
    } else {
      setOpenConfirm(true);
    }
  };

  // **確認後執行重抽**
  const executeRedraw = (count: number) => {
    setOpenConfirm(false);
    dispatch(removeRewards(selectedIds)); // 刪除選取的獎勵
    setSelectedIds([]); // 清空已選的獎勵

    // ✅ **使用 page.tsx 的 handleDraw 來抽獎**
    onRedraw(count, true);
  };

  // **發送到信箱（暫時刪除）**
  const handleSendToMail = () => {
    if (selectedIds.length === 0) return;
    dispatch(removeRewards(selectedIds));
    setSelectedIds([]);
  };

  return (
    <>
      <LotteryDialog
        open={open}
        onClose={onClose}
        title="抽獎歷史"
        actions={[
          {
            text: `兌換 ${Math.floor(selectedIds.length / 3)} 抽`,
            onClick: handleRedeemForRedraw,
            variantColor: "blue",
          },
          { text: "發送到信箱", onClick: handleSendToMail, variantColor: "gold" },
        ]}
      >
        {/* 快速選取按鈕 */}
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 2, }}>
          <Typography sx={{ mx: 2, fontWeight: "bold" }}>獎勵可以發送到信箱或兌換免費抽獎</Typography>
          <Button onClick={handleQuickSelect} variant="contained" sx={{ backgroundColor: "#4e89b7", color: "white" }}>
            快速選取
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          {history.length === 1 ? (
            // 當只有一個獎勵時，使用單一獎勵的顯示樣式
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                textAlign: "center",
                margin: "80px !important",
              }}
            >
              <Image
                src={history[0].image}
                alt={history[0].name}
                width={100}
                height={100}
              />
              <Typography sx={{ mt: 0.4, maxWidth: "98px", fontSize: 16 }}>
                {history[0].name}
              </Typography>
              <Checkbox
                checked={selectedIds.includes(history[0].id)}
                onChange={() => handleToggle(history[0].id)}
              />
            </Box>
          ) : (
            // 當有多個獎勵時，使用網格的顯示樣式
            <Grid2 container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              {history.map((reward) => (
                <Grid2
                  key={reward.id}
                  component="div"
                  sx={{
                    width: "18%", // 每行最多 5 個獎勵
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ width: 100, height: 100, position: "relative" }}>
                    <Image
                      src={reward.image}
                      alt={reward.name}
                      width={100}
                      height={100}
                    />
                  </Box>
                  <Typography
                    sx={{
                      mt: 0.4,
                      maxWidth: "98px",
                      fontSize: 16,
                    }}
                  >
                    {reward.name}
                  </Typography>
                  <Checkbox
                    checked={selectedIds.includes(reward.id)}
                    onChange={() => handleToggle(reward.id)}
                  />
                </Grid2>
              ))}
            </Grid2>
          )}
        </Stack>
      </LotteryDialog>

      {/* 兌換確認視窗 */}
      {openConfirm && (
        <ConfirmDialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onConfirm={() => executeRedraw(redrawCount)}
          description={`是否使用 ${selectedIds.length} 個獎勵兌換 ${redrawCount} 次重抽機會？`}
        />
      )}
    </>
  );
}
