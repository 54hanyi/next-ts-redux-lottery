import { useState, useEffect } from "react";
import Image from "next/image";
import { Typography, Box, Stack, Checkbox } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { removeRewards } from "@/store/rewardHistorySlice";
import LotteryDialog from "./LotteryDialog";

interface HistoryDialogProps {
  open: boolean;
  onClose: () => void;
  onRedraw: (count: number) => void;
}

export default function HistoryDialog({ open, onClose, onRedraw }: HistoryDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { history } = useSelector((state: RootState) => state.rewardHistory);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  const handleRedeemForRedraw = () => {
    if (selectedIds.length % 3 !== 0) {
      alert("請選擇 3 的倍數個獎勵再抽獎！");
      return;
    }
    onRedraw(selectedIds.length / 3);
    dispatch(removeRewards(selectedIds));
    setSelectedIds([]);
  };

  return (
    <LotteryDialog
      open={open}
      onClose={onClose}
      title="抽獎歷史"
      actions={[
        { text: `兌換 ${selectedIds.length / 3} 抽`, onClick: handleRedeemForRedraw, variantColor: "blue" },
        { text: "發送到信箱", onClick: () => {}, variantColor: "gold" },
      ]}
    >
      <Typography>獎勵可以發送到信箱或兌換免費抽獎</Typography>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        {history.map((reward) => (
          <Box key={reward.id} sx={{ textAlign: "center" }}>
            <Image src={reward.image} alt={reward.name} width={80} height={80} />
            <Checkbox checked={selectedIds.includes(reward.id)} onChange={() => handleToggle(reward.id)} />
          </Box>
        ))}
      </Stack>
    </LotteryDialog>
  );
}
