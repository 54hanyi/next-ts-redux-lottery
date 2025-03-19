import Image from "next/image";
import { Typography, Box, Stack, Checkbox, Button } from "@mui/material";
import Grid2 from "@mui/material/Grid2";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

import LotteryDialog from "./LotteryDialog";

interface HistoryDialogProps {
  open: boolean;
  onClose: () => void;
  // 這兩個是父層傳進來的: 選擇哪些獎勵 / 切換勾選
  selectedIds: string[];
  toggleSelectId: (id: string) => void;
  // 父層的「重抽」callback
  onRedeem: (ids: string[]) => void;
}

export default function HistoryDialog({
  open,
  onClose,
  selectedIds,
  toggleSelectId,
  onRedeem,
}: HistoryDialogProps) {
  const { history } = useSelector((state: RootState) => state.rewardHistory);

  // 快速選取 3 的倍數 (由父層做或子層做皆可，這裡示範子層)
  const handleQuickSelect = () => {
    if (history.length === 0) return;
    const maxSelectable = Math.min(30, history.length);
    const validCount = maxSelectable - (maxSelectable % 3);
    const sliceIds = history.slice(0, validCount).map((r) => r.id);

    // 逐個呼叫 toggleSelectId
    // （也可以在父層提供個 setSelectedIds(ids) 直接設定）
    sliceIds.forEach((id) => toggleSelectId(id));
  };

  // 兌換免費重抽
  const handleRedeemForRedraw = () => {
    if (selectedIds.length % 3 !== 0) {
      alert("請選擇 3 的倍數個獎勵再抽獎！");
      return;
    }
    onRedeem(selectedIds);
  };

  // 發送到信箱（暫時只是移除）
  // 這裡其實也應該要呼叫父層 callback 來 removeRewards
  // 但暫時先示範
  const handleSendToMail = () => {
    if (selectedIds.length === 0) return;
    // 你可以在父層做 dispatch(removeRewards()) / setSelectedIds([])
    // 這裡只是示範 => 你可以自己改回父層
    alert("發送到信箱 (僅示範)");
  };

  return (
    <LotteryDialog
      open={open}
      onClose={onClose}
      title="抽獎歷史"
      actions={[
        {
          text: `兌換 ${Math.floor(selectedIds.length / 3)} 抽`,
          onClick: handleRedeemForRedraw,
          variantColor: "blue",
          disabled: selectedIds.length === 0 || selectedIds.length % 3 !== 0,
        },
        {
          text: "發送到信箱",
          onClick: handleSendToMail,
          variantColor: "gold",
          disabled: selectedIds.length === 0,
        },
      ]}
    >
      {/* 快速選取按鈕 */}
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
        <Typography sx={{ mx: 2, fontWeight: "bold" }}>
          獎勵可以發送到信箱或兌換免費抽獎
        </Typography>
        <Button onClick={handleQuickSelect} variant="contained" sx={{ backgroundColor: "#4e89b7", color: "white" }}>
          快速選取
        </Button>
      </Stack>

      {/* 顯示歷史獎勵 */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        {history.length === 1 ? (
          <Box
            sx={{
              display: "flex",
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
              onChange={() => toggleSelectId(history[0].id)}
            />
          </Box>
        ) : (
          <Grid2 container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            {history.map((reward) => (
              <Grid2
                key={reward.id}
                component="div"
                sx={{
                  width: "auto", 
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
                <Typography sx={{ mt: 0.4, maxWidth: "98px", fontSize: 16 }}>
                  {reward.name}
                </Typography>
                <Checkbox
                  checked={selectedIds.includes(reward.id)}
                  onChange={() => toggleSelectId(reward.id)}
                />
              </Grid2>
            ))}
          </Grid2>
        )}
      </Stack>
    </LotteryDialog>
  );
}
