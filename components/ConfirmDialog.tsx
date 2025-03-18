import { useState } from "react";
import { Typography, Box, Checkbox, Stack } from "@mui/material";
import LotteryDialog from "./LotteryDialog";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({ open, onClose, onConfirm }: ConfirmDialogProps) {
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const handleConfirm = () => {
    if (dontAskAgain) {
      localStorage.setItem("skipConfirm", "true");
    }
    onConfirm();
    onClose();
  };

  return (
    <LotteryDialog
      open={open}
      onClose={onClose}
      title="通知"
      actions={[
        { text: "取消", onClick: onClose, variantColor: "blue" },
        { text: "確定", onClick: handleConfirm, variantColor: "gold" },
      ]}
    >
      {/* ✅ 讓內容置中 */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ my: 12, fontSize: 24,  fontWeight: "bold", textAlign: "center" }}>
          確認花費 <span style={{ color: "red" }}>50 點券</span> 抽一次嗎？
        </Typography>

        {/* ✅ 讓 Checkbox & 文字水平排列並置中 */}
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Checkbox checked={dontAskAgain} onChange={() => setDontAskAgain(!dontAskAgain)} />
          <Typography sx={{ fontWeight: "bold" }}>不再提醒</Typography>
        </Stack>
      </Box>
    </LotteryDialog>
  );
}
