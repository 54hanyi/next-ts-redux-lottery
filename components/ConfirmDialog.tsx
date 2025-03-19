import { useState } from "react";
import { Typography, Checkbox, Stack } from "@mui/material";
import LotteryDialog from "./LotteryDialog";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  description?: string; // ✅ `description` 可選，讓 `children` 有更大彈性
  children?: React.ReactNode; // ✅ 讓 `children` 可以傳入額外內容
}

export default function ConfirmDialog({ open, onClose, onConfirm, description, children }: ConfirmDialogProps) {
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
      title="確認"
      actions={[
        { text: "取消", onClick: onClose, variantColor: "blue" },
        { text: "確定", onClick: handleConfirm, variantColor: "gold" },
      ]}
    >
      {/* ✅ 若有 description，則顯示 */}
      {description && (
        <Typography sx={{ my: 6, fontSize: 22, fontWeight: "bold", textAlign: "center" }}>
          {description}
        </Typography>
      )}

      {/* ✅ 如果有 `children`，則顯示額外內容 */}
      {children}

      {/* ✅ 讓 Checkbox & 文字水平排列並置中 */}
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
        <Checkbox checked={dontAskAgain} onChange={() => setDontAskAgain(!dontAskAgain)} />
        <Typography sx={{ fontWeight: "bold" }}>不再提醒</Typography>
      </Stack>
    </LotteryDialog>
  );
}
